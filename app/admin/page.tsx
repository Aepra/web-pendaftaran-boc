"use client";

import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import {
  getAllRegistrations,
  adminGetRegistrationDetail,
  updateRegistrationStatus,
  getAdmins,
  addAdmin,
  removeAdmin,
} from "@/lib/api/boc-api";
import type { RegistrationHistoryItem, RegistrationDetail, ParticipantStatus } from "@/types";

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "abelekaputra05@gmail.com";

// ======================
// Badge Status
// ======================
function StatusBadge({ status }: { status: ParticipantStatus }) {
  const map: Record<ParticipantStatus, { cls: string; label: string }> = {
    MENUNGGU: { cls: "bg-amber-50 text-amber-700 border-amber-200", label: "Menunggu" },
    DISETUJUI: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Disetujui" },
    DITOLAK: { cls: "bg-red-50 text-red-700 border-red-200", label: "Ditolak" },
  };
  const s = map[status] ?? map["MENUNGGU"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "MENUNGGU" ? "bg-amber-400" : status === "DISETUJUI" ? "bg-emerald-500" : "bg-red-500"}`} />
      {s.label}
    </span>
  );
}

// ======================
// Toast
// ======================
function Toast({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <div className="fixed top-6 right-6 z-50 px-5 py-3 bg-[#002D61] text-white text-sm font-semibold rounded-xl shadow-xl animate-pulse">
      {msg}
    </div>
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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-2xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#002D61]/10">
          <p className="font-extrabold text-[#002D61] truncate">{label}</p>
          <div className="flex gap-2">
            <a href={src} download className="px-3 py-1.5 text-xs font-bold bg-[#002D61] text-white rounded-lg hover:bg-[#002D61]/90 transition flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download
            </a>
            <button onClick={onClose} className="p-1.5 rounded-lg text-[#002D61]/50 hover:bg-[#002D61]/5 hover:text-[#002D61] transition">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
        <div className="p-4 bg-gray-50/50 flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} className="max-h-[70vh] max-w-full object-contain rounded-lg border border-[#002D61]/10 shadow-sm" />
        </div>
      </div>
    </div>
  );
}

// ======================
// ======================
// Helper: Convert Google Drive URL → format yang bisa ditampilkan di browser
// ======================
function toDriveImgUrl(url?: string): string {
  if (!url) return "";
  // Data URL (base64) — langsung pakai
  if (url.startsWith("data:")) return url;
  // Ekstrak file ID dari berbagai format URL Google Drive
  let fileId = "";
  // Format: ?id=FILE_ID atau &id=FILE_ID (uc?id=, thumbnail?id=)
  const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (idMatch) fileId = idMatch[1];
  // Format: /file/d/FILE_ID/ atau /d/FILE_ID/
  const fileMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];
  // Jika dapat file ID, gunakan format lh3 yang tidak butuh auth
  if (fileId) return `https://lh3.googleusercontent.com/d/${fileId}`;
  return url;
}

// ======================
// Image Thumbnail (Admin)
// ======================
function ImageThumb({ src, label }: { src?: string; label: string }) {
  const [preview, setPreview] = useState(false);
  const imgSrc = toDriveImgUrl(src);
  if (!src) return (
    <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-[10px] border border-gray-200">
      Tidak ada
    </div>
  );
  return (
    <>
      {preview && <ImagePreviewModal src={imgSrc} label={label} onClose={() => setPreview(false)} />}
      <button type="button" onClick={() => setPreview(true)} className="group relative block aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:border-[#002D61]/40 transition">
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
// Dialog Konfirmasi
// ======================
function ConfirmDialog({
  status,
  adminMessage,
  onConfirm,
  onCancel,
  loading,
}: {
  status: ParticipantStatus;
  adminMessage: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const map: Record<ParticipantStatus, { color: string; label: string }> = {
    MENUNGGU: { color: "text-amber-700", label: "Menunggu" },
    DISETUJUI: { color: "text-emerald-700", label: "Disetujui" },
    DITOLAK: { color: "text-red-700", label: "Ditolak" },
  };
  const info = map[status];
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h3 className="text-lg font-extrabold text-[#002D61] mb-2">Konfirmasi Perubahan Status</h3>
        <p className="text-sm text-[#002D61]/70 mb-4">
          Apakah Anda yakin ingin mengubah status menjadi{" "}
          <span className={`font-bold ${info.color}`}>{info.label}</span>?
          {adminMessage && (
            <>
              {" "}Pesan yang akan dikirim ke peserta:
              <span className="block mt-2 p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-medium text-gray-700 italic">"{adminMessage}"</span>
            </>
          )}
        </p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} disabled={loading} className="px-4 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition disabled:opacity-50">
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2 rounded-xl text-sm font-bold text-white transition disabled:opacity-50 ${status === "DISETUJUI" ? "bg-emerald-600 hover:bg-emerald-500" : status === "DITOLAK" ? "bg-red-600 hover:bg-red-500" : "bg-amber-500 hover:bg-amber-400 text-white"}`}
          >
            {loading ? "Memproses..." : `Ya, Ubah ke ${info.label}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// ======================
// Panel Verifikasi
// ======================
function VerificationPanel({
  reg,
  onSuccess,
}: {
  reg: RegistrationDetail;
  onSuccess: (id: string, status: ParticipantStatus, msg: string) => void;
}) {
  const [newStatus, setNewStatus] = useState<ParticipantStatus>(reg.participant_status);
  const [adminMessage, setAdminMessage] = useState(reg.admin_message || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = () => {
    setError("");
    if (newStatus === "DITOLAK" && !adminMessage.trim()) {
      setError("Pesan alasan penolakan wajib diisi.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setShowConfirm(false);
    const result = await updateRegistrationStatus(reg.registration_id, newStatus, adminMessage);
    setLoading(false);
    if (result.success) {
      onSuccess(reg.registration_id, newStatus, adminMessage);
    } else {
      setError(result.message || "Gagal memperbarui status.");
    }
  };

  return (
    <>
      {showConfirm && (
        <ConfirmDialog
          status={newStatus}
          adminMessage={adminMessage}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
          loading={loading}
        />
      )}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#002D61]/60 uppercase tracking-wider mb-1.5">Status Baru</label>
          <div className="flex gap-2 flex-wrap">
            {(["MENUNGGU", "DISETUJUI", "DITOLAK"] as ParticipantStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setNewStatus(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${newStatus === s
                  ? s === "MENUNGGU" ? "bg-amber-500 border-amber-500 text-white" : s === "DISETUJUI" ? "bg-emerald-600 border-emerald-600 text-white" : "bg-red-600 border-red-600 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
              >
                {s === "MENUNGGU" ? "Menunggu" : s === "DISETUJUI" ? "Disetujui" : "Ditolak"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#002D61]/60 uppercase tracking-wider mb-1.5">
            Pesan untuk Peserta
            {newStatus === "DITOLAK" && <span className="text-red-500 ml-1">*Wajib</span>}
            {newStatus === "DISETUJUI" && <span className="text-gray-400 ml-1">(Opsional)</span>}
          </label>
          <textarea
            value={adminMessage}
            onChange={(e) => setAdminMessage(e.target.value)}
            rows={3}
            placeholder={
              newStatus === "DISETUJUI"
                ? "Contoh: Selamat, pendaftaran tim Anda telah disetujui."
                : newStatus === "DITOLAK"
                ? "Contoh: Bukti pembayaran kurang jelas. Harap upload ulang."
                : ""
            }
            className="w-full p-3 border border-[#002D61]/15 rounded-xl bg-[#FFF6E9]/50 text-[#002D61] placeholder:text-[#002D61]/30 focus:ring-2 focus:ring-[#700702]/40 focus:border-[#700702] focus:outline-none text-sm resize-none"
          />
        </div>

        {error && (
          <p className="text-red-600 text-xs font-semibold">{error}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || newStatus === reg.participant_status}
          className="w-full py-3 bg-[#002D61] hover:bg-[#002D61]/90 text-white font-bold rounded-xl transition disabled:opacity-40 text-sm flex items-center justify-center gap-2"
        >
          {loading ? (
            <><svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Memproses...</>
          ) : (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>Simpan Keputusan</>
          )}
        </button>
        {newStatus === reg.participant_status && (
          <p className="text-xs text-center text-[#002D61]/40">Pilih status yang berbeda untuk menyimpan.</p>
        )}
      </div>
    </>
  );
}

// ======================
// Detail Panel (Admin)
// ======================
function AdminDetailPanel({
  regId,
  onStatusUpdate,
}: {
  regId: string;
  onStatusUpdate: (id: string, status: ParticipantStatus, msg: string) => void;
}) {
  const [detail, setDetail] = useState<RegistrationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setDetail(null);
    adminGetRegistrationDetail(regId).then((d) => {
      setDetail(d);
      setLoading(false);
    });
  }, [regId]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <svg className="animate-spin h-7 w-7 text-[#002D61]/40" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    </div>
  );

  if (!detail) return <p className="text-sm text-center text-[#002D61]/50 py-10">Gagal memuat detail.</p>;

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }); }
    catch { return iso; }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-extrabold text-[#002D61] text-lg leading-tight">{detail.nama_tim}</h3>
          <p className="text-xs text-[#002D61]/50 mt-0.5">ID: {detail.registration_id}</p>
        </div>
        <StatusBadge status={detail.participant_status} />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Ketua", value: detail.nama_ketua },
          { label: "Sekolah", value: detail.instansi },
          { label: "Email", value: detail.email },
          { label: "WhatsApp", value: detail.whatsapp },
          { label: "Jml. Anggota", value: `${detail.jumlah_anggota} Orang` },
          { label: "Tgl. Daftar", value: formatDate(detail.created_at) },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-[10px] text-[#002D61]/50 uppercase font-bold tracking-wider">{item.label}</p>
            <p className="font-semibold text-[#002D61] text-xs mt-0.5 break-all">{item.value || "—"}</p>
          </div>
        ))}
      </div>

      {detail.jumlah_anggota >= 2 && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-[#002D61]/50 uppercase font-bold tracking-wider">Anggota 1</p>
            <p className="font-semibold text-[#002D61] text-xs mt-0.5">{detail.nama_anggota_1}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#002D61]/50 uppercase font-bold tracking-wider">WA Anggota 1</p>
            <p className="font-semibold text-[#002D61] text-xs mt-0.5">{detail.whatsapp_anggota_1}</p>
          </div>
        </div>
      )}
      {detail.jumlah_anggota === 3 && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[10px] text-[#002D61]/50 uppercase font-bold tracking-wider">Anggota 2</p>
            <p className="font-semibold text-[#002D61] text-xs mt-0.5">{detail.nama_anggota_2}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#002D61]/50 uppercase font-bold tracking-wider">WA Anggota 2</p>
            <p className="font-semibold text-[#002D61] text-xs mt-0.5">{detail.whatsapp_anggota_2}</p>
          </div>
        </div>
      )}

      {detail.notes && (
        <div className="p-3 rounded-xl bg-[#FFF6E9] border border-[#002D61]/10">
          <p className="text-[10px] text-[#002D61]/50 uppercase font-bold tracking-wider mb-1">Catatan Peserta</p>
          <p className="text-xs text-[#002D61]/80">{detail.notes}</p>
        </div>
      )}

      {/* Berkas */}
      <div>
        <p className="text-xs font-extrabold text-[#002D61] uppercase tracking-wider border-b border-[#002D61]/10 pb-2 mb-3">Berkas Pendaftaran</p>

        {detail.bukti_bayar && (
          <div className="mb-4">
            <p className="text-[10px] font-bold text-[#700702] uppercase mb-2">Bukti Pembayaran QRIS</p>
            <div className="max-w-[140px]">
              <ImageThumb src={detail.bukti_bayar} label="Bukti Pembayaran" />
            </div>
          </div>
        )}

        <p className="text-[10px] font-bold text-[#002D61] uppercase mb-2">Ketua — {detail.nama_ketua}</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <ImageThumb src={detail.foto_ketua} label="Pas Foto Ketua" />
          <ImageThumb src={detail.kartu_pelajar_ketua} label="KTP/Kartu Pelajar" />
          <ImageThumb src={detail.bukti_follow_ketua} label="Bukti Follow IG" />
        </div>

        {detail.jumlah_anggota >= 2 && (
          <>
            <p className="text-[10px] font-bold text-[#002D61] uppercase mb-2">Anggota 1 — {detail.nama_anggota_1}</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <ImageThumb src={detail.foto_anggota_1} label="Pas Foto A1" />
              <ImageThumb src={detail.kartu_pelajar_anggota_1} label="Kartu Pelajar A1" />
              <ImageThumb src={detail.bukti_follow_anggota_1} label="Bukti Follow A1" />
            </div>
          </>
        )}
        {detail.jumlah_anggota === 3 && (
          <>
            <p className="text-[10px] font-bold text-[#002D61] uppercase mb-2">Anggota 2 — {detail.nama_anggota_2}</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <ImageThumb src={detail.foto_anggota_2} label="Pas Foto A2" />
              <ImageThumb src={detail.kartu_pelajar_anggota_2} label="Kartu Pelajar A2" />
              <ImageThumb src={detail.bukti_follow_anggota_2} label="Bukti Follow A2" />
            </div>
          </>
        )}
      </div>

      {/* Pesan Admin Sebelumnya */}
      {detail.admin_message && (
        <div className="p-3 rounded-xl bg-[#002D61]/5 border border-[#002D61]/10">
          <p className="text-[10px] text-[#002D61]/50 uppercase font-bold tracking-wider mb-1">Pesan Admin Sebelumnya</p>
          <p className="text-xs text-[#002D61]/80 italic">"{detail.admin_message}"</p>
        </div>
      )}

      <div className="text-[10px] text-[#002D61]/40 flex gap-4">
        <span>Daftar: {formatDate(detail.created_at)}</span>
        <span>Update: {formatDate(detail.updated_at)}</span>
      </div>

      {/* Separator */}
      <div className="border-t border-[#002D61]/10 pt-5">
        <p className="text-xs font-extrabold text-[#002D61] uppercase tracking-wider mb-4">Verifikasi Pendaftaran</p>
        <VerificationPanel reg={detail} onSuccess={onStatusUpdate} />
      </div>
    </div>
  );
}

// ======================
// Admin Management Panel
// ======================
function AdminManagementPanel({ isSuperAdmin }: { isSuperAdmin: boolean }) {
  const [admins, setAdmins] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdmin, setNewAdmin] = useState("");
  const [msg, setMsg] = useState("");

  const loadAdmins = useCallback(async () => {
    setLoading(true);
    const data = await getAdmins();
    setAdmins(data);
    setLoading(false);
  }, []);

  useEffect(() => { loadAdmins(); }, [loadAdmins]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdmin) return;
    setLoading(true);
    setMsg("");
    const res = await addAdmin(newAdmin);
    setMsg(res.message || (res.success ? "Admin berhasil ditambahkan" : "Gagal menambahkan admin"));
    if (res.success) {
      setNewAdmin("");
      loadAdmins();
    } else {
      setLoading(false);
    }
  };

  const handleRemove = async (email: string) => {
    if (!confirm(`Hapus ${email} dari admin?`)) return;
    setLoading(true);
    setMsg("");
    const res = await removeAdmin(email);
    setMsg(res.message || (res.success ? "Admin berhasil dihapus" : "Gagal menghapus admin"));
    if (res.success) {
      loadAdmins();
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#002D61]/10 shadow-sm p-6 max-w-3xl">
      <h2 className="text-xl font-extrabold text-[#002D61] mb-4">Manajemen Admin</h2>
      
      {!isSuperAdmin && (
        <div className="mb-6 p-4 bg-amber-50 text-amber-700 rounded-xl text-sm border border-amber-200">
          <strong>Perhatian:</strong> Anda bukan Super Admin. Hanya Super Admin (yang dikonfigurasi di server) yang memiliki fitur perlindungan anti-hapus mutlak. Pastikan berhati-hati saat menambah/menghapus admin.
        </div>
      )}

      {msg && (
        <div className="mb-6 p-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold border border-blue-200">
          {msg}
        </div>
      )}

      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          type="email"
          required
          placeholder="Masukkan alamat Gmail admin baru..."
          value={newAdmin}
          onChange={(e) => setNewAdmin(e.target.value)}
          disabled={loading}
          className="flex-1 p-3 border border-[#002D61]/15 rounded-xl bg-[#FFF6E9]/50 text-[#002D61] placeholder:text-[#002D61]/40 focus:outline-none focus:border-[#700702]"
        />
        <button
          type="submit"
          disabled={loading || !newAdmin}
          className="px-6 py-3 bg-[#002D61] hover:bg-[#002D61]/90 text-white font-bold rounded-xl transition disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Memproses..." : "Tambahkan Admin"}
        </button>
      </form>

      <div className="space-y-3">
        <p className="text-xs font-extrabold text-[#002D61]/60 uppercase tracking-wider mb-2">Daftar Admin Aktif</p>
        
        <div className="flex items-center justify-between gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 w-8 h-8 rounded-full bg-[#700702] flex items-center justify-center text-white font-bold text-xs">S</div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#002D61] truncate">{ADMIN_EMAIL}</p>
              <p className="text-[10px] font-semibold text-[#700702] uppercase tracking-wider truncate">Super Admin (Server Config)</p>
            </div>
          </div>
        </div>

        {loading && admins.length === 0 ? (
          <p className="text-sm text-gray-400 py-4 text-center">Memuat data admin...</p>
        ) : (
          admins.map((email) => (
            <div key={email} className="flex items-center justify-between gap-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-8 h-8 rounded-full bg-[#002D61]/10 flex items-center justify-center text-[#002D61] font-bold text-xs">
                  {email[0].toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#002D61] truncate">{email}</p>
                  <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider truncate">Admin Tambahan</p>
                </div>
              </div>
              <button
                onClick={() => handleRemove(email)}
                disabled={loading}
                className="shrink-0 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
              >
                Hapus
              </button>
            </div>
          ))
        )}
        {admins.length === 0 && !loading && (
          <p className="text-sm text-gray-400 py-4 text-center">Belum ada admin tambahan.</p>
        )}
      </div>
    </div>
  );
}

// ======================
// Main Admin Dashboard
// ======================
export default function AdminDashboard() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"pendaftaran" | "manajemen">("pendaftaran");
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [registrations, setRegistrations] = useState<RegistrationHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | ParticipantStatus>("ALL");
  const [search, setSearch] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  // Auth guard with multi-admin support
  useEffect(() => {
    if (!isAuthenticated) { 
      router.replace("/login"); 
      return; 
    }
    if (!user) return;
    
    // Immediately allow Super Admin
    if (user.email === ADMIN_EMAIL) {
      setIsAdmin(true);
      setCheckingAuth(false);
      return;
    }

    // Check remote admin list
    getAdmins().then(admins => {
      if (user.email && admins.includes(user.email)) {
        setIsAdmin(true);
      } else {
        router.replace("/");
      }
      setCheckingAuth(false);
    });
  }, [isAuthenticated, user, router]);

  const loadData = useCallback(async () => {
    if (!isAdmin) return;
    setLoading(true);
    const data = await getAllRegistrations();
    setRegistrations(data);
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => { 
    if (isAdmin && activeTab === "pendaftaran") {
      loadData(); 
    }
  }, [isAdmin, activeTab, loadData]);

  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(""), 3500); };

  const handleStatusUpdate = (id: string, status: ParticipantStatus, msg: string) => {
    setRegistrations((prev) =>
      prev.map((r) => r.registration_id === id ? { ...r, participant_status: status, admin_message: msg } : r)
    );
    showToast(`✅ Status berhasil diubah ke ${status === "MENUNGGU" ? "Menunggu" : status === "DISETUJUI" ? "Disetujui" : "Ditolak"}.`);
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#FFF6E9] flex flex-col items-center justify-center text-[#002D61]">
        <svg className="animate-spin h-10 w-10 mb-4 opacity-50" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="font-semibold text-lg animate-pulse">Memverifikasi akses Admin...</p>
      </div>
    );
  }

  if (!isAdmin || !user) return null;

  // Stats
  const stats = {
    total: registrations.length,
    menunggu: registrations.filter((r) => r.participant_status === "MENUNGGU").length,
    disetujui: registrations.filter((r) => r.participant_status === "DISETUJUI").length,
    ditolak: registrations.filter((r) => r.participant_status === "DITOLAK").length,
  };

  // Filter & Search
  const q = search.toLowerCase();
  const filtered = registrations.filter((r) => {
    const matchStatus = filterStatus === "ALL" || r.participant_status === filterStatus;
    const matchSearch = !q || (
      r.nama_tim?.toLowerCase().includes(q) ||
      r.nama_ketua?.toLowerCase().includes(q) ||
      r.instansi?.toLowerCase().includes(q) ||
      r.registration_id?.toLowerCase().includes(q)
    );
    return matchStatus && matchSearch;
  });

  const formatDate = (iso: string) => {
    try { return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); }
    catch { return iso; }
  };

  return (
    <div className="min-h-screen bg-[#FFF6E9] font-sans text-[#002D61] antialiased">
      <Toast msg={toastMsg} />

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#002D61] text-white fixed inset-y-0 left-0 z-30 shadow-2xl">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#700702] flex items-center justify-center font-black text-lg shadow-lg">B</div>
              <div>
                <p className="font-extrabold text-sm leading-tight">BoC III Admin</p>
                <p className="text-white/50 text-[11px]">Battle of Champions 2026</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => setActiveTab("pendaftaran")}
              className={`w-full text-left px-4 py-3 rounded-xl border flex items-center gap-3 transition-colors ${
                activeTab === "pendaftaran" 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-transparent border-transparent text-white/70 hover:bg-white/5"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-sm font-bold">Pendaftaran</span>
            </button>
            
            <button
              onClick={() => setActiveTab("manajemen")}
              className={`w-full text-left px-4 py-3 rounded-xl border flex items-center gap-3 transition-colors ${
                activeTab === "manajemen" 
                ? "bg-white/10 border-white/20 text-white" 
                : "bg-transparent border-transparent text-white/70 hover:bg-white/5"
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className="text-sm font-bold">Manajemen Admin</span>
            </button>
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3 mb-3">
              {user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full border-2 border-white/20" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-[#700702] flex items-center justify-center font-bold text-sm">
                  {user.name?.[0] ?? "A"}
                </div>
              )}
              <div className="overflow-hidden">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-[11px] text-white/50 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/10 hover:bg-[#700702]/50 text-sm font-semibold transition-colors border border-white/10"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Keluar
            </button>
          </div>
        </aside>

          <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
            {/* Mobile Header */}
            <header className="lg:hidden sticky top-0 z-20 bg-[#002D61] text-white px-4 py-4 flex items-center justify-between shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#700702] flex items-center justify-center font-black text-sm">B</div>
                <span className="font-extrabold text-sm">BoC III Admin</span>
              </div>
              <button onClick={logout} className="text-white/70 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </header>

            {/* Mobile Tab Switcher */}
            <div className="lg:hidden px-4 pt-4 pb-1">
              <div className="flex bg-white rounded-xl shadow-sm border border-[#002D61]/10 p-1">
                <button
                  onClick={() => setActiveTab("pendaftaran")}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${
                    activeTab === "pendaftaran" 
                    ? "bg-[#002D61] text-white" 
                    : "text-[#002D61]/60 hover:bg-gray-50"
                  }`}
                >
                  Pendaftaran
                </button>
                <button
                  onClick={() => setActiveTab("manajemen")}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${
                    activeTab === "manajemen" 
                    ? "bg-[#002D61] text-white" 
                    : "text-[#002D61]/60 hover:bg-gray-50"
                  }`}
                >
                  Manajemen Admin
                </button>
              </div>
            </div>

            <div className="flex-1 p-4 md:p-8 space-y-6">
            {activeTab === "manajemen" ? (
              <AdminManagementPanel isSuperAdmin={user.email === ADMIN_EMAIL} />
            ) : (
              <>
                {/* Title */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-[#002D61]">Dashboard Pendaftaran</h1>
                  <p className="text-sm text-[#002D61]/60 mt-1">Verifikasi dan kelola data peserta Battle of Champions III 2026</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Pendaftar", value: stats.total, color: "bg-[#002D61]" },
                    { label: "Menunggu", value: stats.menunggu, color: "bg-amber-500" },
                    { label: "Disetujui", value: stats.disetujui, color: "bg-emerald-600" },
                    { label: "Ditolak", value: stats.ditolak, color: "bg-red-600" },
                  ].map((s) => (
                    <div key={s.label} className={`${s.color} text-white rounded-2xl p-5 shadow-md`}>
                      <div className="text-3xl font-extrabold">{loading ? "–" : s.value}</div>
                      <div className="text-xs font-semibold opacity-80 mt-1 uppercase tracking-wide">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Table + Detail */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  {/* Left: List */}
                  <div className="xl:col-span-2 bg-white rounded-2xl border border-[#002D61]/10 shadow-sm overflow-hidden">
                    {/* Toolbar */}
                    <div className="px-5 py-4 border-b border-[#002D61]/8 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                      <h2 className="text-base font-extrabold text-[#002D61]">
                        Daftar Peserta ({filtered.length})
                      </h2>
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Search */}
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002D61]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <input
                            type="text"
                            placeholder="Nama tim, ketua, sekolah..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9 pr-3 py-2 text-xs rounded-lg border border-[#002D61]/15 bg-[#FFF6E9] text-[#002D61] placeholder:text-[#002D61]/40 focus:outline-none focus:border-[#002D61]/40 w-52"
                          />
                        </div>
                        {/* Filter Tabs */}
                        <div className="flex bg-[#FFF6E9] rounded-lg border border-[#002D61]/10 p-0.5">
                          {([["ALL", "Semua"], ["MENUNGGU", "Menunggu"], ["DISETUJUI", "Disetujui"], ["DITOLAK", "Ditolak"]] as const).map(([val, lbl]) => (
                            <button
                              key={val}
                              onClick={() => setFilterStatus(val)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === val ? "bg-[#002D61] text-white shadow-sm" : "text-[#002D61]/60 hover:text-[#002D61]"}`}
                            >
                              {lbl}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card List */}
                    <div className="divide-y divide-[#002D61]/5">
                      {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 text-[#002D61]/40">
                          <svg className="animate-spin h-7 w-7 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <p className="text-sm">Memuat data...</p>
                        </div>
                      ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-[#002D61]/40">
                          <svg className="w-10 h-10 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="text-sm font-medium">Tidak ada data ditemukan.</p>
                        </div>
                      ) : (
                        filtered.map((reg) => (
                          <button
                            key={reg.registration_id}
                            type="button"
                            onClick={() => setSelectedId(reg.registration_id === selectedId ? null : reg.registration_id)}
                            className={`w-full text-left px-5 py-4 hover:bg-[#002D61]/3 transition-colors ${selectedId === reg.registration_id ? "bg-[#002D61]/5 border-l-4 border-l-[#700702]" : ""}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-[#002D61] text-sm">{reg.nama_tim}</p>
                                <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-xs text-[#002D61]/60">
                                  <span>{reg.nama_ketua}</span>
                                  <span>·</span>
                                  <span className="truncate max-w-[160px]">{reg.instansi}</span>
                                  <span>·</span>
                                  <span>{reg.jumlah_anggota} orang</span>
                                  <span>·</span>
                                  <span>{formatDate(reg.created_at)}</span>
                                </div>
                              </div>
                              <StatusBadge status={reg.participant_status} />
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right: Detail Panel */}
                  <div className="xl:col-span-1">
                    <div className="sticky top-8 bg-white rounded-2xl border border-[#002D61]/10 shadow-sm overflow-hidden">
                      {selectedId ? (
                        <div className="max-h-[85vh] overflow-y-auto p-5">
                          <AdminDetailPanel
                            key={selectedId}
                            regId={selectedId}
                            onStatusUpdate={handleStatusUpdate}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
                          <div className="w-16 h-16 rounded-2xl bg-[#002D61]/8 flex items-center justify-center mb-4">
                            <svg className="w-8 h-8 text-[#002D61]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                          <p className="text-sm font-semibold text-[#002D61]/50">
                            Pilih peserta untuk melihat detail & berkas
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
            </div>
          </main>
      </div>
    </div>
  );
}
