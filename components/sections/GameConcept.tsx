import Link from "next/link";

export default function GameConcept() {
  return (
    <section id="game-concept" className="relative w-full bg-[#FFF6E9]/75 backdrop-blur-[2px] py-12 md:py-16">
      {/* Subtle diagonal lines */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #002D61 0, #002D61 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="relative max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#002D61] leading-[1.15]">
            5 Babak Investigasi
          </h2>
          <p className="text-lg sm:text-xl text-[#700702] font-semibold mt-3">
            ClashMind: Think Faster, Solve Smarter
          </p>
        </div>

        {/* Premise */}
        <div className="p-6 md:p-8 rounded-2xl border border-[#002D61]/10 bg-white shadow-sm mb-10">
          <p className="text-base sm:text-lg text-[#002D61]/80 leading-relaxed text-center">
            Dalam Battle of Champions Season III, peserta berperan sebagai{" "}
            <span className="text-[#700702] font-semibold">detective</span> yang
            harus memecahkan sebuah kasus misterius melalui serangkaian
            tantangan. Setiap babak menggabungkan{" "}
            <span className="text-[#002D61] font-semibold">
              matematika, logika, dan pengetahuan umum
            </span>{" "}
            yang harus dipecahkan untuk mengumpulkan{" "}
            <span className="text-[#700702] font-semibold">clue</span> dan melaju
            ke babak berikutnya.
          </p>
        </div>

        {/* Investigation Ladder */}
        <h3 className="text-xl sm:text-2xl font-bold text-[#002D61] text-center mb-8">
          Perjalanan Seorang Detective
        </h3>

        <div className="relative">
          {/* Vertical line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#700702]/50 via-[#002D61]/30 to-transparent" />

          <div className="space-y-6">
            {[
              {
                phase: "Tahap 1",
                tag: "Pengetahuan Umum",
                title: "Geo-Tracking Clues",
                desc: "Tim menerima amplop berisi identitas pelaku dan peta Indonesia. Peserta memecahkan clue geografi untuk menandai titik koordinat dan menggambarkan rute pelarian pelaku.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
              },
              {
                phase: "Tahap 2",
                tag: "Logika",
                title: "Suspect Dossier",
                desc: "Setiap tim menerima Amplop Kriminologi berisi berkas empat tersangka. Gunakan penalaran deduktif untuk mengeliminasi tersangka berdasarkan alibi, jadwal, dan fakta lokasi.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                phase: "Tahap 3",
                tag: "Matematika",
                title: "Code Cracker",
                desc: "Peserta sebagai investigator mengakses web bertema detektif dan menyelesaikan soal matematika bertingkat (Aritmatika, Pola Bilangan, Aljabar). Setiap jawaban benar membuka petunjuk kasus baru.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                phase: "Tahap 4",
                tag: "Bahasa Inggris",
                title: "The Silent Witness",
                desc: "Satu anggota tim menjadi Witness dan mengamati gambar TKP, lalu menyampaikan informasi kepada Detectives dalam bahasa Indonesia. Detectives melengkapi kalimat rumpang dalam Bahasa Inggris menggunakan bank kata yang disediakan.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ),
              },
              {
                phase: "Final",
                tag: "Campuran",
                title: "Matrix Game",
                desc: "Babak final penentu juara. Papan matriks 5x5 berisi soal dari berbagai kategori. Peserta menjawab secara rebutan. Tim dengan poin tertinggi dinobatkan sebagai Champion.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ),
              },
            ].map((step, idx) => (
              <div key={idx} className="relative flex gap-5 md:gap-8">
                {/* Icon dot */}
                <div className="hidden md:flex flex-shrink-0 relative z-10 w-16 h-16 items-center justify-center rounded-full bg-white border-2 border-[#700702] text-[#700702] shadow-md">
                  {step.icon}
                </div>

                {/* Card */}
                <div className="flex-1 p-5 md:p-6 rounded-2xl border border-[#002D61]/10 bg-white shadow-sm hover:shadow-md hover:border-[#002D61]/25 transition-all duration-300">
                  {/* Mobile icon */}
                  <div className="flex items-center gap-3 mb-3 md:hidden">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white border-2 border-[#700702] text-[#700702] shadow-sm">
                      {step.icon}
                    </div>
                    <span className="text-xs font-bold text-[#700702] tracking-wider uppercase">
                      {step.phase}
                    </span>
                  </div>
                  <div className="hidden md:flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-[#700702] tracking-wider uppercase">{step.phase}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#002D61]/8 text-[#002D61]/70 border border-[#002D61]/10">{step.tag}</span>
                  </div>
                  <h4 className="text-lg font-bold text-[#002D61] mb-2">{step.title}</h4>
                  <p className="text-sm text-[#002D61]/65 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banner Tata Tertib & Detail Regulasi */}
        <div className="mt-12 p-6 md:p-8 rounded-2xl bg-gradient-to-r from-[#002D61] via-[#00224b] to-[#120303] text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6 border border-[#002D61]/20">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 text-amber-300 text-[11px] font-extrabold tracking-wider uppercase">
              Dokumen Resmi Lomba
            </span>
            <h4 className="text-xl md:text-2xl font-black text-white">
              Tata Tertib & Mekanisme Lengkap
            </h4>
            <p className="text-xs md:text-sm text-white/80 max-w-xl">
              Pelajari 7 aturan pokok disiplin, sistem penilaian bertingkat, penalti keterlambatan, hingga aturan rebutan Matrix Game.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
            <Link
              href="/tatib"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-[#002D61] font-extrabold text-xs md:text-sm hover:bg-[#FFF6E9] transition-all shadow-md"
            >
              Baca Tata Tertib
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <a
              href="/KONSEP%20GAMES%20BOC%202026%20(1).pdf"
              download="KONSEP_GAMES_BOC_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#700702] text-white font-extrabold text-xs md:text-sm hover:bg-[#8a0903] transition-all shadow-md border border-white/20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh PDF
            </a>
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-[#002D61]/40 text-center mt-6">
          Detail teknis dan aturan lengkap juga akan dibahas bersama guru pembina saat Technical Meeting.
        </p>
      </div>
    </section>
  );
}
