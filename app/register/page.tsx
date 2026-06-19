"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { useRegistration } from "@/contexts/registration-context";
import { useEffect, useState, useMemo } from "react";
import type { RegistrationFormData, RegistrationData } from "@/types";
import {
  getCategories,
  getPaymentMethods,
  registerParticipant,
  isMidtransCode,
  isOrangDalamCode,
  isNormalPaymentCode,
  type CategoryDTO,
  type PaymentMethodDTO,
} from "@/lib/api/boc-api";

const fmt = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function RegisterPage() {
  const { isAuthenticated, user } = useAuth();
  const { setData, clearData } = useRegistration();
  const router = useRouter();

  // Master data from Apps Script
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDTO[]>([]);
  const [masterLoading, setMasterLoading] = useState(true);
  const [masterError, setMasterError] = useState("");

  // Pre-fill from Google session
  const [initialized, setInitialized] = useState(false);

  // Form state
  const [d, sd] = useState<RegistrationFormData>({
    teamName: "",
    leaderName: user?.name || "",
    email: user?.email || "",
    whatsapp: "",
    institution: "",
    category: "",
    paymentMethod: "",
    memberCount: 1,
    memberNames: "",
    notes: "",
  });

  // Sync initial values after user is loaded
  useEffect(() => {
    if (!initialized && user) {
      sd((prev) => ({
        ...prev,
        leaderName: user.name || prev.leaderName,
        email: user.email || prev.email,
      }));
      setInitialized(true);
    }
  }, [user, initialized]);
  const [st, sst] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [em, sem] = useState("");

  // Determine payment method category on the fly
  const selectedMethod = d.paymentMethod;
  const methodCategory = useMemo(() => {
    if (!selectedMethod) return null;
    if (isOrangDalamCode(selectedMethod)) return "orang_dalam";
    if (isMidtransCode(selectedMethod)) return "midtrans";
    if (isNormalPaymentCode(selectedMethod)) return "normal";
    return null;
  }, [selectedMethod]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch master data on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [cats, pms] = await Promise.all([getCategories(), getPaymentMethods()]);
        if (!cancelled) {
          setCategories(cats);
          setPaymentMethods(pms);
          setMasterLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setMasterError(err instanceof Error ? err.message : "Gagal memuat data.");
          setMasterLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // ======================
  // Price preview (from backend categories)
  // NOTE: This hook MUST be before any early return to maintain
  // a consistent hook call count across all renders.
  // ======================

  const selectedCategoryObj = useMemo(() => {
    if (!d.category) return null;
    return categories.find((c) => c.code === d.category || c.name === d.category) ?? null;
  }, [d.category, categories]);

  if (!isAuthenticated) {
    return null;
  }

  // Loading state for master data
  if (masterLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-amber-500 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-zinc-400">Memuat data pendaftaran...</p>
        </div>
      </div>
    );
  }

  // Error state for master data
  if (masterError) {
    return (
      <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased flex items-center justify-center px-4">
        <div className="max-w-md text-center">
          <div className="p-6 rounded-2xl border border-red-500/20 bg-red-500/5 mb-6">
            <p className="text-red-400 font-semibold mb-2">Gagal memuat data</p>
            <p className="text-sm text-zinc-400">{masterError}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // ======================
  // Form handlers
  // ======================

  const hc = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const t = e.target;
    sd((pr) => ({ ...pr, [t.name]: t.type === "number" ? (t.value === "" ? 0 : +t.value) : t.value }));
  };

  const vl = (): string | null => {
    if (!d.teamName || !d.leaderName || !d.email || !d.whatsapp || !d.institution || !d.category || !d.paymentMethod)
      return "Semua field wajib harus diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return "Format email tidak valid.";
    if (!/^(\+62|62|08)\d{7,14}$/.test(d.whatsapp.replace(/[\s\-()]/g, ""))) return "WhatsApp tidak valid.";
    if (d.memberCount < 1 || d.memberCount > 5) return "Anggota 1-5.";
    return null;
  };

  const sb = async (e: React.FormEvent) => {
    e.preventDefault();
    sem("");

    const ve = vl();
    if (ve) {
      sem(ve);
      sst("error");
      return;
    }

    // BLOCK: Midtrans methods are coming soon
    if (methodCategory === "midtrans") {
      router.push("/payment?status=coming_soon");
      return;
    }

    // BLOCK: ORANG_DALAM → bypass payment, show success
    if (methodCategory === "orang_dalam") {
      // We need to still submit to backend so it registers
      sst("loading");
      try {
        const result = await registerParticipant({
          nama_tim: d.teamName,
          nama_ketua: d.leaderName,
          email: d.email,
          whatsapp: d.whatsapp,
          instansi: d.institution,
          kategori_lomba: d.category,
          payment_method_code: d.paymentMethod,
          jumlah_anggota: d.memberCount,
          nama_anggota: d.memberNames,
          notes: d.notes,
        });

        if (result.status === "success" && result.data) {
          setData(result.data);
          // ORANG_DALAM → SKIPPED_PAYMENT → redirect langsung
          router.push("/payment?status=bypass");
        } else {
          sem(result.message || "Gagal mendaftar.");
          sst("error");
        }
      } catch (err) {
        sem(err instanceof Error ? err.message : "Terjadi kesalahan jaringan.");
        sst("error");
      }
      return;
    }

    // NORMAL FLOW: submit to backend, go to payment page
    sst("loading");
    try {
      const result = await registerParticipant({
        nama_tim: d.teamName,
        nama_ketua: d.leaderName,
        email: d.email,
        whatsapp: d.whatsapp,
        instansi: d.institution,
        kategori_lomba: d.category,
        payment_method_code: d.paymentMethod,
        jumlah_anggota: d.memberCount,
        nama_anggota: d.memberNames,
        notes: d.notes,
      });

      if (result.status === "success" && result.data) {
        setData(result.data);
        router.push("/payment");
      } else {
        sem(result.message || "Gagal menyimpan data.");
        sst("error");
      }
    } catch (err) {
      sem(err instanceof Error ? err.message : "Terjadi kesalahan jaringan.");
      sst("error");
    }
  };

  // ======================
  // UI constants
  // ======================

  const ic =
    "w-full p-3 border border-zinc-700/60 rounded-xl bg-zinc-900/60 text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-amber-500/50 focus:outline-none disabled:opacity-40 transition";
  const lc = "block text-sm font-semibold text-zinc-300 mb-1.5";
  const ds = st === "loading";

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-4">
            Registration
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Investigation Registration File
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 mt-4 max-w-xl mx-auto">
            Isi berkas pendaftaran investigasi Anda dengan data yang valid dan lengkap.
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar - Info */}
          <div className="lg:col-span-2 space-y-5">
            <div className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
              <h3 className="text-lg font-bold text-white mb-4 flex gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Informasi Kompetisi
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="text-amber-400/70 font-semibold min-w-[80px]">Kategori</span>
                  <span className="text-zinc-300">
                    {categories.map((c) => c.name).join(", ")}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400/70 font-semibold min-w-[80px]">Anggota</span>
                  <span className="text-zinc-300">1–5 orang (termasuk ketua)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400/70 font-semibold min-w-[80px]">Peserta</span>
                  <span className="text-zinc-300">Siswa SMA/SMK/MA se-Sulawesi Selatan</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-amber-400/70 font-semibold min-w-[80px]">Hadiah</span>
                  <span className="text-zinc-300">Total Rp 50 Juta+</span>
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
              <h3 className="text-lg font-bold text-white mb-4 flex gap-2">
                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Benefit
              </h3>
              <ul className="space-y-2 text-sm text-zinc-300">
                <li className="flex gap-2"><span className="text-amber-400">✓</span> Sertifikat Peserta</li>
                <li className="flex gap-2"><span className="text-amber-400">✓</span> Total Hadiah Rp 50 Juta+</li>
                <li className="flex gap-2"><span className="text-amber-400">✓</span> Networking Antar Sekolah</li>
                <li className="flex gap-2"><span className="text-amber-400">✓</span> Pengalaman Kompetisi Nasional</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={sb} className="lg:col-span-3 p-6 md:p-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
            {st === "error" && em && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">
                {em}
              </div>
            )}

            {/* Midtrans coming soon warning */}
            {methodCategory === "midtrans" && (
              <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl text-sm font-medium flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="font-semibold">Metode pembayaran ini belum tersedia</p>
                  <p className="text-amber-400/70 mt-1">
                    Pembayaran melalui Midtrans akan segera hadir. Silakan pilih metode pembayaran lain atau hubungi panitia.
                  </p>
                </div>
              </div>
            )}

            {/* ORANG_DALAM info */}
            {methodCategory === "orang_dalam" && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm font-medium flex items-start gap-3">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-semibold">Pendaftaran tanpa pembayaran</p>
                  <p className="text-green-400/70 mt-1">
                    Akun ORANG_DALAM tidak dikenakan biaya pendaftaran. Status langsung PAID setelah submit.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={lc}>Nama Tim <span className="text-red-400">*</span></label>
                <input name="teamName" required value={d.teamName} onChange={hc} disabled={ds} className={ic} placeholder="Nama tim investigasi" />
              </div>
              <div>
                <label className={lc}>Nama Ketua <span className="text-red-400">*</span></label>
                <input name="leaderName" required value={d.leaderName} onChange={hc} disabled={ds} className={ic} placeholder="Lead investigator" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={lc}>Email <span className="text-red-400">*</span></label>
                <input name="email" type="email" required value={d.email} onChange={hc} disabled={ds} className={ic} placeholder="email@contoh.com" />
              </div>
              <div>
                <label className={lc}>WhatsApp <span className="text-red-400">*</span></label>
                <input name="whatsapp" required value={d.whatsapp} onChange={hc} disabled={ds} className={ic} placeholder="08123456789" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className={lc}>Instansi <span className="text-red-400">*</span></label>
                <input name="institution" required value={d.institution} onChange={hc} disabled={ds} className={ic} placeholder="Sekolah / Kampus / Umum" />
              </div>
              <div>
                <label className={lc}>Kategori <span className="text-red-400">*</span></label>
                <select name="category" required value={d.category} onChange={hc} disabled={ds} className={ic}>
                  <option value="" disabled>Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.code} value={cat.code}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Harga dari backend */}
            {selectedCategoryObj && (
              <div className="mb-5 p-4 rounded-xl border border-amber-500/15 bg-amber-500/5">
                <h4 className="text-sm font-semibold text-amber-400 mb-1">Biaya Pendaftaran</h4>
                <p className="text-lg font-bold text-white">
                  {fmt(selectedCategoryObj.fee)}
                </p>
              </div>
            )}

            <div className="mb-5">
              <label className={lc}>Metode Pembayaran <span className="text-red-400">*</span></label>
              <select name="paymentMethod" required value={d.paymentMethod} onChange={hc} disabled={ds} className={ic}>
                <option value="" disabled>Pilih Metode</option>
                {paymentMethods.map((m) => (
                  <option key={m.code} value={m.code}>
                    {m.name} {isMidtransCode(m.code) ? "(Coming Soon)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-5 mb-5">
              <div>
                <label className={lc}>Jml Anggota <span className="text-red-400">*</span></label>
                <input name="memberCount" type="number" min="1" max="5" required value={d.memberCount} onChange={hc} disabled={ds} className={ic} />
              </div>
              <div>
                <label className={lc}>Nama Anggota</label>
                <textarea name="memberNames" value={d.memberNames} onChange={hc} disabled={ds} rows={2} className={ic + " resize-none"} placeholder="Pisahkan dengan koma" />
              </div>
            </div>

            <div className="mb-5">
              <label className={lc}>Catatan</label>
              <textarea name="notes" value={d.notes} onChange={hc} disabled={ds} rows={2} className={ic + " resize-none"} placeholder="Opsional" />
            </div>

            <div className="border-t border-zinc-800 pt-6">
              <button
                type="submit"
                disabled={ds || methodCategory === "midtrans"}
                className="w-full md:w-auto px-10 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] disabled:opacity-50 transition float-right flex items-center gap-2"
              >
                {ds && (
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {ds ? "Memproses..." : "Kirim Pendaftaran"}
              </button>
              <div className="clear-both" />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}