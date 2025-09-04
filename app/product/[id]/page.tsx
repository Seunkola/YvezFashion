import { getServerProductByID, getServerProductByIDWithCategory, getServerRelatedProducts } from "@/features/product/productService"
import { Metadata } from "next"
import { notFound } from "next/navigation";
import ProductClient from "../product-client";

// Product Detail 
interface ProductPageProps {
    params: {
        id: string
    }
}

//dynamic metaData per product
export async function generateMetadata({params}: ProductPageProps): Promise<Metadata> {
    const product = await getServerProductByID(params.id);

    if(!product) return { title: "Product | Yvez Collections"};

    return {
        title: `${product.name} | Yvez Collections`,
        description: product.description ?? "",
        openGraph: {
            title: product.name,
            description: product.description,
            images: product.image_url ? [{url: product.image_url}]: undefined
        }
    }
}

async function ProductPage({ params }: ProductPageProps)  {
    const { id } = params;

    //Fetch product + category name
    const {data: product, error} = await getServerProductByIDWithCategory(id);
    
    if(error || !product){notFound();}

    //Fetch related products( using same category excluding the current product)
    const { data: relatedProducts = [] } = await getServerRelatedProducts(product);

    //Build Product Structure Data (JSON-LD)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description,
        image: product.image_url ? [product.image_url] : [],
        sku: product.id,
        //category: product.categories?.[0]?.name ?? "Uncategorized",
        offers: {
            "@type": "offer",
            priceCurrency: "NGN",
            price: product.price ?? 0,
            availability:
                (product.stock_quantity ?? 0) > 0
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
            url: `https://yvezcollections.com/product/${product.id}`
        }, 
    };

    return (
    <main className="py-8 px-4 max-w-7x1 mx-auto">
        {/* JSON-LD for SEO */}
        <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData)}}
        />
        <ProductClient product={product} relatedProduct={relatedProducts}/>
    </main>
    )
}

export default ProductPage;