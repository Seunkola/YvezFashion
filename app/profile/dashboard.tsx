"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Package, ClipboardList } from "lucide-react";

const menuItems = [
  { name: "Profile Info", href: "/profile/info", icon: User },
  { name: "My Orders", href: "/profile/orders", icon: ClipboardList },
  { name: "My Favorites", href: "/profile/favorites", icon: Package },
];

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:static top-0 left-0 w-64 h-full bg-black text-white shadow-lg transition-transform z-50`}
      >
        {/* Header with toggle */}
        <div className="flex items-center justify-between p-4 border-b border-white/20">
          <h2 className="text-lg font-semibold">Dashboard</h2>
          <button
            className="lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} color="#FFD700" />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menuItems.map(({ name, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  active
                    ? "bg-[#FFD700] text-black font-medium"
                    : "text-gray-300 hover:bg-gray-800 hover:text-[#FFD700]"
                }`}
                onClick={() => setOpen(false)} // close on mobile click
              >
                <Icon size={18} color={active ? "#000000" : "#FFD700"} />
                {name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile menu button */}
      {!open && (
        <button
          className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-black text-white rounded-md shadow-lg"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} color="#FFD700" />
        </button>
      )}

      {/* Overlay when sidebar is open on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
