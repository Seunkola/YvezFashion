"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Slider } from "@/components/ui/slider";

type FiltersProps = {
  categories: { id: string; name: string }[];
  selectedCategory: string | null;
  onCategoryChange: (id: string | null) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
};

export default function Filters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
}: FiltersProps) {
  const [open, setOpen] = useState(false);

  const content = (
    <div className="space-y-6 p-4">
      {/* Category */}
      <div>
        <h3 className="font-semibold mb-2">Categories</h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => {onCategoryChange(null); setOpen(false)}}
              className={`block w-full text-left px-2 py-1 rounded ${
                selectedCategory === null
                  ? "bg-gold text-black font-medium"
                  : "hover:bg-gray-100"
              }`}
            >
              All
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                onClick={() => {onCategoryChange(cat.id); setOpen(false); }}
                className={`block w-full text-left px-2 py-1 rounded ${
                  selectedCategory === cat.id
                    ? "bg-gold text-black font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-semibold mb-2">Price Range</h3>
        <Slider
          value={priceRange}
          min={10000}
          max={200000}
          step={10000}
          onValueChange={(val) => onPriceChange([val[0], val[1]])}
        />
        
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer Toggle */}
      <div className="block lg:hidden mb-4">
        <Button
            onClick={() => setOpen(true)}
            className="bg-gold text-black w-full"
        >
            Filters
        </Button>
      </div>

      {/* Drawer */}
      <Drawer open={open} onOpenChange={setOpen}>
        <div className="bg-white rounded-t-2x1 shadow-lg p-4 max-h-[80vh] overflow-y-auto">
            {content}
            <Button
                onClick={() => setOpen(false)}
                className="mt-4 w-full bg-gray-200 text-black"
            >
                Close
            </Button>
        </div>
      </Drawer>
      
    </>
  );
}
