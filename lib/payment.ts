/**
 * Payment calculation utilities
 *
 * ARSITEKTUR DATA:
 * Source of truth untuk biaya admin dan metode pembayaran adalah sheet "payment_methods"
 * di Google Spreadsheet, diakses melalui Google Apps Script.
 *
 * Untuk MVP, PAYMENT_METHODS dan getBaseAmount() di-hardcode di frontend.
 * Di production, konfigurasi ini akan diambil dari Apps Script via /api/register
 * (action: "getPaymentMethods").
 *
 * JANGAN mengubah struktur ini tanpa sinkronisasi dengan Apps Script dan Spreadsheet.
 */

export type PaymentMethodCode = "VA" | "QRIS" | "EWALLET" | "CREDIT_CARD";

export interface AdminFeeConfig {
  code: PaymentMethodCode;
  label: string;
  type: "fixed" | "percentage" | "mixed";
  rate: number; // 0 for fixed
  fixed: number; // 0 for percentage
}

/**
 * MVP: Hardcoded — harus sinkron dengan sheet "payment_methods".
 * Di production, fetch dari Apps Script action: "getPaymentMethods".
 */
export const PAYMENT_METHODS: AdminFeeConfig[] = [
  { code: "VA", label: "Virtual Account (VA)", type: "fixed", rate: 0, fixed: 4000 },
  { code: "QRIS", label: "QRIS", type: "percentage", rate: 0.007, fixed: 0 },
  { code: "EWALLET", label: "E-Wallet", type: "percentage", rate: 0.015, fixed: 0 },
  { code: "CREDIT_CARD", label: "Credit Card", type: "mixed", rate: 0.029, fixed: 2000 },
];

/**
 * Get base amount for a given category.
 * MVP: Hardcoded — harus sinkron dengan sheet "registrations".
 * Di production, fetch dari Apps Script action: "getCategories".
 *
 * Default: Rp100.000 untuk kategori yang belum dikonfigurasi.
 */
export function getBaseAmount(category: string): number {
  switch (category) {
    case "Web Development":
      return 150000;
    case "UI/UX Design":
      return 120000;
    default:
      return 100000;
  }
}

/**
 * Calculate admin fee based on payment method config.
 * PRD:
 * - fixed: admin_fee = fixed
 * - percentage: admin_fee = baseAmount × rate
 * - mixed: admin_fee = (baseAmount × rate) + fixed
 * Rounded up to nearest integer (Math.ceil).
 */
export function calculateAdminFee(baseAmount: number, config: AdminFeeConfig): number {
  let fee: number;
  switch (config.type) {
    case "fixed":
      fee = config.fixed;
      break;
    case "percentage":
      fee = baseAmount * config.rate;
      break;
    case "mixed":
      fee = baseAmount * config.rate + config.fixed;
      break;
    default:
      fee = 0;
  }
  return Math.ceil(fee);
}

/**
 * Get total amount = base + admin fee.
 */
export function getTotalAmount(baseAmount: number, adminFee: number): number {
  return baseAmount + adminFee;
}

/**
 * Find payment method config by code.
 */
export function getPaymentMethodConfig(code: PaymentMethodCode | string): AdminFeeConfig | undefined {
  return PAYMENT_METHODS.find((m) => m.code === code);
}

export interface PaymentPreview {
  baseAmount: number;
  adminFee: number;
  totalAmount: number;
  config: AdminFeeConfig | undefined;
}

/**
 * Calculate complete payment preview for a given category and payment method.
 */
export function getPaymentPreview(category: string, paymentMethodCode: PaymentMethodCode | string): PaymentPreview {
  const baseAmount = getBaseAmount(category);
  const config = getPaymentMethodConfig(paymentMethodCode);
  const adminFee = config ? calculateAdminFee(baseAmount, config) : 0;
  const totalAmount = getTotalAmount(baseAmount, adminFee);

  return { baseAmount, adminFee, totalAmount, config };
}