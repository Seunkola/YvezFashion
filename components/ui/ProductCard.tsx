// components/ui/ProductCard.tsx

export const ProductCard = () => {
  return (
    <div className="border rounded-md shadow-sm hover:shadow-md transition overflow-hidden bg-white">
      <div className="aspect-square bg-gray-100">
        {/* Placeholder Image */}
        <img
          src="/images/placeholder.png"
          alt="Product"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-black">Product Name</h3>
        <p className="text-sm text-gray-600 mt-1">Short product description</p>
        <p className="text-gold font-bold mt-2">$99.00</p>

        <button className="btn btn-primary mt-4 w-full">Add to Cart</button>
      </div>
    </div>
  );
};
