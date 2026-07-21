// ======================
// Status Standar — Satu-satunya nilai yang boleh digunakan di seluruh codebase
// ======================

export type ParticipantStatus = "MENUNGGU" | "DISETUJUI" | "DITOLAK";

// ======================
// DTO — User
// ======================

export interface UserDTO {
  user_id: string;
  name: string;
  email: string;
  whatsapp: string;
  created_at: string;
}

// ======================
// DTO — Registrasi (untuk list di dashboard user)
// ======================

export interface RegistrationHistoryItem {
  registration_id: string;
  nama_tim: string;
  instansi: string;
  nama_ketua: string;
  jumlah_anggota: number;
  participant_status: ParticipantStatus;
  admin_message: string;
  created_at: string;
  updated_at: string;
}

// ======================
// DTO — Detail Registrasi Lengkap (untuk panel detail user & admin)
// ======================

export interface RegistrationDetail {
  registration_id: string;
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
  participant_status: ParticipantStatus;
  admin_message: string;
  created_at: string;
  updated_at: string;
}

// ======================
// Form State — Halaman Pendaftaran
// ======================

export interface RegistrationFormData {
  // Data Tim
  nama_tim: string;
  institution: string;
  // Data Ketua
  leaderName: string;
  email: string;
  whatsapp: string;
  // Data Anggota
  nama_anggota_1: string;
  whatsapp_anggota_1: string;
  nama_anggota_2: string;
  whatsapp_anggota_2: string;
  // Catatan
  notes: string;
  // Berkas Ketua
  foto_ketua: string;
  kartu_pelajar_ketua: string;
  bukti_follow_boc_ketua: string;
  bukti_follow_yv_ketua: string;

  // Berkas Anggota 1 (opsional)
  foto_anggota_1: string;
  kartu_pelajar_anggota_1: string;
  bukti_follow_boc_anggota_1: string;
  bukti_follow_yv_anggota_1: string;

  // Berkas Anggota 2 (opsional)
  foto_anggota_2: string;
  kartu_pelajar_anggota_2: string;
  bukti_follow_boc_anggota_2: string;
  bukti_follow_yv_anggota_2: string;
  // Pembayaran
  bukti_bayar: string;
  link_twibbon_ketua: string;
  link_twibbon_anggota_1: string;
  link_twibbon_anggota_2: string;
}

// ======================
// Payload — Submit Pendaftaran ke Apps Script
// ======================

export interface RegisterPayload {
  action: "register";
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
}

// ======================
// Payload — Update Pendaftaran (user edit jika MENUNGGU)
// ======================

export interface UpdateRegistrationPayload extends Omit<RegisterPayload, "action"> {
  action: "update_registration";
  registration_id: string;
}

// ======================
// Payload — Admin Update Status
// ======================

export interface AdminUpdateStatusPayload {
  action: "admin_update_status";
  registration_id: string;
  status: ParticipantStatus;
  admin_message: string;
}

// ======================
// Response — Standar Apps Script
// ======================

export interface BocApiSuccess<T> {
  status: "success";
  data: T;
}

export interface BocApiError {
  status: "error";
  message: string;
}

export type BocApiResponse<T> = BocApiSuccess<T> | BocApiError;

// ======================
// Response — Setelah Submit Pendaftaran Berhasil
// ======================

export interface RegistrationData {
  registration_id: string;
}