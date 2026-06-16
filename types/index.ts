export interface RegistrationFormData {
  teamName: string;
  leaderName: string;
  email: string;
  whatsapp: string;
  institution: string;
  category: string;
  paymentMethod: string; // "VA" | "QRIS" | "EWALLET" | "CREDIT_CARD"
  memberCount: number;
  memberNames: string;
  notes: string;
}

export interface RegistrationResponse {
  status: "success" | "error";
  message?: string;
  data?: {
    registration_id: string;
    order_id: string;
    base_amount: number;
    admin_fee: number;
    total_amount: number;
    payment_url?: string;
  };
}

/** Payload sent to Google Apps Script (PRD Section 4) */
export interface AppsScriptPayload {
  action: "register";
  nama_tim: string;
  nama_ketua: string;
  email: string;
  whatsapp: string;
  instansi: string;
  kategori_lomba: string;
  payment_method_code: string;
  jumlah_anggota: number;
  nama_anggota: string;
  notes: string;
}