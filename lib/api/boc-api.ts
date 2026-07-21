/**
 * BOC API Service Layer
 *
 * Single gateway ke Google Apps Script backend.
 * Semua request dikirim melalui Next.js proxy (/api/register) untuk menghindari CORS.
 *
 * Sistem Pembayaran: QRIS tunggal Rp100.000/Tim
 * Status: MENUNGGU | DISETUJUI | DITOLAK
 */

import type {
  UserDTO,
  RegistrationHistoryItem,
  RegistrationDetail,
  RegistrationData,
  ParticipantStatus,
  BocApiResponse,
} from "@/types";

// ======================
// Generic fetch via Next.js API proxy
// ======================

async function callApi<T>(payload: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(
      (errorBody as { message?: string }).message ||
        `Server returned HTTP ${res.status}`
    );
  }

  const data: T = await res.json();
  return data;
}

// ======================
// User API
// ======================

/** Sync akun Google ke sheet users setelah login. */
export async function syncGoogleUser(data: {
  name: string;
  email: string;
}): Promise<void> {
  try {
    await callApi<{ status: string }>({
      action: "sync_google_user",
      name: data.name,
      email: data.email,
    });
  } catch {
    console.warn("[syncGoogleUser] Gagal sinkronisasi (non-critical)");
  }
}

/** Ambil data profil user berdasarkan email. */
export async function getUserByEmail(email: string): Promise<UserDTO | null> {
  const response = await callApi<BocApiResponse<UserDTO>>({
    action: "get_user",
    email,
  });

  if (response.status !== "success") return null;
  return response.data;
}

// ======================
// Registrasi — User
// ======================

/** Submit pendaftaran baru. */
export async function registerParticipant(payload: {
  nama_tim: string;
  nama_ketua: string;
  email: string;
  whatsapp: string;
  instansi: string;
  jumlah_anggota: number;
  nama_anggota_1: string;
  whatsapp_anggota_1: string;
  nama_anggota_2: string;
  whatsapp_anggota_2: string;
  notes: string;
  foto_ketua: string;
  kartu_pelajar_ketua: string;
  bukti_follow_boc_ketua: string;
  bukti_follow_yv_ketua: string;
  foto_anggota_1: string;
  kartu_pelajar_anggota_1: string;
  bukti_follow_boc_anggota_1: string;
  bukti_follow_yv_anggota_1: string;
  foto_anggota_2: string;
  kartu_pelajar_anggota_2: string;
  bukti_follow_boc_anggota_2: string;
  bukti_follow_yv_anggota_2: string;
  bukti_bayar: string;
  link_twibbon_ketua: string;
  link_twibbon_anggota_1: string;
  link_twibbon_anggota_2: string;
}): Promise<{ status: "success" | "error"; message?: string; data?: RegistrationData }> {
  return callApi({
    action: "register",
    ...payload,
  });
}

/** Ambil daftar riwayat pendaftaran berdasarkan email. */
export async function getRegistrationsByEmail(
  email: string
): Promise<RegistrationHistoryItem[]> {
  const response = await callApi<BocApiResponse<RegistrationHistoryItem[]>>({
    action: "get_registrations",
    email,
  });

  if (response.status !== "success" || !Array.isArray(response.data)) return [];
  return response.data;
}

/** Ambil detail lengkap satu pendaftaran (untuk user). */
export async function getRegistrationDetail(
  registrationId: string,
  email: string
): Promise<RegistrationDetail | null> {
  const response = await callApi<BocApiResponse<RegistrationDetail>>({
    action: "get_registration_detail",
    registration_id: registrationId,
    email,
  });

  if (response.status !== "success") return null;
  return response.data;
}

/** Update pendaftaran yang masih MENUNGGU. */
export async function updateRegistration(payload: {
  registration_id: string;
  email: string;
  nama_tim: string;
  nama_ketua: string;
  whatsapp: string;
  instansi: string;
  jumlah_anggota: number;
  nama_anggota_1: string;
  whatsapp_anggota_1: string;
  nama_anggota_2: string;
  whatsapp_anggota_2: string;
  notes: string;
  foto_ketua: string;
  kartu_pelajar_ketua: string;
  bukti_follow_boc_ketua: string;
  bukti_follow_yv_ketua: string;
  foto_anggota_1: string;
  kartu_pelajar_anggota_1: string;
  bukti_follow_boc_anggota_1: string;
  bukti_follow_yv_anggota_1: string;
  foto_anggota_2: string;
  kartu_pelajar_anggota_2: string;
  bukti_follow_boc_anggota_2: string;
  bukti_follow_yv_anggota_2: string;
  bukti_bayar: string;
  link_twibbon_ketua: string;
  link_twibbon_anggota_1: string;
  link_twibbon_anggota_2: string;
}): Promise<{ status: "success" | "error"; message?: string }> {
  return callApi({
    action: "update_registration",
    ...payload,
  });
}

// ======================
// Admin API
// ======================

/** Ambil semua pendaftaran (admin only). */
export async function getAllRegistrations(): Promise<RegistrationHistoryItem[]> {
  const response = await callApi<BocApiResponse<RegistrationHistoryItem[]>>({
    action: "admin_get_all_registrations",
  });

  if (response.status !== "success" || !Array.isArray(response.data)) {
    console.warn("[getAllRegistrations] Fallback ke mock data (dev mode)");
    return getMockRegistrations();
  }

  return response.data;
}

/** Ambil detail lengkap satu pendaftaran (admin, semua dokumen). */
export async function adminGetRegistrationDetail(
  registrationId: string
): Promise<RegistrationDetail | null> {
  const response = await callApi<BocApiResponse<RegistrationDetail>>({
    action: "admin_get_registration_detail",
    registration_id: registrationId,
  });

  if (response.status !== "success") return null;
  return response.data;
}

/** Ubah status pendaftaran (admin only). */
export async function updateRegistrationStatus(
  registrationId: string,
  status: ParticipantStatus,
  adminMessage: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await callApi<{ status: string; message?: string }>({
      action: "admin_update_status",
      registration_id: registrationId,
      status,
      admin_message: adminMessage,
    });
    return { success: response.status === "success", message: response.message };
  } catch (err) {
    console.error("[updateRegistrationStatus] Error:", err);
    return { success: false, message: "Gagal menghubungi server." };
  }
}

// ======================
// Admin API (User Management)
// ======================

/** Ambil daftar email admin dari Google Sheet. */
export async function getAdmins(): Promise<string[]> {
  const response = await callApi<BocApiResponse<{ email: string }[]>>({
    action: "admin_get_admins",
  });

  if (response.status !== "success" || !Array.isArray(response.data)) {
    return [];
  }
  return response.data.map((d) => d.email);
}

/** Tambahkan email sebagai admin. */
export async function addAdmin(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await callApi<{ status: string; message?: string }>({
      action: "admin_add_admin",
      email,
    });
    return { success: response.status === "success", message: response.message };
  } catch (err) {
    return { success: false, message: "Gagal menghubungi server." };
  }
}

/** Hapus email dari daftar admin. */
export async function removeAdmin(email: string): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await callApi<{ status: string; message?: string }>({
      action: "admin_remove_admin",
      email,
    });
    return { success: response.status === "success", message: response.message };
  } catch (err) {
    return { success: false, message: "Gagal menghubungi server." };
  }
}

// ======================
// Mock Data (Dev Fallback — untuk admin getAllRegistrations saja)
// ======================

function getMockRegistrations(): RegistrationHistoryItem[] {
  return [
    {
      registration_id: "REG-2026-001",
      nama_tim: "Tim Investigator Alpha",
      nama_ketua: "Budi Santoso",
      instansi: "SMAN 1 Makassar",
      jumlah_anggota: 3,
      participant_status: "MENUNGGU",
      admin_message: "",
      created_at: "2026-08-01T10:00:00",
      updated_at: "2026-08-01T10:00:00",
    },
    {
      registration_id: "REG-2026-002",
      nama_tim: "Sherlock Squad",
      nama_ketua: "Andi Rahman",
      instansi: "SMAN 5 Makassar",
      jumlah_anggota: 2,
      participant_status: "DISETUJUI",
      admin_message: "Selamat, pendaftaran tim Anda telah disetujui.",
      created_at: "2026-08-02T09:00:00",
      updated_at: "2026-08-03T14:00:00",
    },
    {
      registration_id: "REG-2026-003",
      nama_tim: "Detective Agency",
      nama_ketua: "Sari Dewi",
      instansi: "SMAN 3 Makassar",
      jumlah_anggota: 1,
      participant_status: "DITOLAK",
      admin_message: "Bukti pembayaran kurang jelas. Harap upload ulang.",
      created_at: "2026-08-02T11:00:00",
      updated_at: "2026-08-03T15:00:00",
    },
  ];
}