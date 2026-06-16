export default function FAQ() {
  const faqs = [
    {
      q: "Siapa saja yang boleh mendaftar?",
      a: "Kompetisi ini terbuka untuk seluruh siswa SMA/SMK/MA sederajat se-Sulawesi Selatan. Peserta wajib memiliki Kartu Pelajar yang masih berlaku.",
    },
    {
      q: "Berapa anggota maksimal per tim?",
      a: "Setiap tim terdiri dari minimal 1 orang (individu) dan maksimal 5 anggota, termasuk 1 orang sebagai ketua tim. Anggota tim boleh berasal dari sekolah yang berbeda.",
    },
    {
      q: "Apakah pendaftaran dipungut biaya?",
      a: "Ya, terdapat biaya pendaftaran per tim yang besarannya berbeda untuk setiap kategori lomba. Biaya admin payment gateway ditanggung peserta dan dihitung berdasarkan metode pembayaran yang Anda pilih. Rincian lengkap dapat dilihat pada Case Cost Summary di halaman pendaftaran.",
    },
    {
      q: "Bagaimana alur pendaftaran?",
      a: "Alur pendaftaran: Login dengan Google → Isi formulir pendaftaran → Pilih metode pembayaran → Lanjut ke halaman pembayaran → Selesaikan pembayaran → Status terverifikasi. Anda wajib login dengan akun Google terlebih dahulu sebelum mengisi formulir.",
    },
    {
      q: "Kapan batas akhir pendaftaran?",
      a: "Pendaftaran dibuka mulai 1 Agustus 2026 dan ditutup pada 30 September 2026 pukul 23:59 WITA. Pastikan Anda menyelesaikan pembayaran sebelum batas waktu.",
    },
    {
      q: "Apa yang terjadi jika pembayaran saya expired?",
      a: "Jika pembayaran melebihi batas waktu yang ditentukan oleh payment gateway, status pembayaran akan berubah menjadi EXPIRED. Anda harus mendaftar ulang dan membuat invoice baru untuk melanjutkan.",
    },
    {
      q: "Apakah saya bisa mengganti kategori lomba setelah mendaftar?",
      a: "Tidak. Setelah formulir disubmit dan invoice pembayaran dibuat, kategori lomba tidak dapat diubah. Pastikan Anda memilih kategori yang tepat sebelum mengirim pendaftaran.",
    },
    {
      q: "Bagaimana cara menghubungi panitia?",
      a: "Anda dapat menghubungi panitia melalui WhatsApp Support (Senin–Sabtu, 08.00–20.00 WITA) atau Email Support (24/7). Kontak lengkap tersedia di section Command Center di bawah.",
    },
    {
      q: "Apakah technical meeting wajib diikuti?",
      a: "Ya, technical meeting pada 14 dan 15 Oktober 2026 bersifat wajib untuk seluruh peserta yang sudah terverifikasi. Informasi detail akan dikirimkan melalui email dan WhatsApp setelah masa pendaftaran berakhir.",
    },
  ];

  return (
    <section id="faq" className="relative w-full bg-zinc-950 py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-4">
            Briefing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            FAQ
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 mt-4">
            Informasi penting sebelum memulai investigasi.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <details
              key={idx}
              className="group rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm hover:border-amber-500/20 transition-all duration-300 [&[open]]:border-amber-500/30 [&[open]]:shadow-[0_0_25px_rgba(245,158,11,0.06)]"
            >
              <summary className="flex items-center justify-between px-6 py-5 cursor-pointer list-none select-none">
                <h3 className="text-base sm:text-lg font-semibold text-white pr-4 group-hover:text-amber-300 transition-colors">
                  {faq.q}
                </h3>
                <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-amber-500/10 text-amber-400 group-open:rotate-45 transition-transform duration-300 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </span>
              </summary>
              <div className="px-6 pb-5 -mt-2">
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}