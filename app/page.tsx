import Link from 'next/link'
import ProductCard from '@/components/ui/ProductCard'
import { getServerProducts } from '@/features/product/productService';
import { Product } from '@/features/admin/products/types';

export default async function HomePage() {
  //Prefetch the first page of products for Featured Product based on latest 
  const initialProducts = await getServerProducts(4);

  return (
    <main className="max-w-7xl mx-auto">
      {/* ✅ Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden mb-12">
        <img
          src="/images/hero.png"
          alt="Fashion Promo"
          className="absolute inset-0 w-full h-full object-cover brightness-75 transition duration-1000 ease-in-out"
        />
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up">
            Elevate Your Style
          </h1>
          <p className="text-lg md:text-xl mb-6 max-w-xl animate-fade-in-up delay-100">
            Discover timeless fashion, curated for you. Free shipping over $50.
          </p>
          <Link
            href="/shop"
            className="bg-gold text-black px-6 py-3 font-medium rounded hover:bg-yellow-500 transition animate-fade-in-up delay-200"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Featured Products</h2>
          <Link href="/shop" className="text-gold hover:underline text-sm">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {initialProducts.map((p) => (
            <ProductCard product={p} />
          ))}
        </div>
      </section>
    </main>
  )
}
