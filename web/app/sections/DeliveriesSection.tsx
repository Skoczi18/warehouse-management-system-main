"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "@/app/components/SectionCard";
import TableContainer from "@/app/components/TableContainer";

type DeliveriesSectionProps = {
  data: any[];
  loading: boolean;
  deliveryStatus: string;
  setDeliveryStatus: (value: string) => void;
  refresh: () => void;
  setDeliveryModalOpen: (open: boolean) => void;
  canManageDeliveries: boolean;
  deliverySelected: any | null;
  handleSelectDelivery: (delivery: any) => void;
  deliveryPutawayForm: {
    delivery_id: string;
    items: { sku: string; qty: string; location_code: string }[];
  };
  setDeliveryPutawayForm: React.Dispatch<
    React.SetStateAction<{
      delivery_id: string;
      items: { sku: string; qty: string; location_code: string }[];
    }>
  >;
  deliveryInProgress: any[];
  deliveryWarehouseId: string;
  setDeliveryWarehouseId: (value: string) => void;
  handleAddPutawayItem: () => void;
  handleRemovePutawayItem: (index: number) => void;
  handlePutawayDelivery: () => void;
  canPutawayDelivery: boolean;
  deliveryItemsSummary: any[];
  lookups: {
    products: any[];
    warehouses: any[];
    locations: any[];
  };
  renderDeliveryStatus: (delivery: any) => string;
  deliveryModalOpen: boolean;
  deliveryForm: {
    supplier_id: string;
    document_no: string;
    items: { sku: string; qty: string; location_code: string }[];
  };
  setDeliveryForm: React.Dispatch<
    React.SetStateAction<{
      supplier_id: string;
      document_no: string;
      items: { sku: string; qty: string; location_code: string }[];
    }>
  >;
  handleAddDeliveryItem: () => void;
  handleRemoveDeliveryItem: (index: number) => void;
  handleCreateDelivery: () => void;
  deliveryMessage: string | null;
  lookupsSuppliers: any[];
 };

export default function DeliveriesSection({
  data,
  loading,
  deliveryStatus,
  setDeliveryStatus,
  refresh,
  setDeliveryModalOpen,
  canManageDeliveries,
  deliverySelected,
  handleSelectDelivery,
  deliveryPutawayForm,
  setDeliveryPutawayForm,
  deliveryInProgress,
  deliveryWarehouseId,
  setDeliveryWarehouseId,
  handleAddPutawayItem,
  handleRemovePutawayItem,
  handlePutawayDelivery,
  canPutawayDelivery,
  deliveryItemsSummary,
  lookups,
  renderDeliveryStatus,
  deliveryModalOpen,
  deliveryForm,
  setDeliveryForm,
  handleAddDeliveryItem,
  handleRemoveDeliveryItem,
  handleCreateDelivery,
  deliveryMessage,
  lookupsSuppliers,
}: DeliveriesSectionProps) {
  const filteredLocations = React.useMemo(() => {
    const locations = Array.isArray(lookups.locations) ? lookups.locations : [];
    if (!deliveryWarehouseId) return locations;
    return locations.filter(
      (location) => String(location.warehouse_id) === String(deliveryWarehouseId)
    );
  }, [deliveryWarehouseId, lookups.locations]);

  return (
     <>
       <div className="grid gap-4">
         <div className="flex flex-wrap items-end justify-between gap-3">
           <div className="grid gap-2">
             <Label>Status</Label>
             <Input
               value={deliveryStatus}
               onChange={(event) => setDeliveryStatus(event.target.value)}
               placeholder="W_TRAKCIE"
             />
           </div>
           <div className="flex items-center gap-3">
             <Button onClick={refresh} disabled={loading}>
               Filtruj
             </Button>
             <Button onClick={() => setDeliveryModalOpen(true)} disabled={!canManageDeliveries}>
               Dodaj dostawe
             </Button>
           </div>
         </div>
         <TableContainer>
           <table className="min-w-full text-left text-sm">
             <thead className="sticky top-0 bg-white">
               <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                 <th className="px-4 py-3">Dokument</th>
                 <th className="px-4 py-3">Dostawca</th>
                 <th className="px-4 py-3">Status</th>
                 <th className="px-4 py-3">Data</th>
               </tr>
             </thead>
             <tbody>
              {data.length === 0 && (
                <tr key="deliveries-empty">
                  <td className="px-4 py-6 text-muted-foreground">
                    Brak dostaw. Dodaj pierwsza dostawe.
                  </td>
                </tr>
              )}
                {data.map((delivery: any, index: number) => (
                  <tr
                    key={`${delivery.id ?? delivery.document_no ?? "delivery"}-${index}`}
                    className={`cursor-pointer border-b hover:bg-secondary/40 ${
                      deliverySelected?.id === delivery.id ? "bg-secondary/40" : ""
                    }`}
                    onClick={() => handleSelectDelivery(delivery)}
                  >
                   <td className="px-4 py-3">{delivery.document_no}</td>
                   <td className="px-4 py-3">ID {delivery.supplier_id}</td>
                   <td className="px-4 py-3">{renderDeliveryStatus(delivery)}</td>
                   <td className="px-4 py-3">{delivery.created_at ?? "-"}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </TableContainer>
         {deliverySelected && (
           <SectionCard
             title="Wybrana dostawa"
             description={`ID ${deliverySelected.id} · dokument ${deliverySelected.document_no}`}
           >
             <div className="text-sm text-muted-foreground">
               Status: {renderDeliveryStatus(deliverySelected)}
             </div>
           </SectionCard>
         )}
         <SectionCard
           title="Zmagazynuj dostawe"
           description="Dla dostaw w trakcie. Tu wybierasz magazyn i lokacje, a system podniesie stany i ustawi status ZMAGAZYNOWANA."
           contentClassName="grid gap-4"
         >
             <div className="grid gap-2 md:grid-cols-2">
               <div className="grid gap-2">
                 <Label>Dostawy w trakcie</Label>
                 <select
                   className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                   value={deliveryPutawayForm.delivery_id}
                   onChange={(event) =>
                     setDeliveryPutawayForm((prev) => ({
                       ...prev,
                       delivery_id: event.target.value,
                     }))
                   }
                   disabled={!canManageDeliveries}
                 >
                   <option value="">Wybierz dostawe...</option>
                   {deliveryInProgress.map((delivery) => (
                     <option key={delivery.id} value={delivery.id}>
                       {delivery.document_no} (ID {delivery.id})
                     </option>
                   ))}
                 </select>
                 <Input
                   value={deliveryPutawayForm.delivery_id}
                   onChange={(event) =>
                     setDeliveryPutawayForm((prev) => ({
                       ...prev,
                       delivery_id: event.target.value,
                     }))
                   }
                   placeholder="lub wpisz ID dostawy"
                   disabled={!canManageDeliveries}
                 />
               </div>
               <div className="grid gap-2">
                 <Label>Magazyn (filtr lokacji)</Label>
                 <select
                   className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                   value={deliveryWarehouseId}
                   onChange={(event) => setDeliveryWarehouseId(event.target.value)}
                 >
                   <option value="">Wszystkie magazyny...</option>
                   {lookups.warehouses.map((warehouse) => (
                     <option key={warehouse.id} value={warehouse.id}>
                       {warehouse.name} (ID {warehouse.id})
                     </option>
                   ))}
                 </select>
               </div>
             </div>
             <div className="flex items-center justify-between">
               <Label>Pozycje do zmagazynowania</Label>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={handleAddPutawayItem}
                 disabled={!canManageDeliveries}
               >
                 Dodaj pozycje
               </Button>
             </div>
             {deliveryItemsSummary.length > 0 && (
               <div className="rounded-xl border bg-white">
                 <div className="border-b px-4 py-2 text-xs uppercase tracking-wide text-muted-foreground">
                   Zawartosc dostawy
                 </div>
                 <table className="min-w-full text-left text-sm">
                   <thead className="sticky top-0 bg-white">
                     <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                       <th className="px-4 py-2">SKU</th>
                       <th className="px-4 py-2">Produkt</th>
                       <th className="px-4 py-2">Ilosc</th>
                     </tr>
                   </thead>
                   <tbody>
                    {deliveryItemsSummary.map((item: any, index: number) => {
                      const product = lookups.products.find(
                        (row) => String(row.id) === String(item.product_id)
                      );
                      return (
                        <tr
                          key={`${item.id ?? item.product_id ?? "item"}-${index}`}
                          className="border-b"
                        >
                          <td className="px-4 py-2">{product?.sku ?? "-"}</td>
                          <td className="px-4 py-2">{product?.name ?? "-"}</td>
                          <td className="px-4 py-2">{item.qty}</td>
                        </tr>
                      );
                     })}
                   </tbody>
                 </table>
               </div>
             )}
             <div className="grid gap-3">
               {deliveryPutawayForm.items.map((item, index) => (
                 <div
                   key={`putaway-item-${index}`}
                   className="grid gap-3 rounded-xl border bg-white p-3 md:grid-cols-4"
                 >
                   <div className="grid gap-2">
                     <Label>Kod produktu (SKU)</Label>
                     <Input
                       value={item.sku}
                       onChange={(event) =>
                         setDeliveryPutawayForm((prev) => ({
                           ...prev,
                           items: prev.items.map((row, idx) =>
                             idx === index ? { ...row, sku: event.target.value } : row
                           ),
                         }))
                       }
                       list="product-skus"
                       disabled={!canManageDeliveries}
                     />
                   </div>
                   <div className="grid gap-2">
                     <Label>Ilosc</Label>
                     <Input
                       type="number"
                       min="1"
                       value={item.qty}
                       onChange={(event) =>
                         setDeliveryPutawayForm((prev) => ({
                           ...prev,
                           items: prev.items.map((row, idx) =>
                             idx === index ? { ...row, qty: event.target.value } : row
                           ),
                         }))
                       }
                       disabled={!canManageDeliveries}
                     />
                   </div>
                  <div className="grid gap-2">
                    <Label>Kod lokacji</Label>
                    <select
                      className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                      value={item.location_code}
                      onChange={(event) =>
                        setDeliveryPutawayForm((prev) => ({
                          ...prev,
                          items: prev.items.map((row, idx) =>
                            idx === index ? { ...row, location_code: event.target.value } : row
                          ),
                        }))
                      }
                      disabled={!canManageDeliveries}
                    >
                      <option value="">
                        {deliveryWarehouseId
                          ? "Wybierz lokacje..."
                          : "Najpierw wybierz magazyn"}
                      </option>
                      {filteredLocations.map((location) => (
                        <option key={location.id} value={location.code}>
                          {location.code}
                        </option>
                      ))}
                    </select>
                    {deliveryWarehouseId && filteredLocations.length === 0 && (
                      <span className="text-xs text-muted-foreground">
                        Brak lokacji dla wybranego magazynu.
                      </span>
                    )}
                  </div>
                   <div className="flex items-end justify-end">
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleRemovePutawayItem(index)}
                       disabled={!canManageDeliveries || deliveryPutawayForm.items.length === 1}
                     >
                       Usun
                     </Button>
                   </div>
                 </div>
               ))}
             </div>
            <div className="flex flex-wrap items-center gap-3">
               <Button
                 onClick={handlePutawayDelivery}
                 disabled={!canManageDeliveries || loading || !canPutawayDelivery}
               >
                 Zmagazynuj dostawe
               </Button>
               {!canPutawayDelivery && (
                 <p className="text-sm text-muted-foreground">
                   Wypelnij SKU, ilosc i lokacje dla kazdej pozycji.
                 </p>
               )}
             </div>
         </SectionCard>
       </div>

       {deliveryModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
           <div className="w-full max-w-2xl rounded-2xl border bg-white shadow-xl">
             <div className="flex items-center justify-between border-b px-6 py-4">
               <div>
                 <h3 className="text-lg font-semibold">Przyjecie dostawy</h3>
                 <p className="text-sm text-muted-foreground">
                   Dostawa startuje jako W TRAKCIE. Lokacje uzupelnisz przy zmagazynowaniu.
                 </p>
               </div>
               <Button variant="ghost" onClick={() => setDeliveryModalOpen(false)}>
                 Zamknij
               </Button>
             </div>
             <div className="grid gap-4 p-6">
               <div className="grid gap-2 md:grid-cols-2">
                 <div className="grid gap-2">
                   <Label>ID dostawcy</Label>
                   <select
                     className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                     value={deliveryForm.supplier_id}
                     onChange={(event) =>
                       setDeliveryForm((prev) => ({
                         ...prev,
                         supplier_id: event.target.value,
                       }))
                     }
                     disabled={!canManageDeliveries}
                   >
                     <option value="">Wybierz dostawce...</option>
                     {lookupsSuppliers.map((supplier) => (
                       <option key={supplier.id} value={supplier.id}>
                         {supplier.name} (ID {supplier.id})
                       </option>
                     ))}
                   </select>
                 </div>
                 <div className="grid gap-2">
                   <Label>Numer dokumentu</Label>
                   <Input
                     value={deliveryForm.document_no}
                     onChange={(event) =>
                       setDeliveryForm((prev) => ({
                         ...prev,
                         document_no: event.target.value,
                       }))
                     }
                     disabled={!canManageDeliveries}
                   />
                 </div>
               </div>
               <div className="grid gap-3">
                 <div className="flex items-center justify-between">
                   <Label>Pozycje dostawy</Label>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={handleAddDeliveryItem}
                     disabled={!canManageDeliveries}
                   >
                     Dodaj pozycje
                   </Button>
                 </div>
                 <div className="grid gap-3">
                   {deliveryForm.items.map((item, index) => (
                     <div
                       key={`delivery-item-${index}`}
                       className="grid gap-3 rounded-xl border bg-white p-3 md:grid-cols-3"
                     >
                       <div className="grid gap-2">
                         <Label>Kod produktu (SKU)</Label>
                         <Input
                           value={item.sku}
                           onChange={(event) =>
                             setDeliveryForm((prev) => ({
                               ...prev,
                               items: prev.items.map((row, idx) =>
                                 idx === index ? { ...row, sku: event.target.value } : row
                               ),
                             }))
                           }
                           list="product-skus"
                           disabled={!canManageDeliveries}
                         />
                       </div>
                       <div className="grid gap-2">
                         <Label>Ilosc sztuk</Label>
                         <Input
                           type="number"
                           min="1"
                           value={item.qty}
                           onChange={(event) =>
                             setDeliveryForm((prev) => ({
                               ...prev,
                               items: prev.items.map((row, idx) =>
                                 idx === index ? { ...row, qty: event.target.value } : row
                               ),
                             }))
                           }
                           disabled={!canManageDeliveries}
                         />
                       </div>
                       <div className="flex items-end justify-end">
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleRemoveDeliveryItem(index)}
                           disabled={!canManageDeliveries || deliveryForm.items.length === 1}
                         >
                           Usun
                         </Button>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
               <div className="flex flex-wrap items-center gap-3">
                 <Button onClick={handleCreateDelivery} disabled={!canManageDeliveries || loading}>
                   Zapisz dostawe
                 </Button>
                 {deliveryMessage && (
                   <p className="text-sm text-emerald-600">{deliveryMessage}</p>
                 )}
                 {!canManageDeliveries && (
                   <p className="text-sm text-muted-foreground">
                     Brak uprawnien do przyjmowania dostaw.
                   </p>
                 )}
               </div>
             </div>
           </div>
         </div>
       )}
     </>
   );
 }
