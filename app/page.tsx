import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import GameConcept from "@/components/sections/GameConcept";
import Timeline from "@/components/sections/Timeline";
import GalleryPreview from "@/components/sections/GalleryPreview";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans text-[#002D61] selection:bg-[#700702]/15 selection:text-[#700702] antialiased">
      <main className="flex flex-col items-center w-full">
        <Hero />
        <About />
        <GameConcept />
        <Timeline />
        {/* <GalleryPreview /> */}
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

