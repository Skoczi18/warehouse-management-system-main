"use client";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ProductsSection from "./sections/ProductsSection";
import OrdersSection from "./sections/OrdersSection";
import DeliveriesSection from "./sections/DeliveriesSection";
import CustomersSection from "./sections/CustomersSection";
import SuppliersSection from "./sections/SuppliersSection";
import StockSection from "./sections/StockSection";
import SearchSection from "./sections/SearchSection";
import WarehousesSection from "./sections/WarehousesSection";
import AdminSection from "./sections/AdminSection";
import ReportsSection from "./sections/ReportsSection";
import DashboardSection from "./sections/DashboardSection";
import AppShell from "./components/AppShell";
import LoginCard from "./components/LoginCard";
import useWmsData from "./hooks/useWmsData";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function Page() {
  const {
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
    canPutawayDelivery,
  } = useWmsData(API_URL);
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_oklch(0.97_0.03_240),_transparent_55%),linear-gradient(135deg,_oklch(0.99_0.01_200),_oklch(0.94_0.02_40))] px-6 py-10 text-foreground">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-3 rounded-3xl border bg-white/80 px-6 py-6 shadow-sm backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Warehouse Management System
              </p>
              <h1 className="text-2xl font-semibold">WMS Console</h1>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>API: {API_URL}</span>
              <span className="rounded-full border px-3 py-1">
                Status: {health}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Role: {role ?? "brak"}</span>
            {token && (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Wyloguj
              </Button>
            )}
          </div>
        </header>

        {!token ? (
          <LoginCard
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            error={error}
            loading={loading}
            onLogin={handleLogin}
          />
        ) : (
          <AppShell
            view={view}
            setView={setView}
            allowedViews={allowedViews}
            loading={loading}
            onRefresh={refresh}
          >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold">
                    {view === "dashboard" && "Przeglad"}
                    {view === "products" && "Produkty"}
                    {view === "stock" && "Stany magazynowe"}
                    {view === "deliveries" && "Dostawy"}
                    {view === "orders" && "Zamowienia"}
                    {view === "customers" && "Klienci"}
                    {view === "suppliers" && "Dostawcy"}
                    {view === "warehouses" && "Magazyny i lokacje"}
                    {view === "search" && "Wyszukiwarka"}
                    {view === "admin" && "Administracja"}
                    {view === "reports" && "Raporty"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Dane pobierane na zadanie, zeby nie obciazac przegladarki.
                  </p>
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>

              {!allowedViews.has(view) && (
                <Card className="border-0 bg-secondary/60">
                  <CardHeader>
                    <CardTitle className="text-base">Brak dostepu</CardTitle>
                    <CardDescription>
                      Twoja rola nie ma uprawnien do tej sekcji.
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}

              {view === "products" && (
                <ProductsSection
                  role={role}
                  data={data}
                  loading={loading}
                  productSearch={productSearch}
                  setProductSearch={setProductSearch}
                  refresh={refresh}
                  canManageProducts={canManageProducts}
                  productModalOpen={productModalOpen}
                  setProductModalOpen={setProductModalOpen}
                  productForm={productForm}
                  setProductForm={setProductForm}
                  productSkuSuggestion={productSkuSuggestion}
                  productMessage={productMessage}
                  productEditForm={productEditForm}
                  setProductEditForm={setProductEditForm}
                  productEditMessage={productEditMessage}
                  handleCreateProduct={handleCreateProduct}
                  handleUpdateProduct={handleUpdateProduct}
                  handleDeleteProduct={handleDeleteProduct}
                  handleSelectProduct={handleSelectProduct}
                />
              )}

              {view === "deliveries" && (
                <DeliveriesSection
                  data={data}
                  loading={loading}
                  deliveryStatus={deliveryStatus}
                  setDeliveryStatus={setDeliveryStatus}
                  refresh={refresh}
                  setDeliveryModalOpen={setDeliveryModalOpen}
                  canManageDeliveries={canManageDeliveries}
                  deliverySelected={deliverySelected}
                  handleSelectDelivery={handleSelectDelivery}
                  deliveryPutawayForm={deliveryPutawayForm}
                  setDeliveryPutawayForm={setDeliveryPutawayForm}
                  deliveryInProgress={deliveryInProgress}
                  deliveryWarehouseId={deliveryWarehouseId}
                  setDeliveryWarehouseId={setDeliveryWarehouseId}
                  handleAddPutawayItem={handleAddPutawayItem}
                  handleRemovePutawayItem={handleRemovePutawayItem}
                  handlePutawayDelivery={handlePutawayDelivery}
                  canPutawayDelivery={canPutawayDelivery}
                  deliveryItemsSummary={deliveryItemsSummary}
                  lookups={{
                    products: lookups.products,
                    warehouses: lookups.warehouses,
                    locations: lookups.locations,
                  }}
                  renderDeliveryStatus={(delivery) => renderCell(delivery, "status")}
                  deliveryModalOpen={deliveryModalOpen}
                  deliveryForm={deliveryForm}
                  setDeliveryForm={setDeliveryForm}
                  handleAddDeliveryItem={handleAddDeliveryItem}
                  handleRemoveDeliveryItem={handleRemoveDeliveryItem}
                  handleCreateDelivery={handleCreateDelivery}
                  deliveryMessage={deliveryMessage}
                  lookupsSuppliers={lookups.suppliers}
                />
              )}


              {view === "stock" && (
                <StockSection
                  lookups={{
                    warehouses: lookups.warehouses,
                    products: lookups.products,
                    locations: lookups.locations,
                  }}
                  stockFilters={stockFilters}
                  setStockFilters={setStockFilters}
                  stockFilterLookup={stockFilterLookup}
                  setStockFilterLookup={setStockFilterLookup}
                  refresh={refresh}
                  loading={loading}
                  renderDataTable={renderDataTable}
                  stockTransferFilter={stockTransferFilter}
                  setStockTransferFilter={setStockTransferFilter}
                  stockTransferForm={stockTransferForm}
                  setStockTransferForm={setStockTransferForm}
                  canTransferStock={canTransferStock}
                  handleTransferStock={handleTransferStock}
                  stockTransferMessage={stockTransferMessage}
                />
              )}

              {view === "orders" && (
                <OrdersSection
                  role={role}
                  data={data}
                  loading={loading}
                  orderFilters={orderFilters}
                  setOrderFilters={setOrderFilters}
                  refresh={refresh}
                  setOrderModalOpen={setOrderModalOpen}
                  canCreateOrders={canCreateOrders}
                  orderSelected={orderSelected}
                  handleSelectOrder={handleSelectOrder}
                  orderModalOpen={orderModalOpen}
                  orderForm={orderForm}
                  setOrderForm={setOrderForm}
                  orderNoSuggestion={orderNoSuggestion}
                  orderMessage={orderMessage}
                  handleCreateOrder={handleCreateOrder}
                  handleAddOrderItem={handleAddOrderItem}
                  handleRemoveOrderItem={handleRemoveOrderItem}
                  lookups={{ customers: lookups.customers }}
                  orderAction={orderAction}
                  setOrderAction={setOrderAction}
                  canIssueOrders={canIssueOrders}
                  canCancelOrders={canCancelOrders}
                  canManageOrderPriority={canManageOrderPriority}
                  handleIssueOrder={handleIssueOrder}
                  handleCancelOrder={handleCancelOrder}
                  handleUpdatePriority={handleUpdatePriority}
                  orderDetailId={orderDetailId}
                  setOrderDetailId={setOrderDetailId}
                  handleFetchOrderSummary={handleFetchOrderSummary}
                  orderSummary={orderSummary}
                  orderStatusUpdate={orderStatusUpdate}
                  setOrderStatusUpdate={setOrderStatusUpdate}
                  handleUpdateOrderStatus={handleUpdateOrderStatus}
                  handleOrderMissingToDelivery={handleOrderMissingToDelivery}
                  orderEditForm={orderEditForm}
                  setOrderEditForm={setOrderEditForm}
                  orderEditMessage={orderEditMessage}
                  handleUpdateOrderNo={handleUpdateOrderNo}
                />
              )}

              {view === "search" && (
                <SearchSection
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  handleSearch={handleSearch}
                  loading={loading}
                  searchResults={searchResults}
                />
              )}

              {view === "customers" && (
                <CustomersSection
                  data={data}
                  loading={loading}
                  customerSearch={customerSearch}
                  setCustomerSearch={setCustomerSearch}
                  refresh={refresh}
                  canManageCustomers={canManageCustomers}
                  setCustomerModalOpen={setCustomerModalOpen}
                  customerEditForm={customerEditForm}
                  setCustomerEditForm={setCustomerEditForm}
                  handleUpdateCustomer={handleUpdateCustomer}
                  handleDeleteCustomer={handleDeleteCustomer}
                  handleSelectCustomer={handleSelectCustomer}
                  customerModalOpen={customerModalOpen}
                  customerForm={customerForm}
                  setCustomerForm={setCustomerForm}
                  handleCreateCustomer={handleCreateCustomer}
                  customerMessage={customerMessage}
                />
              )}

              {view === "suppliers" && (
                <SuppliersSection
                  data={data}
                  loading={loading}
                  supplierSearch={supplierSearch}
                  setSupplierSearch={setSupplierSearch}
                  refresh={refresh}
                  canManageSuppliers={canManageSuppliers}
                  setSupplierModalOpen={setSupplierModalOpen}
                  supplierEditForm={supplierEditForm}
                  setSupplierEditForm={setSupplierEditForm}
                  handleUpdateSupplier={handleUpdateSupplier}
                  handleDeleteSupplier={handleDeleteSupplier}
                  handleSelectSupplier={handleSelectSupplier}
                  supplierModalOpen={supplierModalOpen}
                  supplierForm={supplierForm}
                  setSupplierForm={setSupplierForm}
                  handleCreateSupplier={handleCreateSupplier}
                  supplierMessage={supplierMessage}
                />
              )}

              {view === "warehouses" && (
                <WarehousesSection
                  warehouseQuery={warehouseQuery}
                  setWarehouseQuery={setWarehouseQuery}
                  refresh={refresh}
                  loading={loading}
                  warehouseList={warehouseList}
                  warehouseSelected={warehouseSelected}
                  handleSelectWarehouse={handleSelectWarehouse}
                  warehouseTab={warehouseTab}
                  setWarehouseTab={setWarehouseTab}
                  warehouseDashboard={warehouseDashboard}
                  warehouseStockQuery={warehouseStockQuery}
                  setWarehouseStockQuery={setWarehouseStockQuery}
                  handleLoadWarehouseDetails={handleLoadWarehouseDetails}
                  warehouseStock={warehouseStock}
                  lowStockThreshold={lowStockThreshold}
                  handleLoadProductLocations={handleLoadProductLocations}
                  warehouseStockTotal={warehouseStockTotal}
                  warehouseProductLocations={warehouseProductLocations}
                  warehouseLocations={warehouseLocations}
                  warehouseLocationFilter={warehouseLocationFilter}
                  setWarehouseLocationFilter={setWarehouseLocationFilter}
                  locationForm={locationForm}
                  setLocationForm={setLocationForm}
                  locationFormMessage={locationFormMessage}
                  locationEditForm={locationEditForm}
                  setLocationEditForm={setLocationEditForm}
                  handleCreateLocation={handleCreateLocation}
                  handleUpdateLocation={handleUpdateLocation}
                  handleDeleteLocation={handleDeleteLocation}
                  locationSelectSearch={locationSelectSearch}
                  setLocationSelectSearch={setLocationSelectSearch}
                  warehouseView={warehouseView}
                  setWarehouseView={setWarehouseView}
                  handleSelectBlockLocation={handleSelectBlockLocation}
                  handleBlockLocation={handleBlockLocation}
                  canManageLocations={canManageLocations}
                  warehouseMessage={warehouseMessage}
                  layoutLock={layoutLock}
                  handleFetchLock={handleFetchLock}
                  handleAcquireLock={handleAcquireLock}
                  handleRefreshLock={handleRefreshLock}
                  handleReleaseLock={handleReleaseLock}
                  layoutLockMessage={layoutLockMessage}
                  canManageWarehouses={canManageWarehouses}
                  warehouseForm={warehouseForm}
                  setWarehouseForm={setWarehouseForm}
                  handleCreateWarehouse={handleCreateWarehouse}
                  warehouseFormMessage={warehouseFormMessage}
                  warehouseEditForm={warehouseEditForm}
                  setWarehouseEditForm={setWarehouseEditForm}
                  handleUpdateWarehouse={handleUpdateWarehouse}
                />
              )}

              {view === "admin" && (
                <AdminSection
                  adminUserForm={adminUserForm}
                  setAdminUserForm={setAdminUserForm}
                  adminUpdateForm={adminUpdateForm}
                  setAdminUpdateForm={setAdminUpdateForm}
                  handleCreateAdminUser={handleCreateAdminUser}
                  handleUpdateAdminUser={handleUpdateAdminUser}
                  canManageAdmin={canManageAdmin}
                  adminMessage={adminMessage}
                  loading={loading}
                />
              )}

              {view === "reports" && (
                <ReportsSection
                  reportType={reportType}
                  setReportType={setReportType}
                  reportFilters={reportFilters}
                  setReportFilters={setReportFilters}
                  refresh={refresh}
                  loading={loading}
                  pagination={pagination}
                  setPagination={setPagination}
                  getPaginationInfo={getPaginationInfo}
                />
              )}

              <div className="grid gap-4">
                {view === "dashboard" ? (
                  <DashboardSection data={data} />
                ) : view === "warehouses" ||
                  view === "stock" ||
                  view === "products" ||
                  view === "deliveries" ||
                  view === "orders" ||
                  view === "customers" ||
                  view === "suppliers" ? null : (
                  renderDataTable()
                )}
              </div>
                      </AppShell>
        )}
        <datalist id="product-skus">
          {lookups.products.map((product) => (
            <option key={product.id} value={product.sku}>
              {product.sku} - {product.name}
            </option>
          ))}
        </datalist>
        <datalist id="location-codes">
          {lookups.locations
            .filter((location) =>
              deliveryWarehouseId ? String(location.warehouse_id) === deliveryWarehouseId : true
            )
            .map((location) => (
            <option key={location.id} value={location.code}>
              {location.code}
            </option>
          ))}
        </datalist>
      </div>
    </main>
  );
}
