"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import {
  getUserByEmail,
  getRegistrationsByEmail,
  getRegistrationDetail,
  updateRegistration,
} from "@/lib/api/boc-api";
import type {
  RegistrationHistoryItem,
  RegistrationDetail,
  ParticipantStatus,
  RegistrationFormData,
} from "@/types";

const REGISTRATION_FEE = 100000;

// ======================
// Badge Status
// ======================
function StatusBadge({ status }: { status: ParticipantStatus }) {
  const map: Record<ParticipantStatus, { bg: string; text: string; dot: string; label: string }> = {
    MENUNGGU: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400", label: "Menunggu" },
    DISETUJUI: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500", label: "Disetujui" },
    DITOLAK: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500", label: "Ditolak" },
  };
  const s = map[status] ?? map["MENUNGGU"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${s.bg} ${s.text} border-current/20`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

// ======================
// Modal Preview Gambar
// ======================
function ImagePreviewModal({ src, label, onClose }: { src: string; label: string; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b">
          <p className="font-bold text-zinc-800 truncate">{label}</p>
          <div className="flex gap-2">
            <a href={src} download className="px-3 py-1.5 text-xs font-bold bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download
            </a>
            <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} className="max-h-[70vh] max-w-full object-contain rounded-lg" />
        </div>
      </div>
    </div>
  );
}

// ======================
// Image Thumbnail
// ======================
// ======================
// Helper: Convert Google Drive URL → format yang bisa ditampilkan di browser
// ======================
function toDriveImgUrl(url?: string): string {
  if (!url) return "";
  if (url.startsWith("data:")) return url;
  let fileId = "";
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) fileId = idMatch[1];
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];
  if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
  return url;
}

function ImageThumb({ src, label }: { src?: string; label: string }) {
  const [preview, setPreview] = useState(false);
  const imgSrc = toDriveImgUrl(src);
  if (!src) return <div className="aspect-square rounded-lg bg-zinc-800/40 flex items-center justify-center text-zinc-600 text-[10px]">—</div>;
  return (
    <>
      {preview && <ImagePreviewModal src={imgSrc} label={label} onClose={() => setPreview(false)} />}
      <button type="button" onClick={() => setPreview(true)} className="group relative block aspect-square rounded-lg overflow-hidden border border-zinc-700/60 bg-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imgSrc} alt={label} className="w-full h-full object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>
        <p className="absolute bottom-0 inset-x-0 text-[9px] text-white text-center bg-black/50 py-0.5 truncate px-1">{label}</p>
      </button>
    </>
  );
}

// ======================
// Komponen compressImage (client util)
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
        const MAX = 800;
        let { width, height } = img;
        if (width > height) { if (width > MAX) { height *= MAX / width; width = MAX; } }
        else { if (height > MAX) { width *= MAX / height; height = MAX; } }
        canvas.width = width; canvas.height = height;
        canvas.getContext("2d")?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = reject;
    };
    reader.onerror = reject;
  });

// ======================
// Panel Edit Pendaftaran (MENUNGGU)
// ======================
function EditPanel({
  detail,
  email,
  onSuccess,
  onCancel,
}: {
  detail: RegistrationDetail;
  email: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const [d, sd] = useState<RegistrationFormData>({
    nama_tim: detail.nama_tim,
    institution: detail.instansi,
    leaderName: detail.nama_ketua,
    email: detail.email,
    whatsapp: detail.whatsapp,
    nama_anggota_1: detail.nama_anggota_1,
    whatsapp_anggota_1: detail.whatsapp_anggota_1,
    nama_anggota_2: detail.nama_anggota_2,
    whatsapp_anggota_2: detail.whatsapp_anggota_2,
    notes: detail.notes,
    foto_ketua: detail.foto_ketua,
    kartu_pelajar_ketua: detail.kartu_pelajar_ketua,
    bukti_follow_boc_ketua: detail.bukti_follow_boc_ketua,
    bukti_follow_yv_ketua: detail.bukti_follow_yv_ketua,
    foto_anggota_1: detail.foto_anggota_1,
    kartu_pelajar_anggota_1: detail.kartu_pelajar_anggota_1,
    bukti_follow_boc_anggota_1: detail.bukti_follow_boc_anggota_1,
    bukti_follow_yv_anggota_1: detail.bukti_follow_yv_anggota_1,
    foto_anggota_2: detail.foto_anggota_2,
    kartu_pelajar_anggota_2: detail.kartu_pelajar_anggota_2,
    bukti_follow_boc_anggota_2: detail.bukti_follow_boc_anggota_2,
    bukti_follow_yv_anggota_2: detail.bukti_follow_yv_anggota_2,
    bukti_bayar: detail.bukti_bayar,
    link_twibbon_ketua: detail.link_twibbon_ketua || "",
    link_twibbon_anggota_1: detail.link_twibbon_anggota_1 || "",
    link_twibbon_anggota_2: detail.link_twibbon_anggota_2 || "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    sd((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof RegistrationFormData) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { alert("Hanya file gambar yang diperbolehkan."); e.target.value = ""; return; }
    try {
      setStatus("loading");
      const b64 = await compressImage(file);
      sd((prev) => ({ ...prev, [field]: b64 }));
    } catch { alert("Gagal memproses gambar."); e.target.value = ""; }
    finally { setStatus("idle"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading"); setErrorMsg("");
    const result = await updateRegistration({
      registration_id: detail.registration_id,
      email,
      nama_tim: d.nama_tim,
      nama_ketua: d.leaderName,
      whatsapp: d.whatsapp,
      instansi: d.institution,
      jumlah_anggota: 3,
      nama_anggota_1: d.nama_anggota_1,
      whatsapp_anggota_1: d.whatsapp_anggota_1,
      nama_anggota_2: d.nama_anggota_2,
      whatsapp_anggota_2: d.whatsapp_anggota_2,
      notes: d.notes,
      foto_ketua: d.foto_ketua,
      kartu_pelajar_ketua: d.kartu_pelajar_ketua,
      bukti_follow_boc_ketua: d.bukti_follow_boc_ketua,
      bukti_follow_yv_ketua: d.bukti_follow_yv_ketua,
      foto_anggota_1: d.foto_anggota_1,
      kartu_pelajar_anggota_1: d.kartu_pelajar_anggota_1,
      bukti_follow_boc_anggota_1: d.bukti_follow_boc_anggota_1,
      bukti_follow_yv_anggota_1: d.bukti_follow_yv_anggota_1,
      foto_anggota_2: d.foto_anggota_2,
      kartu_pelajar_anggota_2: d.kartu_pelajar_anggota_2,
      bukti_follow_boc_anggota_2: d.bukti_follow_boc_anggota_2,
      bukti_follow_yv_anggota_2: d.bukti_follow_yv_anggota_2,
      bukti_bayar: d.bukti_bayar,
      link_twibbon_ketua: d.link_twibbon_ketua,
      link_twibbon_anggota_1: d.link_twibbon_anggota_1,
      link_twibbon_anggota_2: d.link_twibbon_anggota_2,
    });
    if (result.status === "success") { onSuccess(); }
    else { setErrorMsg(result.message || "Gagal memperbarui data."); setStatus("error"); }
  };

  const ic = "w-full p-3 border border-[#002D61]/15 rounded-xl bg-white text-[#002D61] placeholder:text-[#002D61]/40 focus:ring-2 focus:ring-[#700702]/20 focus:border-[#700702] focus:outline-none text-sm shadow-sm transition";
  const lc = "block text-xs font-extrabold text-[#002D61]/60 mb-1 uppercase tracking-wider";
  const fc = "block w-full text-xs text-[#002D61]/60 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#002D61] file:text-white hover:file:bg-[#002D61]/90 file:transition border border-[#002D61]/15 p-1.5 rounded-xl bg-white focus:ring-2 focus:ring-[#700702]/20 transition shadow-sm cursor-pointer";
  const isLoading = status === "loading";

  return (
    <div className="mt-4 p-5 rounded-2xl bg-[#002D61]/5 border border-[#002D61]/10">
      <h4 className="font-bold text-[#002D61] mb-4 flex items-center gap-2">
        <svg className="w-4 h-4 text-[#700702]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
        Edit Pendaftaran
      </h4>
      {status === "error" && errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{errorMsg}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lc}>Nama Tim</label><input name="nama_tim" value={d.nama_tim} onChange={handleChange} disabled={isLoading} className={ic} /></div>
          <div><label className={lc}>Asal Sekolah</label><input name="institution" value={d.institution} onChange={handleChange} disabled={isLoading} className={ic} /></div>
          <div><label className={lc}>Nama Ketua</label><input name="leaderName" value={d.leaderName} onChange={handleChange} disabled={isLoading} className={ic} /></div>
          <div><label className={lc}>WhatsApp Ketua</label><input name="whatsapp" value={d.whatsapp} onChange={handleChange} disabled={isLoading} className={ic} /></div>
          <div><label className={lc}>WhatsApp Ketua</label><input name="whatsapp" value={d.whatsapp} onChange={handleChange} disabled={isLoading} className={ic} /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lc}>Nama Anggota 1</label><input name="nama_anggota_1" value={d.nama_anggota_1} onChange={handleChange} disabled={isLoading} className={ic} /></div>
          <div><label className={lc}>WhatsApp Anggota 1</label><input name="whatsapp_anggota_1" value={d.whatsapp_anggota_1} onChange={handleChange} disabled={isLoading} className={ic} /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div><label className={lc}>Nama Anggota 2</label><input name="nama_anggota_2" value={d.nama_anggota_2} onChange={handleChange} disabled={isLoading} className={ic} /></div>
          <div><label className={lc}>WhatsApp Anggota 2</label><input name="whatsapp_anggota_2" value={d.whatsapp_anggota_2} onChange={handleChange} disabled={isLoading} className={ic} /></div>
        </div>

        {/* Berkas Ketua */}
        <div className="mt-4 p-4 rounded-xl bg-white border border-[#002D61]/10">
          <p className="text-xs font-bold text-[#002D61] uppercase tracking-wider mb-3">Ubah Berkas Ketua</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={lc}>Pas Foto</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "foto_ketua")} disabled={isLoading} className={fc} />
              {d.foto_ketua && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
            <div>
              <label className={lc}>Kartu Pelajar</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "kartu_pelajar_ketua")} disabled={isLoading} className={fc} />
              {d.kartu_pelajar_ketua && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
            <div>
              <label className={lc}>Follow BoC</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "bukti_follow_boc_ketua")} disabled={isLoading} className={fc} />
              {d.bukti_follow_boc_ketua && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
            <div>
              <label className={lc}>Follow Youthverse</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "bukti_follow_yv_ketua")} disabled={isLoading} className={fc} />
              {d.bukti_follow_yv_ketua && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
          </div>
          <div className="mt-4">
            <label className={lc}>Link Twibbon Ketua</label>
            <input type="url" name="link_twibbon_ketua" value={d.link_twibbon_ketua} onChange={handleChange} disabled={isLoading} className={ic} placeholder="Link post IG" required />
          </div>
        </div>

        {/* Berkas Anggota 1 */}
        <div className="mt-4 p-4 rounded-xl bg-white border border-[#002D61]/10">
          <p className="text-xs font-bold text-[#002D61] uppercase tracking-wider mb-3">Ubah Berkas Anggota 1</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={lc}>Pas Foto</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "foto_anggota_1")} disabled={isLoading} className={fc} />
              {d.foto_anggota_1 && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
            <div>
              <label className={lc}>Kartu Pelajar</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "kartu_pelajar_anggota_1")} disabled={isLoading} className={fc} />
              {d.kartu_pelajar_anggota_1 && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
            <div>
              <label className={lc}>Follow BoC</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "bukti_follow_boc_anggota_1")} disabled={isLoading} className={fc} />
              {d.bukti_follow_boc_anggota_1 && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
            <div>
              <label className={lc}>Follow Youthverse</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "bukti_follow_yv_anggota_1")} disabled={isLoading} className={fc} />
              {d.bukti_follow_yv_anggota_1 && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
          </div>
          <div className="mt-4">
            <label className={lc}>Link Twibbon Anggota 1</label>
            <input type="url" name="link_twibbon_anggota_1" value={d.link_twibbon_anggota_1} onChange={handleChange} disabled={isLoading} className={ic} placeholder="Link post IG" required />
          </div>
        </div>

        {/* Berkas Anggota 2 */}
        <div className="mt-4 p-4 rounded-xl bg-white border border-[#002D61]/10">
          <p className="text-xs font-bold text-[#002D61] uppercase tracking-wider mb-3">Ubah Berkas Anggota 2</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className={lc}>Pas Foto</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "foto_anggota_2")} disabled={isLoading} className={fc} />
              {d.foto_anggota_2 && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
            <div>
              <label className={lc}>Kartu Pelajar</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "kartu_pelajar_anggota_2")} disabled={isLoading} className={fc} />
              {d.kartu_pelajar_anggota_2 && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
            <div>
              <label className={lc}>Follow BoC</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "bukti_follow_boc_anggota_2")} disabled={isLoading} className={fc} />
              {d.bukti_follow_boc_anggota_2 && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
            <div>
              <label className={lc}>Follow Youthverse</label>
              <input type="file" accept="image/*" onChange={(e) => handleFile(e, "bukti_follow_yv_anggota_2")} disabled={isLoading} className={fc} />
              {d.bukti_follow_yv_anggota_2 && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
            </div>
          </div>
          <div className="mt-4">
            <label className={lc}>Link Twibbon Anggota 2</label>
            <input type="url" name="link_twibbon_anggota_2" value={d.link_twibbon_anggota_2} onChange={handleChange} disabled={isLoading} className={ic} placeholder="Link post IG" required />
          </div>
        </div>

        <div className="mt-4 p-4 rounded-xl bg-white border border-[#002D61]/10">
          <p className="text-xs font-bold text-[#002D61] uppercase tracking-wider mb-3">Ubah Bukti Pembayaran QRIS</p>
          <input type="file" accept="image/*" onChange={(e) => handleFile(e, "bukti_bayar")} disabled={isLoading} className={fc} />
          {d.bukti_bayar && <span className="text-[10px] text-emerald-600 mt-1 block font-bold">✓ Tersimpan</span>}
        </div>


        <div>
          <label className={lc}>Catatan (Opsional)</label>
          <textarea name="notes" value={d.notes} onChange={handleChange} disabled={isLoading} rows={2} className={ic} />
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-[#002D61] hover:bg-[#001d40] text-white font-bold rounded-xl transition disabled:opacity-50 text-sm flex items-center gap-2 shadow-md">
            {isLoading && <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <button type="button" onClick={onCancel} disabled={isLoading} className="px-5 py-2.5 bg-white border-2 border-gray-200 hover:bg-gray-50 text-[#002D61] font-bold rounded-xl transition text-sm">Batal</button>
        </div>
      </form>
    </div>
  );
}

// ======================
// Card Registrasi
// ======================
function RegistrationCard({
  item,
  email,
  onRefresh,
}: {
  item: RegistrationHistoryItem;
  email: string;
  onRefresh: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<RegistrationDetail | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const loadDetail = useCallback(async () => {
    if (detail) return;
    setLoadingDetail(true);
    const d = await getRegistrationDetail(item.registration_id, email);
    setDetail(d);
    setLoadingDetail(false);
  }, [detail, item.registration_id, email]);

  const handleToggle = () => {
    setOpen((v) => !v);
    if (!open) loadDetail();
  };

  const handleEditSuccess = () => {
    setEditMode(false);
    setDetail(null);
    loadDetail();
    showToast("✅ Data berhasil diperbarui!");
    onRefresh();
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" });
    } catch { return iso; }
  };

  return (
    <div className="rounded-2xl border border-[#002D61]/15 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {toast && (
        <div className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-semibold">{toast}</div>
      )}
      {/* Card Header */}
      <button
        type="button"
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <p className="font-extrabold text-[#002D61] text-base">{item.nama_tim}</p>
            <StatusBadge status={item.participant_status} />
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-[#002D61]/60 font-medium">
            <span>Reg ID: <span className="font-bold">{item.registration_id}</span></span>
            <span>Anggota: <span className="font-bold">{item.jumlah_anggota} Orang</span></span>
            <span>Terdaftar: <span className="font-bold">{formatDate(item.created_at)}</span></span>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          <svg className={`w-5 h-5 text-[#002D61]/40 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      </button>

      {/* Panel Detail */}
      {open && (
        <div className="border-t border-[#002D61]/10 px-5 py-5 space-y-6 bg-gray-50/50">
          {loadingDetail ? (
            <div className="flex items-center justify-center py-10">
              <svg className="animate-spin h-6 w-6 text-[#002D61]/50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : detail ? (
            <>
              {/* WhatsApp Link Box */}
              <div className="p-4 rounded-xl border bg-green-50 border-green-200">
                <p className="text-sm text-green-900 font-medium leading-relaxed">
                  Terima kasih sudah mendaftar. Panitia akan memverifikasi dahulu data yang diberikan. Silahkan masuk ke dalam grup peserta BoC III:
                </p>
                <a href="https://chat.whatsapp.com/FkmQ9POpXziBXLHIHA2w11" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold rounded-lg transition-colors text-sm shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Gabung Grup WhatsApp
                </a>
              </div>

              {/* Info Dasar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { label: "Nama Tim", value: detail.nama_tim },
                  { label: "Asal Sekolah", value: detail.instansi },
                  { label: "Jumlah Anggota", value: `${detail.jumlah_anggota} Orang` },
                  { label: "Nama Ketua", value: detail.nama_ketua },
                  { label: "Email", value: detail.email },
                  { label: "WhatsApp Ketua", value: detail.whatsapp },
                  { label: "Anggota 1", value: detail.nama_anggota_1 },
                  { label: "WA Anggota 1", value: detail.whatsapp_anggota_1 },
                  { label: "Anggota 2", value: detail.nama_anggota_2 },
                  { label: "WA Anggota 2", value: detail.whatsapp_anggota_2 },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[10px] text-[#002D61]/50 uppercase font-bold tracking-wider">{item.label}</p>
                    <p className="text-[#002D61] text-sm font-semibold mt-0.5 break-all">{item.value || "—"}</p>
                  </div>
                ))}
              </div>

              {detail.notes && (
                <div className="p-3 rounded-xl bg-[#002D61]/5 border border-[#002D61]/10">
                  <p className="text-[10px] text-[#002D61]/50 uppercase font-bold tracking-wider mb-1">Catatan</p>
                  <p className="text-[#002D61]/80 text-sm">{detail.notes}</p>
                </div>
              )}

              {/* Dokumen */}
              <div>
                <p className="text-xs font-extrabold text-[#002D61]/40 uppercase tracking-wider mb-3">Berkas Ketua</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <ImageThumb src={detail.foto_ketua} label="Pas Foto Ketua" />
                  <ImageThumb src={detail.kartu_pelajar_ketua} label="Kartu Pelajar Ketua" />
                  <ImageThumb src={detail.bukti_follow_boc_ketua} label="Follow BoC Ketua" />
                  <ImageThumb src={detail.bukti_follow_yv_ketua} label="Follow YV Ketua" />
                </div>
                {detail.link_twibbon_ketua && (
                  <div className="mt-2 text-xs">
                    <span className="font-bold text-[#002D61]/60 mr-1">Twibbon:</span>
                    <a href={detail.link_twibbon_ketua} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{detail.link_twibbon_ketua}</a>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <p className="text-xs font-extrabold text-[#002D61]/40 uppercase tracking-wider mb-3">Berkas Anggota 1</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <ImageThumb src={detail.foto_anggota_1} label="Pas Foto A1" />
                  <ImageThumb src={detail.kartu_pelajar_anggota_1} label="Kartu Pelajar A1" />
                  <ImageThumb src={detail.bukti_follow_boc_anggota_1} label="Follow BoC A1" />
                  <ImageThumb src={detail.bukti_follow_yv_anggota_1} label="Follow YV A1" />
                </div>
                {detail.link_twibbon_anggota_1 && (
                  <div className="mt-2 text-xs">
                    <span className="font-bold text-[#002D61]/60 mr-1">Twibbon:</span>
                    <a href={detail.link_twibbon_anggota_1} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{detail.link_twibbon_anggota_1}</a>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <p className="text-xs font-extrabold text-[#002D61]/40 uppercase tracking-wider mb-3">Berkas Anggota 2</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <ImageThumb src={detail.foto_anggota_2} label="Pas Foto A2" />
                  <ImageThumb src={detail.kartu_pelajar_anggota_2} label="Kartu Pelajar A2" />
                  <ImageThumb src={detail.bukti_follow_boc_anggota_2} label="Follow BoC A2" />
                  <ImageThumb src={detail.bukti_follow_yv_anggota_2} label="Follow YV A2" />
                </div>
                {detail.link_twibbon_anggota_2 && (
                  <div className="mt-2 text-xs">
                    <span className="font-bold text-[#002D61]/60 mr-1">Twibbon:</span>
                    <a href={detail.link_twibbon_anggota_2} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline break-all">{detail.link_twibbon_anggota_2}</a>
                  </div>
                )}
              </div>

              {/* Bukti Bayar */}
              <div>
                <p className="text-xs font-extrabold text-[#002D61]/40 uppercase tracking-wider mb-3">Bukti Pembayaran</p>
                <div className="max-w-[200px]">
                  <ImageThumb src={detail.bukti_bayar} label="Bukti Pembayaran QRIS" />
                </div>
              </div>

              {/* Pesan Admin */}
              {detail.admin_message && (
                <div className={`p-4 rounded-xl border ${detail.participant_status === "DISETUJUI" ? "bg-emerald-50 border-emerald-200" : detail.participant_status === "DITOLAK" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-1 text-[#002D61]/50">Pesan dari Admin</p>
                  <p className={`text-sm font-medium ${detail.participant_status === "DISETUJUI" ? "text-emerald-700" : detail.participant_status === "DITOLAK" ? "text-red-700" : "text-amber-700"}`}>
                    {detail.admin_message}
                  </p>
                </div>
              )}

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[#002D61]/50 uppercase font-bold tracking-wider">Tanggal Daftar</p>
                  <p className="text-[#002D61] font-semibold mt-0.5">{formatDate(detail.created_at)}</p>
                </div>
                <div>
                  <p className="text-[#002D61]/50 uppercase font-bold tracking-wider">Update Terakhir</p>
                  <p className="text-[#002D61] font-semibold mt-0.5">{formatDate(detail.updated_at)}</p>
                </div>
              </div>

              {/* Action — Edit hanya jika MENUNGGU */}
              {detail.participant_status === "MENUNGGU" && !editMode && (
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-[#700702]/5 hover:bg-[#700702]/10 text-[#700702] border border-[#700702]/20 rounded-xl transition"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  Edit Pendaftaran
                </button>
              )}

              {detail.participant_status === "MENUNGGU" && editMode && (
                <EditPanel
                  detail={detail}
                  email={email}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setEditMode(false)}
                />
              )}

              {detail.participant_status !== "MENUNGGU" && (
                <p className="text-xs text-[#002D61]/40 italic">
                  Data tidak dapat diubah karena status pendaftaran sudah {detail.participant_status === "DISETUJUI" ? "Disetujui" : "Ditolak"}.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-[#002D61]/50 text-center py-8">Gagal memuat detail pendaftaran.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ======================
// Main Page
// ======================
export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const [registrations, setRegistrations] = useState<RegistrationHistoryItem[]>([]);
  const [userData, setUserData] = useState<{ whatsapp: string; user_id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/login");
  }, [isAuthenticated, router]);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user?.email) return;
    setLoading(true);
    try {
      const [userInfo, regs] = await Promise.all([
        getUserByEmail(user.email),
        getRegistrationsByEmail(user.email),
      ]);
      if (userInfo) setUserData({ whatsapp: userInfo.whatsapp, user_id: userInfo.user_id });
      setRegistrations(regs);
    } catch (err) {
      console.error("[Profile] Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.email]);

  useEffect(() => { fetchData(); }, [fetchData, refreshKey]);

  if (!isAuthenticated || !user) return null;

  const stats = {
    total: registrations.length,
    menunggu: registrations.filter((r) => r.participant_status === "MENUNGGU").length,
    disetujui: registrations.filter((r) => r.participant_status === "DISETUJUI").length,
    ditolak: registrations.filter((r) => r.participant_status === "DITOLAK").length,
  };

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans text-[#002D61] antialiased">
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-[#700702]/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#002D61]/5 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-20 md:py-28">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#002D61] leading-tight">
            Berkas Investigator
          </h1>
          <p className="text-base text-[#002D61]/70 mt-4 max-w-xl mx-auto font-medium">
            Kelola seluruh pendaftaran tim Anda di satu tempat.
          </p>
        </div>

        {/* Profile Card */}
        <div className="p-6 md:p-8 rounded-3xl border border-[#002D61]/10 bg-white/90 backdrop-blur-md shadow-lg shadow-[#002D61]/5 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt={user.name} className="w-20 h-20 rounded-full border-2 border-[#700702]/20" />
            ) : (
              <div className="w-20 h-20 rounded-full bg-[#700702]/10 flex items-center justify-center text-[#700702] font-bold text-2xl">
                {user.name?.[0] ?? "U"}
              </div>
            )}
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-xl md:text-2xl font-black text-[#002D61]">{user.name}</h2>
              <p className="text-sm text-[#002D61]/70 mt-1 font-medium">{user.email}</p>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
                  Terhubung
                </span>
                <span className="px-3 py-1 rounded-full bg-[#002D61]/5 border border-[#002D61]/10 text-[#002D61] text-xs font-bold">
                  {stats.total} Pendaftaran
                </span>
              </div>
            </div>
            <div className="sm:ml-auto">
              <button
                onClick={logout}
                className="px-5 py-2.5 rounded-xl bg-white border-2 border-red-100 hover:bg-red-50 text-red-600 text-sm font-bold transition-colors"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* List of Registrations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-extrabold text-[#002D61]">Riwayat Pendaftaran</h3>
            <button
              onClick={() => router.push("/register")}
              className="px-4 py-2 bg-[#700702] hover:bg-[#8a0903] text-white text-sm font-bold rounded-xl shadow-md transition-colors"
            >
              + Daftar Tim Baru
            </button>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-[#002D61] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <p className="text-[#002D61]/60 font-medium text-sm">Memuat data pendaftaran...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="p-12 border-2 border-dashed border-[#002D61]/15 rounded-3xl text-center bg-white/50">
              <div className="w-16 h-16 mx-auto bg-[#002D61]/5 text-[#002D61]/40 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-[#002D61] mb-2">Belum ada tim terdaftar</h3>
              <p className="text-[#002D61]/60 mb-6 font-medium text-sm">Anda belum mendaftarkan tim investigasi apa pun.</p>
              <button onClick={() => router.push("/register")} className="px-6 py-3 bg-[#700702] hover:bg-[#8a0903] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all">
                Mulai Pendaftaran
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {registrations.map((reg) => (
                <RegistrationCard
                  key={reg.registration_id}
                  item={reg}
                  email={user.email}
                  onRefresh={() => setRefreshKey((k) => k + 1)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}