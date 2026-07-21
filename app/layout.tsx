import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";
import Navbar from "@/components/layout/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Battle of Champions Season III — SmartSolve: Unlock Your Mind, Ignite The Future",
  description: "Kompetisi akademik untuk siswa SMA/SMK/MA Sederajat se-Sulawesi Selatan. Matematika, logika, pemecahan masalah, dan kerja sama tim dalam atmosfer investigasi yang seru.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FFF6E9]">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}