/**
 * Payment utilities — BOC Frontend
 *
 * Frontend does NOT calculate prices.
 * All pricing is handled by Google Apps Script backend.
 *
 * Frontend only:
 * - Knows which codes are Midtrans (coming soon)
 * - Knows which code is ORANG_DALAM (free, bypass)
 * - Routes UI based on these flags
 */

export { MIDTRANS_CODES, ORANG_DALAM_CODE, isMidtransCode, isOrangDalamCode, isNormalPaymentCode } from "@/lib/api/boc-api";