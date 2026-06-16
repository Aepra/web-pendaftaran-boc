import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import GameConcept from "@/components/sections/GameConcept";
import Timeline from "@/components/sections/Timeline";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-amber-500/20 selection:text-amber-300 antialiased">
      <main className="flex flex-col items-center w-full">
        <Hero />
        <About />
        <GameConcept />
        <Timeline />
        <FAQ />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-800/60 bg-zinc-900/30">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
            <div>
              <p className="text-sm font-bold text-white tracking-wide">
                Battle of Champions Season III &mdash; 2026
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                &copy; {new Date().getFullYear()} — Seluruh hak cipta dilindungi.
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a href="/register" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors uppercase tracking-wider">Daftar</a>
              <a href="#about" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors uppercase tracking-wider">Tentang</a>
              <a href="#game-concept" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors uppercase tracking-wider">Konsep</a>
              <a href="#timeline" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors uppercase tracking-wider">Timeline</a>
              <a href="#faq" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors uppercase tracking-wider">FAQ</a>
              <a href="#contact" className="text-xs text-zinc-500 hover:text-amber-400 transition-colors uppercase tracking-wider">Kontak</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
