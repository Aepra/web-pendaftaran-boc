/**
 * BOC API Service Layer
 *
 * Single gateway to Google Apps Script backend.
 * All data-fetching goes through Next.js API route (/api/register) to avoid CORS.
 * All data master (categories, payment methods) is fetched from Apps Script.
 * No hardcoded data except MIDTRANS_CODES and ORANG_DALAM_CODE.
 */

// ======================
// MIDTRANS placeholder codes
// These are the payment method codes that map to Midtrans integration.
// Tim payment akan mengintegrasikan ini di tahap berikutnya.
// ======================

function parseCommaList(val: string | undefined): string[] {
  if (!val) return [];
  return val.split(",").map((s) => s.trim()).filter(Boolean);
}

export const MIDTRANS_CODES: string[] = parseCommaList(
  process.env.NEXT_PUBLIC_MIDTRANS_CODES
);

export const ORANG_DALAM_CODE: string =
  process.env.NEXT_PUBLIC_ORANG_DALAM_CODE || "ORANG_DALAM";

/**
 * Check if a payment method code is a Midtrans method (coming soon).
 */
export function isMidtransCode(code: string): boolean {
  return MIDTRANS_CODES.includes(code);
}

/**
 * Check if a payment method code is ORANG_DALAM (free, auto-PAID).
 */
export function isOrangDalamCode(code: string): boolean {
  return code === ORANG_DALAM_CODE;
}

/**
 * Check if a payment method is "normal" (not Midtrans placeholder, not ORANG_DALAM).
 */
export function isNormalPaymentCode(code: string): boolean {
  return !isMidtransCode(code) && !isOrangDalamCode(code);
}

// ======================
// DTO types
// ======================

export interface CategoryDTO {
  code: string;
  name: string;
  fee: number;
}

export interface PaymentMethodDTO {
  code: string;
  name: string;
}

export interface RegisterResult {
  registration_id: string;
  order_id: string;
  total_amount: number;
  payment_url: string;
  payment_flow_stage: "REGISTERED" | "SKIPPED_PAYMENT";
}

/** User data from Apps Script users sheet */
export interface UserDTO {
  user_id: string;
  name: string;
  email: string;
  whatsapp: string;
  created_at: string;
}

/** Registration history item from Apps Script */
export interface RegistrationHistoryItem {
  registration_id: string;
  kategori_lomba: string;
  payment_status: string;
  participant_status: string;
  created_at: string;
}

// ======================
// Generic fetch via Next.js API proxy
// All calls go through /api/register to avoid CORS issues
// ======================

async function callApi<T>(payload: Record<string, unknown>): Promise<T> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `Server returned HTTP ${res.status}`);
  }

  const data: T = await res.json();
  return data;
}

// ======================
// Public API functions
// ======================

/**
 * Fetch active competition categories from Apps Script.
 */
export async function getCategories(): Promise<CategoryDTO[]> {
  const response = await callApi<{ status: string; data: CategoryDTO[] }>({
    action: "get_categories",
  });

  if (response.status !== "success" || !Array.isArray(response.data)) {
    throw new Error("Gagal memuat daftar kategori.");
  }

  return response.data;
}

/**
 * Fetch active payment methods from Apps Script.
 */
export async function getPaymentMethods(): Promise<PaymentMethodDTO[]> {
  const response = await callApi<{ status: string; data: PaymentMethodDTO[] }>({
    action: "get_payment_methods",
  });

  if (response.status !== "success" || !Array.isArray(response.data)) {
    throw new Error("Gagal memuat metode pembayaran.");
  }

  return response.data;
}

/**
 * Submit registration to Apps Script via Next.js API proxy.
 *
 * Returns:
 *   { status: "success", data: RegisterResult }
 *   { status: "error", message: string }
 */
export async function registerParticipant(payload: {
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
}): Promise<{
  status: "success" | "error";
  message?: string;
  data?: RegisterResult;
}> {
  return callApi({
    action: "register",
    ...payload,
  });
}

// ======================
// User & Registration API
// ======================

/** Fetch user profile data by email from Apps Script */
export async function getUserByEmail(email: string): Promise<UserDTO | null> {
  const response = await callApi<{ status: string; data?: UserDTO; message?: string }>({
    action: "get_user",
    email,
  });

  if (response.status !== "success" || !response.data) {
    return null;
  }

  return response.data;
}

/**
 * Sync Google user to Apps Script users sheet.
 * Called after successful Google OAuth to ensure user exists.
 */
export async function syncGoogleUser(data: { name: string; email: string }): Promise<void> {
  try {
    await callApi<{ status: string }>({
      action: "sync_google_user",
      name: data.name,
      email: data.email,
    });
  } catch {
    // Non-critical – user dapat tetap lanjut tanpa error
    console.warn("[syncGoogleUser] Failed to sync user (non-critical)");
  }
}

/** Fetch registration history by email from Apps Script */
export async function getRegistrationsByEmail(email: string): Promise<RegistrationHistoryItem[]> {
  const response = await callApi<{ status: string; data?: RegistrationHistoryItem[]; message?: string }>({
    action: "get_registrations",
    email,
  });

  if (response.status !== "success" || !Array.isArray(response.data)) {
    return [];
  }

  return response.data;
}