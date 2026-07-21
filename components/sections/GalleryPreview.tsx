"use client";

import Link from "next/link";
import Image from "next/image";

const GALLERY_PREVIEW_ITEMS = [
  {
    id: "1",
    title: "Investigasi Kasus Season II",
    season: "Season II — 2025",
    category: "Kompetisi",
    image: "/gallery/boc_gallery_1.jpg",
  },
  {
    id: "2",
    title: "Penyerahan Tropy Champion",
    season: "Season II — 2025",
    category: "Awarding",
    image: "/gallery/boc_gallery_2.jpg",
  },
  {
    id: "3",
    title: "Pencegahan & Geo-Tracking",
    season: "Season I — 2024",
    category: "TKP 1 & 2",
    image: "/gallery/boc_gallery_3.jpg",
  },
  {
    id: "4",
    title: "Antusiasme Peserta & Supporter",
    season: "Season II — 2025",
    category: "Dokumentasi",
    image: "/gallery/boc_gallery_4.jpg",
  },
];

export default function GalleryPreview() {
  return (
    <section id="gallery" className="relative w-full bg-[#FFF6E9] py-12 md:py-16 overflow-hidden">
      {/* Ambient Glows */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#700702]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#002D61]/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-[#002D61] leading-[1.15]">
              Dokumentasi Keseruan
            </h2>
            <p className="text-base sm:text-lg text-[#002D61]/60 mt-2 max-w-xl">
              Momen-momen terbaik dan perjuangan peserta di Battle of Champions musim sebelumnya.
            </p>
          </div>

          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2.5 px-6 py-3 bg-[#002D61] hover:bg-[#002147] text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 self-start md:self-auto"
          >
            Lihat Detail Galeri
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {GALLERY_PREVIEW_ITEMS.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden border border-[#002D61]/10 bg-white shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#002D61]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-xs text-white font-medium bg-[#700702] px-2.5 py-1 rounded-md">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#700702] tracking-wider uppercase block mb-1">
                    {item.season}
                  </span>
                  <h3 className="text-base font-bold text-[#002D61] group-hover:text-[#700702] transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-12 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[#700702] hover:text-[#002D61] transition-colors py-2 px-4 rounded-lg bg-[#700702]/5 border border-[#700702]/10 hover:bg-[#002D61]/5"
          >
            Jelajahi Arsip Foto Lengkap Season I & II &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
