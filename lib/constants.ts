/**
 * Konfigurasi Status Pendaftaran Battle of Champions (BoC) Season III 2026.
 *
 * Nilai default: true (Pendaftaran dibuka).
 * Dapat di-override melalui environment variable NEXT_PUBLIC_REGISTRATION_OPEN="false" untuk menutup.
 */
export const IS_REGISTRATION_OPEN =
  process.env.NEXT_PUBLIC_REGISTRATION_OPEN !== "false";

export const REGISTRATION_CLOSED_DATE = "7 Oktober 2026";

export const REGISTRATION_CLOSED_NOTICE = {
  title: "Pendaftaran Telah Ditutup",
  subtitle:
    "Periode pendaftaran Battle of Champions Season III telah resmi berakhir pada 7 Oktober 2026.",
  description:
    "Terima kasih atas antusiasme seluruh tim investigator SMA/SMK/MA sederajat se-Sulawesi Selatan yang telah mendaftar. Bagi tim yang telah terdaftar, silakan pantau status verifikasi dan pengumuman teknis melalui dashboard profil tim.",
  tmDate: "14 / 15 Oktober 2026 (Online)",
  eventDate: "17 Oktober 2026 (Investigation Day)",
};
