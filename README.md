# Warehouse Management System Configuration Documentation

## Prerequisites

Before you begin, make sure you have installed:

- Docker
- Make

## Configuration

To configure the project, first generate .env files:

```sh
make configure
```

## Building Containers

To build the required containers for all services, run:

```sh
make build
```

## Starting Services

To start all necessary services, use:

```sh
make up
```

## Backend (local)

Run the API locally (FastAPI) with a virtual environment:

```sh
cd api
python3 -m venv .venv
source .venv/bin/activate
pip install "psycopg[binary]"
pip install bcrypt
pip install fastapi uvicorn sqlalchemy psycopg alembic pydantic python-jose passlib python-dotenv
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check:

```sh
curl http://localhost:8000/health
```

## Frontend (web)

```sh
cd web
npm install
export NEXT_PUBLIC_API_URL="http://localhost:8000"
npm run dev
```

Open `http://localhost:3000`.

Run backend + frontend together:

```sh
# Terminal 1
cd api
source .venv/bin/activate
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2
cd web
export NEXT_PUBLIC_API_URL="http://localhost:8000"
npm run dev
```

## Smoke test (ETAP 6)

```sh
export TOKEN="<jwt>"
./scripts/smoke-test.sh
```

Auth (seed users are created on first run if DB has no users):

```sh
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"ChangeMe123!"}'
```

```sh
curl http://localhost:8000/auth/me \
  -H "Authorization: Bearer <token>"
```

You can override the seed password via `DEFAULT_USER_PASSWORD` in `.env`.

## Inventory (ETAP 2)

Products:

```sh
curl http://localhost:8000/products \
  -H "Authorization: Bearer <token>"
```

```sh
curl -X POST http://localhost:8000/products \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"sku":"SKU-001","name":"Monitor 24","type":"MONITOR","brand":"ACME","model":"M24"}'
```

Update product (ADMIN can also update `sku`):

```sh
curl -X PATCH http://localhost:8000/products/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"sku":"SKU-002","name":"Monitor 27"}'
```

Delete product:

```sh
curl -X DELETE http://localhost:8000/products/1 \
  -H "Authorization: Bearer <token>"
```

Locations and stock:

```sh
curl http://localhost:8000/warehouses/1/locations \
  -H "Authorization: Bearer <token>"
```

Admin locations management:

```sh
curl -X POST http://localhost:8000/locations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"warehouse_id":1,"code":"A1-01","description":"Regał A1","kind":"RACK_CELL"}'
```

```sh
curl -X PATCH http://localhost:8000/locations/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"description":"Regał A1, poziom 2"}'
```

```sh
curl -X DELETE http://localhost:8000/locations/1 \
  -H "Authorization: Bearer <token>"
```

```sh
curl -X PATCH http://localhost:8000/locations/1/block \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"is_blocked":true}'
```

```sh
curl "http://localhost:8000/stock?warehouse_id=1" \
  -H "Authorization: Bearer <token>"
```

## Deliveries (ETAP 3)

Create delivery (status set to `W_TRAKCIE`, stock does not change yet):

```sh
curl -X POST http://localhost:8000/deliveries \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "supplier_id": 1,
    "document_no": "WZ/0001/2025",
    "items": [
      {"sku":"SKU-001","qty":5}
    ]
  }'
```

Putaway delivery (assign locations, status becomes `ZATWIERDZONA` and stock increases):

```sh
curl -X POST http://localhost:8000/deliveries/1/putaway \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {"sku":"SKU-001","qty":3,"location_code":"A1-01"},
      {"sku":"SKU-001","qty":2,"location_code":"A1-02"}
    ]
  }'
```

List deliveries:

```sh
curl "http://localhost:8000/deliveries?status=ZATWIERDZONA" \
  -H "Authorization: Bearer <token>"
```

Cancel delivery (MVP: changes status to `ANULOWANA`, does not revert stock):

```sh
curl -X POST http://localhost:8000/deliveries/1/cancel \
  -H "Authorization: Bearer <token>"
```

## Orders (ETAP 4)

Create order:

```sh
curl -X POST http://localhost:8000/orders \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "order_no": "ORD-0001",
    "customer_id": 1,
    "priority": false,
    "items": [
      {"sku":"SKU-001","qty":2}
    ]
  }'
```

Issue order:

```sh
curl -X POST http://localhost:8000/orders/1/issue \
  -H "Authorization: Bearer <token>"
```

Update priority:

```sh
curl -X PATCH http://localhost:8000/orders/1/priority \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"priority":true}'
```

Cancel order:

```sh
curl -X POST http://localhost:8000/orders/1/cancel \
  -H "Authorization: Bearer <token>"
```

## Reports (ETAP 5)

```sh
curl "http://localhost:8000/reports/stock?warehouse_id=1" \
  -H "Authorization: Bearer <token>"
```

```sh
curl "http://localhost:8000/reports/deliveries?status=ZATWIERDZONA" \
  -H "Authorization: Bearer <token>"
```

```sh
curl "http://localhost:8000/reports/orders?priority=true" \
  -H "Authorization: Bearer <token>"
```

```sh
curl "http://localhost:8000/reports/audit?action=LOGIN_OK" \
  -H "Authorization: Bearer <token>"
```

## Admin (ETAP 5)

```sh
curl http://localhost:8000/admin/users \
  -H "Authorization: Bearer <token>"
```

```sh
curl -X POST http://localhost:8000/admin/users \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"login":"newuser","password":"ChangeMe123!","role":"MAGAZYNIER"}'
```

```sh
curl -X PATCH http://localhost:8000/admin/users/1 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"is_active":false}'
```

```sh
curl -X POST http://localhost:8000/admin/backup \
  -H "Authorization: Bearer <token>"
```

## Warehouses module (Backend + UI)

New endpoints:

```sh
curl "http://localhost:8000/warehouses?q=MAIN&sort=total_qty&order=desc" \
  -H "Authorization: Bearer <token>"
```

```sh
curl "http://localhost:8000/warehouses/1/dashboard?threshold=5" \
  -H "Authorization: Bearer <token>"
```

```sh
curl "http://localhost:8000/warehouses/1/stock/summary?q=SKU&page=1&page_size=20&sort=qty&order=desc" \
  -H "Authorization: Bearer <token>"
```

```sh
curl "http://localhost:8000/warehouses/1/stock/product/10" \
  -H "Authorization: Bearer <token>"
```

```sh
curl "http://localhost:8000/warehouses/1/locations" \
  -H "Authorization: Bearer <token>"
```

UI:
- Zakladka „Magazyny” zawiera liste magazynow oraz widok szczegolow (Podsumowanie / Stany / Lokalizacje).
- Podsumowanie pokazuje KPI, Top produkty, Low stock oraz zablokowane lokalizacje.
- Stany: tabela produktow + szczegoly lokacji po kliknieciu.
- Lokalizacje: lista ze statusami FREE/OCCUPIED/BLOCKED, podglad SKU i blokady.

## Global search + Orders 1-click

```sh
curl "http://localhost:8000/search?q=sku" \
  -H "Authorization: Bearer <token>"
```

UI:
- Zakladka „Szukaj” udostepnia globalna wyszukiwarke (produkty, zamowienia, lokacje, klienci, dostawcy, dostawy).
- W „Zamowienia” jest panel 1-klik, ktory sam wydaje zamowienie albo przygotowuje dostawe z brakami.

## Stopping Services

To stop all services, use:

```sh
make stop
```

## Removing Services

To remove all services, use:

```sh
make down
```

## Development Mode

If you want to run the services and automatically sync backend files, use:

```sh
make watch
```
