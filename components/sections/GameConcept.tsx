export default function GameConcept() {
  return (
    <section id="game-concept" className="relative w-full bg-zinc-900/30 py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-4">
            Game Concept
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Code Cracker
          </h2>
          <p className="text-lg sm:text-xl text-amber-400/80 font-semibold mt-3">
            The Investigation Ladder
          </p>
        </div>

        {/* Premise */}
        <div className="p-6 md:p-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm mb-8">
          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed text-center">
            Dalam Battle of Champions Season III, peserta berperan sebagai{" "}
            <span className="text-amber-400 font-semibold">detective</span> yang
            harus memecahkan sebuah kasus misterius melalui serangkaian
            tantangan. Setiap tantangan menggabungkan{" "}
            <span className="text-amber-400 font-semibold">
              matematika, logika, dan pengetahuan umum
            </span>{" "}
            yang harus dipecahkan untuk mengumpulkan{" "}
            <span className="text-amber-400 font-semibold">clue</span> dan naik
            ke level berikutnya.
          </p>
        </div>

        {/* The Investigation Ladder */}
        <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-8">
          Perjalanan Seorang Detective
        </h3>

        <div className="relative">
          {/* Vertical connection line */}
          <div className="hidden md:block absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-amber-500/40 via-amber-500/20 to-transparent" />

          <div className="space-y-6">
            {[
              {
                phase: "Phase 1",
                title: "Case Briefing",
                desc: "Setiap tim detective menerima berkas kasus misterius. Pelajari petunjuk awal, pahami aturan permainan, dan susun strategi investigasi bersama tim.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                phase: "Phase 2",
                title: "Evidence Gathering",
                desc: "Pecahkan tantangan matematika dan logika satu per satu. Setiap soal yang terpecahkan membuka clue baru yang membawa Anda lebih dekat pada kebenaran.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                phase: "Phase 3",
                title: "Investigation Board",
                desc: "Susun seluruh clue yang terkumpul di papan investigasi. Analisis pola, hubungkan bukti, dan identifikasi tersangka utama bersama tim Anda.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm0 8a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm12 3a3 3 0 110-6 3 3 0 010 6z" />
                  </svg>
                ),
              },
              {
                phase: "Final Phase",
                title: "Case Closed",
                desc: "Presentasikan hasil investigasi Anda. Tim dengan solusi paling akurat dan strategi terbaik akan dinobatkan sebagai pemenang Battle of Champions.",
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                ),
              },
            ].map((step, idx) => (
              <div key={idx} className="relative flex gap-5 md:gap-8">
                {/* Icon dot */}
                <div className="hidden md:flex flex-shrink-0 relative z-10 w-16 h-16 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                  {step.icon}
                </div>

                {/* Card */}
                <div className="flex-1 p-5 md:p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm hover:border-amber-500/20 transition-all duration-300">
                  {/* Mobile icon */}
                  <div className="flex items-center gap-3 mb-3 md:hidden">
                    <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                      {step.icon}
                    </div>
                    <span className="text-xs font-semibold text-amber-500 tracking-wider uppercase">
                      {step.phase}
                    </span>
                  </div>
                  <span className="hidden md:inline-block text-xs font-semibold text-amber-500 tracking-wider uppercase mb-2">
                    {step.phase}
                  </span>
                  <h4 className="text-lg font-bold text-white mb-2">{step.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note */}
        <p className="text-xs text-zinc-600 text-center mt-10">
          Detail teknis dan aturan lengkap akan disampaikan saat Technical Meeting.
        </p>
      </div>
    </section>
  );
}