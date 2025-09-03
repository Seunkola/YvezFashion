// app/shop/page.tsx

import { Metadata } from "next";
import { getCategoryOptions } from "@/features/admin/products/api";
import { fetchProducts } from "@/features/admin/products/api";
import { getServerCategoryOptions, getServerProducts } from "@/features/product/productService";
import ShopClient from "./shopClient";

//SEO MetaData
export const metadata: Metadata = {
  title: "Shop All Products | Yvez Collections | Yvez",
  description: "Browse our wide range of Female Ready to wear fashion products by category and price.",
  openGraph: {
    title: "Shop All Products",
    description: "Browse our wide range of Female Ready to wear fashion products by category and price.",
    url: "",
    siteName:"Yvez Collection"
  }
};

// Server Component 
export default async function ShopPage() {
  const categories = await getServerCategoryOptions();

  //Prefetch the first page of products for JSON-LD
  const initialProducts = await getServerProducts(8);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProductCollection",
    name: "Shop All Products",
    url: "https://yourdomain.com/shop",
    product: initialProducts.map((product) => ({
      "@type": "Product",
      name: product.name,
      description: product.description,
      image: product.image_url,
      sku: product.id,
      category: categories.find((category) => category.id === product.category_id)?.name || "Uncategorized",
      offers: {
        "@type": "Offer",
        priceCurrency: "Naira",
        price: product.price,
        availability:
          product.stock_quantity > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `https://yourdomain.com/product/${product.id}`,
      },
    })),
  }

  return (
    <main className="py-8 px-4 max-w-71 mx-auto">
      <h1 className="text-3x1 font-bold mb-6 text-gold">Shop All Products</h1>

      {/* JSON-LD injection for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}}
       />

      <ShopClient categories={categories} />
    </main>
  )
  
}