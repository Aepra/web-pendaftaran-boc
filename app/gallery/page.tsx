"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface GalleryItem {
  id: string;
  title: string;
  season: string;
  category: string;
  desc: string;
  image: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "1",
    title: "Investigasi Kasus Season II",
    season: "Season II (2025)",
    category: "Kompetisi",
    desc: "Peserta memecahkan soal matematika dan petunjuk kriminologi secara bertahap.",
    image: "/gallery/boc_gallery_1.jpg",
  },
  {
    id: "2",
    title: "Penyerahan Trophy Champion",
    season: "Season II (2025)",
    category: "Awarding Night",
    desc: "Momen penganugerahan piala dan sertifikat kepada pemenang Battle of Champions II.",
    image: "/gallery/boc_gallery_2.jpg",
  },
  {
    id: "3",
    title: "Pencegahan & Geo-Tracking",
    season: "Season I (2024)",
    category: "Season I (2024)",
    desc: "Babak geo-tracking koordinat lokasi dan peta peta geografi.",
    image: "/gallery/boc_gallery_3.jpg",
  },
  {
    id: "4",
    title: "Antusiasme Peserta & Supporter",
    season: "Season II (2025)",
    category: "Dokumentasi",
    desc: "Suasana ruang kompetisi dan antusiasme supporter sekolah peserta.",
    image: "/gallery/boc_gallery_4.jpg",
  },
  {
    id: "5",
    title: "Sesi Pembukaan & Briefing Juri",
    season: "Season II (2025)",
    category: "Dokumentasi",
    desc: "Sesi penjelasan aturan main dan pembukaan resmi oleh panitia Youthverse.",
    image: "/background.jpeg",
  },
  {
    id: "6",
    title: "Babak Final Matrix Game",
    season: "Season I (2024)",
    category: "Season I (2024)",
    desc: "Persaingan sengit perebutan poin di papan matriks 5x5 babak final.",
    image: "/gallery/boc_gallery_1.jpg",
  },
];

const CATEGORIES = ["Semua", "Season II (2025)", "Season I (2024)", "Awarding Night"];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<string>("Semua");
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  const filteredItems = GALLERY_ITEMS.filter((item) => {
    if (activeCategory === "Semua") return true;
    if (activeCategory === "Awarding Night") return item.category === "Awarding Night";
    return item.season === activeCategory;
  });

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans text-[#002D61] antialiased pt-20">
      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="relative h-80 sm:h-96 md:h-[450px] w-full bg-black">
              <Image
                src={selectedImage.image}
                alt={selectedImage.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-6 bg-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-[#700702] uppercase tracking-wider bg-[#700702]/10 px-3 py-1 rounded-full border border-[#700702]/15">
                  {selectedImage.season}
                </span>
                <span className="text-xs font-semibold text-[#002D61]/60">
                  {selectedImage.category}
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#002D61] mb-2">{selectedImage.title}</h3>
              <p className="text-sm text-[#002D61]/70 leading-relaxed">{selectedImage.desc}</p>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        {/* Header Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-[#002D61]/60 mb-6">
          <Link href="/" className="hover:text-[#700702] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#002D61] font-bold">Galeri Dokumentasi</span>
        </div>

        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#002D61] leading-[1.15] mb-4">
            Galeri Dokumentasi Lomba
          </h1>
          <p className="text-base sm:text-lg text-[#002D61]/70">
            Kumpulan foto perjalanan, kompetisi, dan momen seputar Battle of Champions Season I & II.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeCategory === cat
                  ? "bg-[#002D61] text-white shadow-md"
                  : "bg-white/80 text-[#002D61]/70 hover:bg-white hover:text-[#002D61] border border-[#002D61]/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedImage(item)}
              className="group cursor-pointer rounded-2xl overflow-hidden border border-[#002D61]/10 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-xs font-bold text-white bg-[#700702] px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Lihat Foto
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#700702] tracking-wider uppercase">
                      {item.season}
                    </span>
                    <span className="text-[11px] font-semibold text-[#002D61]/50 bg-[#002D61]/5 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#002D61] group-hover:text-[#700702] transition-colors mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#002D61]/60 line-clamp-2">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back Link */}
        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[#002D61]/20 text-[#002D61] font-bold text-sm hover:bg-[#002D61] hover:text-white transition-all shadow-sm"
          >
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </main>
    </div>
  );
}
