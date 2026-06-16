"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRegistration } from "@/contexts/registration-context";
const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

// Mock payment status — cyclical for demo
const MOCK_STATUSES: Array<{
  status_label: string;
  status_value: string;
  status_color: string;
  instruction: string;
}> = [
  {
    status_label: "Pending",
    status_value: "PENDING_PAYMENT",
    status_color: "text-amber-400",
    instruction:
      "Silakan selesaikan pembayaran melalui metode yang Anda pilih. Kode pembayaran akan muncul setelah invoice dibuat oleh sistem.",
  },
  {
    status_label: "Paid",
    status_value: "PAID",
    status_color: "text-green-400",
    instruction:
      "Pembayaran Anda telah berhasil dikonfirmasi. Simpan email konfirmasi sebagai bukti pendaftaran.",
  },
  {
    status_label: "Expired",
    status_value: "EXPIRED",
    status_color: "text-red-400",
    instruction:
      "Batas waktu pembayaran telah habis. Silakan daftar ulang untuk membuat invoice baru.",
  },
];

export default function PaymentPage() {
  const { isAuthenticated } = useAuth();
  const { data, clearData } = useRegistration();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }
    if (!data) {
      router.replace("/register");
      return;
    }
  }, [isAuthenticated, data, router]);

  if (!isAuthenticated || !data) {
    return null;
  }

  // Use a deterministic mock status based on registration ID for demo
  const statusIndex =
    data.registration_id
      ? data.registration_id.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % MOCK_STATUSES.length
      : 0;
  const mockStatus = MOCK_STATUSES[statusIndex];

  const paymentMethods: Record<string, string> = {
    VA: "Virtual Account (VA)",
    QRIS: "QRIS",
    EWALLET: "E-Wallet",
    CREDIT_CARD: "Credit Card",
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
      </div>

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

            {/* Kategori & Metode */}
            <div className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Case Details
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-2 border-b border-zinc-800/40">
                  <span className="text-zinc-400">Kategori Lomba</span>
                  <span className="text-white font-semibold">—</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-800/40">
                  <span className="text-zinc-400">Metode Pembayaran</span>
                  <span className="text-white font-semibold">—</span>
                </div>
              </div>
            </div>

            {/* Instruksi Pembayaran */}
            <div className="p-6 rounded-2xl border border-amber-500/15 bg-amber-500/5">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Payment Instruction
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{mockStatus.instruction}</p>
            </div>
          </div>

          {/* Right: Cost Summary & Status */}
          <div className="space-y-6">
            {/* Status */}
            <div className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Status
              </h3>
              <div className="text-center mb-4">
                <div
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${
                    mockStatus.status_value === "PAID"
                      ? "border-green-500/30 bg-green-500/10 text-green-400"
                      : mockStatus.status_value === "EXPIRED"
                      ? "border-red-500/30 bg-red-500/10 text-red-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  <span className={`relative flex h-2 w-2`}>
                    <span
                      className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                        mockStatus.status_value === "PAID"
                          ? "bg-green-400"
                          : mockStatus.status_value === "EXPIRED"
                          ? "bg-red-400"
                          : "bg-amber-400"
                      }`}
                    />
                    <span
                      className={`relative inline-flex rounded-full h-2 w-2 ${
                        mockStatus.status_value === "PAID"
                          ? "bg-green-400"
                          : mockStatus.status_value === "EXPIRED"
                          ? "bg-red-400"
                          : "bg-amber-400"
                      }`}
                    />
                  </span>
                  {mockStatus.status_label}
                </div>
              </div>
            </div>

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
                  <span className="text-zinc-400">Biaya Pendaftaran</span>
                  <span className="text-zinc-200">{fmt(data.base_amount)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-zinc-800/40">
                  <span className="text-zinc-400">Biaya Admin</span>
                  <span className="text-zinc-200">{fmt(data.admin_fee)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-zinc-300 font-semibold">Total Pembayaran</span>
                  <span className="text-amber-400 font-bold text-base">{fmt(data.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {mockStatus.status_value === "PENDING_PAYMENT" && (
                <button
                  onClick={() => alert("Payment gateway akan diintegrasikan di tahap berikutnya.")}
                  className="w-full px-8 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] transition"
                >
                  Bayar Sekarang
                </button>
              )}
              {mockStatus.status_value === "PAID" && (
                <div className="w-full px-8 py-3 bg-green-500/10 border border-green-500/20 text-green-400 font-bold rounded-xl text-center text-sm">
                  ✓ Pembayaran Terkonfirmasi
                </div>
              )}
              {mockStatus.status_value === "EXPIRED" && (
                <button
                  onClick={() => {
                    clearData();
                    router.push("/register");
                  }}
                  className="w-full px-8 py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 font-bold rounded-xl transition"
                >
                  Daftar Ulang
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
    </div>
  );
}