"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";

export default function Hero() {
  const { isAuthenticated } = useAuth();

  return (
    <section id="home" className="relative w-full overflow-hidden min-h-[92vh] flex items-center">
      {/* === BACKGROUND IMAGE === */}
      <div
        className="absolute inset-0 z-0 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: "url('/background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Brand color overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#002D61]/85 via-[#002D61]/60 to-[#700702]/45" />

      {/* Ambient Pulsing Glow Effects */}
      <div className="absolute -top-24 right-0 w-[650px] h-[650px] bg-[#700702]/30 rounded-full blur-[120px] z-0 pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 -left-24 w-[500px] h-[500px] bg-[#002D61]/40 rounded-full blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 md:py-28 flex flex-col items-center text-center">
        {/* Live Registration Status Badge */}
        <div className="inline-flex items-center gap-3 px-5 py-2 mb-6 rounded-full border border-white/25 bg-white/10 backdrop-blur-md shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFF6E9] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FFF6E9]" />
          </span>
          <span className="text-[#FFF6E9] text-xs sm:text-sm font-semibold tracking-[0.15em] uppercase">
            Pendaftaran Resmi Dibuka
          </span>
        </div>

        {/* Season label */}
        <p className="text-xs sm:text-sm font-extrabold tracking-[0.3em] uppercase text-[#FFF6E9]/70 mb-3">
          Season III • 2026
        </p>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.05] max-w-5xl drop-shadow-sm">
          Battle of
          <br />
          <span className="bg-gradient-to-r from-[#FFF6E9] via-[#ffcccc] to-[#FFF6E9] bg-clip-text text-transparent drop-shadow-md">
            Champions
          </span>
        </h1>

        {/* Theme Badge */}
        <div className="inline-flex flex-col items-center px-7 py-3.5 mb-8 rounded-2xl border border-[#700702]/40 bg-[#700702]/20 backdrop-blur-md shadow-[0_0_30px_rgba(112,7,2,0.3)]">
          <p className="text-base sm:text-lg md:text-xl font-black text-[#FFF6E9] tracking-wider uppercase">
            ClashMind
          </p>
          <p className="text-xs sm:text-sm text-white/80 font-medium tracking-wide mt-0.5">
            Think Faster, Solve Smarter
          </p>
        </div>

        {/* Subheadline */}
        <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mb-3 leading-relaxed font-normal">
          Kompetisi akademik yang menggabungkan matematika, logika, pemecahan
          masalah, dan kerja sama tim dalam atmosfer investigasi yang seru.
        </p>
        <p className="text-sm sm:text-base text-[#FFF6E9] font-bold mb-10 tracking-wide bg-white/10 px-5 py-1.5 rounded-full border border-white/15 backdrop-blur-sm">
          Untuk Siswa SMA/SMK/MA Sederajat se-Sulawesi Selatan
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center">
          {isAuthenticated ? (
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-gradient-to-r from-[#700702] to-[#8a0903] hover:from-[#8a0903] hover:to-[#700702] text-white font-extrabold text-base rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(112,7,2,0.4)] hover:shadow-[0_8px_45px_rgba(112,7,2,0.6)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Daftar Sekarang
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          ) : (
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2.5 px-9 py-4 bg-gradient-to-r from-[#700702] to-[#8a0903] hover:from-[#8a0903] hover:to-[#700702] text-white font-extrabold text-base rounded-xl transition-all duration-300 shadow-[0_4px_30px_rgba(112,7,2,0.4)] hover:shadow-[0_8px_45px_rgba(112,7,2,0.6)] hover:-translate-y-0.5 active:translate-y-0"
            >
              Daftar Sekarang
              <svg
                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}

          <a
            href="#game-concept"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 text-[#FFF6E9] font-bold text-base rounded-xl border border-white/20 hover:border-white/40 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5"
          >
            Lihat Konsep Babak
          </a>
        </div>
        
        <p className="text-xs sm:text-sm text-white/60 mt-4 max-w-md text-center font-medium">
          *Catatan: Pendaftaran hanya bisa dilakukan oleh perwakilan tim (Ketua Tim).
        </p>

        {/* Stats Row */}
        <div className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8 w-full max-w-3xl">
          {[
            {
              value: "25 Tim",
              label: "Detectives",
              icon: (
                <svg className="w-5 h-5 text-[#FFF6E9]/80 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ),
            },
            {
              value: "5 TKP",
              label: "Tahapan Lomba",
              icon: (
                <svg className="w-5 h-5 text-[#FFF6E9]/80 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              ),
            },
            {
              value: "Jutaan Rupiah",
              label: "Total Hadiah",
              icon: (
                <svg className="w-5 h-5 text-[#FFF6E9]/80 mb-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="relative group p-6 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md hover:border-white/40 hover:bg-white/20 hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)] transition-all duration-300 flex flex-col items-center justify-center text-center min-h-[120px]"
            >
              {stat.icon}
              <div className="text-2xl md:text-3xl font-extrabold text-[#FFF6E9] mb-0.5 group-hover:scale-105 transition-transform">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-white/70 tracking-wider uppercase font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#FFF6E9] to-transparent pointer-events-none" />
    </section>
  );
}