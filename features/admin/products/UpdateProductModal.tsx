'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { useUpdateProduct } from './hooks';
import type { Product } from './types';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { getCategoryOptions } from './api';

interface UpdateProductModalProps {
  product: Product;
  open: boolean;
  onClose: () => void;
}

export default function UpdateProductModal({
  product,
  open,
  onClose,
}: UpdateProductModalProps) {
  const { mutateAsync: updateProduct } = useUpdateProduct();
  const [form, setForm] = useState({
    name: product?.name,
    description: product?.description,
    category_id: product?.category_id,
    price: product?.price,
    stock_quantity: product?.stock_quantity,
    image_url: String(product?.image_url),
    image_file: null as File | null,
  });

  const [loading, setLoading] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoryOptions,
    staleTime: 1000 * 60 * 10,
  });

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, files } = event.target as HTMLInputElement;

    if (files && files[0]) {
      setForm((prev) => ({ ...prev, image_file: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      await updateProduct({
        id: product.id,
        patch: {
          name: form.name,
          description: form.description,
          category_id: form.category_id,
          price: Number(form.price),
          stock_quantity: Number(form.stock_quantity),
        },
        image_file: form.image_file,
      });
      onClose();
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Update Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              id="stock_quantity"
              name="stock_quantity"
              type="number"
              value={form.stock_quantity}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="category_id">Category</Label>
            <select
              id="category_id"
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="w-full border rounded px-2 py-1"
            >
              <option value="">Select category</option>
              {categories?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="image_file">Product Image</Label>
            <Input
              id="image_file"
              type="file"
              name="image_file"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
