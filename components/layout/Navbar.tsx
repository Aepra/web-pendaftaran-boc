"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

const NAV_LINKS_GUEST = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
];

const NAV_LINKS_AUTH = [
  { href: "/", label: "Home" },
  { href: "/register", label: "Pendaftaran" },
  { href: "/profile", label: "Profil" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = isAuthenticated ? NAV_LINKS_AUTH : NAV_LINKS_GUEST;

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-lg">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 group-hover:shadow-[0_0_12px_rgba(245,158,11,0.2)] transition-shadow">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <span className="text-sm font-bold text-white tracking-wide">
            BoC <span className="hidden sm:inline">2026</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                pathname === link.href
                  ? "text-amber-400 bg-amber-500/10"
                  : "text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="ml-2 px-3 py-2 rounded-lg text-sm font-semibold text-zinc-500 hover:text-red-400 hover:bg-zinc-800/50 transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* User avatar (desktop) */}
        {isAuthenticated && user && (
          <div className="hidden md:flex items-center gap-2 ml-3">
            <img
              src={user.image}
              alt={user.name}
              className="w-8 h-8 rounded-full border border-zinc-700"
            />
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-zinc-400 hover:text-amber-400 transition-colors"
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
        <div className="md:hidden border-t border-zinc-800/60 bg-zinc-950/95 backdrop-blur-lg">
          <div className="px-4 py-3 space-y-1">
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-2 py-3 border-b border-zinc-800/60 mb-2">
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-10 h-10 rounded-full border border-zinc-700"
                />
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
              </div>
            )}
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  pathname === link.href
                    ? "text-amber-400 bg-amber-500/10"
                    : "text-zinc-400 hover:text-amber-300 hover:bg-zinc-800/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => { logout(); setMobileOpen(false); }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-500 hover:text-red-400 hover:bg-zinc-800/50 transition-colors"
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