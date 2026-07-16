"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getAdmins } from "@/lib/api/boc-api";

const NAV_LINKS_GUEST = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
];

const NAV_LINKS_AUTH = [
  { href: "/", label: "Home" },
  { href: "/register", label: "Pendaftaran" },
  { href: "/profile", label: "Profil" },
];

const NAV_LINKS_ADMIN = [
  { href: "/admin", label: "Dashboard" },
  { href: "/profile", label: "Profil" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;
    const superAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "abelekaputra05@gmail.com";
    if (user.email === superAdmin) {
      setIsAdmin(true);
      return;
    }
    // Check dynamic admins
    getAdmins().then(admins => {
      if (admins.includes(user.email!)) {
        setIsAdmin(true);
      }
    }).catch(() => {});
  }, [isAuthenticated, user]);

  const links = isAuthenticated 
    ? (isAdmin ? NAV_LINKS_ADMIN : NAV_LINKS_AUTH) 
    : NAV_LINKS_GUEST;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[#002D61]/10 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#700702] border border-[#700702]/20 text-white shadow-sm group-hover:shadow-md transition-all group-hover:-translate-y-0.5">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-sm font-black text-[#002D61] tracking-wide">
            BoC <span className="hidden sm:inline">2026</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${
                pathname === link.href
                  ? "text-white bg-[#002D61] shadow-sm"
                  : "text-[#002D61]/70 hover:text-[#002D61] hover:bg-[#002D61]/5"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="ml-2 px-3 py-2 rounded-lg text-sm font-bold text-red-600 hover:text-white hover:bg-red-600 transition-colors border border-transparent hover:border-red-700"
            >
              Logout
            </button>
          )}
        </div>

        {isAuthenticated && user && (
          <div className="hidden md:flex items-center gap-2 ml-3">
            <img
              src={user.image}
              alt={user.name}
              className="w-8 h-8 rounded-full border-2 border-[#002D61]/10"
            />
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#002D61] hover:bg-[#002D61]/5 rounded-lg transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#002D61]/10 bg-white/95 backdrop-blur-lg shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-2 py-3 border-b border-[#002D61]/10 mb-2">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border-2 border-[#002D61]/10"
                />
                <div>
                  <p className="text-sm font-black text-[#002D61]">{user.name}</p>
                  <p className="text-xs text-[#002D61]/60 font-medium">{user.email}</p>
                </div>
              </div>
            )}
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  pathname === link.href
                    ? "text-white bg-[#002D61] shadow-sm"
                    : "text-[#002D61]/70 hover:text-[#002D61] hover:bg-[#002D61]/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-red-600 hover:text-white hover:bg-red-600 transition-colors mt-1"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}