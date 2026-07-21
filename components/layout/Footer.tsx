"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full border-t border-[#002D61]/10 bg-white/95 backdrop-blur-md pt-16 pb-12 text-[#002D61]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#002D61]/10">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo-hitam-boc.jpg"
                alt="BoC 2026 Logo"
                width={140}
                height={40}
                className="h-10 w-auto object-contain rounded transition-transform group-hover:scale-105"
              />
              <span className="text-sm font-black text-[#002D61] tracking-wide group-hover:text-[#700702] transition-colors">
                Battle of Champions
              </span>
            </Link>
            <p className="text-xs text-[#002D61]/70 leading-relaxed">
              Kompetisi akademik bergengsi untuk siswa SMA/SMK/MA sederajat se-Sulawesi Selatan. Menggabungkan matematika, logika, dan simulasi investigasi detektif.
            </p>
            <div className="inline-block px-3 py-1 rounded-full bg-[#700702]/8 border border-[#700702]/15 text-[11px] font-extrabold text-[#700702]">
              Organized by Youthverse Indonesia
            </div>
          </div>

          {/* Column 2: Navigasi Lomba */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#002D61]">
              Navigasi Utama
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <a href="#about" className="text-[#002D61]/70 hover:text-[#700702] transition-colors">
                  Tentang Lomba
                </a>
              </li>
              <li>
                <a href="#game-concept" className="text-[#002D61]/70 hover:text-[#700702] transition-colors">
                  Konsep 5 Babak
                </a>
              </li>
              <li>
                <a href="#timeline" className="text-[#002D61]/70 hover:text-[#700702] transition-colors">
                  Timeline & Jadwal
                </a>
              </li>
              <li>
                <Link href="/gallery" className="text-[#002D61]/70 hover:text-[#700702] transition-colors">
                  Galeri Dokumentasi
                </Link>
              </li>
              <li>
                <a href="#faq" className="text-[#002D61]/70 hover:text-[#700702] transition-colors">
                  FAQ & Briefing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Akses Peserta */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#002D61]">
              Portal Peserta
            </h4>
            <ul className="space-y-2 text-sm font-semibold">
              <li>
                <Link href="/register" className="text-[#002D61]/70 hover:text-[#700702] transition-colors">
                  Pendaftaran Tim
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-[#002D61]/70 hover:text-[#700702] transition-colors">
                  Login Ketua Tim
                </Link>
              </li>
              <li>
                <Link href="/profile" className="text-[#002D61]/70 hover:text-[#700702] transition-colors">
                  Cek Status Pendaftaran
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Command Center / Help */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-[0.15em] text-[#002D61]">
              Bantuan & Contact
            </h4>
            <p className="text-xs text-[#002D61]/70 leading-relaxed">
              Ada pertanyaan terkait pendaftaran atau teknis lomba? Tim panitia siap merespons.
            </p>
            <div className="space-y-2 text-xs font-bold text-[#002D61]">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-[#002D61]/80 hover:text-emerald-700 transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                WA: +62 812-3456-7890
              </a>
              <a
                href="mailto:panitia@boc2026.id"
                className="flex items-center gap-2 text-[#002D61]/80 hover:text-[#700702] transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-[#700702]" />
                Email: panitia@boc2026.id
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-[#002D61]/60">
          <p>
            &copy; {new Date().getFullYear()} Battle of Champions Season III. All rights reserved. Youthverse Indonesia.
          </p>

          <button
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#002D61]/15 hover:bg-[#002D61] hover:text-white transition-all text-xs font-bold"
          >
            Atas &uarr;
          </button>
        </div>
      </div>
    </footer>
  );
}
