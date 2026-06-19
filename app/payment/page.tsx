"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRegistration } from "@/contexts/registration-context";
import { isOrangDalamCode, isMidtransCode } from "@/lib/api/boc-api";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

function PaymentContent() {
  const { isAuthenticated } = useAuth();
  const { data, paymentFlowStage, clearData } = useRegistration();
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  // Determine display mode
  const isComingSoon = statusParam === "coming_soon";
  const isBypass = statusParam === "bypass";

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    // If coming_soon or bypass, we don't need registration data
    if (isComingSoon || isBypass) return;

    if (!data) {
      router.replace("/register");
      return;
    }
  }, [isAuthenticated, data, router, isComingSoon, isBypass]);

  if (!isAuthenticated) {
    return null;
  }

  // ======================
  // COMING SOON (Midtrans)
  // ======================

  if (isComingSoon) {
    return (
      <main className="relative max-w-2xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-4">
            Payment
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Case Cost Settlement
          </h1>
        </div>

        <div className="p-8 md:p-10 rounded-2xl border border-amber-500/20 bg-zinc-900/50 shadow-[0_0_40px_rgba(245,158,11,0.06)] text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>

          <h2 className="text-2xl font-extrabold text-amber-400 mb-3">
            Metode Pembayaran Belum Tersedia
          </h2>
          <p className="text-zinc-300 leading-relaxed max-w-md mx-auto mb-8">
            Metode pembayaran yang Anda pilih sedang dalam tahap pengembangan.
            Integrasi Midtrans akan segera hadir. Silakan hubungi panitia untuk informasi lebih lanjut.
          </p>

          <div className="space-y-3 max-w-xs mx-auto">
            <button
              onClick={() => router.push("/register")}
              className="w-full px-8 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] transition"
            >
              Kembali ke Pendaftaran
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full px-8 py-3 rounded-xl border border-zinc-700/60 text-zinc-400 hover:text-amber-300 hover:border-amber-500/40 font-semibold transition"
            >
              ← Kembali ke Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ======================
  // ORANG_DALAM BYPASS
  // ======================

  if (isBypass) {
    return (
      <main className="relative max-w-2xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-4">
            Registration Complete
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Case Successfully Registered
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 mt-4 max-w-xl mx-auto">
            Berkas investigasi Anda telah tercatat.
          </p>
        </div>

        <div className="p-8 md:p-10 rounded-2xl border border-green-500/20 bg-zinc-900/50 shadow-[0_0_40px_rgba(34,197,94,0.06)] text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 mb-6 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h2 className="text-2xl font-extrabold text-green-400 mb-3">
            Pendaftaran Berhasil
          </h2>
          <p className="text-zinc-300 leading-relaxed max-w-md mx-auto mb-8">
            Pendaftaran Anda telah berhasil diproses tanpa pembayaran.
            Status peserta Anda langsung terverifikasi. Silakan cek profil untuk melihat detail pendaftaran.
          </p>

          <div className="space-y-3 max-w-xs mx-auto">
            <button
              onClick={() => router.push("/profile")}
              className="w-full px-8 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] transition"
            >
              Lihat Profil
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full px-8 py-3 rounded-xl border border-zinc-700/60 text-zinc-400 hover:text-amber-300 hover:border-amber-500/40 font-semibold transition"
            >
              ← Kembali ke Home
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ======================
  // NORMAL FLOW (with registration data)
  // ======================

  if (!data) {
    return null;
  }

  const isSkipped = paymentFlowStage === "SKIPPED_PAYMENT";

  return (
    <main className="relative max-w-4xl mx-auto px-4 py-20 md:py-28">
      <div className="text-center mb-12">
        <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-4">
          Payment
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
          Case Cost Settlement
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 mt-4 max-w-xl mx-auto">
          Selesaikan biaya investigasi Anda untuk mengamankan slot.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Payment Summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ringkasan Peserta */}
          <div className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Investigator Profile
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-zinc-500 text-xs">Registration ID</span>
                <p className="text-white font-semibold mt-0.5">{data.registration_id}</p>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">Order ID</span>
                <p className="text-white font-semibold mt-0.5">{data.order_id}</p>
              </div>
            </div>
          </div>

          {/* Payment Instruction */}
          <div className="p-6 rounded-2xl border border-amber-500/15 bg-amber-500/5">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Payment Instruction
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Silakan selesaikan pembayaran melalui metode yang Anda pilih.
              Kode pembayaran akan muncul setelah invoice dibuat oleh sistem.
            </p>
          </div>
        </div>

        {/* Right: Cost Summary & Actions */}
        <div className="space-y-6">
          {/* Case Cost Summary */}
          <div className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Case Cost Summary
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-zinc-800/40">
                <span className="text-zinc-400">Total Pembayaran</span>
                <span className="text-amber-400 font-bold text-base">
                  {fmt(data.total_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            {!isSkipped && (
              <button
                onClick={() => alert("Payment gateway akan diintegrasikan di tahap berikutnya.")}
                className="w-full px-8 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] transition"
              >
                Bayar Sekarang
              </button>
            )}
            <button
              onClick={() => router.push("/")}
              className="w-full px-8 py-3 rounded-xl border border-zinc-700/60 text-zinc-400 hover:text-amber-300 hover:border-amber-500/40 font-semibold transition"
            >
              ← Kembali ke Home
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
      </div>

      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <svg className="animate-spin h-10 w-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </div>
  );
}