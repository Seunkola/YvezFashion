'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, Package, ClipboardList } from 'lucide-react'

const menuItems = [
  { name: 'Admin Info', href: '/admin/info', icon: User },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
]

export default function DashboardSidebar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`${
          open ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:static top-0 left-0 w-64 h-full bg-black text-white shadow-lg transition-transform z-50`}
      >
        {/* Header with toggle */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h1 className="text-xl font-bold" style={{ color: '#FFD700' }}>
            Admin Dashboard
          </h1>
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
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                  active
                    ? 'bg-[#FFD700] text-black font-medium'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-[#FFD700]'
                }`}
                onClick={() => setOpen(false)} // close on mobile click
              >
                <Icon size={18} color={active ? '#000000' : '#FFD700'} />
                {name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Mobile toggle button (only shown when closed) */}
      {!open && (
        <button
          className="lg:hidden fixed top-11 left-4 z-50 p-2 rounded-md bg-black"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={24} color="#FFD700" />
        </button>
      )}

      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
