"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative w-full overflow-hidden bg-zinc-950">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/3 rounded-full blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 1) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Diagonal scan lines */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgb(255 255 255 / 0.3) 2px, rgb(255 255 255 / 0.3) 3px)",
          backgroundSize: "100% 4px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-28 md:py-36 lg:py-44 flex flex-col items-center text-center">
        {/* Case Open Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2 mb-8 rounded-full border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
          </span>
          <span className="text-amber-400/90 text-sm font-semibold tracking-[0.15em] uppercase">
            Registration Now Open
          </span>
        </div>

        {/* Season & Event Name */}
        <p className="text-sm sm:text-base font-semibold tracking-[0.3em] uppercase text-amber-400/80 mb-3">
          Season III • 2026
        </p>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08] max-w-5xl">
          Battle of
          <br />
          <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">
            Champions
          </span>
        </h1>

        {/* Theme */}
        <div className="inline-block px-6 py-3 mb-8 rounded-xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm">
          <p className="text-base sm:text-lg md:text-xl font-bold text-amber-300 tracking-wide">
            SmartSolve
          </p>
          <p className="text-xs sm:text-sm text-amber-400/60 mt-0.5">
            Unlock Your Mind, Ignite The Future
          </p>
        </div>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
          Kompetisi akademik yang menggabungkan matematika, logika, pemecahan
          masalah, dan kerja sama tim dalam atmosfer investigasi yang seru.
        </p>

        <p className="text-sm text-amber-400/70 font-semibold mb-10">
          Untuk siswa SMA se-Sulawesi Selatan
        </p>

        {/* CTA Buttons — dynamic based on auth */}
        <div className="flex flex-col sm:flex-row gap-4">
          {isAuthenticated ? (
            <Link
              href="/register"
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_45px_rgba(245,158,11,0.35)] hover:-translate-y-0.5"
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
              className="group inline-flex items-center gap-2.5 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-all duration-300 shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:shadow-[0_0_45px_rgba(245,158,11,0.35)] hover:-translate-y-0.5"
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
            className="px-8 py-3.5 rounded-xl border border-zinc-700/60 hover:border-amber-500/40 text-zinc-400 hover:text-amber-300 font-semibold transition-all duration-300 hover:-translate-y-0.5"
          >
            Buka Case File
          </a>
        </div>

        {/* Stats Row */}
        <div className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {[
            { value: "1000+", label: "Detectives" },
            { value: "24", label: "Kab/Kota" },
            { value: "5", label: "Kategori" },
            { value: "Rp 50jt+", label: "Total Hadiah" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative group p-5 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm hover:border-amber-500/20 hover:bg-zinc-900/60 transition-all duration-300"
            >
              <div className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-zinc-500 group-hover:text-zinc-400 transition-colors tracking-wider uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none" />
    </section>
  );
}