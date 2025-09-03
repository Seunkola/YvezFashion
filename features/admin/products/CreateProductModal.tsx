'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { useCreateProducts } from './hooks';
import { Product } from './types';
import { getCategoryOptions } from './api';
import { useQuery } from '@tanstack/react-query';

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ open, onClose }: Props) {
  const { mutate, isPending } = useCreateProducts();
  const [form, setForm] = useState<Partial<Product>>({});
  const [imageFile, setImageFile] = useState<File | null>(null);

    const {data: categories} = useQuery({
        queryKey: ['categories'],
        queryFn: getCategoryOptions,
        staleTime: 1000 * 60 * 10,
    });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && !file.type.startsWith('image/')) {
      alert('Please select a valid image file.');
      return;
    }
    setImageFile(file || null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock_quantity || !form.category_id) {
      alert('Please fill out all fields.');
      return;
    }

    mutate(
      { product: form as Product, image_file: imageFile },
      {
        onSuccess: () => {
          setForm({});
          setImageFile(null);
          onClose();
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle>Create Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input name="name" value={form.name || ''} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input name="description" value={form.description || ''} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              type="number"
              step="0.01"
              name="price"
              value={form.price || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              type="number"
              name="stock_quantity"
              value={form.stock_quantity || ''}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="category_id">Category</Label>
            <select
              name="category_id"
              value={form.category_id || ''}
              onChange={handleChange}
              className="w-full border rounded-md p-2"
              required
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
            <Label htmlFor="image">Product Image</Label>
            <Input type="file" accept="image/*" onChange={handleFileChange} />
          </div>

          <Button
            type="submit"
            className="w-full bg-[var(--color-gold)] text-black hover:opacity-90"
            disabled={isPending}
          >
            {isPending ? 'Creating...' : 'Create Product'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
