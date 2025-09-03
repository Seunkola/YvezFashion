'use client';

import { useState } from 'react';
import { useDeleteProduct, useProducts } from '@/features/admin/products/hooks';
import CreateProductModal from '@/features/admin/products/CreateProductModal';
import UpdateProductModal from '@/features/admin/products/UpdateProductModal';
import ProductCard from '@/features/admin/products/ProductCard';
import { Button } from '@/components/ui/Button';
import { Product } from '@/features/admin/products/types';
import EmptyState from '@/components/ui/EmptyState';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts();
  const [createOpen, setCreateOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false)
  const [updateProduct, setUpdateProduct] = useState<Product | null>(null);
  const { mutateAsync: deleteProduct } = useDeleteProduct();

  const deleteProductFromShop = async (id: string) => {
    try{
       await deleteProduct({
        id: id
       });
    }
    catch (error) {
      toast.error('Failed to update product');
    }
  }

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-[var(--color-gold)] text-black hover:opacity-90"
        >
          Create Product
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          onButtonClick={() => setCreateOpen(true)}
          title='No products yet'
          description='Add  your first product to start selling'
        />
      ): (
        <div className="grid gap-4">
          {
            products.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onEdit={() => {setUpdateProduct(p); setUpdateOpen(true)}} 
                onDelete = {() => deleteProductFromShop(p.id)}
              />
            ))
          }
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-[var(--color-gold)] text-black hover:opacity-90"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}

      {/* Modals */}
      <CreateProductModal open={createOpen} onClose={() => setCreateOpen(false)} />
       { updateProduct && (
        <UpdateProductModal
          open = {updateOpen}
          onClose={() => setUpdateProduct(null)}
          product={updateProduct}
        />
      )}
      
    </div>
  );
}
