/** Menunggu sejumlah milidetik. */
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Format angka menjadi format Rupiah. */
export const formatRupiah = (amount: unknown): string => {
  const num = typeof amount === "number" ? amount : Number(amount) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

/**
 * Normalisasi nomor WhatsApp ke format standar 08xxxxxxxxxx
 * - Menghapus semua karakter non-digit (spasi, tanda +, tanda -, tanda kurung, dll)
 * - Mengubah awalan +62, 62, atau 8 menjadi 08
 * - Mencegah string diawali tanda '+' atau '=' agar tidak memicu Formula Parse Error di Google Sheets
 * - Aman terhadap nilai null, undefined, number, maupun objek (mencegah error e.replace is not a function)
 */
export function normalizeWhatsAppNumber(phone: unknown): string {
  if (phone === null || phone === undefined) return "";
  const str = typeof phone === "string" ? phone : String(phone);
  if (!str.trim()) return "";

  // Hapus semua karakter non-digit secara aman
  let cleaned = str.replace(/\D/g, "");

  // Format 6208... -> 08...
  if (cleaned.startsWith("6208")) {
    cleaned = cleaned.slice(2);
  }
  // Format 628... -> 08...
  else if (cleaned.startsWith("628")) {
    cleaned = "0" + cleaned.slice(2);
  }
  // Format 62... -> 0...
  else if (cleaned.startsWith("62")) {
    cleaned = "0" + cleaned.slice(2);
  }
  // Format 8... (user tidak mengetik 0 di depan) -> 08...
  else if (cleaned.startsWith("8")) {
    cleaned = "0" + cleaned;
  }

  return cleaned;
}

/**
 * Validasi nomor WhatsApp setelah dinormalisasi
 * Format standar Indonesia: diawali 08, panjang 10 hingga 14 digit
 */
export function isValidWhatsAppNumber(phone: unknown): boolean {
  const normalized = normalizeWhatsAppNumber(phone);
  return /^08\d{8,12}$/.test(normalized);
}

/**
 * Konversi nomor WhatsApp menjadi link wa.me (format internasional tanpa tanda +)
 */
export function toWhatsAppLink(phone: unknown): string {
  const normalized = normalizeWhatsAppNumber(phone);
  if (!normalized) return "";
  const intl = normalized.startsWith("0") ? "62" + normalized.slice(1) : normalized;
  return `https://wa.me/${intl}`;
}
