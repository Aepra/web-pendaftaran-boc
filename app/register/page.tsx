"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useRegistration } from "@/contexts/registration-context";
import { useEffect, useState, useRef } from "react";
import type { RegistrationFormData } from "@/types";
import { registerParticipant, uploadSingleFile } from "@/lib/api/boc-api";
import { formatRupiah } from "@/lib/utils";

const BIAYA_PENDAFTARAN = 100000;
const DANA_NUMBER = "089654850260";
const DANA_ACCOUNT_NAME = "Fitriani Nurhasanah";

// ======================
// Helper: Image Compression
// ======================
const compressImage = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 500; // Diperkecil dari 800 → lebih ringan di jaringan
        let { width, height } = img;
        if (width > height) {
          if (width > MAX) { height *= MAX / width; width = MAX; }
        } else {
          if (height > MAX) { width *= MAX / height; height = MAX; }
        }
        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.5)); // Quality 0.7 → 0.5
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });

// ======================
// Sub-komponen: Label wajib
// ======================
function Req() {
  return <span className="text-[#700702]"> *</span>;
}

// ======================
// Sub-komponen: Badge Upload
// ======================
function UploadBadge({ value }: { value: string }) {
  if (!value) return null;
  return <span className="text-xs font-bold text-emerald-600 mt-1.5 block">✓ Tersimpan</span>;
}

// ======================
// Main Page
// ======================
const EMPTY_FORM: RegistrationFormData = {
  nama_tim: "",
  institution: "",
  leaderName: "",
  email: "",
  whatsapp: "",
  nama_anggota_1: "",
  whatsapp_anggota_1: "",
  nama_anggota_2: "",
  whatsapp_anggota_2: "",
  notes: "",
  foto_ketua: "",
  kartu_pelajar_ketua: "",
  bukti_follow_boc_ketua: "",
  bukti_follow_yv_ketua: "",
  foto_anggota_1: "",
  kartu_pelajar_anggota_1: "",
  bukti_follow_boc_anggota_1: "",
  bukti_follow_yv_anggota_1: "",
  foto_anggota_2: "",
  kartu_pelajar_anggota_2: "",
  bukti_follow_boc_anggota_2: "",
  bukti_follow_yv_anggota_2: "",
  bukti_bayar: "",
  link_twibbon_ketua: "",
  link_twibbon_anggota_1: "",
  link_twibbon_anggota_2: "",
};

export default function RegisterPage() {
  const { isAuthenticated, user } = useAuth();
  const { setData } = useRegistration();
  const router = useRouter();

  const [initialized, setInitialized] = useState(false);
  const [d, sd] = useState<RegistrationFormData>(EMPTY_FORM);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedDana, setCopiedDana] = useState(false);
  const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});
  const isSubmitting = useRef(false);

  // Redirect jika belum login
  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  // Isi default dari sesi user
  useEffect(() => {
    if (!initialized && user) {
      sd((prev) => ({
        ...prev,
        leaderName: user.name || prev.leaderName,
        email: user.email || prev.email,
      }));
      setInitialized(true);
    }
  }, [user, initialized]);

  if (!isAuthenticated) return null;

  // ======================
  // Handlers
  // ======================
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    sd((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof RegistrationFormData
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Hanya file gambar (JPG/PNG) yang diperbolehkan.");
      e.target.value = "";
      return;
    }
    try {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: true }));
      const base64 = await compressImage(file);
      const prefix = d.nama_tim ? d.nama_tim.replace(/[^a-zA-Z0-9]/g, "_") : "Tim";
      const filename = `${prefix}_${String(fieldName)}.jpg`;
      
      const url = await uploadSingleFile(base64, filename);
      sd((prev) => ({ ...prev, [fieldName]: url }));
    } catch {
      alert("Gagal mengunggah gambar. Coba gambar lain.");
      e.target.value = "";
    } finally {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleCopyDanaNumber = async () => {
    try {
      await navigator.clipboard.writeText(DANA_NUMBER);
      setCopiedDana(true);
      window.setTimeout(() => setCopiedDana(false), 2000);
    } catch {
      setCopiedDana(false);
    }
  };

  // ======================
  // Validasi
  // ======================
  const validate = (): string | null => {
    if (!d.nama_tim.trim()) return "Nama tim wajib diisi.";
    if (!d.institution.trim()) return "Asal sekolah wajib diisi.";
    if (!d.leaderName.trim()) return "Nama ketua wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return "Format email tidak valid.";
    if (!/^(\+62|62|08)\d{7,14}$/.test(d.whatsapp.replace(/[\s\-()]/g, "")))
      return "Nomor WhatsApp tidak valid (gunakan 08... atau 628...).";
    if (!d.nama_anggota_1.trim() || !d.whatsapp_anggota_1.trim())
      return "Nama dan WhatsApp Anggota 1 wajib diisi.";
    if (!d.foto_anggota_1 || !d.kartu_pelajar_anggota_1 || !d.bukti_follow_boc_anggota_1 || !d.bukti_follow_yv_anggota_1)
      return "Berkas Anggota 1 (Foto, Kartu Pelajar, Bukti Follow BoC & YV) wajib dilengkapi.";
    
    if (!d.nama_anggota_2.trim() || !d.whatsapp_anggota_2.trim())
      return "Nama dan WhatsApp Anggota 2 wajib diisi.";
    if (!d.foto_anggota_2 || !d.kartu_pelajar_anggota_2 || !d.bukti_follow_boc_anggota_2 || !d.bukti_follow_yv_anggota_2)
      return "Berkas Anggota 2 (Foto, Kartu Pelajar, Bukti Follow BoC & YV) wajib dilengkapi.";

    if (!d.link_twibbon_ketua.trim()) return "Link Twibbon Ketua wajib diisi.";
    if (!d.link_twibbon_anggota_1.trim()) return "Link Twibbon Anggota 1 wajib diisi.";
    if (!d.link_twibbon_anggota_2.trim()) return "Link Twibbon Anggota 2 wajib diisi.";

    if (!d.bukti_bayar) return "Bukti pembayaran DANA wajib diunggah.";

    return null;
  };

  // ======================
  // Submit
  // ======================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting.current) return;
    isSubmitting.current = true;

    setErrorMsg("");

    // Cek apakah ada file yang sedang diunggah
    const isAnyUploading = Object.values(uploadingFields).some(Boolean);
    if (isAnyUploading) {
      setErrorMsg("Mohon tunggu hingga semua gambar selesai diunggah ke Google Drive.");
      setSubmitStatus("error");
      isSubmitting.current = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const err = validate();
    if (err) {
      setErrorMsg(err);
      setSubmitStatus("error");
      isSubmitting.current = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitStatus("loading");

    try {
      // Seluruh 13 gambar sudah dalam bentuk URL Google Drive di `d`
      // Langsung simpan ke backend (proses instant < 1 detik)
      const result = await registerParticipant({
        nama_tim: d.nama_tim,
        nama_ketua: d.leaderName,
        email: d.email,
        whatsapp: d.whatsapp,
        instansi: d.institution,
        jumlah_anggota: 3,
        nama_anggota_1: d.nama_anggota_1,
        whatsapp_anggota_1: d.whatsapp_anggota_1,
        nama_anggota_2: d.nama_anggota_2,
        whatsapp_anggota_2: d.whatsapp_anggota_2,
        notes: d.notes,
        foto_ketua:                 d.foto_ketua || "",
        kartu_pelajar_ketua:        d.kartu_pelajar_ketua || "",
        bukti_follow_boc_ketua:     d.bukti_follow_boc_ketua || "",
        bukti_follow_yv_ketua:      d.bukti_follow_yv_ketua || "",
        foto_anggota_1:             d.foto_anggota_1 || "",
        kartu_pelajar_anggota_1:    d.kartu_pelajar_anggota_1 || "",
        bukti_follow_boc_anggota_1: d.bukti_follow_boc_anggota_1 || "",
        bukti_follow_yv_anggota_1:  d.bukti_follow_yv_anggota_1 || "",
        foto_anggota_2:             d.foto_anggota_2 || "",
        kartu_pelajar_anggota_2:    d.kartu_pelajar_anggota_2 || "",
        bukti_follow_boc_anggota_2: d.bukti_follow_boc_anggota_2 || "",
        bukti_follow_yv_anggota_2:  d.bukti_follow_yv_anggota_2 || "",
        bukti_bayar:                d.bukti_bayar || "",
        link_twibbon_ketua:         d.link_twibbon_ketua || "",
        link_twibbon_anggota_1:     d.link_twibbon_anggota_1 || "",
        link_twibbon_anggota_2:     d.link_twibbon_anggota_2 || "",
      });

      if (result.status === "success" && result.data) {
        setData(result.data);
        setSubmitStatus("success");
        isSubmitting.current = false;
        router.push("/profile");
      } else {
        setErrorMsg(result.message || "Gagal menyimpan data pendaftaran.");
        setSubmitStatus("error");
        isSubmitting.current = false;
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan jaringan.");
      setSubmitStatus("error");
      isSubmitting.current = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // ======================
  // Style helpers
  // ======================
  const isLoading = submitStatus === "loading";
  const inputCls =
    "w-full p-3.5 border border-[#002D61]/15 rounded-xl bg-white text-[#002D61] placeholder:text-[#002D61]/30 focus:ring-2 focus:ring-[#700702]/40 focus:border-[#700702] focus:outline-none disabled:opacity-40 transition shadow-sm text-sm";
  const fileCls =
    "block w-full text-sm text-[#002D61]/70 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#002D61]/8 file:text-[#002D61] hover:file:bg-[#002D61]/15 file:transition cursor-pointer border border-[#002D61]/10 p-1.5 rounded-xl bg-white";
  const labelCls = "block text-sm font-extrabold text-[#002D61] mb-1.5";
  const sectionCls =
    "bg-white/90 backdrop-blur-md border border-[#002D61]/10 rounded-3xl p-6 md:p-8 shadow-lg shadow-[#002D61]/5";
  const sectionHeaderCls = "flex items-center gap-3 mb-6 pb-4 border-b border-[#002D61]/8";

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans text-[#002D61] antialiased">
      {/* Ambient BG */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#700702]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#002D61]/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 pt-28 pb-12 md:py-20">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#002D61] mb-4">
            Formulir Pendaftaran
          </h1>
          <p className="text-[#002D61]/70 max-w-xl mx-auto font-medium">
            Lengkapi data tim investigasi Anda dan unggah berkas yang diperlukan.
            Semua berkas dalam format gambar (JPG/PNG).
          </p>
        </div>

        {/* Error Banner */}
        {submitStatus === "error" && errorMsg && (
          <div className="mb-8 p-5 bg-red-50 border-l-4 border-red-600 text-red-700 rounded-r-xl shadow-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-bold">Gagal Menyimpan</p>
              <p className="text-sm mt-0.5">{errorMsg}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* === SECTION A: INFORMASI OLIMPIADE === */}
          <div className={sectionCls}>
            <div className={sectionHeaderCls}>
              <div className="w-9 h-9 rounded-full bg-[#700702] text-white flex items-center justify-center font-bold text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-[#002D61]">Informasi Olimpiade</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Jenis Lomba", value: "Olimpiade" },
                { label: "Biaya Pendaftaran", value: formatRupiah(BIAYA_PENDAFTARAN) + " / Tim" },
                { label: "Maks. Anggota", value: "3 Orang" },
                { label: "Pembayaran", value: "DANA" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-2xl bg-[#FFF6E9] border border-[#002D61]/10">
                  <p className="text-[10px] font-bold text-[#002D61]/50 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="font-extrabold text-[#002D61] text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* === SECTION B: PEMBAYARAN DANA === */}
          <div className={sectionCls}>
            <div className={sectionHeaderCls}>
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8V6m0 2v8m0 0v2m0-2c-1.657 0-3-.895-3-2m3 2c1.657 0 3-.895 3-2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-[#002D61]">Pembayaran DANA</h2>
            </div>

            {/* Petunjuk & Upload */}
            <div className="space-y-5">
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <h3 className="text-sm sm:text-base font-bold text-emerald-800 mb-2 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Petunjuk Pembayaran
                </h3>
                <div className="mb-4 p-4 sm:p-5 rounded-xl bg-white border border-emerald-200">
                  <p className="text-[11px] sm:text-xs font-bold text-emerald-800 uppercase tracking-wider">Transfer ke DANA</p>
                  <div className="mt-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                    <p className="text-base sm:text-xl font-black tracking-[0.06em] whitespace-nowrap text-[#002D61]">{DANA_NUMBER}</p>
                    <button
                      type="button"
                      onClick={handleCopyDanaNumber}
                      className="px-3 py-1.5 rounded-lg bg-[#002D61] text-white text-xs font-bold hover:bg-[#002D61]/90 transition"
                    >
                      {copiedDana ? "Tersalin" : "Salin Nomor"}
                    </button>
                  </div>
                  <div className="mt-2 text-[#002D61]/70">
                    <span className="block text-[11px] uppercase tracking-wider">Nama pemilik</span>
                    <strong className="block mt-0.5 text-sm leading-snug break-words text-[#002D61]">{DANA_ACCOUNT_NAME}</strong>
                  </div>
                  <div className="mt-4 flex flex-col items-center rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-center">
                    <p className="text-xs font-extrabold text-emerald-800">Atau scan QR untuk pembayaran</p>
                    <Image
                      src="/crop.jpeg"
                      alt="Kode QR pembayaran"
                      width={400}
                      height={400}
                      className="mt-3 w-full max-w-[260px] rounded-xl border border-emerald-200 bg-white"
                    />
                  </div>
                </div>
                <ol className="space-y-2 text-sm leading-relaxed text-emerald-700">
                  <li className="flex gap-2">
                    <span className="w-4 font-bold flex-shrink-0">1.</span>
                    <span className="min-w-0">Transfer tepat <strong>{formatRupiah(BIAYA_PENDAFTARAN)}</strong> ke nomor DANA di atas.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-4 font-bold flex-shrink-0">2.</span>
                    <span className="min-w-0">Pastikan nama penerima adalah <strong>{DANA_ACCOUNT_NAME}</strong>.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-4 font-bold flex-shrink-0">3.</span>
                    <span className="min-w-0">Screenshot bukti pembayaran dari aplikasi DANA.</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="w-4 font-bold flex-shrink-0">4.</span>
                    <span className="min-w-0">Upload bukti pembayaran di kolom berikut sebelum submit formulir.</span>
                  </li>
                </ol>
              </div>

              <div>
                <label className={labelCls}>
                  Upload Bukti Pembayaran DANA <Req />
                  <span className="block text-xs font-semibold text-[#700702]">Rekomendasi ukuran file: maksimal 200 KB</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "bukti_bayar")}
                  disabled={isLoading}
                  className={fileCls}
                />
                <UploadBadge value={d.bukti_bayar} isUploading={uploadingFields["bukti_bayar"]} />
                {!d.bukti_bayar && (
                  <p className="text-xs text-[#700702]/70 mt-1">
                    Formulir tidak dapat dikirim tanpa bukti pembayaran.
                  </p>
                )}
              </div>
            </div>

            {/* Twibbon Announcement Banner */}
            <div className="mt-6 p-4 rounded-2xl bg-[#700702]/5 border border-[#700702]/15 text-sm text-[#700702]/90 flex gap-3 items-start">
              <div className="w-5 h-5 rounded-full bg-[#700702] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">!</div>
              <div>
                <strong className="block text-[#700702] font-extrabold mb-0.5">Penting:</strong>
                Minimal satu anggota peserta wajib mengunggah Twibbon di Instagram.
                <br />
                Silakan download template Twibbon di sini:{" "}
                <a 
                  href="[MASUKKAN_LINK_DOWNLOAD_TWIBBON_DI_SINI]" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="font-extrabold text-[#002D61] underline hover:text-[#700702] transition-colors"
                >
                  Template Twibbon BoC
                </a>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-[#002D61]/5 border border-[#002D61]/15 text-sm text-[#002D61]/90">
              <strong className="block text-[#002D61] font-extrabold mb-2">Contact Person:</strong>
              <p className="mb-2">Jika membutuhkan bantuan selama proses pendaftaran, silakan hubungi:</p>
              <div className="flex flex-col gap-1.5">
                <a href="https://wa.me/6285299489932" target="_blank" rel="noreferrer" className="font-semibold text-[#700702] hover:underline">
                  Kevin Ardhana — 0852-9948-9932
                </a>
                <a href="https://wa.me/6285796508390" target="_blank" rel="noreferrer" className="font-semibold text-[#700702] hover:underline">
                  Abel Eka Putra — 0857-9650-8390
                </a>
                <a href="https://wa.me/6285966407041" target="_blank" rel="noreferrer" className="font-semibold text-[#700702] hover:underline">
                  Vira Anggraeni — 0859-6640-7041
                </a>
              </div>
            </div>
          </div>

          {/* === SECTION 1: TIM & INSTANSI === */}
          <div className={sectionCls}>
            <div className={sectionHeaderCls}>
              <div className="w-9 h-9 rounded-full bg-[#002D61] text-white flex items-center justify-center font-bold">1</div>
              <h2 className="text-xl font-extrabold text-[#002D61]">Informasi Tim & Instansi</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelCls}>Nama Tim <Req /></label>
                <input
                  name="nama_tim"
                  required
                  value={d.nama_tim}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputCls}
                  placeholder="Misal: Tim Investigator Alpha"
                />
              </div>
              <div>
                <label className={labelCls}>Asal Sekolah / Instansi <Req /></label>
                <input
                  name="institution"
                  required
                  value={d.institution}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputCls}
                  placeholder="Misal: SMAN 5 Makassar"
                />
              </div>
            </div>
          </div>

          {/* === SECTION 2: DATA KETUA === */}
          <div className={sectionCls}>
            <div className={sectionHeaderCls}>
              <div className="w-9 h-9 rounded-full bg-[#700702] text-white flex items-center justify-center font-bold">2</div>
              <h2 className="text-xl font-extrabold text-[#002D61]">Data Ketua Tim</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className={labelCls}>Nama Lengkap Ketua <Req /></label>
                <input name="leaderName" required value={d.leaderName} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="Nama sesuai kartu pelajar" />
              </div>
              <div>
                <label className={labelCls}>Email Ketua <Req /></label>
                <input name="email" type="email" required value={d.email} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="email@contoh.com" />
              </div>
              <div>
                <label className={labelCls}>No. WhatsApp Ketua <Req /></label>
                <input name="whatsapp" required value={d.whatsapp} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="081234567890" />
              </div>
            </div>

            <div className="bg-[#FFF6E9]/60 p-5 rounded-2xl border border-[#002D61]/8">
              <p className="text-xs font-extrabold text-[#002D61]/60 uppercase tracking-wider mb-4">Berkas Ketua</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                <div>
                  <label className={labelCls}>Pas Foto <Req /><span className="block text-xs font-semibold text-[#700702]">Wajib menggunakan seragam sekolah<br />Rekomendasi ukuran file: maksimal 200 KB</span></label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "foto_ketua")} disabled={isLoading} className={fileCls} />
                  <UploadBadge value={d.foto_ketua} isUploading={uploadingFields["foto_ketua"]} />
                </div>
                <div>
                  <label className={labelCls}>Kartu Pelajar <Req /><span className="block text-xs font-semibold text-[#700702]">Rekomendasi ukuran file: maksimal 200 KB</span></label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "kartu_pelajar_ketua")} disabled={isLoading} className={fileCls} />
                  <UploadBadge value={d.kartu_pelajar_ketua} isUploading={uploadingFields["kartu_pelajar_ketua"]} />
                </div>
                <div>
                  <label className={labelCls}>Bukti Follow BoC <Req /><span className="block text-xs font-semibold text-[#700702]">Rekomendasi ukuran file: maksimal 200 KB</span></label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_boc_ketua")} disabled={isLoading} className={fileCls} />
                  <UploadBadge value={d.bukti_follow_boc_ketua} isUploading={uploadingFields["bukti_follow_boc_ketua"]} />
                </div>
                <div>
                  <label className={labelCls}>Bukti Follow Youthverse <Req /><span className="block text-xs font-semibold text-[#700702]">Rekomendasi ukuran file: maksimal 200 KB</span></label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_yv_ketua")} disabled={isLoading} className={fileCls} />
                  <UploadBadge value={d.bukti_follow_yv_ketua} isUploading={uploadingFields["bukti_follow_yv_ketua"]} />
                </div>
                <div>
                  <label className={labelCls}>Link Twibbon <Req /></label>
                  <input type="url" name="link_twibbon_ketua" value={d.link_twibbon_ketua} onChange={handleChange} disabled={isLoading} className={inputCls.replace("p-3.5", "p-2")} placeholder="Link IG" required />
                </div>
              </div>
            </div>
          </div>

          {/* === SECTION 3: DATA ANGGOTA 1 === */}
          <div className={sectionCls}>
              <div className={sectionHeaderCls}>
                <div className="w-9 h-9 rounded-full bg-[#002D61]/20 text-[#002D61] flex items-center justify-center font-bold text-sm">A1</div>
                <h2 className="text-xl font-extrabold text-[#002D61]">Data Anggota 1</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={labelCls}>Nama Lengkap Anggota 1 <Req /></label>
                  <input name="nama_anggota_1" required value={d.nama_anggota_1} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="Nama sesuai kartu pelajar" />
                </div>
                <div>
                  <label className={labelCls}>No. WhatsApp Anggota 1 <Req /></label>
                  <input name="whatsapp_anggota_1" required value={d.whatsapp_anggota_1} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="081234567890" />
                </div>
              </div>
              <div className="bg-[#FFF6E9]/60 p-5 rounded-2xl border border-[#002D61]/8">
                <p className="text-xs font-extrabold text-[#002D61]/60 uppercase tracking-wider mb-4">Berkas Anggota 1</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <label className={labelCls}>Pas Foto <Req /><span className="block text-xs font-semibold text-[#700702]">Wajib menggunakan seragam sekolah<br />Rekomendasi ukuran file: maksimal 200 KB</span></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "foto_anggota_1")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.foto_anggota_1} isUploading={uploadingFields["foto_anggota_1"]} />
                  </div>
                  <div>
                    <label className={labelCls}>Kartu Pelajar <Req /><span className="block text-xs font-semibold text-[#700702]">Rekomendasi ukuran file: maksimal 200 KB</span></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "kartu_pelajar_anggota_1")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.kartu_pelajar_anggota_1} isUploading={uploadingFields["kartu_pelajar_anggota_1"]} />
                  </div>
                  <div>
                    <label className={labelCls}>Bukti Follow BoC <Req /><span className="block text-xs font-semibold text-[#700702]">Rekomendasi ukuran file: maksimal 200 KB</span></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_boc_anggota_1")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.bukti_follow_boc_anggota_1} isUploading={uploadingFields["bukti_follow_boc_anggota_1"]} />
                  </div>
                  <div>
                    <label className={labelCls}>Bukti Follow Youthverse <Req /><span className="block text-xs font-semibold text-[#700702]">Rekomendasi ukuran file: maksimal 200 KB</span></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_yv_anggota_1")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.bukti_follow_yv_anggota_1} isUploading={uploadingFields["bukti_follow_yv_anggota_1"]} />
                  </div>
                  <div>
                    <label className={labelCls}>Link Twibbon <Req /></label>
                    <input type="url" name="link_twibbon_anggota_1" value={d.link_twibbon_anggota_1} onChange={handleChange} disabled={isLoading} className={inputCls.replace("p-3.5", "p-2")} placeholder="Link IG" required />
                  </div>
                </div>
              </div>
            </div>

          {/* === SECTION 4: DATA ANGGOTA 2 === */}
          <div className={sectionCls}>
              <div className={sectionHeaderCls}>
                <div className="w-9 h-9 rounded-full bg-[#002D61]/20 text-[#002D61] flex items-center justify-center font-bold text-sm">A2</div>
                <h2 className="text-xl font-extrabold text-[#002D61]">Data Anggota 2</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className={labelCls}>Nama Lengkap Anggota 2 <Req /></label>
                  <input name="nama_anggota_2" required value={d.nama_anggota_2} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="Nama sesuai kartu pelajar" />
                </div>
                <div>
                  <label className={labelCls}>No. WhatsApp Anggota 2 <Req /></label>
                  <input name="whatsapp_anggota_2" required value={d.whatsapp_anggota_2} onChange={handleChange} disabled={isLoading} className={inputCls} placeholder="081234567890" />
                </div>
              </div>
              <div className="bg-[#FFF6E9]/60 p-5 rounded-2xl border border-[#002D61]/8">
                <p className="text-xs font-extrabold text-[#002D61]/60 uppercase tracking-wider mb-4">Berkas Anggota 2</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                  <div>
                    <label className={labelCls}>Pas Foto <Req /><span className="block text-xs font-semibold text-[#700702]">Wajib menggunakan seragam sekolah<br />Rekomendasi ukuran file: maksimal 200 KB</span></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "foto_anggota_2")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.foto_anggota_2} isUploading={uploadingFields["foto_anggota_2"]} />
                  </div>
                  <div>
                    <label className={labelCls}>Kartu Pelajar <Req /><span className="block text-xs font-semibold text-[#700702]">Rekomendasi ukuran file: maksimal 200 KB</span></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "kartu_pelajar_anggota_2")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.kartu_pelajar_anggota_2} isUploading={uploadingFields["kartu_pelajar_anggota_2"]} />
                  </div>
                  <div>
                    <label className={labelCls}>Bukti Follow BoC <Req /><span className="block text-xs font-semibold text-[#700702]">Rekomendasi ukuran file: maksimal 200 KB</span></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_boc_anggota_2")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.bukti_follow_boc_anggota_2} isUploading={uploadingFields["bukti_follow_boc_anggota_2"]} />
                  </div>
                  <div>
                    <label className={labelCls}>Bukti Follow Youthverse <Req /><span className="block text-xs font-semibold text-[#700702]">Rekomendasi ukuran file: maksimal 200 KB</span></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_yv_anggota_2")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.bukti_follow_yv_anggota_2} isUploading={uploadingFields["bukti_follow_yv_anggota_2"]} />
                  </div>
                  <div>
                    <label className={labelCls}>Link Twibbon <Req /></label>
                    <input type="url" name="link_twibbon_anggota_2" value={d.link_twibbon_anggota_2} onChange={handleChange} disabled={isLoading} className={inputCls.replace("p-3.5", "p-2")} placeholder="Link IG" required />
                  </div>
                </div>
              </div>
            </div>

          {/* === SECTION 5: CATATAN & SUBMIT === */}
          <div className={sectionCls}>
            <div className={sectionHeaderCls}>
              <div className="w-9 h-9 rounded-full bg-[#002D61] text-white flex items-center justify-center font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-[#002D61]">Catatan & Kirim</h2>
            </div>



            <div className="mb-6">
              <label className={labelCls}>Catatan Tambahan (Opsional)</label>
              <textarea
                name="notes"
                value={d.notes}
                onChange={handleChange}
                disabled={isLoading}
                rows={3}
                className={inputCls}
                placeholder="Jika ada pesan untuk panitia..."
              />
            </div>

            {/* Checklist sebelum submit */}
            <div className="mb-6 p-4 rounded-xl bg-[#002D61]/5 border border-[#002D61]/10">
              <p className="text-xs font-bold text-[#002D61] mb-3 uppercase tracking-wider">Pastikan sebelum submit:</p>
              <div className="space-y-1.5">
                {[
                  { label: "Data tim & instansi sudah diisi", ok: !!(d.nama_tim && d.institution) },
                  { label: "Data ketua sudah lengkap", ok: !!(d.leaderName && d.whatsapp && d.email) },
                  { label: "Berkas ketua sudah diunggah", ok: !!(d.foto_ketua && d.kartu_pelajar_ketua && d.bukti_follow_boc_ketua && d.bukti_follow_yv_ketua) },
                  { label: "Bukti pembayaran DANA sudah diunggah", ok: !!d.bukti_bayar },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold ${item.ok ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                      {item.ok ? "✓" : "–"}
                    </span>
                    <span className={`text-xs font-medium ${item.ok ? "text-emerald-700" : "text-[#002D61]/50"}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#700702] hover:bg-[#8a0903] text-white font-extrabold text-lg rounded-xl shadow-[0_4px_25px_rgba(112,7,2,0.25)] hover:shadow-[0_6px_35px_rgba(112,7,2,0.4)] transition-all disabled:opacity-60 flex items-center justify-center gap-3"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Memproses Pendaftaran...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Kirim Pendaftaran
                </>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
