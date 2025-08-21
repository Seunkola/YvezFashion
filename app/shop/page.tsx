// app/shop/page.tsx

import { ProductCard } from '@/components/ui/ProductCard';

export default function ShopPage() {
  return (
    <main className="py-8 px-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gold">Shop All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Render 8 placeholder cards for now */}
        {Array.from({ length: 8 }).map((_, idx) => (
          <ProductCard key={idx} />
        ))}
      </div>
    </main>
  );
}
