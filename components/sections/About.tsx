export default function About() {
  return (
    <section id="about" className="relative w-full bg-white/75 backdrop-blur-[2px] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Section label */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#002D61] mb-8 leading-[1.15]">
            Tentang Kompetisi
          </h2>

          <p className="text-base sm:text-lg text-[#002D61]/70 leading-relaxed mb-6">
            Battle of Champions adalah kompetisi akademik tahunan untuk siswa
            SMA se-Sulawesi Selatan yang menggabungkan matematika, logika,
            pengetahuan umum, dan pemecahan masalah dalam atmosfer permainan
            investigasi yang seru dan menantang.
          </p>

          <p className="text-base sm:text-lg text-[#002D61]/70 leading-relaxed mb-10">
            Memasuki Season III, BoC 2026 mengusung tema{" "}
            <span className="text-[#700702] font-semibold">
              &ldquo;ClashMind: Think Faster, Solve Smarter&rdquo;
            </span>{" "}
            — mengajak peserta mengasah kemampuan berpikir kritis, kreativitas,
            dan kerja sama tim melalui rangkaian tantangan akademik yang
            dikemas sebagai misi investigasi seru.
          </p>

          {/* Tujuan */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#002D61] mt-14 mb-6">
            Tujuan Kegiatan
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                ),
                title: "Kemampuan Akademik",
                desc: "Meningkatkan kemampuan akademik siswa dalam bidang matematika, logika, dan pengetahuan umum.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Problem Solving",
                desc: "Melatih kemampuan pemecahan masalah kompleks melalui studi kasus dan tantangan berbasis analisis.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ),
                title: "Teamwork & Kepemimpinan",
                desc: "Membangun kemampuan kerja sama tim, komunikasi efektif, dan jiwa kepemimpinan antar peserta.",
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                  </svg>
                ),
                title: "Kreativitas",
                desc: "Mendorong inovasi dan kreativitas siswa dalam menemukan solusi terhadap tantangan yang diberikan.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-5 rounded-xl border border-[#002D61]/10 bg-[#FFF6E9] hover:border-[#002D61]/30 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg bg-[#700702]/10 text-[#700702] group-hover:bg-[#700702]/15 transition-all">
                    {item.icon}
                  </div>
                  <h4 className="text-sm font-bold text-[#002D61]">{item.title}</h4>
                </div>
                <p className="text-xs text-[#002D61]/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Target Peserta */}
          <div className="mt-14 p-6 rounded-2xl border border-[#002D61]/15 bg-[#002D61]/5 text-center">
            <h3 className="text-lg font-bold text-[#002D61] mb-3">Peserta</h3>
            <p className="text-base sm:text-lg text-[#002D61] font-semibold">
              Siswa SMA/SMK/MA Sederajat se-Sulawesi Selatan
            </p>
            <p className="text-sm text-[#002D61]/60 mt-2">
              Tim (maks. 3 anggota termasuk ketua)
            </p>
          </div>

          {/* Skills Pillars */}
          <div className="mt-12">
            <h3 className="text-lg font-bold text-[#002D61] mb-5">
              Kemampuan yang Diasah
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                "Matematika",
                "Logika",
                "Pengetahuan Umum",
                "Problem Solving",
                "Critical Thinking",
                "Teamwork",
                "Bahasa Inggris",
              ].map((skill) => (
                <div
                  key={skill}
                  className="p-3 rounded-xl border border-[#002D61]/10 bg-white text-sm font-semibold text-[#002D61]/70 hover:text-[#700702] hover:border-[#700702]/25 hover:bg-[#700702]/3 transition-colors cursor-default"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}