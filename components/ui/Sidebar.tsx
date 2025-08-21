'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, ShoppingCart, X } from 'lucide-react';
import clsx from 'clsx';

const menuItems = [
  { name: 'Admin Info', href: '/admin/admin-info', icon: User },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SideBar({isOpen, onClose}: SidebarProps){
    const pathName = usePathname();

    return (
        <aside
        className={clsx(
        'bg-primary text-white w-64 flex-shrink-0 flex-col fixed md:static top-0 left-0 h-full z-50 transition-transform transform',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'md:translate-x-0'
        )}
        >
            {/* Mobile close button */}
            <div className="flex items-center justify-between p-4 md:hidden">
                <span className="font-bold">Menu</span>
                <button onClick={onClose} aria-label="Close menu">
                <X size={24} />
                </button>
            </div>

            {/* Logo */}
            <div className="hidden md:block p-4 font-bold text-lg border-b border-white/20">
                Admin Dashboard
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                    <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                        'flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition',
                        pathName === item.href && 'bg-white/20'
                    )}
                    onClick={onClose}
                    >
                    <Icon size={20} />
                    {item.name}
                    </Link>
                );
                })}
            </nav>
        </aside>
    );
}