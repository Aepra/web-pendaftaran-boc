"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Siapa saja yang boleh mendaftar?",
    a: "Kompetisi ini terbuka untuk seluruh siswa SMA/SMK/MA sederajat se-Sulawesi Selatan. Peserta wajib memiliki Kartu Pelajar yang masih berlaku.",
  },
  {
    q: "Berapa anggota per tim?",
    a: "Setiap tim terdiri dari 3 anggota termasuk 1 orang sebagai ketua tim. Seluruh anggota tim harus berasal dari sekolah yang sama.",
  },
  {
    q: "Apakah pendaftaran dipungut biaya?",
    a: "Ya, terdapat biaya pendaftaran per tim. Rincian biaya akan diumumkan saat pembukaan pendaftaran pada 1 Agustus 2026.",
  },
  {
    q: "Bagaimana alur pendaftaran?",
    a: "Alur pendaftaran: Login dengan Google → Isi formulir lengkap → Upload berkas (foto, kartu pelajar, bukti follow) → Unggah bukti pembayaran → Menunggu verifikasi panitia.",
  },
  {
    q: "Kapan batas akhir pendaftaran?",
    a: "Pendaftaran dibuka mulai 1 Agustus 2026 dan ditutup pada 30 September 2026. Pastikan semua berkas terisi dan pembayaran sudah diunggah sebelum batas waktu.",
  },
  {
    q: "Apakah technical meeting wajib diikuti?",
    a: "Ya, technical meeting pada 14 atau 15 Oktober 2026 bersifat wajib untuk seluruh peserta yang sudah terverifikasi. Informasi detail akan dikirimkan setelah verifikasi selesai.",
  },
  {
    q: "Bagaimana cara menghubungi panitia?",
    a: "Anda dapat menghubungi panitia melalui WhatsApp atau email. Kontak lengkap tersedia di bagian Kontak Kami di bawah.",
  },
  {
    q: "Di mana kegiatan ini akan dilaksanakan?",
    a: "Kegiatan akan dilaksanakan secara offline pada 17 Oktober 2026 di Makassar. Lokasi pasti akan diumumkan kemudian.",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section id="faq" className="relative w-full bg-white/75 backdrop-blur-[2px] py-12 md:py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#002D61] leading-[1.15]">
            FAQ
          </h2>
          <p className="text-base sm:text-lg text-[#002D61]/60 mt-4">
            Informasi penting sebelum memulai investigasi.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border bg-white transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "border-[#700702]/30 shadow-md"
                    : "border-[#002D61]/10 hover:border-[#002D61]/25 hover:shadow-sm"
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex items-center justify-between w-full px-6 py-5 text-left cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <h3 className={`text-base sm:text-lg font-semibold pr-4 transition-colors ${isOpen ? "text-[#700702]" : "text-[#002D61]"}`}>
                    {faq.q}
                  </h3>
                  <span className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
                    isOpen
                      ? "bg-[#700702]/10 text-[#700702] rotate-45"
                      : "bg-[#002D61]/8 text-[#002D61]/60"
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 -mt-2 border-t border-[#002D61]/6">
                    <p className="text-sm sm:text-base text-[#002D61]/70 leading-relaxed pt-3">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}