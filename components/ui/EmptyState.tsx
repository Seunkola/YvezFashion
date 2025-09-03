'use client';

import { Button } from './Button';
import Image from 'next/image';

interface EmptyStateProps {
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  imageSrc?: string;
}

export default function EmptyState({
  title = "No Products Yet",
  description = "You haven't added any products to your store. Start creating amazing products now!",
  buttonText = "Create Product",
  onButtonClick,
  imageSrc = "http://localhost:3000/images/empty-products.svg" // Put your SVG in public folder
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh] px-4">
      {imageSrc && (
        <div className="w-48 h-48 mb-6 relative">
          <Image src={imageSrc} alt="Empty state illustration" fill className="object-contain" />
        </div>
      )}
      <h2 className="text-2xl font-semibold text-black mb-2">{title}</h2>
      <p className="text-black/70 mb-6">{description}</p>
      <Button onClick={onButtonClick}>{buttonText}</Button>
    </div>
  );
}
