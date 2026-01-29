 "use client";

 import * as React from "react";

 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import SectionCard from "@/app/components/SectionCard";
 import TableContainer from "@/app/components/TableContainer";

 type OrdersSectionProps = {
   role: string | null;
   data: any[];
   loading: boolean;
   orderFilters: {
     status: string;
     customer_id: string;
     priority: string;
   };
   setOrderFilters: React.Dispatch<
     React.SetStateAction<{
       status: string;
       customer_id: string;
       priority: string;
     }>
   >;
   refresh: () => void;
   setOrderModalOpen: (open: boolean) => void;
   canCreateOrders: boolean;
   orderSelected: any | null;
   handleSelectOrder: (order: any) => void;
   orderModalOpen: boolean;
   orderForm: {
     order_no: string;
     customer_id: string;
     priority: boolean;
     items: { sku: string; qty: string }[];
   };
   setOrderForm: React.Dispatch<
     React.SetStateAction<{
       order_no: string;
       customer_id: string;
       priority: boolean;
       items: { sku: string; qty: string }[];
     }>
   >;
   orderNoSuggestion: string;
   orderMessage: string | null;
   handleCreateOrder: () => void;
   handleAddOrderItem: () => void;
   handleRemoveOrderItem: (index: number) => void;
   lookups: {
     customers: any[];
   };
   orderAction: {
     order_id: string;
     priority: boolean;
   };
   setOrderAction: React.Dispatch<
     React.SetStateAction<{ order_id: string; priority: boolean }>
   >;
   canIssueOrders: boolean;
   canCancelOrders: boolean;
   canManageOrderPriority: boolean;
   handleIssueOrder: () => void;
  handleCancelOrder: () => void;
  handleUpdatePriority: () => void;
  orderDetailId: string;
   setOrderDetailId: (value: string) => void;
   handleFetchOrderSummary: () => void;
   orderSummary: any | null;
   orderStatusUpdate: string;
   setOrderStatusUpdate: (value: string) => void;
   handleUpdateOrderStatus: () => void;
   handleOrderMissingToDelivery: () => void;
  orderEditForm: { id: string; order_no: string };
  setOrderEditForm: React.Dispatch<
    React.SetStateAction<{ id: string; order_no: string }>
   >;
   orderEditMessage: string | null;
   handleUpdateOrderNo: () => void;
 };

export default function OrdersSection({
   role,
   data,
   loading,
   orderFilters,
   setOrderFilters,
   refresh,
   setOrderModalOpen,
   canCreateOrders,
   orderSelected,
   handleSelectOrder,
   orderModalOpen,
   orderForm,
   setOrderForm,
   orderNoSuggestion,
   orderMessage,
   handleCreateOrder,
   handleAddOrderItem,
   handleRemoveOrderItem,
   lookups,
   orderAction,
   setOrderAction,
   canIssueOrders,
   canCancelOrders,
   canManageOrderPriority,
   handleIssueOrder,
   handleCancelOrder,
   handleUpdatePriority,
   orderDetailId,
   setOrderDetailId,
   handleFetchOrderSummary,
   orderSummary,
   orderStatusUpdate,
   setOrderStatusUpdate,
   handleUpdateOrderStatus,
   handleOrderMissingToDelivery,
  orderEditForm,
  setOrderEditForm,
  orderEditMessage,
   handleUpdateOrderNo,
}: OrdersSectionProps) {
   return (
     <>
       <div className="grid gap-4">
         <div className="flex flex-wrap items-end justify-between gap-3">
           <div className="grid gap-2">
             <Label>Status</Label>
             <Input
               value={orderFilters.status}
               onChange={(event) =>
                 setOrderFilters((prev) => ({
                   ...prev,
                   status: event.target.value,
                 }))
               }
               placeholder="NOWE"
             />
           </div>
           <div className="grid gap-2">
             <Label>ID klienta</Label>
             <Input
               value={orderFilters.customer_id}
               onChange={(event) =>
                 setOrderFilters((prev) => ({
                   ...prev,
                   customer_id: event.target.value,
                 }))
               }
             />
           </div>
           <div className="grid gap-2">
             <Label>Priorytet</Label>
             <Input
               value={orderFilters.priority}
               onChange={(event) =>
                 setOrderFilters((prev) => ({
                   ...prev,
                   priority: event.target.value,
                 }))
               }
               placeholder="true/false"
             />
           </div>
           <div className="flex items-center gap-3">
             <Button onClick={refresh} disabled={loading}>
               Filtruj
             </Button>
             <Button onClick={() => setOrderModalOpen(true)} disabled={!canCreateOrders}>
               Dodaj zamowienie
             </Button>
           </div>
         </div>
         <TableContainer>
           <table className="min-w-full text-left text-sm">
             <thead className="sticky top-0 bg-white">
               <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                 <th className="px-4 py-3">Numer</th>
                 <th className="px-4 py-3">Klient</th>
                 <th className="px-4 py-3">Status</th>
                 <th className="px-4 py-3">Priorytet</th>
               </tr>
             </thead>
             <tbody>
               {data.length === 0 && (
                 <tr>
                   <td className="px-4 py-6 text-muted-foreground">
                     Brak zamowien. Dodaj pierwsze zamowienie.
                   </td>
                 </tr>
               )}
               {data.map((order: any) => (
                 <tr
                   key={order.id}
                   className={`cursor-pointer border-b hover:bg-secondary/40 ${
                     orderSelected?.id === order.id ? "bg-secondary/40" : ""
                   }`}
                   onClick={() => handleSelectOrder(order)}
                 >
                   <td className="px-4 py-3">{order.order_no}</td>
                   <td className="px-4 py-3">ID {order.customer_id}</td>
                   <td className="px-4 py-3">{order.status}</td>
                   <td className="px-4 py-3">{order.priority ? "Tak" : "Nie"}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </TableContainer>
         {orderSelected && (
           <SectionCard
             title="Wybrane zamowienie"
             description={`ID ${orderSelected.id} · numer ${orderSelected.order_no}`}
           >
             <div className="text-sm text-muted-foreground">
               Status: {orderSelected.status}
             </div>
           </SectionCard>
         )}
         {role === "ADMIN" && orderEditForm.id && (
           <SectionCard
             title="Edycja zamowienia (ADMIN)"
             description="Zmien numer zamowienia dla wybranego zlecenia."
             contentClassName="grid gap-4 md:grid-cols-2"
           >
               <div className="grid gap-2">
                 <Label>ID zamowienia</Label>
                 <Input value={orderEditForm.id} disabled />
               </div>
               <div className="grid gap-2">
                 <Label>Numer zamowienia</Label>
                 <Input
                   value={orderEditForm.order_no}
                   onChange={(event) =>
                     setOrderEditForm((prev) => ({
                       ...prev,
                       order_no: event.target.value,
                     }))
                   }
                 />
               </div>
               <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                 <Button onClick={handleUpdateOrderNo} disabled={loading}>
                   Zapisz numer
                 </Button>
                 {orderEditMessage && (
                   <p className="text-sm text-emerald-600">{orderEditMessage}</p>
                 )}
               </div>
           </SectionCard>
         )}
         <SectionCard
           title="Operacje na zamowieniu"
           description="Podaj ID zamowienia, aby je wydac, anulowac lub ustawic priorytet."
           contentClassName="grid gap-4 md:grid-cols-3"
         >
             <div className="grid gap-2 md:col-span-2">
               <Label>ID zamowienia</Label>
               <Input
                 value={orderAction.order_id}
                 onChange={(event) =>
                   setOrderAction((prev) => ({
                     ...prev,
                     order_id: event.target.value,
                   }))
                 }
               />
             </div>
             <div className="flex items-center gap-2">
               <input
                 id="order-priority"
                 type="checkbox"
                 className="h-4 w-4"
                 checked={orderAction.priority}
                 onChange={(event) =>
                   setOrderAction((prev) => ({
                     ...prev,
                     priority: event.target.checked,
                   }))
                 }
                 disabled={!canManageOrderPriority}
               />
               <Label htmlFor="order-priority">Priorytet</Label>
             </div>
             <div className="flex flex-wrap items-center gap-3 md:col-span-3">
               <Button
                 variant="outline"
                 onClick={handleIssueOrder}
                 disabled={!canIssueOrders || loading || !orderAction.order_id}
               >
                 Wydaj zamowienie
               </Button>
               <Button
                 variant="outline"
                 onClick={handleCancelOrder}
                 disabled={!canCancelOrders || loading || !orderAction.order_id}
               >
                 Anuluj zamowienie
               </Button>
               <Button
                 onClick={handleUpdatePriority}
                 disabled={!canManageOrderPriority || loading || !orderAction.order_id}
               >
                 Zmien priorytet
               </Button>
               {orderMessage && (
                 <p className="text-sm text-emerald-600">{orderMessage}</p>
               )}
               {!canIssueOrders && (
                 <p className="text-sm text-muted-foreground">
                   Brak uprawnien do wydawania zamowien.
                 </p>
               )}
             </div>
         </SectionCard>
         <SectionCard
           title="Podsumowanie zamowienia"
           description="Szybki podglad realizacji i brakow na stanie."
           contentClassName="grid gap-4"
         >
             <div className="flex flex-wrap items-end gap-3">
               <div className="grid gap-2">
                 <Label>ID zamowienia</Label>
                 <Input
                   value={orderDetailId}
                   onChange={(event) => setOrderDetailId(event.target.value)}
                   placeholder="np. 12"
                 />
               </div>
               <Button onClick={handleFetchOrderSummary} disabled={loading || !orderDetailId}>
                 Pobierz podsumowanie
               </Button>
             </div>
             {orderSummary && (
               <div className="grid gap-4">
                 <div className="flex flex-wrap items-center gap-4 text-sm">
                   <span>Numer: {orderSummary.order_no}</span>
                   <span>Status: {orderSummary.status}</span>
                   <span>Priorytet: {orderSummary.priority ? "Tak" : "Nie"}</span>
                 </div>
                 <div className="flex flex-wrap items-end gap-3">
                   <div className="grid gap-2">
                     <Label>Zmien status</Label>
                     <select
                       className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                       value={orderStatusUpdate}
                       onChange={(event) => setOrderStatusUpdate(event.target.value)}
                     >
                       <option value="NOWE">NOWE</option>
                       <option value="OCZEKUJACE">OCZEKUJACE</option>
                       <option value="W_REALIZACJI">W_REALIZACJI</option>
                       <option value="ZREALIZOWANE">ZREALIZOWANE</option>
                       <option value="ZREALIZOWANE_CZESCIOWO">ZREALIZOWANE_CZESCIOWO</option>
                       <option value="ANULOWANE">ANULOWANE</option>
                     </select>
                   </div>
                   <Button onClick={handleUpdateOrderStatus} disabled={loading || !canManageOrderPriority}>
                     Zapisz status
                   </Button>
                 </div>
                 <div className="grid gap-2">
                   {orderSummary.items.map((item: any) => (
                     <div
                       key={item.product_id}
                       className="flex flex-wrap items-center justify-between gap-2 rounded-md border bg-white px-3 py-2 text-sm"
                     >
                       <div>
                         {item.sku} - {item.name}
                       </div>
                       <div>
                         zamowione: {item.qty_ordered} | wydane: {item.qty_issued} | dostepne:{" "}
                         {item.available} | braki: {item.missing}
                       </div>
                     </div>
                   ))}
                 </div>
                 <div className="flex flex-wrap items-center gap-3">
                   <Button
                     variant="outline"
                     onClick={handleIssueOrder}
                     disabled={!canIssueOrders || loading || !orderSummary.order_id}
                   >
                     Wydaj zamowienie
                   </Button>
                   <Button onClick={handleOrderMissingToDelivery} disabled={loading}>
                     Zamow brakujace
                   </Button>
                 </div>
               </div>
             )}
         </SectionCard>
       </div>

       {orderModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
           <div className="w-full max-w-2xl rounded-2xl border bg-white shadow-xl">
             <div className="flex items-center justify-between border-b px-6 py-4">
               <div>
                 <h3 className="text-lg font-semibold">Nowe zamowienie</h3>
                 <p className="text-sm text-muted-foreground">Podaj klienta i pozycje.</p>
               </div>
               <Button variant="ghost" onClick={() => setOrderModalOpen(false)}>
                 Zamknij
               </Button>
             </div>
             <div className="grid gap-4 p-6">
               <div className="grid gap-2 md:grid-cols-2">
                 <div className="grid gap-2">
                   <Label>Numer zamowienia</Label>
                   <Input
                     value={orderForm.order_no}
                     onChange={(event) =>
                       setOrderForm((prev) => ({
                         ...prev,
                         order_no: event.target.value,
                       }))
                     }
                     disabled={!canCreateOrders}
                   />
                   {orderNoSuggestion && !orderForm.order_no && (
                     <p className="text-xs text-muted-foreground">
                       Podpowiedz: {orderNoSuggestion}
                     </p>
                   )}
                 </div>
                 <div className="grid gap-2">
                   <Label>ID klienta</Label>
                   <select
                     className="h-10 rounded-md border border-input bg-background px-3 text-sm"
                     value={orderForm.customer_id}
                     onChange={(event) =>
                       setOrderForm((prev) => ({
                         ...prev,
                         customer_id: event.target.value,
                       }))
                     }
                     disabled={!canCreateOrders}
                   >
                     <option value="">Wybierz klienta...</option>
                     {lookups.customers.map((customer) => (
                       <option key={customer.id} value={customer.id}>
                         {customer.name} (ID {customer.id})
                       </option>
                     ))}
                   </select>
                 </div>
                 <div className="flex items-center gap-2 md:col-span-2">
                   <input
                     id="priority"
                     type="checkbox"
                     className="h-4 w-4"
                     checked={orderForm.priority}
                     onChange={(event) =>
                       setOrderForm((prev) => ({
                         ...prev,
                         priority: event.target.checked,
                       }))
                     }
                     disabled={!canCreateOrders}
                   />
                   <Label htmlFor="priority">Priorytetowe</Label>
                 </div>
               </div>
               <div className="grid gap-3">
                 <div className="flex items-center justify-between">
                   <Label>Pozycje zamowienia</Label>
                   <Button
                     variant="outline"
                     size="sm"
                     onClick={handleAddOrderItem}
                     disabled={!canCreateOrders}
                   >
                     Dodaj pozycje
                   </Button>
                 </div>
                 {orderForm.items.map((item, index) => (
                   <div
                     key={`order-item-${index}`}
                     className="grid gap-3 rounded-xl border bg-white p-3 md:grid-cols-3"
                   >
                     <div className="grid gap-2">
                       <Label>Kod produktu (SKU)</Label>
                       <Input
                         value={item.sku}
                         onChange={(event) =>
                           setOrderForm((prev) => ({
                             ...prev,
                             items: prev.items.map((row, idx) =>
                               idx === index ? { ...row, sku: event.target.value } : row
                             ),
                           }))
                         }
                         list="product-skus"
                         disabled={!canCreateOrders}
                       />
                     </div>
                     <div className="grid gap-2">
                       <Label>Ilosc sztuk</Label>
                       <Input
                         type="number"
                         min="1"
                         value={item.qty}
                         onChange={(event) =>
                           setOrderForm((prev) => ({
                             ...prev,
                             items: prev.items.map((row, idx) =>
                               idx === index ? { ...row, qty: event.target.value } : row
                             ),
                           }))
                         }
                         disabled={!canCreateOrders}
                       />
                     </div>
                     <div className="flex items-end justify-end">
                       <Button
                         variant="ghost"
                         size="sm"
                         onClick={() => handleRemoveOrderItem(index)}
                         disabled={!canCreateOrders || orderForm.items.length === 1}
                       >
                         Usun
                       </Button>
                     </div>
                   </div>
                 ))}
               </div>
               <div className="flex flex-wrap items-center gap-3">
                 <Button onClick={handleCreateOrder} disabled={!canCreateOrders || loading}>
                   Utworz zamowienie
                 </Button>
                 {orderMessage && <p className="text-sm text-emerald-600">{orderMessage}</p>}
                 {!canCreateOrders && (
                   <p className="text-sm text-muted-foreground">
                     Brak uprawnien do tworzenia zamowien.
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
