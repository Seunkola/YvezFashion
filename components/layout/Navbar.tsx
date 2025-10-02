"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/features/stores/useAuthStores";
import CartIcon from "../ui/cartIcon";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false); // checking mobile navbar state
  const { user, logout } = useAuth(); // logout on navbar
  const router = useRouter();
  const isAdmin = useAuthStore((state) => state.isAdmin); // checking usertype to show profile or admin dashboard

  const closeMenu = () => setIsOpen(false);

  async function handleLogout() {
    closeMenu();
    const { error } = await logout();

    if (error) {
      toast.error(`Logout failed: ${error.message}`);
      return;
    }

    toast.success("You have been logged out successfully!");

    // Give toast a moment to display before redirect
    router.push("/login");
  }

  return (
    <header className="bg-black text-gold sticky top-0 z-50 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-gold">
          Yvez Collections
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>
          <Link href="/cart" className="hover:underline">
            Cart <CartIcon />
          </Link>

          {
            /* Check if user is logged in */
            user ? (
              <>
                {isAdmin === false && (
                  <Link href="/profile" className="hover:underline">
                    Profile
                  </Link>
                )}
                {isAdmin === true && (
                  <Link href="/admin" className="hover:underline">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="border border-gold px-3 py-1 rounded hover:bg-gold hover:text-black transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="border border-gold px-3 py-1 rounded hover:bg-gold hover:text-black transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-gold text-black px-3 py-1 rounded hover:opacity-90 transition"
                >
                  Sign Up
                </Link>
              </>
            )
          }
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="md:hidden text-gold"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black px-4 pb-4 space-y-2">
          <Link href="/shop" className="block" onClick={() => setIsOpen(false)}>
            Shop
          </Link>
          <Link href="/cart" className="block" onClick={() => setIsOpen(false)}>
            Cart
          </Link>
          {user ? (
            <>
              {isAdmin === false && (
                <Link
                  href="/profile"
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  Profile
                </Link>
              )}
              {isAdmin === true && (
                <Link
                  href="/admin"
                  className="block"
                  onClick={() => setIsOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left border border-gold px-3 py-1 rounded hover:bg-gold hover:text-black transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
