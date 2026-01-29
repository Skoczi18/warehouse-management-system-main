-- ============================================================
-- AV WMS (Warehouse Management System) - Full Schema (current)
-- PostgreSQL 16+
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('MAGAZYNIER', 'KIEROWNIK', 'ADMIN');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'delivery_status') THEN
    CREATE TYPE delivery_status AS ENUM ('NOWA', 'W_TRAKCIE', 'ZATWIERDZONA', 'ANULOWANA');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('NOWE', 'OCZEKUJACE', 'W_REALIZACJI', 'ZREALIZOWANE', 'ZREALIZOWANE_CZESCIOWO', 'ANULOWANE');
  END IF;
END$$;

-- ============================================================
-- USERS + AUTH
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id              BIGSERIAL PRIMARY KEY,
  login           TEXT NOT NULL UNIQUE,
  password_hash   TEXT NOT NULL,
  role            user_role NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  must_change_pwd BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================
-- MASTER DATA
-- ============================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  contact_data  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS customers (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  contact_data  TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id         BIGSERIAL PRIMARY KEY,
  sku        TEXT NOT NULL UNIQUE,  -- kod produktu (EAN/SKU)
  name       TEXT NOT NULL,
  type       TEXT NOT NULL,         -- np. TV, projektor, mikrofon
  brand      TEXT,
  model      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- ============================================================
-- WAREHOUSES + LAYOUT (JSONB) + LOCKS
-- ============================================================
CREATE TABLE IF NOT EXISTS warehouses (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,
  unit_scale  NUMERIC(10,4) NOT NULL DEFAULT 1.0, -- 1 jednostka = 1 metr
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One layout per warehouse (source of truth for drawing)
CREATE TABLE IF NOT EXISTS warehouse_layouts (
  warehouse_id BIGINT PRIMARY KEY REFERENCES warehouses(id) ON DELETE CASCADE,
  layout_json  JSONB NOT NULL,
  version      INTEGER NOT NULL DEFAULT 1,
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by   BIGINT REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_warehouse_layouts_gin
  ON warehouse_layouts USING GIN (layout_json);

-- Single editor lock per warehouse
CREATE TABLE IF NOT EXISTS layout_locks (
  warehouse_id BIGINT PRIMARY KEY REFERENCES warehouses(id) ON DELETE CASCADE,
  lock_id      UUID NOT NULL,
  locked_by    BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  expires_at   TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_layout_locks_expires ON layout_locks(expires_at);

-- ============================================================
-- LOCATIONS + STOCK
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id           BIGSERIAL PRIMARY KEY,
  warehouse_id BIGINT NOT NULL REFERENCES warehouses(id) ON DELETE CASCADE,
  code         TEXT NOT NULL,
  description  TEXT,
  kind         TEXT NOT NULL DEFAULT 'RACK_CELL',
  is_blocked   BOOLEAN NOT NULL DEFAULT FALSE,
  geometry_json JSONB, -- rect/polygon (for 2D view)
  CONSTRAINT uq_locations_code_per_wh UNIQUE (warehouse_id, code),
  CONSTRAINT chk_locations_kind CHECK (kind IN ('RACK_CELL', 'RACK', 'ZONE', 'GATE', 'OBSTACLE'))
);

CREATE INDEX IF NOT EXISTS idx_locations_warehouse ON locations(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_locations_geometry_gin ON locations USING GIN (geometry_json);

CREATE TABLE IF NOT EXISTS stock_positions (
  id          BIGSERIAL PRIMARY KEY,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  location_id BIGINT NOT NULL REFERENCES locations(id) ON DELETE RESTRICT,
  quantity    INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  UNIQUE(product_id, location_id)
);

CREATE INDEX IF NOT EXISTS idx_stock_product ON stock_positions(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_location ON stock_positions(location_id);

-- ============================================================
-- DELIVERIES (PU-01)
-- ============================================================
CREATE TABLE IF NOT EXISTS deliveries (
  id              BIGSERIAL PRIMARY KEY,
  document_no     TEXT NOT NULL, -- nr dokumentu (WZ/faktura)
  supplier_id     BIGINT NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  status          delivery_status NOT NULL DEFAULT 'NOWA',
  created_by      BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_by     BIGINT REFERENCES users(id) ON DELETE RESTRICT,
  approved_at     TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_deliveries_doc ON deliveries(document_no);
CREATE INDEX IF NOT EXISTS idx_deliveries_status ON deliveries(status);

CREATE TABLE IF NOT EXISTS delivery_items (
  id          BIGSERIAL PRIMARY KEY,
  delivery_id BIGINT NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  product_id  BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  qty         INTEGER NOT NULL CHECK (qty > 0)
);

CREATE INDEX IF NOT EXISTS idx_delivery_items_delivery ON delivery_items(delivery_id);

-- ============================================================
-- ORDERS (PU-02)
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id           BIGSERIAL PRIMARY KEY,
  order_no     TEXT NOT NULL UNIQUE,
  customer_id  BIGINT NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
  status       order_status NOT NULL DEFAULT 'NOWE',
  priority     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);

CREATE TABLE IF NOT EXISTS order_items (
  id            BIGSERIAL PRIMARY KEY,
  order_id      BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    BIGINT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  qty_ordered   INTEGER NOT NULL CHECK (qty_ordered > 0),
  qty_issued    INTEGER NOT NULL DEFAULT 0 CHECK (qty_issued >= 0),
  UNIQUE(order_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- ============================================================
-- AUDIT LOG
-- ============================================================
CREATE TABLE IF NOT EXISTS audit_log (
  id          BIGSERIAL PRIMARY KEY,
  user_id     BIGINT REFERENCES users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,              -- LOGIN, CREATE_DELIVERY, SAVE_LAYOUT, ...
  entity      TEXT,                       -- delivery, order, warehouse, ...
  entity_id   BIGINT,
  details     JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

-- ============================================================
-- TRIGGERS: updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated ON users;
CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_orders_updated ON orders;
CREATE TRIGGER trg_orders_updated
BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- SEED DATA
-- ============================================================

-- Default warehouse
INSERT INTO warehouses(name, unit_scale)
VALUES ('MAIN_WAREHOUSE', 1.0)
ON CONFLICT (name) DO NOTHING;

-- Default location in default warehouse
INSERT INTO locations(warehouse_id, code, description, kind)
VALUES (
  (SELECT id FROM warehouses WHERE name='MAIN_WAREHOUSE'),
  'MAIN',
  'Domyślna lokalizacja',
  'ZONE'
)
ON CONFLICT (warehouse_id, code) DO NOTHING;

-- Optional: default empty layout (can be overwritten by editor)
INSERT INTO warehouse_layouts(warehouse_id, layout_json, version)
SELECT
  w.id,
  jsonb_build_object(
    'unit','m',
    'boundary', jsonb_build_array(
      jsonb_build_object('type','line','from',jsonb_build_array(0,0),'to',jsonb_build_array(40,0)),
      jsonb_build_object('type','line','from',jsonb_build_array(40,0),'to',jsonb_build_array(40,30)),
      jsonb_build_object('type','line','from',jsonb_build_array(40,30),'to',jsonb_build_array(0,30)),
      jsonb_build_object('type','line','from',jsonb_build_array(0,30),'to',jsonb_build_array(0,0))
    ),
    'objects', jsonb_build_array()
  ),
  1
FROM warehouses w
WHERE w.name='MAIN_WAREHOUSE'
ON CONFLICT (warehouse_id) DO NOTHING;
