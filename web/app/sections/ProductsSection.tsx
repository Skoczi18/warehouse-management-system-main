 "use client";

 import * as React from "react";

 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import SectionCard from "@/app/components/SectionCard";
 import TableContainer from "@/app/components/TableContainer";

 type ProductsSectionProps = {
   role: string | null;
   data: any[];
   loading: boolean;
   productSearch: string;
   setProductSearch: (value: string) => void;
   refresh: () => void;
   canManageProducts: boolean;
   productModalOpen: boolean;
   setProductModalOpen: (open: boolean) => void;
   productForm: {
     sku: string;
     name: string;
     type: string;
     brand: string;
     model: string;
   };
   setProductForm: React.Dispatch<
     React.SetStateAction<{
       sku: string;
       name: string;
       type: string;
       brand: string;
       model: string;
     }>
   >;
   productSkuSuggestion: string;
   productMessage: string | null;
   productEditForm: {
     id: string;
     sku: string;
     name: string;
     type: string;
     brand: string;
     model: string;
   };
   setProductEditForm: React.Dispatch<
     React.SetStateAction<{
       id: string;
       sku: string;
       name: string;
       type: string;
       brand: string;
       model: string;
     }>
   >;
   productEditMessage: string | null;
   handleCreateProduct: () => void;
   handleUpdateProduct: () => void;
   handleDeleteProduct: () => void;
   handleSelectProduct: (product: any) => void;
 };

 export default function ProductsSection({
   role,
   data,
   loading,
   productSearch,
   setProductSearch,
   refresh,
   canManageProducts,
   productModalOpen,
   setProductModalOpen,
   productForm,
   setProductForm,
   productSkuSuggestion,
   productMessage,
   productEditForm,
   setProductEditForm,
   productEditMessage,
   handleCreateProduct,
   handleUpdateProduct,
   handleDeleteProduct,
   handleSelectProduct,
 }: ProductsSectionProps) {
   return (
     <>
       <div className="grid gap-4">
         <div className="flex flex-wrap items-end justify-between gap-3">
           <div className="grid gap-2">
             <Label>Szukaj (sku / nazwa)</Label>
             <Input
               value={productSearch}
               onChange={(event) => setProductSearch(event.target.value)}
               placeholder="np. SKU-001"
             />
           </div>
           <div className="flex items-center gap-3">
             <Button onClick={refresh} disabled={loading}>
               Filtruj
             </Button>
             <Button onClick={() => setProductModalOpen(true)} disabled={!canManageProducts}>
               Dodaj nowy produkt
             </Button>
           </div>
         </div>
         <TableContainer>
           <table className="min-w-full text-left text-sm">
             <thead className="sticky top-0 bg-white">
               <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                 <th className="px-4 py-3">SKU</th>
                 <th className="px-4 py-3">Nazwa</th>
                 <th className="px-4 py-3">Typ</th>
                 <th className="px-4 py-3">Marka</th>
                 <th className="px-4 py-3">Model</th>
               </tr>
             </thead>
             <tbody>
              {data.length === 0 && (
                <tr key="products-empty">
                  <td className="px-4 py-6 text-muted-foreground">
                    Brak produktow. Dodaj pierwszy produkt.
                  </td>
                </tr>
              )}
              {data.map((product: any, index: number) => (
                <tr
                  key={`${product.id ?? product.sku ?? "product"}-${index}`}
                  className="cursor-pointer border-b hover:bg-secondary/40"
                  onClick={() => handleSelectProduct(product)}
                >
                   <td className="px-4 py-3">{product.sku}</td>
                   <td className="px-4 py-3">{product.name}</td>
                   <td className="px-4 py-3">{product.type ?? "-"}</td>
                   <td className="px-4 py-3">{product.brand ?? "-"}</td>
                   <td className="px-4 py-3">{product.model ?? "-"}</td>
                 </tr>
               ))}
             </tbody>
           </table>
         </TableContainer>
         {productEditForm.id && (
           <SectionCard
             title="Edytuj produkt"
             description="Kliknij produkt w tabeli, aby go edytowac."
             contentClassName="grid gap-4 md:grid-cols-2"
           >
               <div className="grid gap-2">
                 <Label>SKU</Label>
                 <Input
                   value={productEditForm.sku}
                   onChange={(event) =>
                     setProductEditForm((prev) => ({
                       ...prev,
                       sku: event.target.value,
                     }))
                   }
                   disabled={role !== "ADMIN"}
                 />
                 {role !== "ADMIN" && (
                   <p className="text-xs text-muted-foreground">
                     Zmiana SKU jest dostepna tylko dla ADMINA.
                   </p>
                 )}
               </div>
               <div className="grid gap-2">
                 <Label>Nazwa</Label>
                 <Input
                   value={productEditForm.name}
                   onChange={(event) =>
                     setProductEditForm((prev) => ({
                       ...prev,
                       name: event.target.value,
                     }))
                   }
                 />
               </div>
               <div className="grid gap-2">
                 <Label>Typ</Label>
                 <Input
                   value={productEditForm.type}
                   onChange={(event) =>
                     setProductEditForm((prev) => ({
                       ...prev,
                       type: event.target.value,
                     }))
                   }
                 />
               </div>
               <div className="grid gap-2">
                 <Label>Marka</Label>
                 <Input
                   value={productEditForm.brand}
                   onChange={(event) =>
                     setProductEditForm((prev) => ({
                       ...prev,
                       brand: event.target.value,
                     }))
                   }
                 />
               </div>
               <div className="grid gap-2 md:col-span-2">
                 <Label>Model</Label>
                 <Input
                   value={productEditForm.model}
                   onChange={(event) =>
                     setProductEditForm((prev) => ({
                       ...prev,
                       model: event.target.value,
                     }))
                   }
                 />
               </div>
               <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                 <Button onClick={handleUpdateProduct} disabled={!canManageProducts || loading}>
                   Zapisz zmiany
                 </Button>
                 <Button
                   variant="destructive"
                   onClick={handleDeleteProduct}
                   disabled={!canManageProducts || loading}
                 >
                   Usun produkt
                 </Button>
                 {productEditMessage && (
                   <p className="text-sm text-emerald-600">{productEditMessage}</p>
                 )}
               </div>
           </SectionCard>
         )}
       </div>

       {productModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
           <div className="w-full max-w-xl rounded-2xl border bg-white shadow-xl">
             <div className="flex items-center justify-between border-b px-6 py-4">
               <div>
                 <h3 className="text-lg font-semibold">Dodaj produkt</h3>
                 <p className="text-sm text-muted-foreground">
                   Uzupelnij dane nowego produktu.
                 </p>
               </div>
               <Button variant="ghost" onClick={() => setProductModalOpen(false)}>
                 Zamknij
               </Button>
             </div>
             <div className="grid gap-4 p-6 md:grid-cols-2">
               <div className="grid gap-2">
                 <Label>SKU</Label>
                 <Input
                   value={productForm.sku}
                   onChange={(event) =>
                     setProductForm((prev) => ({ ...prev, sku: event.target.value }))
                   }
                   disabled={!canManageProducts}
                 />
                 {productSkuSuggestion && !productForm.sku && (
                   <p className="text-xs text-muted-foreground">
                     Podpowiedz: {productSkuSuggestion}
                   </p>
                 )}
               </div>
               <div className="grid gap-2">
                 <Label>Nazwa</Label>
                 <Input
                   value={productForm.name}
                   onChange={(event) =>
                     setProductForm((prev) => ({ ...prev, name: event.target.value }))
                   }
                   disabled={!canManageProducts}
                 />
               </div>
               <div className="grid gap-2">
                 <Label>Typ</Label>
                 <Input
                   value={productForm.type}
                   onChange={(event) =>
                     setProductForm((prev) => ({ ...prev, type: event.target.value }))
                   }
                   disabled={!canManageProducts}
                 />
               </div>
               <div className="grid gap-2">
                 <Label>Marka</Label>
                 <Input
                   value={productForm.brand}
                   onChange={(event) =>
                     setProductForm((prev) => ({ ...prev, brand: event.target.value }))
                   }
                   disabled={!canManageProducts}
                 />
               </div>
               <div className="grid gap-2 md:col-span-2">
                 <Label>Model</Label>
                 <Input
                   value={productForm.model}
                   onChange={(event) =>
                     setProductForm((prev) => ({ ...prev, model: event.target.value }))
                   }
                   disabled={!canManageProducts}
                 />
               </div>
               <div className="flex flex-wrap items-center gap-3 md:col-span-2">
                 <Button onClick={handleCreateProduct} disabled={!canManageProducts || loading}>
                   Dodaj produkt
                 </Button>
                 {productMessage && (
                   <p className="text-sm text-emerald-600">{productMessage}</p>
                 )}
                 {!canManageProducts && (
                   <p className="text-sm text-muted-foreground">
                     Brak uprawnien do dodawania produktow.
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
