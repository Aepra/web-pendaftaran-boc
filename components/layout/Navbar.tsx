"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { getAdmins } from "@/lib/api/boc-api";

const NAV_LINKS_GUEST = [
  { href: "/", label: "Home" },
  { href: "/#game-concept", label: "Babak" },
  { href: "/#timeline", label: "Timeline" },
  { href: "/#gallery", label: "Galeri" },
  { href: "/#faq", label: "FAQ" },
  { href: "/login", label: "Login" },
];

const NAV_LINKS_AUTH = [
  { href: "/", label: "Home" },
  { href: "/#game-concept", label: "Babak" },
  { href: "/#timeline", label: "Timeline" },
  { href: "/#gallery", label: "Galeri" },
  { href: "/#faq", label: "FAQ" },
  { href: "/register", label: "Pendaftaran" },
  { href: "/profile", label: "Profil" },
];

const NAV_LINKS_ADMIN = [
  { href: "/admin", label: "Dashboard" },
  { href: "/gallery", label: "Galeri" },
  { href: "/profile", label: "Profil" },
];

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDynamicAdmin, setIsDynamicAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  const superAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "abelekaputra05@gmail.com";
  const isSuperAdmin = isAuthenticated && Boolean(user?.email && user.email === superAdmin);

  useEffect(() => {
    if (!isAuthenticated || !user?.email || isSuperAdmin) return;
    let active = true;
    getAdmins()
      .then((admins) => {
        if (active && user.email && admins.includes(user.email)) {
          setIsDynamicAdmin(true);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isAuthenticated, user?.email, isSuperAdmin]);

  // Scroll Spy for Home Page Sections
  useEffect(() => {
    if (pathname !== "/") return;

    const sections = ["home", "game-concept", "timeline", "gallery", "faq"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 130; // 130px header offset
      let current = "home";

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            current = id;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const isAdmin = isSuperAdmin || isDynamicAdmin;

  const links = isAuthenticated 
    ? (isAdmin ? NAV_LINKS_ADMIN : NAV_LINKS_AUTH) 
    : NAV_LINKS_GUEST;

  const isLinkActive = (href: string) => {
    if (pathname !== "/") {
      return pathname === href;
    }
    if (href === "/") return activeSection === "home";
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      return activeSection === sectionId;
    }
    return pathname === href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full border-b border-[#002D61]/10 bg-white/80 backdrop-blur-md md:backdrop-blur-xl shadow-[0_4px_20px_-2px_rgba(0,45,97,0.06)] transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group py-1"
        >
          <Image
            src="/logo-hitam-boc.jpg"
            alt="BoC 2026 Logo"
            width={140}
            height={40}
            priority
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105 rounded"
          />
          <span className="text-xs sm:text-sm font-black text-[#002D61] tracking-wide group-hover:text-[#700702] transition-colors">
            Battle of Champions
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = isLinkActive(link.href);
            const isCta = link.href === "/login" || link.href === "/register";

            if (isCta) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="ml-2.5 px-5 py-2 text-sm font-extrabold text-white bg-gradient-to-r from-[#700702] to-[#8a0903] hover:from-[#8a0903] hover:to-[#700702] rounded-xl shadow-[0_4px_15px_rgba(112,7,2,0.35)] hover:shadow-[0_6px_20px_rgba(112,7,2,0.45)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
                >
                  <span>{link.label}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </Link>
              );
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                  active
                    ? "text-white bg-[#002D61] shadow-sm scale-[1.02]"
                    : "text-[#002D61] hover:text-[#002D61] hover:bg-[#002D61]/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {isAuthenticated && (
            <button
              onClick={logout}
              className="ml-2 px-3.5 py-2 rounded-lg text-sm font-bold text-red-600 hover:text-white hover:bg-red-600 transition-colors border border-transparent hover:border-red-700"
            >
              Logout
            </button>
          )}
        </div>

        {isAuthenticated && user && (
          <div className="hidden md:flex items-center gap-2 ml-3">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name || "User Avatar"}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full border-2 border-[#002D61]/10 object-cover"
              />
            ) : null}
          </div>
        )}

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-[#002D61] hover:bg-[#002D61]/10 rounded-lg transition-colors"
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
        <div className="md:hidden border-t border-[#002D61]/10 bg-white/95 backdrop-blur-xl shadow-2xl">
          <div className="px-4 py-3 space-y-1">
            {isAuthenticated && user && (
              <div className="flex items-center gap-3 px-2 py-3 border-b border-[#002D61]/10 mb-2">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User Avatar"}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full border-2 border-[#002D61]/10 object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-black text-[#002D61]">{user.name}</p>
                  <p className="text-xs text-[#002D61]/60 font-medium">{user.email}</p>
                </div>
              </div>
            )}
            {links.map((link) => {
              const active = isLinkActive(link.href);
              const isCta = link.href === "/login" || link.href === "/register";

              if (isCta) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block w-full text-center px-4 py-3 rounded-xl text-sm font-extrabold text-white bg-gradient-to-r from-[#700702] to-[#8a0903] shadow-md mt-3"
                  >
                    {link.label}
                  </Link>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                    active
                      ? "text-white bg-[#002D61] shadow-sm"
                      : "text-[#002D61]/80 hover:text-[#002D61] hover:bg-[#002D61]/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
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