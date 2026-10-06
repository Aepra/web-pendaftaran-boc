"use client";

import { useState } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

type TabType = "umum" | "babak" | "faq";
type StageKey = 1 | 2 | 3 | 4 | 5;

interface StageInfo {
  id: StageKey;
  roman: string;
  name: string;
  tag: string;
  themeColor: string;
  badgeBg: string;
  quota: string;
  survival: string;
  duration: string;
  officers: { examiners: string; mc: string };
  maxScore: string;
  summary: string;
  phases: { name: string; time: string; detail: string }[];
  scoringDetails: { label: string; points: string; type: "pos" | "neg" | "neutral" }[];
  rules: string[];
  penalties: string[];
}

const STAGES: Record<StageKey, StageInfo> = {
  1: {
    id: 1,
    roman: "Tahap I",
    name: "Geo-Tracking Clues",
    tag: "Pengetahuan Umum & Geografi",
    themeColor: "#002D61",
    badgeBg: "bg-[#002D61]/10 text-[#002D61]",
    quota: "25 Tim Awal",
    survival: "20 Tim Lolos ke Tahap II (5 Gugur)",
    duration: "40 Menit (10m Memorizing + 30m Pengerjaan)",
    officers: { examiners: "Alya, Irun, Rara", mc: "Vira" },
    maxScore: "450 Poin",
    summary:
      "Tim detektif menganalisis 8 titik rute pelarian pelaku pada peta Indonesia berdasarkan bukti, narasi investigasi, dan koordinat. Garis rute ditarik lurus menggunakan spidol merah dan penggaris, serta menjawab soal isian di setiap titik.",
    phases: [
      {
        name: "Fase Memorizing",
        time: "10 Menit",
        detail:
          "Setiap tim diberikan waktu 10 menit untuk membaca dan mengingat informasi awal. Berkas soal tetap dalam kondisi tersegel dan dilarang keras dibuka pada fase ini.",
      },
      {
        name: "Fase Pengerjaan",
        time: "30 Menit",
        detail:
          "Dimulai serentak setelah aba-aba panitia. Peserta membuka berkas, memahami panduan, menyelesaikan 8 titik rute (1 start, 6 transit, 1 finish), menggambar garis merah urut, dan mengisi lembar jawaban.",
      },
      {
        name: "Pengumpulan Berkas",
        time: "Tepat saat timer habis",
        detail:
          "Seluruh peserta wajib langsung berhenti, memasukkan berkas ke map, dan menyerahkan ke meja panitia. Timestamp penerimaan fisik dicatat sebagai dasar waktu tercepat.",
      },
    ],
    scoringDetails: [
      { label: "Ketepatan nama kota per titik (maks 8 titik)", points: "+20 poin / titik (maks 160)", type: "pos" },
      { label: "Ketepatan penandaan titik koordinat pada peta", points: "+20 poin / titik (maks 160)", type: "pos" },
      { label: "Jawaban nama kota salah ATAU titik salah", points: "-10 poin", type: "neg" },
      { label: "Jawaban nama kota DAN titik keduanya salah", points: "-20 poin", type: "neg" },
      { label: "Soal isian per titik (2 soal x 8 titik)", points: "+5 poin / soal", type: "pos" },
      { label: "Bonus Rute Sempurna (seluruh garis tepat, urut, tanpa jebakan)", points: "+50 poin bonus", type: "pos" },
    ],
    rules: [
      "Setiap tim beranggotakan 3 orang sebagai satu kesatuan tim detektif.",
      "Peserta wajib menulis identitas tim pada amplop dan lembar jawaban.",
      "Hanya diperbolehkan menggunakan alat tulis dari panitia: pensil, spidol merah, dan penggaris.",
      "Garis rute wajib ditarik lurus dengan penggaris dan spidol merah sesuai urutan kronologis titik 1 hingga 8.",
      "Waspadai titik jebakan (red herring) yang dirancang untuk mengecoh rute pelarian.",
      "Jika titik benar namun urutan garis terbalik, poin titik tetap dihitung tetapi bonus rute sempurna hangus.",
    ],
    penalties: [
      "Penalti Waktu: -100 Poin bagi tim yang tetap mengerjakan setelah timer habis atau terlambat mengumpulkan map berkas.",
      "Diskualifikasi langsung jika berdiskusi antar-tim atau menggunakan alat bantu dari luar.",
    ],
  },
  2: {
    id: 2,
    roman: "Tahap II",
    name: "Suspect Dossier",
    tag: "Logika & Penalaran Deduktif",
    themeColor: "#700702",
    badgeBg: "bg-[#700702]/10 text-[#700702]",
    quota: "20 Tim Lolos dari Tahap I",
    survival: "15 Tim Lolos ke Tahap III (5 Gugur)",
    duration: "30 Menit",
    officers: { examiners: "Irun, Aji, Rifat", mc: "Atika" },
    maxScore: "100 Poin",
    summary:
      "Peserta menerima Amplop Kriminologi tersegel yang berisi berkas tersangka kasus. Tim menggunakan metode deduksi logis untuk menyusun Matriks Alibi serta mengidentifikasi pelaku utama, kota pelarian, dan jam kejadian secara presisi.",
    phases: [
      {
        name: "Pemeriksaan Amplop",
        time: "Awal timer",
        detail:
          "Timer 30 menit dimulai saat panitia memberi aba-aba membuka Amplop Kriminologi. Tim wajib langsung memeriksa kelengkapan berkas dan melapor jika ada yang kurang.",
      },
      {
        name: "Analisis Deduksi & Pengisian Matriks",
        time: "30 Menit",
        detail:
          "Tim mengisi Matriks Alibi sebagai lembar kerja utama verifikasi fakta (klaim V/X) dan menyimpulkan tersangka utama dengan huruf kapital yang jelas.",
      },
      {
        name: "Penyusunan & Pengumpulan",
        time: "Sebelum timer habis",
        detail:
          "Saat memasukkan kembali berkas ke amplop, Lembar Jawaban wajib diletakkan pada urutan paling depan (paling atas). Timestamp fisik dicatat saat amplop diterima.",
      },
    ],
    scoringDetails: [
      { label: "Matriks Alibi (verifikasi baris klaim valid V/X)", points: "+2 poin / klaim (maks 32)", type: "pos" },
      { label: "Tebakan Identitas Pelaku (All-or-Nothing)", points: "+28 poin jika benar, 0 jika salah", type: "pos" },
      { label: "Kota Pelarian (All-or-Nothing)", points: "+20 poin jika benar, 0 jika salah", type: "pos" },
      { label: "Jam Kejadian (All-or-Nothing)", points: "+20 poin jika benar, 0 jika salah", type: "pos" },
    ],
    rules: [
      "Amplop Kriminologi dilarang dibuka sebelum instruksi resmi dari panitia.",
      "Tebakan identitas pelaku wajib ditulis nama lengkap sesuai berkas tersangka dengan HURUF KAPITAL yang jelas.",
      "Tulisan yang tidak terbaca atau ambigu dianggap tidak sah dan memperoleh 0 poin pada komponen tersebut.",
      "Semua hasil deduksi wajib tercatat resmi di Lembar Jawaban yang disediakan panitia.",
    ],
    penalties: [
      "Penalti Waktu: -100 Poin jika amplop masih berada di meja peserta saat timer 30 menit berakhir.",
      "Setelah amplop diserahkan, seluruh jawaban bersifat final dan tidak dapat diubah.",
    ],
  },
  3: {
    id: 3,
    roman: "Tahap III",
    name: "Code Cracker",
    tag: "Matematika & Pemecahan Kasus Digital",
    themeColor: "#002D61",
    badgeBg: "bg-[#002D61]/10 text-[#002D61]",
    quota: "15 Tim Lolos dari Tahap II",
    survival: "10 Tim Lolos ke Tahap IV (5 Gugur)",
    duration: "±25 Menit (3 Level + Final Resolution)",
    officers: { examiners: "Atika, Rara, Irun", mc: "Alya" },
    maxScore: "330 Poin",
    summary:
      "Investigasi bertema matematika berbasis platform digital. Tim mengakses sistem melalui satu perangkat resmi untuk memecahkan 3 level soal pilihan ganda. Akurasi jawaban membuka petunjuk kasus (clue) pada Investigation Board untuk memecahkan Final Case Resolution.",
    phases: [
      {
        name: "Case File Reading",
        time: "2 Menit",
        detail: "Membaca berkas kasus awal (Case File) sebelum operator memulai sistem serentak.",
      },
      {
        name: "Level 1 (5 Soal PG)",
        time: "5 Menit",
        detail: "Soal matematika dasar: Benar (+10), Salah (-2), Kosong (-1).",
      },
      {
        name: "Level 2 (5 Soal PG)",
        time: "7 Menit",
        detail: "Soal matematika tingkat menengah: Benar (+20), Salah (-4), Kosong (-2).",
      },
      {
        name: "Level 3 (5 Soal PG)",
        time: "8 Menit",
        detail: "Soal matematika analitis: Benar (+30), Salah (-6), Kosong (-3).",
      },
      {
        name: "Final Case Resolution",
        time: "3 Menit",
        detail: "Menyimpulkan jawaban akhir kasus berdasarkan petunjuk yang berhasil dikumpulkan.",
      },
    ],
    scoringDetails: [
      { label: "Level 1: Benar (+10) | Salah (-2) | Kosong (-1)", points: "Maks 50 poin", type: "pos" },
      { label: "Level 2: Benar (+20) | Salah (-4) | Kosong (-2)", points: "Maks 100 poin", type: "pos" },
      { label: "Level 3: Benar (+30) | Salah (-6) | Kosong (-3)", points: "Maks 150 poin", type: "pos" },
      { label: "Bonus Final Case Resolution (menebak kasus akhir dengan benar)", points: "+30 poin bonus", type: "pos" },
    ],
    rules: [
      "Setiap tim hanya menggunakan 1 akun resmi dan 1 perangkat yang telah ditentukan.",
      "Akses pengerjaan ditutup secara otomatis oleh sistem saat durasi level berakhir.",
      "Terdapat jeda antar-level yang dikendalikan operator untuk pembaruan leaderboard.",
      "Pemberian clue berdasarkan jumlah benar: 5 benar (Clue Lengkap), 4 benar (Clue Parsial), 3 benar (Clue Dasar), <3 (Tanpa Clue).",
      "Semua petunjuk tersimpan otomatis di fitur Investigation Board pada platform.",
    ],
    penalties: [
      "Pengurangan poin berlaku otomatis untuk setiap jawaban salah dan soal yang dilewati/kosong di tiap level.",
      "Dilarang me-refresh sistem secara sengaja yang berpotensi merusak sinkronisasi waktu pengerjaan.",
    ],
  },
  4: {
    id: 4,
    roman: "Tahap IV",
    name: "The Silent Witness",
    tag: "Bahasa Inggris & Komunikasi Taktis",
    themeColor: "#700702",
    badgeBg: "bg-[#700702]/10 text-[#700702]",
    quota: "10 Tim Lolos dari Tahap III",
    survival: "5 Tim Lolos ke Babak Final (5 Gugur)",
    duration: "±15 Menit per sesi (2 Gambar)",
    officers: { examiners: "Rifat, Irun, Alya", mc: "Atika" },
    maxScore: "Akumulasi Poin Tertinggi",
    summary:
      "Tantangan observasi dan komunikasi presisi. 10 tim dibagi ke dalam 2 sesi (@ 5 tim) dengan sistem karantina steril gawai. 1 anggota menjadi Witness yang mengamati gambar TKP, lalu mendeskripsikannya kepada 2 Detectives untuk melengkapi 15 kalimat rumpang berbahasa Inggris dari word bank.",
    phases: [
      {
        name: "Pengamatan Saksi (Witness)",
        time: "60 Detik / Gambar",
        detail:
          "Witness mengamati gambar TKP selama 60 detik. Dilarang keras mencatat, memotret, merekam, atau menggunakan alat bantu apapun.",
      },
      {
        name: "Penyampaian Informasi",
        time: "2 Menit",
        detail:
          "Witness mendeskripsikan gambar kepada Detectives (Bahasa Indonesia / Inggris). Detectives dilarang melihat gambar atau menggunakan gadget.",
      },
      {
        name: "Pengerjaan Soal (Detectives)",
        time: "5 Menit",
        detail:
          "Witness wajib berhenti bicara. Detectives melengkapi 15 kalimat rumpang berbahasa Inggris menggunakan word bank dan pensil.",
      },
    ],
    scoringDetails: [
      { label: "Setiap kalimat rumpang dijawab benar", points: "+4 poin", type: "pos" },
      { label: "Jawaban salah / tidak sesuai konteks kunci panitia", points: "-2 poin", type: "neg" },
      { label: "Kalimat yang tidak dijawab (kosong)", points: "-1 poin", type: "neg" },
    ],
    rules: [
      "Tim dibagi acak menjadi 2 sesi (@ 5 tim). Sesi yang belum bertanding menunggu di ruang karantina steril.",
      "Di ruang karantina dilarang menggunakan HP, alat komunikasi, atau menerima bocoran lomba.",
      "Peran Witness dan Detectives harus konsisten untuk kedua gambar yang dikerjakan.",
      "Setiap kata pada word bank hanya boleh digunakan 1 kali kecuali ditentukan lain.",
      "Waktu pengerjaan Detectives dicatat tepat menggunakan stopwatch pengawas meja sebagai tie-breaker.",
    ],
    penalties: [
      "Penggunaan kata yang melenceng dari konteks gambar resmi dianggap salah (-2 poin) meskipun ada di word bank.",
      "Pelanggaran aturan karantina akan dikenakan sanksi diskualifikasi langsung.",
    ],
  },
  5: {
    id: 5,
    roman: "Tahap V",
    name: "Matrix Game (Final)",
    tag: "Komprehensif & Rebutan Berkecepatan Tinggi",
    themeColor: "#002D61",
    badgeBg: "bg-amber-100 text-amber-900 border border-amber-300",
    quota: "5 Tim Finalis Terbaik",
    survival: "Penentuan Juara 1, 2, 3 & Champion BoC III",
    duration: "25 Soal (1 Menit per Soal)",
    officers: { examiners: "Irun, Rifat, Rara", mc: "Alya" },
    maxScore: "Sistem Rebutan Dinamis",
    summary:
      "Babak final spektakuler penentu juara! Layar menampilkan matriks berordo 5x5 berisi 25 nomor soal berbobot nilai 10 hingga 50 poin. Sistem adu cepat bel dengan lemparan soal, risiko minus nilai, serta Super Bonus Garis (Bingo) yang dapat langsung mengakhiri babak.",
    phases: [
      {
        name: "Pemilihan Soal & Display",
        time: "1 Menit / Soal",
        detail:
          "Soal ditampilkan pada layar matriks 5x5 berbobot 10-50 poin. Waktu berpikir dan menjawab adalah 60 detik per nomor.",
      },
      {
        name: "Perebutan Bel & Validasi Juri",
        time: "Maks 5 Detik setelah dipersilakan",
        detail:
          "Tim tercepat memencet bel harus menunggu dipersilakan juri sebelum berbicara. Menjawab tanpa dipersilakan atau diam >5 detik dinyatakan salah.",
      },
      {
        name: "Siklus Lemparan Rebutan",
        time: "Sisa waktu soal",
        detail:
          "Jika penjawab pertama salah, soal dilempar 1 kali secara rebutan ke 4 tim lainnya dengan ketentuan penilaian khusus.",
      },
    ],
    scoringDetails: [
      { label: "Penjawab Pertama - Benar", points: "+ Nilai Bobot Penuh (+10 s.d +50)", type: "pos" },
      { label: "Penjawab Pertama - Salah", points: "- Setengah Bobot Nilai (-5 s.d -25)", type: "neg" },
      { label: "Lemparan Rebutan - Benar", points: "+ Setengah Bobot Nilai (+5 s.d +25)", type: "pos" },
      { label: "Lemparan Rebutan - Salah", points: "- Nilai Bobot Penuh (-10 s.d -50)", type: "neg" },
      { label: "Super Bonus Formasi Garis (Bingo Horizontal / Vertikal / Diagonal)", points: "+500 poin (Babak Langsung Berakhir)", type: "pos" },
      { label: "Penalti Tim Pasif (tidak pernah menjawab sama sekali)", points: "-1000 poin penalti", type: "neg" },
    ],
    rules: [
      "Jumlah soal 25 nomor berbentuk matriks 5x5.",
      "Tim yang menjawab benar berhak memilih nomor entri matriks selanjutnya.",
      "Jika tidak ada tim yang benar, entri berikutnya dipilih oleh tim dengan akumulasi nilai terendah saat itu.",
      "Jika dalam 1 menit tidak ada tim yang memencet bel, soal dinyatakan hangus.",
      "Jika formasi garis (Bingo) tidak tercapai, babak selesai setelah seluruh 25 soal habis dibahas.",
      "Apabila terdapat nilai akhir yang sama pada perebutan gelar juara, akan diadakan babak play-off.",
    ],
    penalties: [
      "Menjawab sebelum dipersilakan juri langsung dianggap SALAH dan dikenakan penalti poin.",
      "Memencet bel tetapi tidak menjawab hingga 5 detik dianggap SALAH.",
      "Tim pasif yang tidak berpartisipasi menjawab dikenakan penalti fatal -1000 poin.",
    ],
  },
};

const GENERAL_RULES = [
  {
    num: "01",
    title: "Kehadiran Tepat Waktu",
    desc: "Peserta wajib berada di lokasi perlombaan paling lambat 15 menit sebelum lomba dimulai. Keterlambatan dapat mengakibatkan kehilangan hak mengikuti briefing dan penyesuaian waktu.",
    highlight: "15 Menit Sebelum Lomba",
    type: "time",
  },
  {
    num: "02",
    title: "Larangan Kerja Sama & Bantuan Luar",
    desc: "Peserta tidak diperkenankan berdiskusi dengan tim lain atau menerima bantuan dari pihak luar dalam bentuk apapun (guru pembina, suporter, atau media luar).",
    highlight: "Diskualifikasi Mutlak",
    type: "ban",
  },
  {
    num: "03",
    title: "Larangan Alat Bantu Hitung",
    desc: "Peserta dilarang keras menggunakan alat bantu hitung dalam bentuk apapun (kalkulator fisik, smartwatch berfitur kalkulator, ponsel pintar, tabel matematika) selama perlombaan berlangsung.",
    highlight: "No Calculator / Gadget",
    type: "ban",
  },
  {
    num: "04",
    title: "Standarisasi Alat Tulis & Berkas Resmi",
    desc: "Peserta hanya diperbolehkan menggunakan lembar soal, lembar jawaban, kertas cakaran, dan alat tulis yang telah disediakan atau ditentukan resmi oleh panitia pelaksana.",
    highlight: "Logistik Resmi Panitia",
    type: "equip",
  },
  {
    num: "05",
    title: "Protokol Area Perlombaan",
    desc: "Peserta tidak diperkenankan meninggalkan area perlombaan atau ruang karantina tanpa izin dan pendampingan resmi dari panitia pengawas.",
    highlight: "Izin & Pengawalan",
    type: "area",
  },
  {
    num: "06",
    title: "Sanksi Pelanggaran Integritas",
    desc: "Peserta atau tim yang terbukti melakukan kecurangan, melanggar ketentuan tata tertib, atau mengabaikan instruksi panitia akan langsung didiskualifikasi dari seluruh rangkaian acara.",
    highlight: "Diskualifikasi Tim",
    type: "sanction",
  },
  {
    num: "07",
    title: "Otoritas Keputusan Panitia",
    desc: "Keputusan dewan juri dan panitia pelaksana bersifat mutlak, final, mengikat, dan tidak dapat diganggu gugat oleh pihak manapun.",
    highlight: "Keputusan Mutlak & Final",
    type: "authority",
  },
];

const FAQS = [
  {
    q: "Apakah diperbolehkan membawa kalkulator atau kamus pribadi?",
    a: "Tidak. Sesuai Aturan Umum Poin 3, alat bantu hitung dalam bentuk apapun dilarang. Untuk Babak The Silent Witness, panitia telah menyediakan word bank resmi pada lembar soal, sehingga kamus pribadi tidak diperkenankan.",
  },
  {
    q: "Bagaimana jika ada dua tim yang memiliki total skor yang sama persis?",
    a: "Setiap babak memiliki kriteria tie-breaker resmi: pada Tahap I & II dilihat dari waktu pengumpulan fisik tercepat via timestamp panitia; pada Tahap III dilihat dari total jawaban benar dan waktu di platform; pada Tahap IV dilihat dari stopwatch pengawas meja. Jika masih tetap sama persis pada batas kelolosan, panitia akan mengadakan babak play-off.",
  },
  {
    q: "Mengapa ada penalti waktu -100 poin pada Tahap I dan Tahap II?",
    a: "Untuk menjamin keadilan dan disiplin waktu. Saat timer 30 menit berakhir, seluruh aktivitas pengerjaan wajib berhenti seketika. Berkas yang masih dikerjakan atau terlambat dikumpulkan ke meja panitia otomatis dikenakan penalti -100 poin.",
  },
  {
    q: "Apakah pembina atau pendamping boleh berada di ruang lomba?",
    a: "Tidak. Selama sesi kompetisi dan masa karantina, area pertandingan bersifat steril dari pihak luar. Pembina dan suporter dipersilakan menunggu di area tribun/ruang yang telah disediakan panitia.",
  },
];

export default function TatibPage() {
  const [activeTab, setActiveTab] = useState<TabType>("umum");
  const [selectedStage, setSelectedStage] = useState<StageKey>(1);
  const [copiedLink, setCopiedLink] = useState(false);

  const stage = STAGES[selectedStage];

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans text-[#002D61] selection:bg-[#700702]/15 selection:text-[#700702] antialiased pt-20">
      {/* Background Ornament */}
      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #002D61 0, #002D61 1px, transparent 0, transparent 50%)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Breadcrumb & Navigation Back */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#002D61]/70 hover:text-[#700702] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Kembali ke Beranda
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[#002D61]/15 bg-white text-[#002D61] hover:border-[#700702] hover:text-[#700702] transition-all shadow-sm"
              title="Salin tautan halaman ini"
            >
              {copiedLink ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Tersalin!
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  Bagikan
                </>
              )}
            </button>

            <a
              href="/KONSEP%20GAMES%20BOC%202026%20(1).pdf"
              download="KONSEP_GAMES_BOC_2026.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-extrabold rounded-lg bg-[#700702] text-white hover:bg-[#8a0903] transition-all shadow-sm"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Unduh PDF Resmi
            </a>
          </div>
        </div>

        {/* Hero Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002D61] via-[#00224b] to-[#120303] text-white p-6 sm:p-10 shadow-xl mb-10 border border-[#002D61]/20">
          <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-[#700702]/30 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-64 h-64 rounded-full bg-[#002D61]/40 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-amber-300 mb-4">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Buku Panduan & Regulasi Resmi BoC 2026
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-3">
              Tata Tertib & Mekanisme Lomba
            </h1>

            <p className="text-sm sm:text-base text-white/80 leading-relaxed mb-6 font-medium">
              Panduan lengkap aturan umum kedisiplinan, etika investigasi detektif, sistem penilaian bertingkat, serta mekanisme teknis 5 babak perlombaan <span className="text-amber-300 font-bold">Battle of Champions Season III</span>.
            </p>

            {/* Quick Stat Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 font-semibold text-[11px]">Format Tim</p>
                <p className="text-white font-extrabold text-sm mt-0.5">3 Orang / Tim</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 font-semibold text-[11px]">Total Babak</p>
                <p className="text-white font-extrabold text-sm mt-0.5">5 Tahap Investigasi</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 font-semibold text-[11px]">Kuota Awal</p>
                <p className="text-white font-extrabold text-sm mt-0.5">25 Tim Terbaik</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <p className="text-white/60 font-semibold text-[11px]">Sistem Sanksi</p>
                <p className="text-amber-300 font-extrabold text-sm mt-0.5">Diskualifikasi Langsung</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#002D61]/15 mb-8 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("umum")}
            className={`flex items-center gap-2 px-6 py-3.5 font-extrabold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === "umum"
                ? "border-[#700702] text-[#700702]"
                : "border-transparent text-[#002D61]/60 hover:text-[#002D61]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Tata Tertib Umum (7 Aturan Pokok)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("babak")}
            className={`flex items-center gap-2 px-6 py-3.5 font-extrabold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === "babak"
                ? "border-[#700702] text-[#700702]"
                : "border-transparent text-[#002D61]/60 hover:text-[#002D61]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Mekanisme & Penilaian 5 Babak
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("faq")}
            className={`flex items-center gap-2 px-6 py-3.5 font-extrabold text-sm border-b-2 transition-all whitespace-nowrap ${
              activeTab === "faq"
                ? "border-[#700702] text-[#700702]"
                : "border-transparent text-[#002D61]/60 hover:text-[#002D61]"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            FAQ & Tanya Jawab Regulasi
          </button>
        </div>

        {/* TAB 1: TATA TERTIB UMUM */}
        {activeTab === "umum" && (
          <div className="space-y-10 animate-fadeIn">
            {/* 7 Aturan Pokok Grid */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-[#002D61]">Aturan Umum Kompetisi</h2>
                  <p className="text-sm text-[#002D61]/70 font-medium">
                    Ketentuan wajib yang mengikat seluruh peserta, guru pembina, dan ofisial tim.
                  </p>
                </div>
                <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#700702]/10 text-[#700702]">
                  Wajib Dipatuhi
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {GENERAL_RULES.map((rule) => (
                  <div
                    key={rule.num}
                    className="p-5 rounded-2xl bg-white border border-[#002D61]/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#002D61]/5 border border-[#002D61]/10 text-[#700702] font-black flex items-center justify-center text-sm shrink-0 group-hover:bg-[#700702] group-hover:text-white transition-colors">
                        {rule.num}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-extrabold text-[#002D61] text-base">{rule.title}</h3>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#002D61]/5 text-[#002D61]/70">
                            {rule.highlight}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#002D61]/75 leading-relaxed font-normal">
                          {rule.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Do's & Don'ts Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <h3 className="font-extrabold text-emerald-950 text-lg">Yang Diperbolehkan (Do&apos;s)</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-emerald-900">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Berdiskusi di dalam tim sendiri dengan <strong>suara rendah</strong> agar strategi tidak terdengar tim lain.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Menggunakan alat tulis yang disediakan panitia (pensil, spidol merah, penggaris).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Membawa kartu pelajar resmi dan tanda pengenal peserta ke lokasi lomba.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>Mengajukan pertanyaan teknis kepada panitia meja atau MC saat sesi tanya jawab/briefing.</span>
                  </li>
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-red-50/60 border border-red-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-full bg-[#700702] text-white flex items-center justify-center font-bold">
                    ✕
                  </div>
                  <h3 className="font-extrabold text-red-950 text-lg">Dilarang Keras (Don&apos;ts)</h3>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-red-900">
                  <li className="flex items-start gap-2">
                    <span className="text-[#700702] font-bold">•</span>
                    <span>Membuka segel berkas soal atau amplop sebelum aba-aba resmi dari panitia/MC.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#700702] font-bold">•</span>
                    <span>Membawa atau menggunakan ponsel/gadget/kalkulator selama lomba & ruang karantina.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#700702] font-bold">•</span>
                    <span>Berkomunikasi, bertukar informasi, atau bekerja sama dengan tim lain maupun pihak luar.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[#700702] font-bold">•</span>
                    <span>Meninggalkan ruang kompetisi tanpa izin dan pendampingan resmi panitia.</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Banner Dokumen Fisik */}
            <div className="p-6 rounded-2xl bg-white border border-[#002D61]/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#700702]/10 text-[#700702] flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-extrabold text-[#002D61] text-base">Arsip Dokumen PDF Resmi</h4>
                  <p className="text-xs text-[#002D61]/65">
                    File: <code className="font-bold">KONSEP GAMES BOC 2026 (1).pdf</code> — Disahkan oleh Youthverse Indonesia & Panitia BoC III.
                  </p>
                </div>
              </div>
              <a
                href="/KONSEP%20GAMES%20BOC%202026%20(1).pdf"
                download="KONSEP_GAMES_BOC_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#002D61] text-white font-extrabold text-xs hover:bg-[#00224b] transition-all shadow-sm"
              >
                Unduh Lembar Resmi (.pdf)
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: MEKANISME 5 BABAK */}
        {activeTab === "babak" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Visual Elimination Pipeline */}
            <div className="p-6 rounded-2xl bg-white border border-[#002D61]/10 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-[#700702] mb-2">
                Alur Eliminasi & Skema Bertingkat
              </h3>
              <p className="text-sm font-bold text-[#002D61] mb-6">
                Perjalanan dari 25 Tim Detektif menuju Gelar Juara Battle of Champions Season III:
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { stage: "Tahap I", name: "Geo-Tracking", teams: "25 Tim", pass: "Lolos 20 Tim", active: selectedStage === 1, id: 1 as StageKey },
                  { stage: "Tahap II", name: "Suspect Dossier", teams: "20 Tim", pass: "Lolos 15 Tim", active: selectedStage === 2, id: 2 as StageKey },
                  { stage: "Tahap III", name: "Code Cracker", teams: "15 Tim", pass: "Lolos 10 Tim", active: selectedStage === 3, id: 3 as StageKey },
                  { stage: "Tahap IV", name: "Silent Witness", teams: "10 Tim", pass: "Lolos 5 Tim", active: selectedStage === 4, id: 4 as StageKey },
                  { stage: "Tahap V", name: "Matrix Game", teams: "5 Tim", pass: "🏆 Champion", active: selectedStage === 5, id: 5 as StageKey },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedStage(item.id)}
                    className={`p-3.5 rounded-xl text-left border transition-all ${
                      item.active
                        ? "bg-[#002D61] text-white border-[#002D61] shadow-md scale-102"
                        : "bg-[#FFF6E9]/50 text-[#002D61] border-[#002D61]/15 hover:border-[#002D61]/40"
                    }`}
                  >
                    <p className={`text-[10px] font-extrabold uppercase ${item.active ? "text-amber-300" : "text-[#700702]"}`}>
                      {item.stage}
                    </p>
                    <p className="text-xs font-black truncate mt-0.5">{item.name}</p>
                    <div className="mt-2 pt-2 border-t border-current/15 flex items-center justify-between text-[11px]">
                      <span className="opacity-70">{item.teams}</span>
                      <span className="font-extrabold">{item.pass}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Stage Detail Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#002D61]/10 shadow-md">
              {/* Stage Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#002D61]/10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="px-3 py-0.5 rounded-full text-xs font-black bg-[#700702] text-white">
                      {stage.roman}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#002D61]/10 text-[#002D61]">
                      {stage.tag}
                    </span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#002D61]">
                    {stage.name}
                  </h2>
                </div>

                {/* Score & Duration Badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-extrabold">
                    <span className="text-amber-700 block text-[10px]">Skor Maksimal</span>
                    {stage.maxScore}
                  </div>
                  <div className="px-3.5 py-2 rounded-xl bg-[#002D61]/5 border border-[#002D61]/15 text-[#002D61] text-xs font-extrabold">
                    <span className="text-[#002D61]/60 block text-[10px]">Durasi Waktu</span>
                    {stage.duration}
                  </div>
                </div>
              </div>

              {/* Stage Summary */}
              <div className="my-6 p-4 rounded-xl bg-[#FFF6E9] border border-[#002D61]/10">
                <p className="text-sm text-[#002D61] leading-relaxed font-medium">
                  {stage.summary}
                </p>
                <div className="mt-3 pt-3 border-t border-[#002D61]/10 flex flex-wrap gap-4 text-xs font-bold text-[#002D61]/70">
                  <span>👥 Kuota: <strong className="text-[#002D61]">{stage.quota}</strong></span>
                  <span>⚡ Syarat: <strong className="text-[#700702]">{stage.survival}</strong></span>
                  <span>📋 Pemeriksa: <strong className="text-[#002D61]">{stage.officers.examiners}</strong> (MC: {stage.officers.mc})</span>
                </div>
              </div>

              {/* 3 Column Grid: Phases, Scoring, Rules */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Column 1: Alur & Fase Pelaksanaan */}
                <div className="space-y-4">
                  <h4 className="font-black text-sm uppercase tracking-wider text-[#002D61] flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#700702]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Fase & Alur Waktu
                  </h4>
                  <div className="space-y-3">
                    {stage.phases.map((ph, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#002D61]/10 shadow-xs">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-xs font-extrabold text-[#002D61]">{ph.name}</span>
                          <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#700702]/10 text-[#700702]">
                            {ph.time}
                          </span>
                        </div>
                        <p className="text-xs text-[#002D61]/75 leading-relaxed">{ph.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Sistem Penilaian & Poin */}
                <div className="space-y-4">
                  <h4 className="font-black text-sm uppercase tracking-wider text-[#002D61] flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Sistem Penilaian
                  </h4>
                  <div className="space-y-2">
                    {stage.scoringDetails.map((sc, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                          sc.type === "pos"
                            ? "bg-emerald-50/50 border-emerald-200 text-emerald-950"
                            : "bg-red-50/50 border-red-200 text-red-950"
                        }`}
                      >
                        <span className="font-semibold leading-tight">{sc.label}</span>
                        <span className={`font-black shrink-0 ${sc.type === "pos" ? "text-emerald-700" : "text-[#700702]"}`}>
                          {sc.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Ketentuan Khusus & Penalti */}
                <div className="space-y-4">
                  <h4 className="font-black text-sm uppercase tracking-wider text-[#002D61] flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Aturan Khusus & Penalti
                  </h4>

                  <div className="space-y-2 text-xs">
                    {stage.rules.map((rule, idx) => (
                      <div key={idx} className="p-2.5 rounded-lg bg-gray-50 border border-gray-200 text-[#002D61]/80 flex items-start gap-2">
                        <span className="text-[#002D61] font-bold">›</span>
                        <span>{rule}</span>
                      </div>
                    ))}

                    {/* Sanksi & Penalti Spesifik */}
                    <div className="mt-3 p-3 rounded-xl bg-red-100/70 border border-red-300 text-red-900">
                      <p className="font-black text-[11px] uppercase tracking-wider text-[#700702] mb-1">
                        ⚠️ Peringatan Penalti:
                      </p>
                      {stage.penalties.map((pen, idx) => (
                        <p key={idx} className="font-bold text-xs mt-1">
                          • {pen}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FAQ & REGULASI */}
        {activeTab === "faq" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto mb-8">
              <h2 className="text-2xl font-black text-[#002D61]">Pertanyaan Seputar Tata Tertib</h2>
              <p className="text-sm text-[#002D61]/70 font-medium mt-1">
                Klarifikasi teknis aturan perlombaan, kedisiplinan waktu, dan prosedur banding.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-[#002D61]/10 shadow-sm">
                  <h3 className="font-extrabold text-[#002D61] text-base mb-2 flex items-start gap-2">
                    <span className="text-[#700702] font-black">Q:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-[#002D61]/75 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Hubungi Panitia jika ragu */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-[#002D61]/10 to-[#700702]/10 border border-[#002D61]/15 text-center max-w-2xl mx-auto mt-10">
              <h3 className="font-black text-[#002D61] text-lg mb-2">Masih Memiliki Pertanyaan Teknis?</h3>
              <p className="text-xs sm:text-sm text-[#002D61]/70 mb-5">
                Silakan hubungi narahubung panitia melalui WhatsApp resmi atau sampaikan saat sesi Technical Meeting.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="https://wa.me/6289654850260"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#002D61] text-white font-extrabold text-xs hover:bg-[#00224b] transition-all shadow-sm"
                >
                  Hubungi Admin WhatsApp
                </a>
                <Link
                  href="/register"
                  className="px-5 py-2.5 rounded-xl bg-[#700702] text-white font-extrabold text-xs hover:bg-[#8a0903] transition-all shadow-sm"
                >
                  Daftarkan Tim Sekarang
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
