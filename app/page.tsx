import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import GameConcept from "@/components/sections/GameConcept";
import Timeline from "@/components/sections/Timeline";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans text-[#002D61] selection:bg-[#700702]/15 selection:text-[#700702] antialiased">
      <main className="flex flex-col items-center w-full">
        <Hero />
        <About />
        <GameConcept />
        <Timeline />
        <FAQ />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#002D61]/10 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <p className="text-sm font-extrabold text-[#002D61] tracking-wide">
                Battle of Champions Season III &mdash; 2026
              </p>
              <p className="text-xs text-[#002D61]/50 mt-1">
                Youthverse Indonesia &copy; {new Date().getFullYear()} — Seluruh hak cipta dilindungi.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a href="/register" className="text-xs text-[#002D61]/50 hover:text-[#700702] transition-colors uppercase tracking-wider font-semibold">Daftar</a>
              <a href="#about" className="text-xs text-[#002D61]/50 hover:text-[#700702] transition-colors uppercase tracking-wider font-semibold">Tentang</a>
              <a href="#game-concept" className="text-xs text-[#002D61]/50 hover:text-[#700702] transition-colors uppercase tracking-wider font-semibold">Konsep</a>
              <a href="#timeline" className="text-xs text-[#002D61]/50 hover:text-[#700702] transition-colors uppercase tracking-wider font-semibold">Timeline</a>
              <a href="#faq" className="text-xs text-[#002D61]/50 hover:text-[#700702] transition-colors uppercase tracking-wider font-semibold">FAQ</a>
              <a href="#contact" className="text-xs text-[#002D61]/50 hover:text-[#700702] transition-colors uppercase tracking-wider font-semibold">Kontak</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

