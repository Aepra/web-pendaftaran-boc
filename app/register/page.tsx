"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useRegistration } from "@/contexts/registration-context";
import { useEffect, useState } from "react";
import type { RegistrationFormData } from "@/types";
import { registerParticipant } from "@/lib/api/boc-api";
import { formatRupiah } from "@/lib/utils";
import Image from "next/image";

const BIAYA_PENDAFTARAN = 100000;

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
// Sub-komponen: Modal Preview Gambar
// ======================
function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = "QRIS_BoC2026.jpeg";
    a.click();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="font-bold text-[#002D61]">QRIS Pembayaran BoC 2026</p>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 text-xs font-bold bg-[#002D61] text-white rounded-lg hover:bg-[#002D61]/90 transition flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
              aria-label="Tutup"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4 flex items-center justify-center bg-gray-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="QRIS BoC 2026" className="max-w-full max-h-[70vh] object-contain rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ======================
// Main Page
// ======================
const EMPTY_FORM: RegistrationFormData = {
  nama_tim: "",
  institution: "",
  memberCount: 1,
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
};

export default function RegisterPage() {
  const { isAuthenticated, user } = useAuth();
  const { setData } = useRegistration();
  const router = useRouter();

  const [initialized, setInitialized] = useState(false);
  const [d, sd] = useState<RegistrationFormData>(EMPTY_FORM);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [qrisModalOpen, setQrisModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number; label: string } | null>(null);

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
      [name]: name === "memberCount" ? Number(value) : value,
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
      setSubmitStatus("loading");
      const base64 = await compressImage(file);
      sd((prev) => ({ ...prev, [fieldName]: base64 }));
    } catch {
      alert("Gagal memproses gambar. Coba gambar lain.");
      e.target.value = "";
    } finally {
      setSubmitStatus("idle");
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
    if (d.memberCount < 1 || d.memberCount > 3)
      return "Jumlah anggota (termasuk ketua) harus 1–3 orang.";

    if (!d.foto_ketua) return "Pas foto ketua wajib diunggah.";
    if (!d.kartu_pelajar_ketua) return "Kartu pelajar ketua wajib diunggah.";
    if (!d.bukti_follow_boc_ketua || !d.bukti_follow_yv_ketua) return "Bukti follow Instagram BoC & Youthverse ketua wajib diunggah.";

    if (d.memberCount >= 2) {
      if (!d.nama_anggota_1.trim() || !d.whatsapp_anggota_1.trim())
        return "Nama dan WhatsApp Anggota 1 wajib diisi.";
      if (!d.foto_anggota_1 || !d.kartu_pelajar_anggota_1 || !d.bukti_follow_boc_anggota_1 || !d.bukti_follow_yv_anggota_1)
        return "Berkas Anggota 1 (Foto, Kartu Pelajar, Bukti Follow BoC & YV) wajib dilengkapi.";
    }

    if (d.memberCount === 3) {
      if (!d.nama_anggota_2.trim() || !d.whatsapp_anggota_2.trim())
        return "Nama dan WhatsApp Anggota 2 wajib diisi.";
      if (!d.foto_anggota_2 || !d.kartu_pelajar_anggota_2 || !d.bukti_follow_boc_anggota_2 || !d.bukti_follow_yv_anggota_2)
        return "Berkas Anggota 2 (Foto, Kartu Pelajar, Bukti Follow BoC & YV) wajib dilengkapi.";
    }

    if (!d.bukti_bayar) return "Bukti pembayaran QRIS wajib diunggah.";

    return null;
  };

  // ======================
  // Submit
  // ======================
  // Upload satu file ke Google Drive via GAS, kembalikan URL
  const uploadFileToDrive = async (base64: string, filename: string): Promise<string> => {
    if (!base64) return "";
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upload_file", filename, data: base64 }),
    });
    const json = await res.json();
    if (json.status === "success" && json.data?.url) return json.data.url;
    throw new Error("Gagal upload file: " + filename);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    const err = validate();
    if (err) {
      setErrorMsg(err);
      setSubmitStatus("error");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitStatus("loading");
    setUploadProgress(null);

    try {
      // ================================================================
      // FASE 1: Upload setiap gambar satu per satu ke Google Drive
      // ================================================================
      const prefix = d.nama_tim.replace(/[^a-zA-Z0-9]/g, "_");

      // Buat daftar file yang perlu diupload
      type FileUpload = { key: string; base64: string; label: string };
      const filesToUpload: FileUpload[] = [
        { key: "foto_ketua",             base64: d.foto_ketua,             label: "Foto Ketua" },
        { key: "kartu_pelajar_ketua",    base64: d.kartu_pelajar_ketua,    label: "Kartu Pelajar Ketua" },
        { key: "bukti_follow_boc_ketua", base64: d.bukti_follow_boc_ketua, label: "Bukti Follow BoC Ketua" },
        { key: "bukti_follow_yv_ketua",  base64: d.bukti_follow_yv_ketua,  label: "Bukti Follow YV Ketua" },
        { key: "bukti_bayar",            base64: d.bukti_bayar,            label: "Bukti Pembayaran" },
        ...(d.memberCount >= 2 ? [
          { key: "foto_anggota_1",             base64: d.foto_anggota_1,             label: "Foto Anggota 1" },
          { key: "kartu_pelajar_anggota_1",    base64: d.kartu_pelajar_anggota_1,    label: "Kartu Pelajar Anggota 1" },
          { key: "bukti_follow_boc_anggota_1", base64: d.bukti_follow_boc_anggota_1, label: "Bukti Follow BoC Anggota 1" },
          { key: "bukti_follow_yv_anggota_1",  base64: d.bukti_follow_yv_anggota_1,  label: "Bukti Follow YV Anggota 1" },
        ] : []),
        ...(d.memberCount === 3 ? [
          { key: "foto_anggota_2",             base64: d.foto_anggota_2,             label: "Foto Anggota 2" },
          { key: "kartu_pelajar_anggota_2",    base64: d.kartu_pelajar_anggota_2,    label: "Kartu Pelajar Anggota 2" },
          { key: "bukti_follow_boc_anggota_2", base64: d.bukti_follow_boc_anggota_2, label: "Bukti Follow BoC Anggota 2" },
          { key: "bukti_follow_yv_anggota_2",  base64: d.bukti_follow_yv_anggota_2,  label: "Bukti Follow YV Anggota 2" },
        ] : []),
      ];

      const uploadedUrls: Record<string, string> = {};
      for (let i = 0; i < filesToUpload.length; i++) {
        const f = filesToUpload[i];
        setUploadProgress({ current: i + 1, total: filesToUpload.length, label: f.label });
        uploadedUrls[f.key] = await uploadFileToDrive(f.base64, `${prefix}_${f.label}.jpg`);
      }

      // ================================================================
      // FASE 2: Submit data teks + URL (ringan, cepat)
      // ================================================================
      setUploadProgress({ current: filesToUpload.length, total: filesToUpload.length, label: "Menyimpan data..." });

      const result = await registerParticipant({
        nama_tim: d.nama_tim,
        nama_ketua: d.leaderName,
        email: d.email,
        whatsapp: d.whatsapp,
        instansi: d.institution,
        jumlah_anggota: d.memberCount,
        nama_anggota_1: d.memberCount >= 2 ? d.nama_anggota_1 : "",
        whatsapp_anggota_1: d.memberCount >= 2 ? d.whatsapp_anggota_1 : "",
        nama_anggota_2: d.memberCount === 3 ? d.nama_anggota_2 : "",
        whatsapp_anggota_2: d.memberCount === 3 ? d.whatsapp_anggota_2 : "",
        notes: d.notes,
        foto_ketua:                 uploadedUrls["foto_ketua"] || "",
        kartu_pelajar_ketua:        uploadedUrls["kartu_pelajar_ketua"] || "",
        bukti_follow_boc_ketua:     uploadedUrls["bukti_follow_boc_ketua"] || "",
        bukti_follow_yv_ketua:      uploadedUrls["bukti_follow_yv_ketua"] || "",
        foto_anggota_1:             uploadedUrls["foto_anggota_1"] || "",
        kartu_pelajar_anggota_1:    uploadedUrls["kartu_pelajar_anggota_1"] || "",
        bukti_follow_boc_anggota_1: uploadedUrls["bukti_follow_boc_anggota_1"] || "",
        bukti_follow_yv_anggota_1:  uploadedUrls["bukti_follow_yv_anggota_1"] || "",
        foto_anggota_2:             uploadedUrls["foto_anggota_2"] || "",
        kartu_pelajar_anggota_2:    uploadedUrls["kartu_pelajar_anggota_2"] || "",
        bukti_follow_boc_anggota_2: uploadedUrls["bukti_follow_boc_anggota_2"] || "",
        bukti_follow_yv_anggota_2:  uploadedUrls["bukti_follow_yv_anggota_2"] || "",
        bukti_bayar:                uploadedUrls["bukti_bayar"] || "",
      });

      setUploadProgress(null);

      if (result.status === "success" && result.data) {
        setData(result.data);
        setSubmitStatus("success");
        router.push("/profile");
      } else {
        setErrorMsg(result.message || "Gagal menyimpan data pendaftaran.");
        setSubmitStatus("error");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch (err) {
      setUploadProgress(null);
      setErrorMsg(err instanceof Error ? err.message : "Terjadi kesalahan jaringan.");
      setSubmitStatus("error");
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
      {/* Modal QRIS */}
      {qrisModalOpen && (
        <ImageModal src="/Qriss_Pembayaran.jpeg" onClose={() => setQrisModalOpen(false)} />
      )}

      {/* Ambient BG */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#700702]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#002D61]/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Page Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-bold tracking-[0.2em] uppercase text-[#700702] mb-3 bg-[#700702]/8 px-4 py-1.5 rounded-full border border-[#700702]/15">
            Registrasi BoC III — Olimpiade
          </span>
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
                { label: "Pembayaran", value: "QRIS" },
              ].map((item) => (
                <div key={item.label} className="p-4 rounded-2xl bg-[#FFF6E9] border border-[#002D61]/10">
                  <p className="text-[10px] font-bold text-[#002D61]/50 uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="font-extrabold text-[#002D61] text-sm">{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* === SECTION B: PEMBAYARAN QRIS === */}
          <div className={sectionCls}>
            <div className={sectionHeaderCls}>
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 4h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h2 className="text-xl font-extrabold text-[#002D61]">Pembayaran QRIS</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
              {/* QRIS Image */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-xs border-2 border-[#002D61]/15 rounded-2xl overflow-hidden shadow-md bg-white p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Qriss_Pembayaran.jpeg"
                    alt="QRIS BoC 2026"
                    className="w-full rounded-xl object-contain"
                  />
                </div>
                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setQrisModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#002D61]/8 text-[#002D61] hover:bg-[#002D61]/15 border border-[#002D61]/15 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                    Perbesar QR
                  </button>
                  <a
                    href="/Qriss_Pembayaran.jpeg"
                    download="QRIS_BoC2026.jpeg"
                    className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-[#002D61] text-white hover:bg-[#002D61]/90 transition"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </a>
                </div>
              </div>

              {/* Petunjuk & Upload */}
              <div className="space-y-5">
                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <h3 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Petunjuk Pembayaran
                  </h3>
                  <ol className="space-y-2 text-sm text-emerald-700">
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">1.</span>
                      Scan QRIS di atas menggunakan aplikasi bank atau e-wallet.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">2.</span>
                      Bayar tepat <strong>{formatRupiah(BIAYA_PENDAFTARAN)}</strong> per tim.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">3.</span>
                      Screenshot bukti pembayaran dari aplikasi Anda.
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold flex-shrink-0">4.</span>
                      Upload bukti pembayaran di kolom berikut sebelum submit formulir.
                    </li>
                  </ol>
                </div>

                <div>
                  <label className={labelCls}>
                    Upload Bukti Pembayaran <Req />
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "bukti_bayar")}
                    disabled={isLoading}
                    className={fileCls}
                  />
                  <UploadBadge value={d.bukti_bayar} />
                  {!d.bukti_bayar && (
                    <p className="text-xs text-[#700702]/70 mt-1">
                      Formulir tidak dapat dikirim tanpa bukti pembayaran.
                    </p>
                  )}
                </div>
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
              <div>
                <label className={labelCls}>Jumlah Anggota (Total termasuk Ketua) <Req /></label>
                <select
                  name="memberCount"
                  required
                  value={d.memberCount}
                  onChange={handleChange}
                  disabled={isLoading}
                  className={inputCls}
                >
                  <option value={1}>1 Orang (Hanya Ketua)</option>
                  <option value={2}>2 Orang (Ketua + 1 Anggota)</option>
                  <option value={3}>3 Orang (Ketua + 2 Anggota)</option>
                </select>
                <p className="text-xs text-[#002D61]/50 mt-1.5 font-medium">Maks. 3 orang (1 Ketua + 2 Anggota).</p>
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
                  <label className={labelCls}>Pas Foto <Req /></label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "foto_ketua")} disabled={isLoading} className={fileCls} />
                  <UploadBadge value={d.foto_ketua} />
                </div>
                <div>
                  <label className={labelCls}>Kartu Pelajar <Req /></label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "kartu_pelajar_ketua")} disabled={isLoading} className={fileCls} />
                  <UploadBadge value={d.kartu_pelajar_ketua} />
                </div>
                <div>
                  <label className={labelCls}>Bukti Follow BoC <Req /></label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_boc_ketua")} disabled={isLoading} className={fileCls} />
                  <UploadBadge value={d.bukti_follow_boc_ketua} />
                </div>
                <div>
                  <label className={labelCls}>Bukti Follow Youthverse <Req /></label>
                  <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_yv_ketua")} disabled={isLoading} className={fileCls} />
                  <UploadBadge value={d.bukti_follow_yv_ketua} />
                </div>
              </div>
            </div>
          </div>

          {/* === SECTION 3: DATA ANGGOTA 1 (Conditional) === */}
          {d.memberCount >= 2 && (
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
                    <label className={labelCls}>Pas Foto <Req /></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "foto_anggota_1")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.foto_anggota_1} />
                  </div>
                  <div>
                    <label className={labelCls}>Kartu Pelajar <Req /></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "kartu_pelajar_anggota_1")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.kartu_pelajar_anggota_1} />
                  </div>
                  <div>
                    <label className={labelCls}>Bukti Follow BoC <Req /></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_boc_anggota_1")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.bukti_follow_boc_anggota_1} />
                  </div>
                  <div>
                    <label className={labelCls}>Bukti Follow Youthverse <Req /></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_yv_anggota_1")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.bukti_follow_yv_anggota_1} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* === SECTION 4: DATA ANGGOTA 2 (Conditional) === */}
          {d.memberCount === 3 && (
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
                    <label className={labelCls}>Pas Foto <Req /></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "foto_anggota_2")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.foto_anggota_2} />
                  </div>
                  <div>
                    <label className={labelCls}>Kartu Pelajar <Req /></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "kartu_pelajar_anggota_2")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.kartu_pelajar_anggota_2} />
                  </div>
                  <div>
                    <label className={labelCls}>Bukti Follow BoC <Req /></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_boc_anggota_2")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.bukti_follow_boc_anggota_2} />
                  </div>
                  <div>
                    <label className={labelCls}>Bukti Follow Youthverse <Req /></label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "bukti_follow_yv_anggota_2")} disabled={isLoading} className={fileCls} />
                    <UploadBadge value={d.bukti_follow_yv_anggota_2} />
                  </div>
                </div>
              </div>
            </div>
          )}

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
                  { label: "Bukti pembayaran QRIS sudah diunggah", ok: !!d.bukti_bayar },
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

            {/* Progress bar upload */}
            {uploadProgress && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-700">
                    Mengupload: {uploadProgress.label}
                  </span>
                  <span className="text-xs font-bold text-blue-700">
                    {uploadProgress.current}/{uploadProgress.total}
                  </span>
                </div>
                <div className="w-full bg-blue-100 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
                <p className="text-[10px] text-blue-500 mt-1">Mohon tunggu, jangan tutup halaman ini.</p>
              </div>
            )}

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
                  {uploadProgress ? `Mengupload ${uploadProgress.current}/${uploadProgress.total}...` : "Memproses..."}
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