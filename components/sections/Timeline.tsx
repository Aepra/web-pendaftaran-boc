export default function Timeline() {
  const phases = [
    {
      date: "1 Agustus – 30 September 2026",
      title: "Case Open",
      subtitle: "Pembukaan Pendaftaran",
      desc: "Pendaftaran dibuka untuk seluruh siswa SMA/sederajat se-Sulawesi Selatan. Daftarkan tim Anda melalui website resmi.",
      color: "red",
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
      desc: "Technical meeting wajib untuk seluruh peserta terverifikasi. Informasi teknis kompetisi, peraturan, dan tanya jawab bersama panitia.",
      color: "blue",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      date: "17 Oktober 2026",
      title: "Investigation Day",
      subtitle: "Hari H Kompetisi",
      desc: "Hari kompetisi utama. Peserta menjalani 5 babak investigasi dan tim terbaik dinobatkan sebagai Battle of Champions III.",
      color: "red",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section id="timeline" className="relative w-full bg-white/75 backdrop-blur-[2px] py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#002D61] leading-[1.15]">
            Timeline Kegiatan
          </h2>
          <p className="text-base sm:text-lg text-[#002D61]/60 mt-4 max-w-xl mx-auto">
            Tiga tahapan menuju puncak investigasi Battle of Champions 2026.
          </p>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          {/* Central line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-px bg-gradient-to-b from-[#700702]/50 via-[#002D61]/30 to-transparent" />

          <div className="space-y-8 md:space-y-14">
            {phases.map((phase, idx) => {
              const isLeft = idx % 2 === 0;
              const isRed = phase.color === "red";
              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-start gap-6 md:gap-8 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <div className={`flex-1 w-full md:w-1/2 ${isLeft ? "md:text-right" : "md:text-left"}`}>
                    <div className="group p-6 rounded-2xl border border-[#002D61]/10 bg-[#FFF6E9] hover:border-[#002D61]/25 hover:shadow-md transition-all duration-300">
                      {/* Mobile header */}
                      <div className="flex items-center gap-3 mb-3 md:hidden">
                        <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-white border-2 shadow-sm ${isRed ? "border-[#700702] text-[#700702]" : "border-[#002D61] text-[#002D61]"}`}>
                          {phase.icon}
                        </div>
                        <span className={`text-sm font-bold ${isRed ? "text-[#700702]" : "text-[#002D61]"}`}>{phase.date}</span>
                      </div>
                      <span className={`hidden md:inline-block text-xs font-bold tracking-wider uppercase mb-2 ${isRed ? "text-[#700702]" : "text-[#002D61]"}`}>
                        {phase.date}
                      </span>
                      <h3 className="text-lg font-extrabold text-[#002D61] mb-1">{phase.title}</h3>
                      <p className={`text-xs font-bold uppercase tracking-[0.1em] mb-2 ${isRed ? "text-[#700702]/70" : "text-[#002D61]/60"}`}>{phase.subtitle}</p>
                      <p className="text-sm text-[#002D61]/65 leading-relaxed">{phase.desc}</p>
                    </div>
                  </div>

                  {/* Glowing checkpoint dot */}
                  <div className={`hidden md:flex absolute left-1/2 top-6 -translate-x-1/2 items-center justify-center w-12 h-12 rounded-full border-2 bg-white shadow-md z-10 ${
                    isRed
                      ? "border-[#700702] text-[#700702] shadow-[0_0_15px_rgba(112,7,2,0.15)]"
                      : "border-[#002D61] text-[#002D61] shadow-[0_0_15px_rgba(0,45,97,0.15)]"
                  }`}>
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