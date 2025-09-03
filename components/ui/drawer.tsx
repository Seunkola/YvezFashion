"use client";

import * as React from "react";
import { X } from "lucide-react";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Drawer({ open, onOpenChange, children }: DrawerProps) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => onOpenChange(false)}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-lg transform transition-transform duration-300 ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="flex justify-end p-2">
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </>
  );
}

export function DrawerTrigger({
  asChild,
  children,
  onClick,
}: {
  asChild?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <div onClick={onClick} className="inline-block">
      {children}
    </div>
  );
}

export function DrawerContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>;
}
