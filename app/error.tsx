"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error Boundary caught an error]:", error);
  }, [error]);

  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-[#002D61]/15 shadow-xl">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-2xl">
          !
        </div>
        <h2 className="text-xl font-black text-[#002D61] mb-2">Terjadi Kendala Memuat Halaman</h2>
        <p className="text-sm text-[#002D61]/70 mb-6">
          Halaman mengalami kendala saat memuat komponen atau data. Silakan coba muat ulang.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#002D61] text-white font-bold text-sm hover:bg-[#002D61]/90 transition-colors shadow-sm cursor-pointer"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-[#002D61]/20 text-[#002D61] font-bold text-sm hover:bg-[#002D61]/5 transition-colors text-center"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </main>
  );
}
