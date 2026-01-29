"use client";
import * as React from "react";

export type ViewKey =
  | "dashboard"
  | "products"
  | "stock"
  | "deliveries"
  | "orders"
  | "customers"
  | "suppliers"
  | "warehouses"
  | "search"
  | "admin"
  | "reports";

export default function useWmsData(baseUrl: string) {
  const [token, setToken] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<string | null>(null);
  const [view, setView] = React.useState<ViewKey>("dashboard");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [health, setHealth] = React.useState("checking");

  const [loginForm, setLoginForm] = React.useState({ username: "", password: "" });
  const [productSearch, setProductSearch] = React.useState("");
  const [productForm, setProductForm] = React.useState({
    sku: "",
    name: "",
    type: "",
    brand: "",
    model: "",
  });
  const [productSkuSuggestion, setProductSkuSuggestion] = React.useState("");
  const [productModalOpen, setProductModalOpen] = React.useState(false);
  const [productEditForm, setProductEditForm] = React.useState({
    id: "",
    sku: "",
    name: "",
    type: "",
    brand: "",
    model: "",
  });
  const [productEditMessage, setProductEditMessage] = React.useState<string | null>(null);
  const [stockFilters, setStockFilters] = React.useState({
    warehouse_id: "",
    product_id: "",
    location_id: "",
  });
  const [stockTransferForm, setStockTransferForm] = React.useState({
    product_id: "",
    from_location_id: "",
    to_location_id: "",
    qty: "1",
  });
  const [stockFilterLookup, setStockFilterLookup] = React.useState({
    product: "",
    location: "",
  });
  const [stockTransferFilter, setStockTransferFilter] = React.useState({
    product: "",
    location: "",
  });
  const [deliveryStatus, setDeliveryStatus] = React.useState("");
  const [deliveryForm, setDeliveryForm] = React.useState({
    supplier_id: "",
    document_no: "",
    items: [{ sku: "", qty: "1", location_code: "" }],
  });
  const [deliveryWarehouseId, setDeliveryWarehouseId] = React.useState("");
  const [deliveryInProgress, setDeliveryInProgress] = React.useState<any[]>([]);
  const [deliveryPutawayForm, setDeliveryPutawayForm] = React.useState({
    delivery_id: "",
    items: [{ sku: "", qty: "1", location_code: "" }],
  });
  const [deliveryModalOpen, setDeliveryModalOpen] = React.useState(false);
  const [deliverySelected, setDeliverySelected] = React.useState<any | null>(null);
  const [deliveryItemsSummary, setDeliveryItemsSummary] = React.useState<any[]>([]);
  const [orderFilters, setOrderFilters] = React.useState({
    status: "",
    customer_id: "",
    priority: "",
  });
  const [orderForm, setOrderForm] = React.useState({
    order_no: "",
    customer_id: "",
    priority: false,
    items: [{ sku: "", qty: "1" }],
  });
  const [orderDetailId, setOrderDetailId] = React.useState("");
  const [orderSummary, setOrderSummary] = React.useState<any | null>(null);
  const [orderStatusUpdate, setOrderStatusUpdate] = React.useState("");
  const [orderModalOpen, setOrderModalOpen] = React.useState(false);
  const [orderSelected, setOrderSelected] = React.useState<any | null>(null);
  const [orderEditForm, setOrderEditForm] = React.useState({
    id: "",
    order_no: "",
  });
  const [orderEditMessage, setOrderEditMessage] = React.useState<string | null>(null);
  const [orderNoSuggestion, setOrderNoSuggestion] = React.useState("");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any | null>(null);
  const [orderAction, setOrderAction] = React.useState({
    order_id: "",
    priority: false,
  });
  const [lookups, setLookups] = React.useState({
    customers: [] as any[],
    suppliers: [] as any[],
    products: [] as any[],
    locations: [] as any[],
    warehouses: [] as any[],
  });
  const [customerForm, setCustomerForm] = React.useState({
    name: "",
    contact_data: "",
  });
  const [customerModalOpen, setCustomerModalOpen] = React.useState(false);
  const [customerEditForm, setCustomerEditForm] = React.useState({
    id: "",
    name: "",
    contact_data: "",
  });
  const [customerSelectSearch, setCustomerSelectSearch] = React.useState("");
  const [supplierForm, setSupplierForm] = React.useState({
    name: "",
    contact_data: "",
  });
  const [supplierModalOpen, setSupplierModalOpen] = React.useState(false);
  const [supplierEditForm, setSupplierEditForm] = React.useState({
    id: "",
    name: "",
    contact_data: "",
  });
  const [supplierSelectSearch, setSupplierSelectSearch] = React.useState("");
  const [customerSearch, setCustomerSearch] = React.useState("");
  const [supplierSearch, setSupplierSearch] = React.useState("");
  const [warehouseView, setWarehouseView] = React.useState({
    warehouse_id: "",
    location_id: "",
    is_blocked: false,
  });
  const [locationForm, setLocationForm] = React.useState({
    warehouse_id: "",
    code: "",
    description: "",
    kind: "RACK_CELL",
    is_blocked: false,
  });
  const [locationEditForm, setLocationEditForm] = React.useState({
    id: "",
    warehouse_id: "",
    code: "",
    description: "",
    kind: "",
    is_blocked: false,
  });
  const [locationFormMessage, setLocationFormMessage] = React.useState<string | null>(null);
  const [locationSelectSearch, setLocationSelectSearch] = React.useState("");
  const [layoutLock, setLayoutLock] = React.useState<any | null>(null);
  const [layoutLockMessage, setLayoutLockMessage] = React.useState<string | null>(null);
  const [warehouseList, setWarehouseList] = React.useState<any[]>([]);
  const [warehouseQuery, setWarehouseQuery] = React.useState({
    q: "",
    sort: "name",
    order: "asc",
  });
  const [warehouseSelected, setWarehouseSelected] = React.useState<any | null>(null);
  const [warehouseTab, setWarehouseTab] = React.useState("summary");
  const [warehouseDashboard, setWarehouseDashboard] = React.useState<any | null>(null);
  const [warehouseStock, setWarehouseStock] = React.useState<any[]>([]);
  const [warehouseStockQuery, setWarehouseStockQuery] = React.useState({
    q: "",
    page: 1,
    page_size: 20,
    sort: "qty",
    order: "desc",
  });
  const [warehouseStockTotal, setWarehouseStockTotal] = React.useState(0);
  const [warehouseProductLocations, setWarehouseProductLocations] = React.useState<any[]>([]);
  const [warehouseLocations, setWarehouseLocations] = React.useState<any[]>([]);
  const [warehouseLocationFilter, setWarehouseLocationFilter] = React.useState("");
  const [warehouseForm, setWarehouseForm] = React.useState({
    name: "",
    unit_scale: "1.0",
  });
  const [warehouseEditForm, setWarehouseEditForm] = React.useState({
    id: "",
    name: "",
    unit_scale: "",
  });
  const [warehouseFormMessage, setWarehouseFormMessage] = React.useState<string | null>(null);
  const [adminUserForm, setAdminUserForm] = React.useState({
    login: "",
    password: "",
    role: "MAGAZYNIER",
  });
  const [adminUpdateForm, setAdminUpdateForm] = React.useState({
    user_id: "",
    role: "MAGAZYNIER",
    is_active: true,
    password: "",
  });
  const [reportFilters, setReportFilters] = React.useState({
    action: "",
    user_id: "",
    status: "",
    supplier_id: "",
    customer_id: "",
    priority: "",
  });
  const [pagination, setPagination] = React.useState({ limit: 50, page: 1 });
  const tableContainerRef = React.useRef<HTMLDivElement | null>(null);
  const [scrollTop, setScrollTop] = React.useState(0);
  const [viewportHeight, setViewportHeight] = React.useState(0);
  const [reportType, setReportType] = React.useState("stock");

  const [data, setData] = React.useState<any[]>([]);
  const [productMessage, setProductMessage] = React.useState<string | null>(null);
  const [deliveryMessage, setDeliveryMessage] = React.useState<string | null>(null);
  const [orderMessage, setOrderMessage] = React.useState<string | null>(null);
  const [customerMessage, setCustomerMessage] = React.useState<string | null>(null);
  const [supplierMessage, setSupplierMessage] = React.useState<string | null>(null);
  const [adminMessage, setAdminMessage] = React.useState<string | null>(null);
  const [warehouseMessage, setWarehouseMessage] = React.useState<string | null>(null);
  const [stockTransferMessage, setStockTransferMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const storedToken = window.localStorage.getItem("wms_token");
    const storedRole = window.localStorage.getItem("wms_role");
    if (storedToken) setToken(storedToken);
    if (storedRole) setRole(storedRole);
  }, []);

  React.useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${baseUrl}/health`);
        if (!res.ok) throw new Error("Health check failed");
        setHealth("ok");
      } catch {
        setHealth("offline");
      }
    };
    checkHealth();
  }, []);

  React.useEffect(() => {
    if (!token) return;
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, reportType]);

  React.useEffect(() => {
    if (view !== "products" || !productModalOpen) return;
    const suggestion = handleSuggestSku();
    setProductForm((prev) => ({
      ...prev,
      sku: prev.sku || suggestion,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, productModalOpen, data]);

  React.useEffect(() => {
    if (view !== "orders" || !orderModalOpen) return;
    const suggestion = handleSuggestOrderNo();
    setOrderForm((prev) => ({
      ...prev,
      order_no: prev.order_no || suggestion,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, orderModalOpen, data]);

  React.useEffect(() => {
    if (view !== "warehouses" || !warehouseSelected) return;
    handleLoadWarehouseDetails(String(warehouseSelected.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    view,
    warehouseSelected?.id,
    warehouseStockQuery.page,
    warehouseStockQuery.page_size,
    warehouseStockQuery.sort,
    warehouseStockQuery.order,
  ]);

  React.useEffect(() => {
    const updateHeight = () => {
      if (tableContainerRef.current) {
        setViewportHeight(tableContainerRef.current.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  React.useEffect(() => {
    if (!token) return;
    const loadLookups = async () => {
      try {
        const [customers, suppliers, products, locations, warehouses] = await Promise.all([
          apiFetch("/customers"),
          apiFetch("/suppliers"),
          apiFetch("/products"),
          apiFetch("/locations"),
          apiFetch("/warehouses"),
        ]);
        setLookups({ customers, suppliers, products, locations, warehouses });
      } catch {
        // Ignore lookup failures; user can still type manually.
      }
    };
    if (view === "orders" || view === "deliveries" || view === "stock") {
      loadLookups();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, token]);

  React.useEffect(() => {
    if (!token) return;
    const loadDeliveryItems = async () => {
      if (!deliveryPutawayForm.delivery_id) {
        setDeliveryItemsSummary([]);
        return;
      }
      try {
        const delivery = await apiFetch(`/deliveries/${deliveryPutawayForm.delivery_id}`);
        setDeliveryItemsSummary(Array.isArray(delivery.items) ? delivery.items : []);
      } catch {
        setDeliveryItemsSummary([]);
      }
    };
    loadDeliveryItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deliveryPutawayForm.delivery_id, token]);

  const apiFetch = async (path: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    if (token) headers.set("Authorization", `Bearer ${token}`);
    if (!headers.has("Content-Type") && options.body) {
      headers.set("Content-Type", "application/json");
    }
    const res = await fetch(`${baseUrl}${path}`, { ...options, headers });
    if (!res.ok) {
      if (res.status === 401) {
        handleLogout();
      }
      const text = await res.text();
      throw new Error(text || `HTTP ${res.status}`);
    }
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return res.json();
    }
    return res.text();
  };

  const handleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const payload = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(loginForm),
      });
      setToken(payload.access_token);
      setRole(payload.role);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("wms_token", payload.access_token);
        window.localStorage.setItem("wms_role", payload.role);
      }
      setView("dashboard");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const canManageProducts = role === "ADMIN" || role === "KIEROWNIK";
  const canManageDeliveries = role === "MAGAZYNIER" || role === "KIEROWNIK";
  const canCreateOrders = role === "ADMIN" || role === "KIEROWNIK";
  const canIssueOrders = role === "MAGAZYNIER" || role === "KIEROWNIK";
  const canManageOrderPriority = role === "KIEROWNIK";
  const canCancelOrders = role === "KIEROWNIK";
  const canManageCustomers = role === "ADMIN" || role === "KIEROWNIK";
  const canManageSuppliers = role === "ADMIN" || role === "KIEROWNIK";
  const canManageAdmin = role === "ADMIN";
  const canManageLocations = role === "ADMIN" || role === "KIEROWNIK";
  const canManageLocationsAdmin = role === "ADMIN";
  const canTransferStock = role === "MAGAZYNIER" || role === "KIEROWNIK";
  const canManageWarehouses = role === "ADMIN";

  const allowedViews = React.useMemo(() => {
    if (role === "ADMIN") {
      return new Set<ViewKey>([
        "dashboard",
        "products",
        "stock",
        "deliveries",
        "orders",
        "customers",
        "suppliers",
        "warehouses",
        "search",
        "admin",
        "reports",
      ]);
    }
    if (role === "KIEROWNIK") {
      return new Set<ViewKey>([
        "dashboard",
        "products",
        "stock",
        "deliveries",
        "orders",
        "customers",
        "suppliers",
        "warehouses",
        "search",
        "reports",
      ]);
    }
    if (role === "MAGAZYNIER") {
      return new Set<ViewKey>([
        "dashboard",
        "products",
        "stock",
        "deliveries",
        "orders",
        "warehouses",
        "search",
      ]);
    }
    return new Set<ViewKey>(["dashboard"]);
  }, [role]);

  React.useEffect(() => {
    if (!allowedViews.has(view)) {
      setView("dashboard");
    }
  }, [allowedViews, view]);

  const handleCreateProduct = async () => {
    setError(null);
    setProductMessage(null);
    setLoading(true);
    try {
      const payload = {
        ...productForm,
        sku: productForm.sku || productSkuSuggestion,
      };
      await apiFetch("/products", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setProductMessage("Produkt dodany.");
      setProductForm({ sku: "", name: "", type: "", brand: "", model: "" });
      setProductModalOpen(false);
      setProductSkuSuggestion("");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac produktu");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product: any) => {
    setProductEditMessage(null);
    setProductEditForm({
      id: String(product.id),
      sku: product.sku,
      name: product.name ?? "",
      type: product.type ?? "",
      brand: product.brand ?? "",
      model: product.model ?? "",
    });
  };

  const handleSuggestSku = () => {
    const existingSkus = Array.isArray(data)
      ? data.map((item: any) => item.sku).filter(Boolean)
      : [];
    const maxNumber = existingSkus.reduce((acc: number, sku: string) => {
      const match = /^SKU-(\d+)$/.exec(String(sku).toUpperCase());
      if (!match) return acc;
      const value = Number(match[1]);
      return Number.isFinite(value) ? Math.max(acc, value) : acc;
    }, 0);
    const nextNumber = String(maxNumber + 1).padStart(3, "0");
    const suggestion = `SKU-${nextNumber}`;
    setProductSkuSuggestion(suggestion);
    return suggestion;
  };

  const handleUpdateProduct = async () => {
    if (!productEditForm.id) return;
    setError(null);
    setProductEditMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/products/${productEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          sku: role === "ADMIN" ? productEditForm.sku || undefined : undefined,
          name: productEditForm.name || undefined,
          type: productEditForm.type || undefined,
          brand: productEditForm.brand || undefined,
          model: productEditForm.model || undefined,
        }),
      });
      setProductEditMessage("Produkt zaktualizowany.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zapisac produktu");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!productEditForm.id) return;
    if (!confirm("Na pewno usunac produkt?")) return;
    setError(null);
    setProductEditMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/products/${productEditForm.id}`, { method: "DELETE" });
      setProductEditMessage("Produkt usuniety.");
      setProductEditForm({
        id: "",
        sku: "",
        name: "",
        type: "",
        brand: "",
        model: "",
      });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie usunac produktu");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDeliveryItem = () => {
    setDeliveryForm((prev) => ({
      ...prev,
      items: [...prev.items, { sku: "", qty: "1", location_code: "" }],
    }));
  };

  const handleRemoveDeliveryItem = (index: number) => {
    setDeliveryForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleCreateDelivery = async () => {
    setError(null);
    setDeliveryMessage(null);
    setLoading(true);
    try {
      const payload = {
        supplier_id: Number(deliveryForm.supplier_id),
        document_no: deliveryForm.document_no,
        items: deliveryForm.items.map((item) => ({
          sku: item.sku,
          qty: Number(item.qty),
          location_code: item.location_code?.trim() || undefined,
        })),
      };
      await apiFetch("/deliveries", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setDeliveryMessage("Dostawa dodana. Status: W TRAKCIE.");
      setDeliveryForm({
        supplier_id: "",
        document_no: "",
        items: [{ sku: "", qty: "1", location_code: "" }],
      });
      setDeliveryModalOpen(false);
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac dostawy");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPutawayItem = () => {
    setDeliveryPutawayForm((prev) => ({
      ...prev,
      items: [...prev.items, { sku: "", qty: "1", location_code: "" }],
    }));
  };

  const handleRemovePutawayItem = (index: number) => {
    setDeliveryPutawayForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handlePutawayDelivery = async () => {
    const hasMissingFields = deliveryPutawayForm.items.some(
      (item) => !item.sku || !item.qty || !item.location_code
    );
    if (!deliveryPutawayForm.delivery_id || hasMissingFields) {
      setError("Wypelnij ID dostawy oraz SKU/ilosc/lokacje dla kazdej pozycji.");
      return;
    }
    if (!deliveryWarehouseId) {
      setError("Wybierz magazyn przed zmagazynowaniem dostawy.");
      return;
    }
    setError(null);
    setDeliveryMessage(null);
    setLoading(true);
    try {
      const payload = {
        items: deliveryPutawayForm.items.map((item) => ({
          sku: item.sku,
          qty: Number(item.qty),
          location_code: item.location_code,
          warehouse_id: Number(deliveryWarehouseId),
        })),
      };
      await apiFetch(`/deliveries/${deliveryPutawayForm.delivery_id}/putaway`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setDeliveryMessage("Dostawa zmagazynowana.");
      setDeliveryPutawayForm({
        delivery_id: "",
        items: [{ sku: "", qty: "1", location_code: "" }],
      });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zmagazynowac dostawy");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrderItem = () => {
    setOrderForm((prev) => ({
      ...prev,
      items: [...prev.items, { sku: "", qty: "1" }],
    }));
  };

  const handleRemoveOrderItem = (index: number) => {
    setOrderForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, idx) => idx !== index),
    }));
  };

  const handleCreateOrder = async () => {
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      const payload = {
        order_no: orderForm.order_no,
        customer_id: Number(orderForm.customer_id),
        priority: orderForm.priority,
        items: orderForm.items.map((item) => ({
          sku: item.sku,
          qty: Number(item.qty),
        })),
      };
      await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setOrderMessage("Zamowienie utworzone.");
      setOrderForm({
        order_no: "",
        customer_id: "",
        priority: false,
        items: [{ sku: "", qty: "1" }],
      });
      setOrderModalOpen(false);
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie utworzyc zamowienia");
    } finally {
      setLoading(false);
    }
  };

  const handleIssueOrder = async () => {
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/orders/${orderAction.order_id}/issue`, { method: "POST" });
      setOrderMessage("Zamowienie wydane.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie wydac zamowienia");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/orders/${orderAction.order_id}/cancel`, { method: "POST" });
      setOrderMessage("Zamowienie anulowane.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie anulowac zamowienia");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePriority = async () => {
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/orders/${orderAction.order_id}/priority`, {
        method: "PATCH",
        body: JSON.stringify({ priority: orderAction.priority }),
      });
      setOrderMessage("Priorytet zaktualizowany.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac priorytetu");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrderStatus = async () => {
    if (!orderSummary?.order_id) return;
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      const payload = { status: orderStatusUpdate || orderSummary.status };
      const updated = await apiFetch(`/orders/${orderSummary.order_id}/status`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setOrderSummary((prev: any) => ({ ...prev, status: updated.status }));
      setOrderMessage("Status zaktualizowany.");
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zmienic statusu");
    } finally {
      setLoading(false);
    }
  };

  const handleFetchOrderSummary = async (orderId?: string) => {
    const targetId = orderId || orderDetailId;
    if (!targetId) return;
    setError(null);
    setOrderMessage(null);
    setLoading(true);
    try {
      const summary = await apiFetch(`/orders/${targetId}/summary`);
      setOrderSummary(summary);
      setOrderStatusUpdate(summary.status);
      setOrderAction((prev) => ({ ...prev, order_id: String(summary.order_id) }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie pobrac podsumowania");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderMissingToDelivery = () => {
    if (!orderSummary) return;
    const missingItems = orderSummary.items
      .filter((item: any) => item.missing > 0)
      .map((item: any) => ({
        sku: item.sku,
        qty: String(item.missing),
        location_code: "",
      }));
    if (missingItems.length === 0) {
      setOrderMessage("Braki nie wystepuja.");
      return;
    }
    setDeliveryForm((prev) => ({
      ...prev,
      supplier_id: "",
      document_no: `AUTO-ORDER-${orderSummary.order_no}`,
      items: missingItems,
    }));
    setDeliveryWarehouseId("");
    setView("deliveries");
  };

  const handleSelectDelivery = (delivery: any) => {
    setDeliverySelected(delivery);
    setDeliveryPutawayForm((prev) => ({
      ...prev,
      delivery_id: String(delivery.id),
    }));
  };

  const handleSelectOrder = async (order: any) => {
    setOrderSelected(order);
    setOrderAction((prev) => ({ ...prev, order_id: String(order.id) }));
    setOrderDetailId(String(order.id));
    setOrderEditForm({ id: String(order.id), order_no: order.order_no ?? "" });
    await handleFetchOrderSummary(String(order.id));
  };

  const handleSuggestOrderNo = () => {
    const existingNos = Array.isArray(data)
      ? data.map((item: any) => item.order_no).filter(Boolean)
      : [];
    const maxNumber = existingNos.reduce((acc: number, orderNo: string) => {
      const match = /^ZAM-(\d+)$/.exec(String(orderNo).toUpperCase());
      if (!match) return acc;
      const value = Number(match[1]);
      return Number.isFinite(value) ? Math.max(acc, value) : acc;
    }, 0);
    const nextNumber = String(maxNumber + 1).padStart(3, "0");
    const suggestion = `ZAM-${nextNumber}`;
    setOrderNoSuggestion(suggestion);
    return suggestion;
  };

  const handleUpdateOrderNo = async () => {
    if (!orderEditForm.id) return;
    setError(null);
    setOrderEditMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/orders/${orderEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify({ order_no: orderEditForm.order_no }),
      });
      setOrderEditMessage("Numer zamowienia zaktualizowany.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zmienic numeru zamowienia");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setError(null);
    setLoading(true);
    try {
      const results = await apiFetch(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(results);
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie wyszukac");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async () => {
    setError(null);
    setCustomerMessage(null);
    setLoading(true);
    try {
      await apiFetch("/customers", {
        method: "POST",
        body: JSON.stringify(customerForm),
      });
      setCustomerMessage("Klient dodany.");
      setCustomerForm({ name: "", contact_data: "" });
      setCustomerModalOpen(false);
      await refresh();
      const customers = await apiFetch("/customers");
      setLookups((prev) => ({ ...prev, customers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac klienta");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCustomer = (customer: any) => {
    setCustomerEditForm({
      id: String(customer.id),
      name: customer.name ?? "",
      contact_data: customer.contact_data ?? "",
    });
  };

  const handleUpdateCustomer = async () => {
    setError(null);
    setCustomerMessage(null);
    setLoading(true);
    try {
      const payload = {
        name: customerEditForm.name || undefined,
        contact_data: customerEditForm.contact_data || undefined,
      };
      await apiFetch(`/customers/${customerEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setCustomerMessage("Klient zaktualizowany.");
      setCustomerEditForm({ id: "", name: "", contact_data: "" });
      await refresh();
      const customers = await apiFetch("/customers");
      setLookups((prev) => ({ ...prev, customers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac klienta");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async () => {
    setError(null);
    setCustomerMessage(null);
    setLoading(true);
    try {
      if (!window.confirm("Czy na pewno chcesz usunac klienta?")) {
        setLoading(false);
        return;
      }
      await apiFetch(`/customers/${customerEditForm.id}`, { method: "DELETE" });
      setCustomerMessage("Klient usuniety.");
      setCustomerEditForm({ id: "", name: "", contact_data: "" });
      await refresh();
      const customers = await apiFetch("/customers");
      setLookups((prev) => ({ ...prev, customers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie usunac klienta");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSupplier = async () => {
    setError(null);
    setSupplierMessage(null);
    setLoading(true);
    try {
      await apiFetch("/suppliers", {
        method: "POST",
        body: JSON.stringify(supplierForm),
      });
      setSupplierMessage("Dostawca dodany.");
      setSupplierForm({ name: "", contact_data: "" });
      setSupplierModalOpen(false);
      await refresh();
      const suppliers = await apiFetch("/suppliers");
      setLookups((prev) => ({ ...prev, suppliers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac dostawcy");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSupplier = (supplier: any) => {
    setSupplierEditForm({
      id: String(supplier.id),
      name: supplier.name ?? "",
      contact_data: supplier.contact_data ?? "",
    });
  };

  const handleUpdateSupplier = async () => {
    setError(null);
    setSupplierMessage(null);
    setLoading(true);
    try {
      const payload = {
        name: supplierEditForm.name || undefined,
        contact_data: supplierEditForm.contact_data || undefined,
      };
      await apiFetch(`/suppliers/${supplierEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setSupplierMessage("Dostawca zaktualizowany.");
      setSupplierEditForm({ id: "", name: "", contact_data: "" });
      await refresh();
      const suppliers = await apiFetch("/suppliers");
      setLookups((prev) => ({ ...prev, suppliers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac dostawcy");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSupplier = async () => {
    setError(null);
    setSupplierMessage(null);
    setLoading(true);
    try {
      if (!window.confirm("Czy na pewno chcesz usunac dostawce?")) {
        setLoading(false);
        return;
      }
      await apiFetch(`/suppliers/${supplierEditForm.id}`, { method: "DELETE" });
      setSupplierMessage("Dostawca usuniety.");
      setSupplierEditForm({ id: "", name: "", contact_data: "" });
      await refresh();
      const suppliers = await apiFetch("/suppliers");
      setLookups((prev) => ({ ...prev, suppliers }));
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie usunac dostawcy");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockLocation = async () => {
    setError(null);
    setWarehouseMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/locations/${warehouseView.location_id}/block`, {
        method: "PATCH",
        body: JSON.stringify({ is_blocked: warehouseView.is_blocked }),
      });
      setWarehouseMessage("Lokacja zaktualizowana.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac lokacji");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectBlockLocation = async (locationId: string) => {
    setWarehouseView((prev) => ({ ...prev, location_id: locationId }));
    if (!locationId) {
      setWarehouseView((prev) => ({ ...prev, is_blocked: false }));
      return;
    }
    try {
      const location = await apiFetch(`/locations/${locationId}`);
      setWarehouseView((prev) => ({
        ...prev,
        is_blocked: Boolean(location.is_blocked),
      }));
    } catch {
      // Ignore fetch errors; user can still set manually.
    }
  };

  const handleCreateLocation = async () => {
    setError(null);
    setLocationFormMessage(null);
    if (!locationForm.warehouse_id || !locationForm.code) {
      setError("Wybierz magazyn i wpisz kod lokacji.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/locations", {
        method: "POST",
        body: JSON.stringify({
          warehouse_id: Number(locationForm.warehouse_id),
          code: locationForm.code,
          description: locationForm.description || null,
          kind: locationForm.kind || "RACK_CELL",
          is_blocked: locationForm.is_blocked,
        }),
      });
      setLocationFormMessage("Lokacja dodana.");
      setLocationForm({
        warehouse_id: "",
        code: "",
        description: "",
        kind: "RACK_CELL",
        is_blocked: false,
      });
      await handleLoadWarehouses();
      if (warehouseSelected) {
        await handleLoadWarehouseDetails(String(warehouseSelected.id));
      }
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac lokacji");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadLocationForEdit = async (locationId: string) => {
    if (!locationId) {
      setLocationEditForm({
        id: "",
        warehouse_id: "",
        code: "",
        description: "",
        kind: "",
        is_blocked: false,
      });
      return;
    }
    setError(null);
    try {
      const location = await apiFetch(`/locations/${locationId}`);
      setLocationEditForm({
        id: String(location.id),
        warehouse_id: String(location.warehouse_id),
        code: location.code,
        description: location.description ?? "",
        kind: location.kind ?? "RACK_CELL",
        is_blocked: Boolean(location.is_blocked),
      });
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie pobrac lokacji");
    }
  };

  const handleUpdateLocation = async () => {
    if (!locationEditForm.id) return;
    setError(null);
    setLocationFormMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/locations/${locationEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          warehouse_id: locationEditForm.warehouse_id
            ? Number(locationEditForm.warehouse_id)
            : undefined,
          code: locationEditForm.code || undefined,
          description: locationEditForm.description || null,
          kind: locationEditForm.kind || undefined,
          is_blocked: locationEditForm.is_blocked,
        }),
      });
      setLocationFormMessage("Lokacja zaktualizowana.");
      await handleLoadWarehouses();
      if (warehouseSelected) {
        await handleLoadWarehouseDetails(String(warehouseSelected.id));
      }
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zapisac lokacji");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async () => {
    if (!locationEditForm.id) return;
    if (!confirm("Na pewno usunac lokacje?")) return;
    setError(null);
    setLocationFormMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/locations/${locationEditForm.id}`, { method: "DELETE" });
      setLocationFormMessage("Lokacja usunieta.");
      setLocationEditForm({
        id: "",
        warehouse_id: "",
        code: "",
        description: "",
        kind: "",
        is_blocked: false,
      });
      await handleLoadWarehouses();
      if (warehouseSelected) {
        await handleLoadWarehouseDetails(String(warehouseSelected.id));
      }
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie usunac lokacji");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadWarehouses = async () => {
    const params = new URLSearchParams();
    if (warehouseQuery.q) params.set("q", warehouseQuery.q);
    if (warehouseQuery.sort) params.set("sort", warehouseQuery.sort);
    if (warehouseQuery.order) params.set("order", warehouseQuery.order);
    const list = await apiFetch(`/warehouses?${params.toString()}`);
    setWarehouseList(list);
    if (!warehouseSelected && list.length > 0) {
      setWarehouseSelected(list[0]);
      setWarehouseView((prev) => ({ ...prev, warehouse_id: String(list[0].id) }));
    }
  };

  const handleCreateWarehouse = async () => {
    setError(null);
    setWarehouseFormMessage(null);
    setLoading(true);
    try {
      await apiFetch("/warehouses", {
        method: "POST",
        body: JSON.stringify({
          name: warehouseForm.name,
          unit_scale: Number(warehouseForm.unit_scale),
        }),
      });
      setWarehouseForm({ name: "", unit_scale: "1.0" });
      setWarehouseFormMessage("Magazyn dodany.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac magazynu");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateWarehouse = async () => {
    setError(null);
    setWarehouseFormMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/warehouses/${warehouseEditForm.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: warehouseEditForm.name || undefined,
          unit_scale: warehouseEditForm.unit_scale
            ? Number(warehouseEditForm.unit_scale)
            : undefined,
        }),
      });
      setWarehouseEditForm({ id: "", name: "", unit_scale: "" });
      setWarehouseFormMessage("Magazyn zaktualizowany.");
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac magazynu");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadWarehouseDetails = async (warehouseId: string) => {
    const [dashboard, locations, stockResp] = await Promise.all([
      apiFetch(`/warehouses/${warehouseId}/dashboard`),
      apiFetch(`/warehouses/${warehouseId}/locations`),
      apiFetch(
        `/warehouses/${warehouseId}/stock/summary?q=${encodeURIComponent(
          warehouseStockQuery.q
        )}&page=${warehouseStockQuery.page}&page_size=${warehouseStockQuery.page_size}&sort=${warehouseStockQuery.sort}&order=${warehouseStockQuery.order}`
      ),
    ]);
    setWarehouseDashboard(dashboard);
    setWarehouseLocations(locations);
    setWarehouseStock(stockResp.items ?? []);
    setWarehouseStockTotal(stockResp.total ?? 0);
  };

  const handleSelectWarehouse = async (warehouse: any) => {
    setWarehouseSelected(warehouse);
    setWarehouseView((prev) => ({ ...prev, warehouse_id: String(warehouse.id) }));
    setWarehouseEditForm((prev) => ({
      ...prev,
      id: String(warehouse.id),
      name: warehouse.name ?? prev.name,
    }));
    setWarehouseTab("summary");
    setWarehouseProductLocations([]);
    setLayoutLock(null);
    setWarehouseView((prev) => ({ ...prev, location_id: "" }));
    await handleLoadWarehouseDetails(String(warehouse.id));
  };

  const handleLoadProductLocations = async (productId: number) => {
    if (!warehouseSelected) return;
    const rows = await apiFetch(
      `/warehouses/${warehouseSelected.id}/stock/product/${productId}`
    );
    setWarehouseProductLocations(rows);
  };

  const lowStockThreshold = 5;

  const handleFetchLock = async () => {
    if (!warehouseView.warehouse_id) return;
    setError(null);
    setLayoutLockMessage(null);
    setLoading(true);
    try {
      const lock = await apiFetch(`/warehouses/${warehouseView.warehouse_id}/layout/lock`);
      setLayoutLock(lock);
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie pobrac locka");
    } finally {
      setLoading(false);
    }
  };

  const handleAcquireLock = async () => {
    if (!warehouseView.warehouse_id) return;
    setError(null);
    setLayoutLockMessage(null);
    setLoading(true);
    try {
      const lock = await apiFetch(`/warehouses/${warehouseView.warehouse_id}/layout/lock`, {
        method: "POST",
      });
      setLayoutLock(lock);
      setLayoutLockMessage("Lock zalozony.");
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zalozyc locka");
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshLock = async () => {
    if (!warehouseView.warehouse_id || !layoutLock?.lock_id) return;
    setError(null);
    setLayoutLockMessage(null);
    setLoading(true);
    try {
      const lock = await apiFetch(
        `/warehouses/${warehouseView.warehouse_id}/layout/lock/refresh`,
        {
          method: "POST",
          body: JSON.stringify({ lock_id: layoutLock.lock_id }),
        }
      );
      setLayoutLock(lock);
      setLayoutLockMessage("Lock odswiezony.");
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie odswiezyc locka");
    } finally {
      setLoading(false);
    }
  };

  const handleReleaseLock = async () => {
    if (!warehouseView.warehouse_id || !layoutLock?.lock_id) return;
    setError(null);
    setLayoutLockMessage(null);
    setLoading(true);
    try {
      await apiFetch(`/warehouses/${warehouseView.warehouse_id}/layout/lock`, {
        method: "DELETE",
        body: JSON.stringify({ lock_id: layoutLock.lock_id }),
      });
      setLayoutLock(null);
      setLayoutLockMessage("Lock zwolniony.");
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zwolnic locka");
    } finally {
      setLoading(false);
    }
  };

  const handleTransferStock = async () => {
    setError(null);
    setStockTransferMessage(null);
    setLoading(true);
    try {
      const payload = {
        product_id: Number(stockTransferForm.product_id),
        from_location_id: Number(stockTransferForm.from_location_id),
        to_location_id: Number(stockTransferForm.to_location_id),
        qty: Number(stockTransferForm.qty),
      };
      await apiFetch("/stock/transfer", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setStockTransferMessage("Przeniesienie wykonane.");
      setStockTransferForm({
        product_id: "",
        from_location_id: "",
        to_location_id: "",
        qty: "1",
      });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie przeniesc stanu");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdminUser = async () => {
    setError(null);
    setAdminMessage(null);
    setLoading(true);
    try {
      await apiFetch("/admin/users", {
        method: "POST",
        body: JSON.stringify(adminUserForm),
      });
      setAdminMessage("Uzytkownik dodany.");
      setAdminUserForm({ login: "", password: "", role: "MAGAZYNIER" });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie dodac uzytkownika");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAdminUser = async () => {
    setError(null);
    setAdminMessage(null);
    setLoading(true);
    try {
      const payload = {
        role: adminUpdateForm.role || undefined,
        is_active: adminUpdateForm.is_active,
        password: adminUpdateForm.password || undefined,
      };
      await apiFetch(`/admin/users/${adminUpdateForm.user_id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      setAdminMessage("Uzytkownik zaktualizowany.");
      setAdminUpdateForm({
        user_id: "",
        role: "MAGAZYNIER",
        is_active: true,
        password: "",
      });
      await refresh();
    } catch (err: any) {
      setError(err?.message || "Nie udalo sie zaktualizowac uzytkownika");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setRole(null);
    setData([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("wms_token");
      window.localStorage.removeItem("wms_role");
    }
  };

  const refresh = async () => {
    setLoading(true);
    setError(null);
    try {
      if (view === "dashboard") {
        const [products, stock, deliveries, orders] = await Promise.all([
          apiFetch(`/products?search=${encodeURIComponent(productSearch)}`),
          apiFetch(`/stock`),
          apiFetch(`/deliveries`),
          apiFetch(`/orders`),
        ]);
        setData([
          { label: "Produkty", value: products.length },
          { label: "Stany", value: stock.length },
          { label: "Dostawy", value: deliveries.length },
          { label: "Zamowienia", value: orders.length },
        ]);
      } else if (view === "products") {
        const query = productSearch ? `?search=${encodeURIComponent(productSearch)}` : "";
        const products = await apiFetch(`/products${query}`);
        setData(products);
      } else if (view === "stock") {
        const params = new URLSearchParams();
        if (stockFilters.warehouse_id) params.set("warehouse_id", stockFilters.warehouse_id);
        if (stockFilters.product_id) params.set("product_id", stockFilters.product_id);
        if (stockFilters.location_id) params.set("location_id", stockFilters.location_id);
        const stock = await apiFetch(`/stock?${params.toString()}`);
        setData(stock);
      } else if (view === "deliveries") {
        const params = new URLSearchParams();
        if (deliveryStatus) params.set("status", deliveryStatus);
        const [deliveries, inProgress] = await Promise.all([
          apiFetch(`/deliveries?${params.toString()}`),
          apiFetch(`/deliveries?status=W_TRAKCIE`),
        ]);
        setData(deliveries);
        setDeliveryInProgress(inProgress);
      } else if (view === "orders") {
        const params = new URLSearchParams();
        if (orderFilters.status) params.set("status", orderFilters.status);
        if (orderFilters.customer_id) params.set("customer_id", orderFilters.customer_id);
        if (orderFilters.priority) params.set("priority", orderFilters.priority);
        const orders = await apiFetch(`/orders?${params.toString()}`);
        setData(orders);
      } else if (view === "customers") {
        const query = customerSearch ? `?search=${encodeURIComponent(customerSearch)}` : "";
        const customers = await apiFetch(`/customers${query}`);
        setData(customers);
      } else if (view === "suppliers") {
        const query = supplierSearch ? `?search=${encodeURIComponent(supplierSearch)}` : "";
        const suppliers = await apiFetch(`/suppliers${query}`);
        setData(suppliers);
      } else if (view === "warehouses") {
        await handleLoadWarehouses();
        if (warehouseSelected) {
          await handleLoadWarehouseDetails(String(warehouseSelected.id));
        }
      } else if (view === "admin") {
        const users = await apiFetch(`/admin/users`);
        setData(users);
      } else if (view === "reports") {
        const params = new URLSearchParams();
        if (reportType === "audit") {
          if (reportFilters.action) params.set("action", reportFilters.action);
          if (reportFilters.user_id) params.set("user_id", reportFilters.user_id);
        } else if (reportType === "deliveries") {
          if (reportFilters.status) params.set("status", reportFilters.status);
          if (reportFilters.supplier_id) params.set("supplier_id", reportFilters.supplier_id);
        } else if (reportType === "orders") {
          if (reportFilters.status) params.set("status", reportFilters.status);
          if (reportFilters.customer_id) params.set("customer_id", reportFilters.customer_id);
          if (reportFilters.priority) params.set("priority", reportFilters.priority);
        }
        const query = params.toString();
        const report = await apiFetch(`/reports/${reportType}${query ? `?${query}` : ""}`);
        const rows = Array.isArray(report) ? report : [];
        setData(rows);
      }
    } catch (err: any) {
      setError(err?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  const getColumns = () => {
    if (view === "products") {
      return [
        { key: "id", label: "ID" },
        { key: "sku", label: "SKU" },
        { key: "name", label: "Nazwa" },
        { key: "type", label: "Typ" },
        { key: "brand", label: "Marka" },
        { key: "model", label: "Model" },
      ];
    }
    if (view === "stock") {
      return [
        { key: "product", label: "Produkt (SKU / nazwa)" },
        { key: "warehouse", label: "Magazyn" },
        { key: "location", label: "Lokacja" },
        { key: "quantity", label: "Ilosc" },
      ];
    }
    if (view === "deliveries") {
      return [
        { key: "id", label: "ID" },
        { key: "document_no", label: "Dokument" },
        { key: "supplier_id", label: "Dostawca" },
        { key: "status", label: "Status" },
        { key: "created_at", label: "Data" },
      ];
    }
    if (view === "orders") {
      return [
        { key: "id", label: "ID" },
        { key: "order_no", label: "Numer" },
        { key: "customer_id", label: "Klient" },
        { key: "status", label: "Status" },
        { key: "priority", label: "Priorytet" },
      ];
    }
    if (view === "customers") {
      return [
        { key: "id", label: "ID" },
        { key: "name", label: "Nazwa" },
        { key: "contact_data", label: "Kontakt" },
      ];
    }
    if (view === "suppliers") {
      return [
        { key: "id", label: "ID" },
        { key: "name", label: "Nazwa" },
        { key: "contact_data", label: "Kontakt" },
      ];
    }
    if (view === "warehouses") {
      return [
        { key: "id", label: "ID" },
        { key: "code", label: "Kod" },
        { key: "description", label: "Opis" },
        { key: "kind", label: "Typ" },
        { key: "is_blocked", label: "Zablokowana" },
      ];
    }
    if (view === "admin") {
      return [
        { key: "id", label: "ID" },
        { key: "login", label: "Login" },
        { key: "role", label: "Rola" },
        { key: "is_active", label: "Aktywny" },
      ];
    }
    if (view === "reports") {
      if (reportType === "stock") {
        return [
          { key: "product_id", label: "Produkt" },
          { key: "location_id", label: "Lokacja" },
          { key: "quantity", label: "Ilosc" },
        ];
      }
      if (reportType === "deliveries") {
        return [
          { key: "document_no", label: "Dokument" },
          { key: "supplier_id", label: "Dostawca" },
          { key: "status", label: "Status" },
          { key: "created_at", label: "Data" },
        ];
      }
      if (reportType === "orders") {
        return [
          { key: "order_no", label: "Numer" },
          { key: "customer_id", label: "Klient" },
          { key: "status", label: "Status" },
          { key: "priority", label: "Priorytet" },
        ];
      }
      if (reportType === "audit") {
        return [
          { key: "created_at", label: "Data" },
          { key: "action", label: "Akcja" },
          { key: "user_id", label: "Uzytkownik" },
          { key: "entity", label: "Encja" },
          { key: "entity_id", label: "ID encji" },
        ];
      }
    }
    return [];
  };

  const renderCell = (row: any, key: string) => {
    if (view === "stock") {
      if (key === "product") {
        const product = lookups.products.find(
          (item) => String(item.id) === String(row?.product_id)
        );
        if (!product) return `ID ${row?.product_id ?? "-"}`;
        return `${product.sku} - ${product.name}`;
      }
      if (key === "location") {
        const location = lookups.locations.find(
          (item) => String(item.id) === String(row?.location_id)
        );
        if (!location) return `ID ${row?.location_id ?? "-"}`;
        return `${location.code} (ID ${location.id})`;
      }
      if (key === "warehouse") {
        const location = lookups.locations.find(
          (item) => String(item.id) === String(row?.location_id)
        );
        const warehouse = lookups.warehouses.find(
          (item) => String(item.id) === String(location?.warehouse_id)
        );
        if (!warehouse) return location?.warehouse_id ? `ID ${location.warehouse_id}` : "-";
        return `${warehouse.name} (ID ${warehouse.id})`;
      }
    }
    const value = row?.[key];
    if (value === null || value === undefined) return "-";
    if (
      key === "status" &&
      (view === "deliveries" || (view === "reports" && reportType === "deliveries"))
    ) {
      if (value === "W_TRAKCIE") return "W trakcie (oczekuje)";
      if (value === "ZATWIERDZONA") return "Zmagazynowana";
    }
    if (typeof value === "boolean") return value ? "Tak" : "Nie";
    return String(value);
  };

  const getDisplayRows = () => {
    if (!Array.isArray(data)) return [];
    const total = data.length;
    const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
    const currentPage = Math.min(pagination.page, totalPages);
    const start = (currentPage - 1) * pagination.limit;
    return data.slice(start, start + pagination.limit);
  };

  const getVirtualRows = (rows: any[]) => {
    const rowHeight = 48;
    const buffer = 6;
    if (!viewportHeight) {
      return { rows, top: 0, bottom: 0 };
    }
    const totalRows = rows.length;
    const visibleCount = Math.ceil(viewportHeight / rowHeight) + buffer * 2;
    const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - buffer);
    const endIndex = Math.min(totalRows, startIndex + visibleCount);
    return {
      rows: rows.slice(startIndex, endIndex),
      top: startIndex * rowHeight,
      bottom: (totalRows - endIndex) * rowHeight,
    };
  };

  const getPaginationInfo = () => {
    const total = Array.isArray(data) ? data.length : 0;
    const totalPages = Math.max(1, Math.ceil(total / pagination.limit));
    const currentPage = Math.min(pagination.page, totalPages);
    return { total, totalPages, currentPage };
  };

  const getRowKey = (row: any, index: number) =>
    row?.id ??
    row?.order_no ??
    row?.document_no ??
    row?.sku ??
    row?.action ??
    `row-${index}`;

  const renderDataTable = () => (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <div
        ref={tableContainerRef}
        className="max-h-[420px] overflow-auto"
        onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      >
        <table className="min-w-full text-left text-sm">
          <thead className="sticky top-0 bg-white">
            {getColumns().length > 0 ? (
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                {getColumns().map((col) => (
                  <th key={col.key} className="px-4 py-3">
                    {col.label}
                  </th>
                ))}
              </tr>
            ) : (
              <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3">Podglad</th>
              </tr>
            )}
          </thead>
          <tbody>
            {data.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-muted-foreground">
                  Brak danych. Uzyj filtrow lub odswiez.
                </td>
              </tr>
            )}
            {(() => {
              const pagedRows = getDisplayRows();
              const virtual = getVirtualRows(pagedRows);
              const colSpan = Math.max(1, getColumns().length);
              return (
                <>
                  {virtual.top > 0 && (
                    <tr>
                      <td style={{ height: virtual.top }} colSpan={colSpan} />
                    </tr>
                  )}
                  {virtual.rows.map((row, index) => (
                    <tr key={getRowKey(row, index)} className="border-b">
                      {getColumns().length > 0 ? (
                        getColumns().map((col) => (
                          <td key={col.key} className="px-4 py-3">
                            {renderCell(row, col.key)}
                          </td>
                        ))
                      ) : (
                        <td className="px-4 py-3">
                          <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
                            {JSON.stringify(row, null, 2)}
                          </pre>
                        </td>
                      )}
                    </tr>
                  ))}
                  {virtual.bottom > 0 && (
                    <tr>
                      <td style={{ height: virtual.bottom }} colSpan={colSpan} />
                    </tr>
                  )}
                </>
              );
            })()}
          </tbody>
        </table>
      </div>
    </div>
  );

  const canPutawayDelivery = React.useMemo(() => {
    if (!deliveryPutawayForm.delivery_id) return false;
    return deliveryPutawayForm.items.every(
      (item) => item.sku && Number(item.qty) > 0 && item.location_code
    );
  }, [deliveryPutawayForm]);


  return {
    token,
    setToken,
    role,
    setRole,
    view,
    setView,
    loading,
    setLoading,
    error,
    setError,
    health,
    setHealth,
    loginForm,
    setLoginForm,
    productSearch,
    setProductSearch,
    productForm,
    setProductForm,
    productSkuSuggestion,
    setProductSkuSuggestion,
    productModalOpen,
    setProductModalOpen,
    productEditForm,
    setProductEditForm,
    productEditMessage,
    setProductEditMessage,
    stockFilters,
    setStockFilters,
    stockTransferForm,
    setStockTransferForm,
    stockFilterLookup,
    setStockFilterLookup,
    stockTransferFilter,
    setStockTransferFilter,
    deliveryStatus,
    setDeliveryStatus,
    deliveryForm,
    setDeliveryForm,
    deliveryWarehouseId,
    setDeliveryWarehouseId,
    deliveryInProgress,
    setDeliveryInProgress,
    deliveryPutawayForm,
    setDeliveryPutawayForm,
    deliveryModalOpen,
    setDeliveryModalOpen,
    deliverySelected,
    setDeliverySelected,
    deliveryItemsSummary,
    setDeliveryItemsSummary,
    orderFilters,
    setOrderFilters,
    orderForm,
    setOrderForm,
    orderDetailId,
    setOrderDetailId,
    orderSummary,
    setOrderSummary,
    orderStatusUpdate,
    setOrderStatusUpdate,
    orderModalOpen,
    setOrderModalOpen,
    orderSelected,
    setOrderSelected,
    orderEditForm,
    setOrderEditForm,
    orderEditMessage,
    setOrderEditMessage,
    orderNoSuggestion,
    setOrderNoSuggestion,
    searchQuery,
    setSearchQuery,
    searchResults,
    setSearchResults,
    orderAction,
    setOrderAction,
    lookups,
    setLookups,
    customerForm,
    setCustomerForm,
    customerModalOpen,
    setCustomerModalOpen,
    customerEditForm,
    setCustomerEditForm,
    customerSelectSearch,
    setCustomerSelectSearch,
    supplierForm,
    setSupplierForm,
    supplierModalOpen,
    setSupplierModalOpen,
    supplierEditForm,
    setSupplierEditForm,
    supplierSelectSearch,
    setSupplierSelectSearch,
    customerSearch,
    setCustomerSearch,
    supplierSearch,
    setSupplierSearch,
    warehouseView,
    setWarehouseView,
    locationForm,
    setLocationForm,
    locationEditForm,
    setLocationEditForm,
    locationFormMessage,
    setLocationFormMessage,
    locationSelectSearch,
    setLocationSelectSearch,
    layoutLock,
    setLayoutLock,
    layoutLockMessage,
    setLayoutLockMessage,
    warehouseList,
    setWarehouseList,
    warehouseQuery,
    setWarehouseQuery,
    warehouseSelected,
    setWarehouseSelected,
    warehouseTab,
    setWarehouseTab,
    warehouseDashboard,
    setWarehouseDashboard,
    warehouseStock,
    setWarehouseStock,
    warehouseStockQuery,
    setWarehouseStockQuery,
    warehouseStockTotal,
    setWarehouseStockTotal,
    warehouseProductLocations,
    setWarehouseProductLocations,
    warehouseLocations,
    setWarehouseLocations,
    warehouseLocationFilter,
    setWarehouseLocationFilter,
    warehouseForm,
    setWarehouseForm,
    warehouseEditForm,
    setWarehouseEditForm,
    warehouseFormMessage,
    setWarehouseFormMessage,
    adminUserForm,
    setAdminUserForm,
    adminUpdateForm,
    setAdminUpdateForm,
    reportFilters,
    setReportFilters,
    pagination,
    setPagination,
    tableContainerRef,
    scrollTop,
    setScrollTop,
    viewportHeight,
    setViewportHeight,
    reportType,
    setReportType,
    data,
    setData,
    productMessage,
    setProductMessage,
    deliveryMessage,
    setDeliveryMessage,
    orderMessage,
    setOrderMessage,
    customerMessage,
    setCustomerMessage,
    supplierMessage,
    setSupplierMessage,
    adminMessage,
    setAdminMessage,
    warehouseMessage,
    setWarehouseMessage,
    stockTransferMessage,
    setStockTransferMessage,
    apiFetch,
    handleLogin,
    canManageProducts,
    canManageDeliveries,
    canCreateOrders,
    canIssueOrders,
    canManageOrderPriority,
    canCancelOrders,
    canManageCustomers,
    canManageSuppliers,
    canManageAdmin,
    canManageLocations,
    canManageLocationsAdmin,
    canTransferStock,
    canManageWarehouses,
    allowedViews,
    handleCreateProduct,
    handleSelectProduct,
    handleSuggestSku,
    handleUpdateProduct,
    handleDeleteProduct,
    handleAddDeliveryItem,
    handleRemoveDeliveryItem,
    handleCreateDelivery,
    handleAddPutawayItem,
    handleRemovePutawayItem,
    handlePutawayDelivery,
    handleAddOrderItem,
    handleRemoveOrderItem,
    handleCreateOrder,
    handleIssueOrder,
    handleCancelOrder,
    handleUpdatePriority,
    handleUpdateOrderStatus,
    handleFetchOrderSummary,
    handleOrderMissingToDelivery,
    handleSelectDelivery,
    handleSelectOrder,
    handleSuggestOrderNo,
    handleUpdateOrderNo,
    handleSearch,
    handleCreateCustomer,
    handleSelectCustomer,
    handleUpdateCustomer,
    handleDeleteCustomer,
    handleCreateSupplier,
    handleSelectSupplier,
    handleUpdateSupplier,
    handleDeleteSupplier,
    handleBlockLocation,
    handleSelectBlockLocation,
    handleCreateLocation,
    handleLoadLocationForEdit,
    handleUpdateLocation,
    handleDeleteLocation,
    handleLoadWarehouses,
    handleCreateWarehouse,
    handleUpdateWarehouse,
    handleLoadWarehouseDetails,
    handleSelectWarehouse,
    handleLoadProductLocations,
    lowStockThreshold,
    handleFetchLock,
    handleAcquireLock,
    handleRefreshLock,
    handleReleaseLock,
    handleTransferStock,
    handleCreateAdminUser,
    handleUpdateAdminUser,
    handleLogout,
    refresh,
    getColumns,
    renderCell,
    getDisplayRows,
    getVirtualRows,
    getPaginationInfo,
    getRowKey,
    renderDataTable,
    canPutawayDelivery
  };
}
