"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { getUserByEmail, getRegistrationsByEmail, type RegistrationHistoryItem } from "@/lib/api/boc-api";

export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  // Real data from Apps Script
  const [registrations, setRegistrations] = useState<RegistrationHistoryItem[]>([]);
  const [userData, setUserData] = useState<{ whatsapp: string; user_id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  // Fetch data from backend
  useEffect(() => {
    if (!isAuthenticated || !user?.email) return;
    const email = user.email;

    console.log("[Profile] Fetching data for email:", email);

    let cancelled = false;
    async function load() {
      try {
        console.log("[Profile] Calling getUserByEmail...");
        const userInfo = await getUserByEmail(email);
        console.log("[Profile] getUserByEmail result:", userInfo);

        console.log("[Profile] Calling getRegistrationsByEmail...");
        const regs = await getRegistrationsByEmail(email);
        console.log("[Profile] getRegistrationsByEmail result:", regs);

        if (!cancelled) {
          if (userInfo) {
            setUserData({ whatsapp: userInfo.whatsapp, user_id: userInfo.user_id });
          }
          setRegistrations(regs);
        }
      } catch (err) {
        console.error("[Profile] Error fetching data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isAuthenticated, user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated || !user) {
    return null;
  }

  const paidCount = registrations.filter((r) => r.payment_status === "PAID").length;
  const pendingCount = registrations.filter((r) => r.payment_status !== "PAID").length;

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 py-20 md:py-28">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold tracking-[0.2em] uppercase text-amber-500 mb-4">
            Investigator Profile
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
            Berkas Investigator
          </h1>
          <p className="text-base sm:text-lg text-zinc-400 mt-4 max-w-xl mx-auto">
            Data dan riwayat investigasi Anda.
          </p>
        </div>

        {/* Profile Header */}
        <div className="p-6 md:p-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={user.image}
              alt={user.name}
              className="w-20 h-20 rounded-full border-2 border-amber-500/20 shadow-[0_0_25px_rgba(245,158,11,0.1)]"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-white">{user.name}</h2>
              <p className="text-sm text-zinc-400 mt-1">{user.email}</p>
              {userData?.user_id && (
                <p className="text-xs text-zinc-500 mt-0.5">ID: {userData.user_id}</p>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
                  </span>
                  Akun Aktif
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informasi Akun */}
          <div className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Informasi Akun
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <span className="text-zinc-500 text-xs">Nama</span>
                <p className="text-white font-semibold mt-0.5">{user.name}</p>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">Email</span>
                <p className="text-white font-semibold mt-0.5">{user.email}</p>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">WhatsApp</span>
                <p className="text-zinc-400 font-semibold mt-0.5">
                  {loading ? (
                    <span className="text-zinc-600">Memuat...</span>
                  ) : userData?.whatsapp || (
                    <span className="text-zinc-600">—</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">User ID</span>
                <p className="text-zinc-400 font-semibold mt-0.5 text-[11px]">
                  {loading ? (
                    <span className="text-zinc-600">Memuat...</span>
                  ) : userData?.user_id || (
                    <span className="text-zinc-600">—</span>
                  )}
                </p>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">Status Akun</span>
                <p className="text-green-400 font-semibold mt-0.5 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                  Terverifikasi
                </p>
              </div>
              <div>
                <span className="text-zinc-500 text-xs">Provider</span>
                <p className="text-zinc-400 font-semibold mt-0.5">Google</p>
              </div>
            </div>
          </div>

          {/* Riwayat Pendaftaran */}
          <div className="lg:col-span-2 p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Riwayat Pendaftaran
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
            ) : registrations.length === 0 ? (
              <p className="text-sm text-zinc-500 text-center py-8">
                Belum ada riwayat pendaftaran.
              </p>
            ) : (
              <div className="space-y-3">
                {registrations.map((reg) => (
                  <div
                    key={reg.registration_id}
                    className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-950/50 hover:border-amber-500/20 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-white">{reg.registration_id}</p>
                        <div className="flex flex-wrap gap-2 mt-1.5">
                          <span className="text-xs text-zinc-400">{reg.kategori_lomba}</span>
                          <span className="text-xs text-zinc-600">•</span>
                          <span className="text-xs text-zinc-500">
                            {new Date(reg.created_at).toLocaleDateString("id-ID", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          reg.payment_status === "PAID"
                            ? "bg-green-500/10 border border-green-500/20 text-green-400"
                            : "bg-amber-500/10 border border-amber-500/20 text-amber-400"
                        }`}>
                          {reg.payment_status === "PAID" ? "✓ Lunas" : reg.payment_status === "PENDING_PAYMENT" ? "Menunggu" : reg.payment_status}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          reg.participant_status === "VERIFIED"
                            ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400"
                            : reg.participant_status === "REGISTERED"
                            ? "bg-blue-500/10 border border-blue-500/20 text-blue-400"
                            : "bg-zinc-800 text-zinc-400"
                        }`}>
                          {reg.participant_status === "VERIFIED" ? "Terverifikasi" : reg.participant_status === "REGISTERED" ? "Terdaftar" : reg.participant_status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Status Pembayaran Summary */}
            <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-[0.15em] mb-4 mt-8 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Status Pembayaran
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 rounded-xl border border-green-500/10 bg-green-500/5 text-center">
                <p className="text-2xl font-bold text-green-400">{paidCount}</p>
                <p className="text-xs text-zinc-500 mt-1">Lunas</p>
              </div>
              <div className="p-3 rounded-xl border border-amber-500/10 bg-amber-500/5 text-center">
                <p className="text-2xl font-bold text-amber-400">{pendingCount}</p>
                <p className="text-xs text-zinc-500 mt-1">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}