export default function Timeline() {
  const phases = [
    {
      date: "1 Agustus – 30 September 2026",
      title: "Case Open",
      subtitle: "Pendaftaran",
      desc: "Pendaftaran dibuka untuk seluruh pelajar dan mahasiswa aktif di Indonesia. Daftarkan tim Anda dan pilih kategori.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      date: "14/15 Oktober 2026",
      title: "Technical Meeting",
      subtitle: "Online",
      desc: "Technical meeting wajib untuk seluruh peserta. Informasi teknis kompetisi, peraturan, dan tanya jawab bersama panitia.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      date: "17 Oktober 2026",
      title: "Investigation Day",
      subtitle: "Hari Kompetisi",
      desc: "Hari kompetisi utama. Presentasikan hasil investigasi digital Anda di hadapan panel juri nasional.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="timeline" className="relative w-full bg-zinc-900/30 py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-4">
            Investigation Progress
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Timeline Investigasi
          </h2>
          <p className="text-base sm:text-lg text-zinc-400 mt-4 max-w-xl mx-auto">
            Tiga tahapan menuju puncak investigasi digital nasional.
          </p>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Amber glowing progress line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-px bg-gradient-to-b from-amber-500/60 via-amber-500/30 to-transparent shadow-[0_0_8px_rgba(245,158,11,0.3)]" />

          <div className="space-y-8 md:space-y-14">
            {phases.map((phase, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-8 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <div className={`flex-1 w-full md:w-1/2 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                    <div className="group p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/50 backdrop-blur-sm hover:border-amber-500/30 hover:shadow-[0_0_25px_rgba(245,158,11,0.08)] transition-all duration-300">
                      {/* Mobile header */}
                      <div className="flex items-center gap-3 mb-3 md:hidden">
                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10 text-amber-400">
                          {phase.icon}
                        </div>
                        <span className="text-sm font-semibold text-amber-500">{phase.date}</span>
                      </div>
                      <span className="hidden md:inline-block text-xs font-semibold text-amber-500 tracking-wider uppercase mb-2">
                        {phase.date}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-1">{phase.title}</h3>
                      <p className="text-xs font-semibold text-amber-400/70 uppercase tracking-[0.1em] mb-2">{phase.subtitle}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{phase.desc}</p>
                    </div>
                  </div>

                  {/* Glowing checkpoint dot */}
                  <div className="hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-sm">
                    {phase.icon}
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block w-1/2" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}