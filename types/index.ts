// ======================
// Master Data (from Apps Script)
// ======================

export interface CategoryItem {
  code: string;
  name: string;
  fee: number;
}

export interface PaymentMethodItem {
  code: string;
  name: string;
}

// ======================
// Registration Form
// ======================

export interface RegistrationFormData {
  teamName: string;
  leaderName: string;
  email: string;
  whatsapp: string;
  institution: string;
  category: string;
  paymentMethod: string;
  memberCount: number;
  memberNames: string;
  notes: string;
}

// ======================
// Apps Script Request Payload
// ======================

export interface RegisterPayload {
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

export interface GetCategoriesPayload {
  action: "get_categories";
}

export interface GetPaymentMethodsPayload {
  action: "get_payment_methods";
}

// ======================
// Apps Script Response
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
// Registration Response Data
// ======================

export interface RegistrationData {
  registration_id: string;
  order_id: string;
  total_amount: number;
  payment_url: string;
  payment_flow_stage: "REGISTERED" | "SKIPPED_PAYMENT";
}

export interface RegistrationResponse {
  status: "success" | "error";
  message?: string;
  data?: RegistrationData;
}