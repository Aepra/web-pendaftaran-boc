"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative w-full overflow-hidden min-h-[90vh] flex items-center">
      {/* === BACKGROUND IMAGE === */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Brand color overlay — reduced opacity so background logo shows through clearly */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#002D61]/80 via-[#002D61]/55 to-[#700702]/40" />

      {/* Red glow top-right */}
      <div className="absolute -top-20 right-0 w-[600px] h-[600px] bg-[#700702]/25 rounded-full blur-3xl z-0 pointer-events-none" />
      {/* Blue glow bottom-left */}
      <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#002D61]/30 rounded-full blur-3xl z-0 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-28 md:py-36 lg:py-44 flex flex-col items-center text-center">
        {/* Live Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFF6E9] opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFF6E9]" />
          </span>
          <span className="text-[#FFF6E9] text-sm font-semibold tracking-[0.15em] uppercase">
            Registration Now Open
          </span>
        </div>

        {/* Season label */}
        <p className="text-sm sm:text-base font-semibold tracking-[0.3em] uppercase text-white/60 mb-3">
          Season III • 2026
        </p>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] max-w-5xl">
          Battle of
          <br />
          <span className="bg-gradient-to-r from-[#FFF6E9] via-[#ffcccc] to-[#FFF6E9] bg-clip-text text-transparent">
            Champions
          </span>
        </h1>

        {/* Theme box */}
        <div className="inline-block px-6 py-3 mb-8 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
          <p className="text-base sm:text-lg md:text-xl font-bold text-[#FFF6E9] tracking-wide">
            ClashMind
          </p>
          <p className="text-xs sm:text-sm text-white/60 mt-0.5">
            Think Faster, Solve Smarter
          </p>
        </div>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mb-4 leading-relaxed">
          Kompetisi akademik yang menggabungkan matematika, logika, pemecahan
          masalah, dan kerja sama tim dalam atmosfer investigasi yang seru.
        </p>
        <p className="text-sm text-[#FFF6E9]/80 font-semibold mb-10">
          Untuk siswa SMA se-Sulawesi Selatan
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          {isAuthenticated ? (
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#700702] hover:bg-[#8a0903] text-white font-bold rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(112,7,2,0.3)] hover:shadow-[0_6px_40px_rgba(112,7,2,0.45)] hover:-translate-y-0.5"
            >
              Daftar Sekarang
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <Link
              href="/login"
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-[#700702] hover:bg-[#8a0903] text-white font-bold rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(112,7,2,0.3)] hover:shadow-[0_6px_40px_rgba(112,7,2,0.45)] hover:-translate-y-0.5"
            >
              Daftar Sekarang
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
          <a
            href="#about"
            className="px-8 py-3.5 rounded-xl border-2 border-white/30 hover:border-white/60 text-white/80 hover:text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm"
          >
            Buka Case File
          </a>
        </div>

        {/* Stats Row */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 w-full max-w-3xl">
          {[
            { value: "1000+", label: "Detectives" },
            { value: "24", label: "Kab/Kota" },
            { value: "5", label: "Tahap Lomba" },
            { value: "Rp 50jt+", label: "Total Hadiah" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative group p-5 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm hover:border-white/30 hover:bg-white/20 hover:shadow-md transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-extrabold text-[#FFF6E9] mb-1 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-white/60 tracking-wider uppercase font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#FFF6E9] to-transparent pointer-events-none" />
    </section>
  );
}