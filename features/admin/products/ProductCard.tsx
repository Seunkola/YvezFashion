'use client';

import { Product } from './types';
import { Button } from '@/components/ui/Button';

type Props = {
  product: Product;
  onEdit: () => void;
  onDelete: () => Promise<void>;
};

export default function ProductCard({ product, onEdit, onDelete }: Props) {
  return (
    <div className="rounded-2xl shadow p-4 bg-white flex flex-col md:flex-row gap-4">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full md:w-40 h-40 object-cover rounded-lg"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
        <p className="text-sm mt-1">
          Price: <span className="font-bold">₦{product.price}</span>
        </p>
        <p className="text-sm">Stock: {product.stock_quantity}</p>
        <Button
          onClick={onEdit}
          className="mt-2 bg-[var(--color-gold)] text-black hover:opacity-90"
        >
          Update
        </Button>
        <Button
          onClick={onDelete}
          className="mt-2 bg-[var(--color-black] text-black hover:opacity-90"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
