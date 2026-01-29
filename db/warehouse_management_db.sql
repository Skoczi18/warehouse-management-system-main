--
-- PostgreSQL database dump
--

\restrict xPgdp17QVu1ZstOXNYscE3pWFWrbblbW0XxqJ8MIBi4hJAa8SmeoQE7Tk4VoZY4

-- Dumped from database version 18.1 (Debian 18.1-1.pgdg13+2)
-- Dumped by pg_dump version 18.1 (Debian 18.1-1.pgdg13+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: delivery_status; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.delivery_status AS ENUM (
    'NOWA',
    'W_TRAKCIE',
    'ZATWIERDZONA',
    'ANULOWANA'
);


ALTER TYPE public.delivery_status OWNER TO "default";

--
-- Name: order_status; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.order_status AS ENUM (
    'NOWE',
    'OCZEKUJACE',
    'W_REALIZACJI',
    'ZREALIZOWANE',
    'ZREALIZOWANE_CZESCIOWO',
    'ANULOWANE'
);


ALTER TYPE public.order_status OWNER TO "default";

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: default
--

CREATE TYPE public.user_role AS ENUM (
    'MAGAZYNIER',
    'KIEROWNIK',
    'ADMIN'
);


ALTER TYPE public.user_role OWNER TO "default";

--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: default
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO "default";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_log; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.audit_log (
    id bigint NOT NULL,
    user_id bigint,
    action text NOT NULL,
    entity text,
    entity_id bigint,
    details jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_log OWNER TO "default";

--
-- Name: audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.audit_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_log_id_seq OWNER TO "default";

--
-- Name: audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.audit_log_id_seq OWNED BY public.audit_log.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.customers (
    id bigint NOT NULL,
    name text NOT NULL,
    contact_data text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.customers OWNER TO "default";

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.customers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO "default";

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: deliveries; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.deliveries (
    id bigint NOT NULL,
    document_no text NOT NULL,
    supplier_id bigint NOT NULL,
    status public.delivery_status DEFAULT 'NOWA'::public.delivery_status NOT NULL,
    created_by bigint NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    approved_by bigint,
    approved_at timestamp with time zone
);


ALTER TABLE public.deliveries OWNER TO "default";

--
-- Name: deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.deliveries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.deliveries_id_seq OWNER TO "default";

--
-- Name: deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.deliveries_id_seq OWNED BY public.deliveries.id;


--
-- Name: delivery_items; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.delivery_items (
    id bigint NOT NULL,
    delivery_id bigint NOT NULL,
    product_id bigint NOT NULL,
    qty integer NOT NULL,
    CONSTRAINT delivery_items_qty_check CHECK ((qty > 0))
);


ALTER TABLE public.delivery_items OWNER TO "default";

--
-- Name: delivery_items_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.delivery_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.delivery_items_id_seq OWNER TO "default";

--
-- Name: delivery_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.delivery_items_id_seq OWNED BY public.delivery_items.id;


--
-- Name: layout_locks; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.layout_locks (
    warehouse_id bigint NOT NULL,
    lock_id uuid NOT NULL,
    locked_by bigint NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.layout_locks OWNER TO "default";

--
-- Name: locations; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.locations (
    id bigint NOT NULL,
    warehouse_id bigint NOT NULL,
    code text NOT NULL,
    description text,
    kind text DEFAULT 'RACK_CELL'::text NOT NULL,
    is_blocked boolean DEFAULT false NOT NULL,
    geometry_json jsonb,
    CONSTRAINT chk_locations_kind CHECK ((kind = ANY (ARRAY['RACK_CELL'::text, 'RACK'::text, 'ZONE'::text, 'GATE'::text, 'OBSTACLE'::text])))
);


ALTER TABLE public.locations OWNER TO "default";

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.locations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.locations_id_seq OWNER TO "default";

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.order_items (
    id bigint NOT NULL,
    order_id bigint NOT NULL,
    product_id bigint NOT NULL,
    qty_ordered integer NOT NULL,
    qty_issued integer DEFAULT 0 NOT NULL,
    CONSTRAINT order_items_qty_issued_check CHECK ((qty_issued >= 0)),
    CONSTRAINT order_items_qty_ordered_check CHECK ((qty_ordered > 0))
);


ALTER TABLE public.order_items OWNER TO "default";

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.order_items_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO "default";

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.orders (
    id bigint NOT NULL,
    order_no text NOT NULL,
    customer_id bigint NOT NULL,
    status public.order_status DEFAULT 'NOWE'::public.order_status NOT NULL,
    priority boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.orders OWNER TO "default";

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.orders_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO "default";

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.products (
    id bigint NOT NULL,
    sku text NOT NULL,
    name text NOT NULL,
    type text NOT NULL,
    brand text,
    model text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO "default";

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.products_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO "default";

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: stock_positions; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.stock_positions (
    id bigint NOT NULL,
    product_id bigint NOT NULL,
    location_id bigint NOT NULL,
    quantity integer DEFAULT 0 NOT NULL,
    CONSTRAINT stock_positions_quantity_check CHECK ((quantity >= 0))
);


ALTER TABLE public.stock_positions OWNER TO "default";

--
-- Name: stock_positions_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.stock_positions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_positions_id_seq OWNER TO "default";

--
-- Name: stock_positions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.stock_positions_id_seq OWNED BY public.stock_positions.id;


--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.suppliers (
    id bigint NOT NULL,
    name text NOT NULL,
    contact_data text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.suppliers OWNER TO "default";

--
-- Name: suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.suppliers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suppliers_id_seq OWNER TO "default";

--
-- Name: suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.suppliers_id_seq OWNED BY public.suppliers.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    login text NOT NULL,
    password_hash text NOT NULL,
    role public.user_role NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    must_change_pwd boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO "default";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO "default";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: warehouse_layouts; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.warehouse_layouts (
    warehouse_id bigint NOT NULL,
    layout_json jsonb NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_by bigint
);


ALTER TABLE public.warehouse_layouts OWNER TO "default";

--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: default
--

CREATE TABLE public.warehouses (
    id bigint NOT NULL,
    name text NOT NULL,
    unit_scale numeric(10,4) DEFAULT 1.0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.warehouses OWNER TO "default";

--
-- Name: warehouses_id_seq; Type: SEQUENCE; Schema: public; Owner: default
--

CREATE SEQUENCE public.warehouses_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.warehouses_id_seq OWNER TO "default";

--
-- Name: warehouses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: default
--

ALTER SEQUENCE public.warehouses_id_seq OWNED BY public.warehouses.id;


--
-- Name: audit_log id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.audit_log ALTER COLUMN id SET DEFAULT nextval('public.audit_log_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: deliveries id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.deliveries ALTER COLUMN id SET DEFAULT nextval('public.deliveries_id_seq'::regclass);


--
-- Name: delivery_items id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.delivery_items ALTER COLUMN id SET DEFAULT nextval('public.delivery_items_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: stock_positions id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stock_positions ALTER COLUMN id SET DEFAULT nextval('public.stock_positions_id_seq'::regclass);


--
-- Name: suppliers id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.suppliers ALTER COLUMN id SET DEFAULT nextval('public.suppliers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: warehouses id; Type: DEFAULT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.warehouses ALTER COLUMN id SET DEFAULT nextval('public.warehouses_id_seq'::regclass);


--
-- Data for Name: audit_log; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.audit_log (id, user_id, action, entity, entity_id, details, created_at) FROM stdin;
1	\N	SEED_USERS	\N	\N	{"count": 3}	2026-01-23 21:03:32.769826+00
2	1	LOGIN_FAIL	\N	\N	{"login": "admin", "reason": "invalid_password"}	2026-01-23 21:49:30.968649+00
3	1	LOGIN_FAIL	\N	\N	{"login": "admin", "reason": "invalid_password"}	2026-01-23 21:49:35.653731+00
4	1	LOGIN_FAIL	\N	\N	{"login": "admin", "reason": "invalid_password"}	2026-01-23 21:49:41.039316+00
5	1	LOGIN_OK	\N	\N	\N	2026-01-23 21:50:05.419057+00
6	2	LOGIN_OK	\N	\N	\N	2026-01-23 21:56:40.83049+00
7	3	LOGIN_OK	\N	\N	\N	2026-01-23 21:57:25.658354+00
8	1	LOGIN_OK	\N	\N	\N	2026-01-23 22:01:35.3239+00
9	2	LOGIN_OK	\N	\N	\N	2026-01-23 22:12:49.740945+00
10	\N	LOGIN_FAIL	\N	\N	{"login": "", "reason": "user_not_found_or_inactive"}	2026-01-23 22:31:17.098271+00
11	1	LOGIN_OK	\N	\N	\N	2026-01-23 22:31:20.310338+00
12	1	CREATE_ORDER	order	1	{"order_no": ""}	2026-01-23 22:36:41.131017+00
13	3	LOGIN_OK	\N	\N	\N	2026-01-23 22:37:13.798604+00
14	2	LOGIN_OK	\N	\N	\N	2026-01-23 22:38:07.588308+00
15	2	UPDATE_PRIORITY	order	1	{"priority": false}	2026-01-23 22:38:13.690701+00
16	2	UPDATE_PRIORITY	order	1	{"priority": true}	2026-01-23 22:38:16.972394+00
17	1	LOGIN_OK	\N	\N	\N	2026-01-23 22:40:50.097324+00
18	3	LOGIN_OK	\N	\N	\N	2026-01-23 22:59:01.802698+00
19	3	CREATE_DELIVERY	delivery	1	{"document_no": "WZ1"}	2026-01-23 22:59:32.883547+00
20	1	LOGIN_OK	\N	\N	\N	2026-01-23 23:07:20.887139+00
21	1	LOCK_ACQUIRE	warehouse	1	{"lock_id": "fc4a21bd-f708-43cf-a8fd-81edd236aa76"}	2026-01-23 23:45:02.581981+00
22	1	LOCK_RELEASE	warehouse	1	{"lock_id": "fc4a21bd-f708-43cf-a8fd-81edd236aa76"}	2026-01-23 23:45:18.414458+00
23	3	LOGIN_OK	\N	\N	\N	2026-01-23 23:50:07.811657+00
24	1	LOGIN_OK	\N	\N	\N	2026-01-23 23:50:27.564257+00
25	1	CREATE_ORDER	order	3	{"order_no": "2"}	2026-01-23 23:56:19.664515+00
26	1	CREATE_ORDER	order	5	{"order_no": "5"}	2026-01-23 23:56:54.724923+00
27	2	LOGIN_OK	\N	\N	\N	2026-01-23 23:58:04.339147+00
28	2	CREATE_DELIVERY	delivery	2	{"document_no": "WZ2"}	2026-01-23 23:59:06.452585+00
29	2	BLOCK_LOCATION	location	1	{"is_blocked": false}	2026-01-23 23:59:49.038556+00
30	2	LOCK_ACQUIRE	warehouse	1	{"lock_id": "fa222cc9-f607-4cb8-bdbf-fd75391fc567"}	2026-01-24 00:00:03.000681+00
31	2	LOCK_RELEASE	warehouse	1	{"lock_id": "fa222cc9-f607-4cb8-bdbf-fd75391fc567"}	2026-01-24 00:00:08.074292+00
32	2	BLOCK_LOCATION	location	1	{"is_blocked": true}	2026-01-24 00:00:12.216325+00
33	2	BLOCK_LOCATION	location	1	{"is_blocked": true}	2026-01-24 00:00:32.924174+00
34	2	BLOCK_LOCATION	location	1	{"is_blocked": false}	2026-01-24 00:00:40.58708+00
35	2	ISSUE_ORDER	order	1	{"status": "ZREALIZOWANE"}	2026-01-24 00:10:53.001129+00
36	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 00:35:31.89579+00
37	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 00:35:31.983599+00
38	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 00:35:50.736501+00
39	1	LOGIN_OK	\N	\N	\N	2026-01-24 00:36:19.530714+00
40	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 00:36:21.954516+00
41	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 00:36:21.973015+00
42	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 00:36:22.031664+00
43	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 00:38:21.407675+00
44	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 00:38:21.547081+00
45	1	LOGIN_OK	\N	\N	\N	2026-01-24 09:22:21.350043+00
46	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 09:22:24.130335+00
47	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:22:24.29224+00
48	1	CREATE_WAREHOUSE	warehouse	\N	{"name": "Magazyn 2"}	2026-01-24 09:23:06.431378+00
49	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 09:23:06.464266+00
50	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:23:06.511803+00
51	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:23:08.790524+00
52	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:23:09.594983+00
53	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:23:09.647175+00
54	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:23:12.696614+00
55	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:23:12.750757+00
56	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:23:13.498684+00
57	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:23:13.552504+00
58	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:25:03.400582+00
59	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:25:04.22188+00
60	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:36:40.432338+00
61	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:36:40.498677+00
62	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:36:41.242316+00
63	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:36:41.30764+00
64	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:36:42.061947+00
65	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:36:42.127786+00
66	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:36:59.144128+00
67	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:36:59.19868+00
68	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:37:00.137707+00
69	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:37:00.20066+00
70	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:37:01.060162+00
381	3	LOGIN_OK	\N	\N	\N	2026-01-24 17:17:22.576082+00
71	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:37:01.121205+00
76	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:37:03.133596+00
72	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:37:01.740692+00
73	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:37:01.800093+00
74	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:37:02.561097+00
75	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 09:37:02.619869+00
77	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 09:37:03.220638+00
78	1	VIEW_GLOBAL_SEARCH	\N	\N	{"q": "tes"}	2026-01-24 09:45:16.900706+00
79	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:10:49.722773+00
80	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:10:49.825002+00
81	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:10:51.446438+00
82	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:11:43.18978+00
83	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:12:03.116081+00
84	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:12:03.783253+00
85	1	LOGIN_OK	\N	\N	\N	2026-01-24 10:24:19.150574+00
86	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:24:21.784784+00
87	2	LOGIN_OK	\N	\N	\N	2026-01-24 10:24:33.132555+00
88	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:24:34.557637+00
89	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:25:02.291745+00
90	2	CREATE_DELIVERY	delivery	3	{"document_no": "WZ3"}	2026-01-24 10:25:21.439997+00
91	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:25:47.422491+00
92	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:25:48.505672+00
93	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:26:21.421574+00
94	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:26:21.937908+00
95	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:26:23.735462+00
96	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:26:24.252641+00
97	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:26:33.567106+00
98	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:26:51.651739+00
99	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:30:24.367055+00
100	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:36:35.725657+00
101	2	LOGIN_OK	\N	\N	\N	2026-01-24 10:39:13.51802+00
102	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:39:15.095282+00
103	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:39:53.679536+00
104	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:39:53.767687+00
105	1	LOGIN_OK	\N	\N	\N	2026-01-24 10:40:24.840884+00
106	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:40:27.508884+00
107	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:40:27.523344+00
108	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:40:27.587104+00
109	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:40:50.339655+00
110	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:40:51.351775+00
111	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:40:52.875375+00
112	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:40:53.205614+00
113	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:40:53.400549+00
114	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:40:53.57235+00
115	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:41:03.138063+00
116	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:41:03.642104+00
117	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:41:03.707986+00
118	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:41:11.322398+00
119	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:41:16.909686+00
120	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:41:16.971537+00
121	1	LOGIN_OK	\N	\N	\N	2026-01-24 10:47:42.165498+00
122	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:47:44.918004+00
123	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:47:45.027124+00
124	1	CREATE_LOCATION	location	2	{"code": "A1", "warehouse_id": 2}	2026-01-24 10:48:28.823966+00
125	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:48:28.876353+00
126	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:48:28.956611+00
127	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:48:41.426643+00
128	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:48:42.93068+00
129	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:48:45.251243+00
130	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:48:45.31255+00
131	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:48:50.426093+00
132	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:48:50.50881+00
133	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:48:53.31596+00
134	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:48:53.38215+00
135	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:51:27.194057+00
136	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:51:27.28973+00
384	2	LOGIN_OK	\N	\N	\N	2026-01-24 17:19:09.370409+00
137	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:51:33.261987+00
138	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:51:34.596975+00
140	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:52:14.552102+00
141	1	LOCK_ACQUIRE	warehouse	1	{"lock_id": "0452452a-46eb-4eb9-88ec-6f7381df4b7a"}	2026-01-24 10:52:23.734654+00
143	1	BLOCK_LOCATION	location	1	{"is_blocked": false}	2026-01-24 10:52:50.233644+00
145	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:52:50.353636+00
151	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:55:55.382714+00
154	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:56:12.417122+00
159	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:56:31.604117+00
160	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:56:33.099442+00
173	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:57:03.413701+00
139	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:51:34.660694+00
147	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:54:57.204911+00
149	1	LOCK_ACQUIRE	warehouse	1	{"lock_id": "75d162ac-42bc-4163-9d16-fc57e0897094"}	2026-01-24 10:55:13.921777+00
150	1	LOCK_RELEASE	warehouse	1	{"lock_id": "75d162ac-42bc-4163-9d16-fc57e0897094"}	2026-01-24 10:55:27.528557+00
157	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:56:22.116111+00
162	1	BLOCK_LOCATION	location	1	{"is_blocked": true}	2026-01-24 10:56:45.477291+00
164	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:56:45.597684+00
165	1	BLOCK_LOCATION	location	1	{"is_blocked": false}	2026-01-24 10:56:47.681975+00
167	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:56:47.802941+00
168	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:56:53.704166+00
171	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:56:59.444888+00
142	1	LOCK_RELEASE	warehouse	1	{"lock_id": "0452452a-46eb-4eb9-88ec-6f7381df4b7a"}	2026-01-24 10:52:28.671384+00
146	1	LOGIN_OK	\N	\N	\N	2026-01-24 10:54:55.513377+00
148	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:54:57.290395+00
152	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:55:55.444618+00
153	1	BLOCK_LOCATION	location	1	{"is_blocked": true}	2026-01-24 10:56:12.365454+00
155	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:56:12.489816+00
156	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:56:22.05038+00
163	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:56:45.528464+00
166	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:56:47.735551+00
172	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:57:03.352136+00
144	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:52:50.283187+00
158	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 10:56:31.518142+00
161	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:56:33.16279+00
169	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 10:56:53.774169+00
170	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 10:56:59.361225+00
174	1	LOGIN_OK	\N	\N	\N	2026-01-24 11:02:57.944961+00
175	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:03:11.299003+00
176	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:05:12.916871+00
177	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:05:14.328149+00
178	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:05:14.80556+00
179	1	LOGIN_OK	\N	\N	\N	2026-01-24 11:12:16.266081+00
180	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:12:17.764908+00
181	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:12:21.971692+00
182	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:12:38.795296+00
183	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:12:39.363019+00
184	2	LOGIN_OK	\N	\N	\N	2026-01-24 11:12:57.999878+00
185	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:12:59.828975+00
186	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:13:00.415733+00
187	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:13:37.041458+00
188	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:13:37.665081+00
189	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:14:17.007605+00
190	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:17:09.56197+00
191	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:18:30.549609+00
192	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:18:39.920011+00
193	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 11:18:40.005231+00
194	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:22:46.286239+00
195	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:23:06.684375+00
196	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:23:07.698893+00
197	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 11:23:07.787731+00
198	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 11:23:11.086071+00
199	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 11:23:11.74793+00
200	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 11:23:11.817212+00
201	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 11:23:12.685553+00
202	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 11:23:12.743075+00
203	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 11:23:13.492331+00
204	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 11:23:13.556369+00
205	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "total_qty", "order": "asc"}	2026-01-24 11:23:27.777688+00
206	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 11:23:27.821779+00
207	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "total_qty", "order": "desc"}	2026-01-24 11:23:30.252191+00
208	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 11:23:30.288222+00
209	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "total_qty", "order": "desc"}	2026-01-24 11:26:18.430181+00
210	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 11:26:18.441849+00
211	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 11:26:18.520944+00
212	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:26:20.372635+00
213	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:26:20.893593+00
214	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 11:26:21.380678+00
215	1	LOGIN_OK	\N	\N	\N	2026-01-24 11:32:50.470535+00
216	1	LOGIN_OK	\N	\N	\N	2026-01-24 12:21:57.224962+00
217	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:23:15.942764+00
218	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:23:18.702709+00
219	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:23:18.859931+00
220	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:23:21.114215+00
221	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:23:30.03066+00
222	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:23:30.112086+00
223	1	UPDATE_WAREHOUSE	warehouse	1	{"name": "Magazyn 1", "unit_scale": 1.0}	2026-01-24 12:23:45.858558+00
224	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:23:45.910822+00
225	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:23:45.995231+00
226	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:23:50.358106+00
227	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:23:50.43986+00
228	1	UPDATE_WAREHOUSE	warehouse	2	{"name": "Magazyn-002", "unit_scale": null}	2026-01-24 12:24:07.58957+00
229	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:24:07.639556+00
230	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:24:07.7264+00
231	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:24:09.491835+00
234	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:24:10.538672+00
237	1	UPDATE_WAREHOUSE	warehouse	1	{"name": "Magazyn-001", "unit_scale": null}	2026-01-24 12:24:20.836662+00
250	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:35:38.347383+00
232	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:24:09.576533+00
235	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:24:11.919468+00
240	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:24:27.006323+00
242	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:24:27.518562+00
247	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:30:58.876163+00
248	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:34:37.921572+00
251	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:35:40.219058+00
233	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:24:10.46215+00
239	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:24:21.000138+00
243	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:24:27.951052+00
249	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:34:38.06294+00
253	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:39:10.46783+00
236	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:24:11.98972+00
238	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:24:20.892625+00
241	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:24:27.436717+00
255	1	LOGIN_OK	\N	\N	\N	2026-01-24 12:46:25.23077+00
244	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:24:28.037924+00
245	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:30:55.443711+00
246	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:30:58.745923+00
252	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:35:40.292486+00
254	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:39:10.601853+00
256	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:48:51.863211+00
257	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:48:56.62263+00
258	2	LOGIN_OK	\N	\N	\N	2026-01-24 12:49:52.193225+00
259	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:49:55.412071+00
260	2	TRANSFER_STOCK	stock	2	{"qty": 2, "product_id": 2, "to_location_id": 2, "from_location_id": 1}	2026-01-24 12:50:04.235129+00
261	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:50:20.482365+00
262	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:50:20.620029+00
263	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:50:22.694588+00
264	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:50:22.761792+00
265	1	LOGIN_OK	\N	\N	\N	2026-01-24 12:50:44.629509+00
266	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:50:46.248489+00
267	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:50:46.264129+00
268	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:50:46.494763+00
269	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:50:47.722587+00
270	1	UPDATE_LOCATION	location	2	{"code": "A-001", "warehouse_id": 2}	2026-01-24 12:51:35.611578+00
271	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:51:35.697792+00
272	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:51:35.813613+00
273	1	CREATE_LOCATION	location	3	{"code": "A-002", "warehouse_id": 2}	2026-01-24 12:52:05.640271+00
274	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:52:05.722758+00
275	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:52:05.842395+00
276	1	UPDATE_LOCATION	location	2	{"code": "A-001", "warehouse_id": 1}	2026-01-24 12:52:24.938829+00
277	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:52:25.02774+00
278	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:52:25.135221+00
280	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:52:43.263896+00
281	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:52:43.362785+00
282	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:53:01.994823+00
283	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:53:02.087338+00
284	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:53:02.612632+00
285	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:53:02.709843+00
286	1	CREATE_LOCATION	location	4	{"code": "A-001", "warehouse_id": 2}	2026-01-24 12:53:19.809253+00
287	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:53:19.890849+00
288	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:53:20.001046+00
289	1	UPDATE_LOCATION	location	3	{"code": "A-002", "warehouse_id": 2}	2026-01-24 12:53:31.840251+00
290	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:53:31.931986+00
291	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:53:32.057972+00
292	1	CREATE_LOCATION	location	5	{"code": "A-003", "warehouse_id": 2}	2026-01-24 12:53:51.379284+00
293	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:53:51.466422+00
294	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:53:51.589122+00
295	1	CREATE_LOCATION	location	6	{"code": "B-001", "warehouse_id": 2}	2026-01-24 12:54:03.086662+00
296	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:54:03.176584+00
297	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:54:03.291372+00
298	1	CREATE_LOCATION	location	7	{"code": "B-002", "warehouse_id": 2}	2026-01-24 12:54:10.541167+00
299	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:54:10.629332+00
300	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:54:10.745085+00
301	1	CREATE_LOCATION	location	8	{"code": "B-003", "warehouse_id": 2}	2026-01-24 12:54:17.722532+00
302	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:54:17.814171+00
303	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:54:17.936686+00
304	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:56:15.316276+00
305	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:56:15.409715+00
306	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:56:16.130405+00
307	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:56:16.218615+00
308	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:56:16.700855+00
309	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:56:16.776061+00
310	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:56:17.280822+00
317	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:58:32.180118+00
311	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 12:56:17.350875+00
312	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:56:18.179053+00
315	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:58:28.241309+00
316	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:58:28.360622+00
313	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 12:56:18.240727+00
314	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 12:58:28.234521+00
318	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 13:05:06.667+00
319	1	UPDATE_ORDER_NO	order	5	{"order_no": "ZAMOWIENIE-001"}	2026-01-24 13:05:17.665883+00
320	1	UPDATE_ORDER_NO	order	1	{"order_no": "ZAMOWIENIE-002"}	2026-01-24 13:05:27.665699+00
321	1	UPDATE_ORDER_NO	order	3	{"order_no": "ZAMOWIENIE-003"}	2026-01-24 13:05:31.761075+00
322	1	UPDATE_ORDER_NO	order	1	{"order_no": "ZAM-002"}	2026-01-24 13:05:44.308567+00
323	1	UPDATE_ORDER_NO	order	3	{"order_no": "ZAM-003"}	2026-01-24 13:05:49.441905+00
324	1	UPDATE_ORDER_NO	order	5	{"order_no": "ZAM-001"}	2026-01-24 13:05:54.159804+00
325	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 13:18:49.691285+00
326	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 13:18:52.555941+00
327	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 13:18:53.085647+00
328	1	LOGIN_OK	\N	\N	\N	2026-01-24 13:57:56.177606+00
329	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 13:57:57.006956+00
330	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 13:57:57.597705+00
331	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 13:57:59.205334+00
332	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 13:57:59.299396+00
333	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:06:57.592563+00
334	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:11:49.180803+00
335	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:11:52.38038+00
336	1	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 14:11:52.452779+00
337	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:11:55.305904+00
338	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:19:59.6236+00
339	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:20:00.067341+00
340	2	LOGIN_OK	\N	\N	\N	2026-01-24 14:30:26.477339+00
341	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:30:27.919567+00
342	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:30:28.496831+00
343	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:30:30.097999+00
344	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:31:05.570959+00
345	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:31:19.960145+00
346	2	PUTAWAY_DELIVERY	delivery	3	\N	2026-01-24 14:31:58.71615+00
347	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:32:04.675044+00
348	2	ISSUE_ORDER	order	5	{"status": "ZREALIZOWANE"}	2026-01-24 14:32:16.833258+00
349	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:32:38.705+00
350	2	LOGIN_OK	\N	\N	\N	2026-01-24 14:50:21.549801+00
351	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:50:23.302788+00
352	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:50:41.596177+00
353	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:50:49.407778+00
354	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:54:14.134635+00
355	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:54:15.338169+00
356	2	CREATE_ORDER	order	6	{"order_no": "ZAM-004"}	2026-01-24 14:54:52.36051+00
357	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:55:10.028717+00
358	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:55:26.056963+00
359	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:55:32.306666+00
360	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:55:53.424905+00
361	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:55:57.417109+00
362	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 14:56:00.488522+00
363	1	LOGIN_OK	\N	\N	\N	2026-01-24 15:42:39.543727+00
364	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 15:42:43.308649+00
365	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 15:43:29.41451+00
366	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 15:43:34.527417+00
367	1	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 15:46:56.18823+00
368	2	LOGIN_OK	\N	\N	\N	2026-01-24 17:14:39.939704+00
369	2	LOGIN_OK	\N	\N	\N	2026-01-24 17:15:22.12462+00
370	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 17:15:43.754893+00
371	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 17:15:43.862418+00
372	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 17:15:46.347103+00
373	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 17:15:47.069311+00
374	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 17:15:47.151649+00
375	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 17:15:47.83274+00
376	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-24 17:15:47.911517+00
377	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 17:16:10.963733+00
378	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-24 17:16:11.058496+00
379	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 17:16:53.058009+00
380	2	CREATE_ORDER	order	7	{"order_no": "ZAM-005"}	2026-01-24 17:17:10.025266+00
382	3	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 17:17:24.836535+00
383	3	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 17:17:36.880632+00
385	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-24 17:19:10.795789+00
386	2	ISSUE_ORDER	order	3	{"status": "ZREALIZOWANE"}	2026-01-24 17:19:22.232479+00
387	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:05:53.832934+00
388	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:05:56.75327+00
389	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:06:19.843168+00
390	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:06:22.60111+00
391	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:09:40.934417+00
392	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:09:42.404286+00
393	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:09:42.975205+00
394	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:09:53.282874+00
395	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:10:11.397518+00
396	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:10:11.483541+00
397	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:10:15.788843+00
398	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:10:22.082394+00
399	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:10:42.234288+00
400	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:10:54.038329+00
401	2	CREATE_DELIVERY	delivery	4	{"document_no": "AUTO-ORDER-ZAM-005"}	2026-01-29 20:11:07.223153+00
402	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:14:39.71414+00
403	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:15:16.032927+00
404	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:15:17.538999+00
405	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:17:31.60102+00
406	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:17:33.246742+00
407	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:18:23.468375+00
408	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:18:24.451623+00
409	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:20:07.591591+00
410	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:20:09.031394+00
411	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:20:32.95308+00
412	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:20:34.664283+00
413	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:20:34.715618+00
414	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:20:35.882977+00
415	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-29 20:20:43.958523+00
416	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-29 20:20:44.036381+00
417	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:20:57.956263+00
418	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:20:58.029464+00
419	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-29 20:21:08.789137+00
420	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	2	{"threshold": 5}	2026-01-29 20:21:08.863851+00
421	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:21:19.74811+00
422	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:21:19.836145+00
423	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:21:30.993388+00
424	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:23:33.595632+00
425	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:23:35.750151+00
426	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:25:47.200969+00
427	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:25:49.589571+00
430	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:27:39.544125+00
431	2	PUTAWAY_DELIVERY	delivery	4	\N	2026-01-29 20:28:00.812652+00
432	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:28:04.56278+00
433	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:28:04.638565+00
434	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:28:05.766378+00
435	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:28:11.808964+00
436	2	ISSUE_ORDER	order	7	{"status": "ZREALIZOWANE"}	2026-01-29 20:28:24.794928+00
437	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:28:46.341879+00
438	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:28:46.357918+00
439	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 20:28:46.469526+00
440	2	LOGIN_OK	\N	\N	\N	2026-01-29 20:56:40.409662+00
441	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:58:52.087751+00
442	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:59:24.625859+00
443	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:59:39.596217+00
444	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 20:59:56.354521+00
445	2	CREATE_DELIVERY	delivery	5	{"document_no": "AUTO-ORDER-ZAM-004"}	2026-01-29 21:00:10.167753+00
446	2	PUTAWAY_DELIVERY	delivery	5	\N	2026-01-29 21:00:35.083428+00
447	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 21:00:38.377622+00
448	2	ISSUE_ORDER	order	6	{"status": "ZREALIZOWANE"}	2026-01-29 21:00:44.267892+00
449	2	CREATE_ORDER	order	8	{"order_no": "ZAM-006"}	2026-01-29 21:00:57.279969+00
450	2	CANCEL_ORDER	order	8	\N	2026-01-29 21:01:00.927271+00
451	2	UPDATE_STATUS	order	8	{"status": "NOWE"}	2026-01-29 21:01:14.672865+00
452	2	UPDATE_STATUS	order	8	{"status": "NOWE"}	2026-01-29 21:01:20.877765+00
453	2	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 21:01:49.36233+00
456	3	LOGIN_OK	\N	\N	\N	2026-01-29 21:03:08.724209+00
454	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 21:01:49.613817+00
459	3	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 21:03:20.022654+00
462	1	LOGIN_OK	\N	\N	\N	2026-01-29 21:03:29.751265+00
455	2	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 21:01:52.706964+00
457	3	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 21:03:12.727363+00
458	3	VIEW_WAREHOUSES_LIST	warehouse	\N	{"q": null, "sort": "name", "order": "asc"}	2026-01-29 21:03:17.283278+00
460	3	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 21:03:20.043163+00
461	3	VIEW_WAREHOUSE_DASHBOARD	warehouse	1	{"threshold": 5}	2026-01-29 21:03:20.497597+00
463	1	LOGIN_OK	\N	\N	\N	2026-01-29 21:23:10.015488+00
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.customers (id, name, contact_data, created_at) FROM stdin;
1	Jak Kowalski	jak.kowalski@gmail.com | +48 823 192 564	2026-01-23 22:30:04.554383+00
3	Adam Kowalaski	adam.kowalski@gmail.com | +48 723 231 231	2026-01-24 14:51:35.155491+00
4	Marek Walkowiak	marek.walkowiak@gmail.com | +48 534 923 125	2026-01-24 14:52:20.847388+00
5	Maksymilian Zapałski	maaksymilian.zapalski@poczta.fm | +48 723 192 392	2026-01-24 14:53:14.471891+00
6	Monika Kowalska	monika.kowalska@interia.pl | +48 725 435 920	2026-01-24 14:53:37.346945+00
7	Karina Ziembik	karina.ziembik@gmail.com | +48 943 291 312	2026-01-24 14:54:10.389786+00
\.


--
-- Data for Name: deliveries; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.deliveries (id, document_no, supplier_id, status, created_by, created_at, approved_by, approved_at) FROM stdin;
1	WZ1	1	ZATWIERDZONA	3	2026-01-23 22:59:32.862275+00	3	2026-01-23 22:59:32.861047+00
2	WZ2	2	ZATWIERDZONA	2	2026-01-23 23:59:06.44436+00	2	2026-01-23 23:59:06.443539+00
3	WZ3	1	ZATWIERDZONA	2	2026-01-24 10:25:21.428947+00	2	2026-01-24 14:31:58.715763+00
4	AUTO-ORDER-ZAM-005	5	ZATWIERDZONA	2	2026-01-29 20:11:07.193314+00	2	2026-01-29 20:28:00.811492+00
5	AUTO-ORDER-ZAM-004	1	ZATWIERDZONA	2	2026-01-29 21:00:10.129005+00	2	2026-01-29 21:00:35.082213+00
\.


--
-- Data for Name: delivery_items; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.delivery_items (id, delivery_id, product_id, qty) FROM stdin;
1	1	1	5
2	2	2	7
3	3	1	3
4	4	11	2
5	4	12	2
6	5	17	3
7	5	14	1
\.


--
-- Data for Name: layout_locks; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.layout_locks (warehouse_id, lock_id, locked_by, expires_at, created_at) FROM stdin;
\.


--
-- Data for Name: locations; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.locations (id, warehouse_id, code, description, kind, is_blocked, geometry_json) FROM stdin;
1	1	MAIN	Domyślna lokalizacja	ZONE	f	\N
2	1	A-001	Regal A, poziom 1	RACK_CELL	f	null
4	2	A-001	Regal A, poziom 1	RACK_CELL	f	null
3	2	A-002	Regal A, poziom 2	RACK_CELL	f	null
5	2	A-003	Regal A, poziom 3	RACK_CELL	f	null
6	2	B-001	Regal B, poziom 1	RACK_CELL	f	null
7	2	B-002	Regal B, poziom 2	RACK_CELL	f	null
8	2	B-003	Regal B, poziom 3	RACK_CELL	f	null
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.order_items (id, order_id, product_id, qty_ordered, qty_issued) FROM stdin;
1	1	1	1	1
3	5	1	5	5
4	5	2	3	3
2	3	2	3	3
9	7	11	1	1
10	7	12	1	1
5	6	12	1	1
6	6	17	3	3
7	6	1	1	1
8	6	14	1	1
11	8	10	1	0
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.orders (id, order_no, customer_id, status, priority, created_at, updated_at) FROM stdin;
1	ZAM-002	1	ZREALIZOWANE	t	2026-01-23 22:36:41.113422+00	2026-01-24 13:05:44.301078+00
5	ZAM-001	1	ZREALIZOWANE	t	2026-01-23 23:56:54.71905+00	2026-01-24 14:32:16.818537+00
3	ZAM-003	1	ZREALIZOWANE	t	2026-01-23 23:56:19.657531+00	2026-01-24 17:19:22.21831+00
7	ZAM-005	7	ZREALIZOWANE	t	2026-01-24 17:17:10.008541+00	2026-01-29 20:28:24.773095+00
6	ZAM-004	4	ZREALIZOWANE	f	2026-01-24 14:54:52.287204+00	2026-01-29 21:00:44.190806+00
8	ZAM-006	7	NOWE	f	2026-01-29 21:00:57.257653+00	2026-01-29 21:01:14.636824+00
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.products (id, sku, name, type, brand, model, created_at) FROM stdin;
2	SKU-002	Mikrofon pojemnościowy studyjny	Audio	Audio-Technica	AT2020	2026-01-23 22:05:09.428821+00
5	SKU-003	Statyw mikrofonowy prosty	Akcesoria	K&M	210/9	2026-01-24 11:47:10.396807+00
6	SKU-004	Mikser audio 12-kanałowy	Audio	Behringer	Xenyx QX1202	2026-01-24 11:47:46.608584+00
7	SKU-005	Interfejs audio USB	Audio	Focusrite	Scarlett 2i2	2026-01-24 11:48:29.311641+00
8	SKU-006	Kolumna aktywna 1000W	Audio	JBL	EON610	2026-01-24 11:50:04.675441+00
9	SKU-007	Subwoofer aktywny	Audio	Yamaha	DXS15	2026-01-24 11:50:30.520376+00
10	SKU-008	Kamera wideo Full HD	Video	Sony	HXR-MC88	2026-01-24 11:51:06.55462+00
11	SKU-009	Statyw wideo z głowicą	Akcesoria	Manfrotto	MVH502AH	2026-01-24 11:51:35.398563+00
12	SKU-010	Kamera sportowa 4K	Video	GoPro	HERO10 Black	2026-01-24 11:52:13.448896+00
13	SKU-011	Projektor multimedialny Full HD	Video	Epson	EB-FHD01	2026-01-24 11:52:49.015558+00
14	SKU-012	Ekran projekcyjny 120"	Video	Avtek	Tripod Standard	2026-01-24 11:53:23.94357+00
15	SKU-013	Monitor studyjny aktywny	Audio	KRK	Rokit 5 G4	2026-01-24 11:53:52.824322+00
16	SKU-014	Odtwarzacz multimedialny	Video	Xiaomi	Mi TV Vox S	2026-01-24 11:54:19.4646+00
17	SKU-015	Przewód XLR 10m	Okablowanie	Cordial	CCM 10 FM	2026-01-24 11:54:42.528215+00
1	SKU-001	Mikrofon dynamiczny sceniczny	Audio	Shure	SM58	2026-01-23 22:01:53.596076+00
\.


--
-- Data for Name: stock_positions; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.stock_positions (id, product_id, location_id, quantity) FROM stdin;
2	2	1	0
3	2	2	1
8	11	1	1
1	1	1	1
9	12	1	0
10	17	4	0
11	14	3	0
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.suppliers (id, name, contact_data, created_at) FROM stdin;
1	AudioTech Distribution	kontakt@audiotech.pl | +48 22 123 45 67	2026-01-23 22:58:37.109217+00
2	ProSound Logistics	sales@prosoundlogistics.com | +48 32 987 65 43	2026-01-23 23:30:13.673512+00
3	VisionAV Polska	biuro@visionav.pl | +48 61 555 12 34	2026-01-24 12:47:56.318449+00
4	Stage & Studio Supply	info@stagestudio.eu | +48 71 444 88 99	2026-01-24 12:48:11.827053+00
5	MediaGear Wholesale	orders@mediagear.pl | +48 58 321 09 87	2026-01-24 12:48:23.924762+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.users (id, login, password_hash, role, is_active, must_change_pwd, created_at, updated_at) FROM stdin;
1	admin	$pbkdf2-sha256$29000$934vZUzJOYfwPoeQUkopBQ$VGJB6dNbmDoydvZtulHqCHnil80UPPKdB.q4NxfznEY	ADMIN	t	t	2026-01-23 21:03:32.809072+00	2026-01-23 21:03:32.809082+00
2	kierownik	$pbkdf2-sha256$29000$I0RoLUXofU8JYYxRSonxPg$g7L1qcW/YjBICL0KIMpRtNXNCph73QtgtJUx9HgoXEk	KIEROWNIK	t	t	2026-01-23 21:03:32.809086+00	2026-01-23 21:03:32.809088+00
3	magazynier	$pbkdf2-sha256$29000$oTRmjDHGWEuJUeo9x5gzZg$qko9bvYPleCIB3QU9faNE4w.S5.p6NKD.4OmDeYtoBE	MAGAZYNIER	t	t	2026-01-23 21:03:32.809091+00	2026-01-23 21:03:32.809094+00
\.


--
-- Data for Name: warehouse_layouts; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.warehouse_layouts (warehouse_id, layout_json, version, updated_at, updated_by) FROM stdin;
1	{"unit": "m", "objects": [], "boundary": [{"to": [40, 0], "from": [0, 0], "type": "line"}, {"to": [40, 30], "from": [40, 0], "type": "line"}, {"to": [0, 30], "from": [40, 30], "type": "line"}, {"to": [0, 0], "from": [0, 30], "type": "line"}]}	1	2026-01-23 20:35:13.35792+00	\N
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: default
--

COPY public.warehouses (id, name, unit_scale, created_at) FROM stdin;
2	Magazyn-002	10.0000	2026-01-24 09:23:06.433892+00
1	Magazyn-001	1.0000	2026-01-23 20:35:13.34579+00
\.


--
-- Name: audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.audit_log_id_seq', 463, true);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.customers_id_seq', 7, true);


--
-- Name: deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.deliveries_id_seq', 5, true);


--
-- Name: delivery_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.delivery_items_id_seq', 7, true);


--
-- Name: locations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.locations_id_seq', 8, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.order_items_id_seq', 11, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.orders_id_seq', 8, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.products_id_seq', 17, true);


--
-- Name: stock_positions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.stock_positions_id_seq', 11, true);


--
-- Name: suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.suppliers_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.users_id_seq', 3, true);


--
-- Name: warehouses_id_seq; Type: SEQUENCE SET; Schema: public; Owner: default
--

SELECT pg_catalog.setval('public.warehouses_id_seq', 2, true);


--
-- Name: audit_log audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: deliveries deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_pkey PRIMARY KEY (id);


--
-- Name: delivery_items delivery_items_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.delivery_items
    ADD CONSTRAINT delivery_items_pkey PRIMARY KEY (id);


--
-- Name: layout_locks layout_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.layout_locks
    ADD CONSTRAINT layout_locks_pkey PRIMARY KEY (warehouse_id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_order_id_product_id_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_product_id_key UNIQUE (order_id, product_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_no_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_no_key UNIQUE (order_no);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: products products_sku_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_sku_key UNIQUE (sku);


--
-- Name: stock_positions stock_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stock_positions
    ADD CONSTRAINT stock_positions_pkey PRIMARY KEY (id);


--
-- Name: stock_positions stock_positions_product_id_location_id_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stock_positions
    ADD CONSTRAINT stock_positions_product_id_location_id_key UNIQUE (product_id, location_id);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: locations uq_locations_code_per_wh; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT uq_locations_code_per_wh UNIQUE (warehouse_id, code);


--
-- Name: users users_login_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_login_key UNIQUE (login);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: warehouse_layouts warehouse_layouts_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.warehouse_layouts
    ADD CONSTRAINT warehouse_layouts_pkey PRIMARY KEY (warehouse_id);


--
-- Name: warehouses warehouses_name_key; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_name_key UNIQUE (name);


--
-- Name: warehouses warehouses_pkey; Type: CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT warehouses_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_action; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_audit_action ON public.audit_log USING btree (action);


--
-- Name: idx_audit_created; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_audit_created ON public.audit_log USING btree (created_at);


--
-- Name: idx_deliveries_doc; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_deliveries_doc ON public.deliveries USING btree (document_no);


--
-- Name: idx_deliveries_status; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_deliveries_status ON public.deliveries USING btree (status);


--
-- Name: idx_delivery_items_delivery; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_delivery_items_delivery ON public.delivery_items USING btree (delivery_id);


--
-- Name: idx_layout_locks_expires; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_layout_locks_expires ON public.layout_locks USING btree (expires_at);


--
-- Name: idx_locations_geometry_gin; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_locations_geometry_gin ON public.locations USING gin (geometry_json);


--
-- Name: idx_locations_warehouse; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_locations_warehouse ON public.locations USING btree (warehouse_id);


--
-- Name: idx_order_items_order; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_order_items_order ON public.order_items USING btree (order_id);


--
-- Name: idx_orders_customer; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_orders_customer ON public.orders USING btree (customer_id);


--
-- Name: idx_orders_status; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_orders_status ON public.orders USING btree (status);


--
-- Name: idx_products_name; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_products_name ON public.products USING btree (name);


--
-- Name: idx_stock_location; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_stock_location ON public.stock_positions USING btree (location_id);


--
-- Name: idx_stock_product; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_stock_product ON public.stock_positions USING btree (product_id);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: idx_warehouse_layouts_gin; Type: INDEX; Schema: public; Owner: default
--

CREATE INDEX idx_warehouse_layouts_gin ON public.warehouse_layouts USING gin (layout_json);


--
-- Name: orders trg_orders_updated; Type: TRIGGER; Schema: public; Owner: default
--

CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: users trg_users_updated; Type: TRIGGER; Schema: public; Owner: default
--

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: audit_log audit_log_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.audit_log
    ADD CONSTRAINT audit_log_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: deliveries deliveries_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: deliveries deliveries_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: deliveries deliveries_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.deliveries
    ADD CONSTRAINT deliveries_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE RESTRICT;


--
-- Name: delivery_items delivery_items_delivery_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.delivery_items
    ADD CONSTRAINT delivery_items_delivery_id_fkey FOREIGN KEY (delivery_id) REFERENCES public.deliveries(id) ON DELETE CASCADE;


--
-- Name: delivery_items delivery_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.delivery_items
    ADD CONSTRAINT delivery_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: layout_locks layout_locks_locked_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.layout_locks
    ADD CONSTRAINT layout_locks_locked_by_fkey FOREIGN KEY (locked_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: layout_locks layout_locks_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.layout_locks
    ADD CONSTRAINT layout_locks_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON DELETE CASCADE;


--
-- Name: locations locations_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: orders orders_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE RESTRICT;


--
-- Name: stock_positions stock_positions_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stock_positions
    ADD CONSTRAINT stock_positions_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id) ON DELETE RESTRICT;


--
-- Name: stock_positions stock_positions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.stock_positions
    ADD CONSTRAINT stock_positions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: warehouse_layouts warehouse_layouts_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.warehouse_layouts
    ADD CONSTRAINT warehouse_layouts_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: warehouse_layouts warehouse_layouts_warehouse_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: default
--

ALTER TABLE ONLY public.warehouse_layouts
    ADD CONSTRAINT warehouse_layouts_warehouse_id_fkey FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict xPgdp17QVu1ZstOXNYscE3pWFWrbblbW0XxqJ8MIBi4hJAa8SmeoQE7Tk4VoZY4

