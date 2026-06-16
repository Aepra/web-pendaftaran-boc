"use client";

import { useState, useMemo } from "react";
import type { RegistrationFormData, RegistrationResponse, AppsScriptPayload } from "@/types";
import { PAYMENT_METHODS, getPaymentPreview } from "@/lib/payment";
const fmt = (n: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(n);

export default function RegistrationForm() {
  const [d, sd] = useState<RegistrationFormData>({ teamName: "", leaderName: "", email: "", whatsapp: "", institution: "", category: "", paymentMethod: "", memberCount: 1, memberNames: "", notes: "" });
  const [st, sst] = useState<"idle"|"loading"|"success"|"error">("idle");
  const [em, sem] = useState(""); const [r, sr] = useState<RegistrationResponse|null>(null);
  const pv = useMemo(() => (!d.category||!d.paymentMethod?null:getPaymentPreview(d.category,d.paymentMethod)), [d.category,d.paymentMethod]);
  const hc = (e: React.ChangeEvent<HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>) => { const t=e.target as HTMLInputElement; sd(pr=>({...pr,[t.name]:t.type==="number"?(t.value===""?0:+t.value):t.value})); };
  const vl = (): string|null => { if(!d.teamName||!d.leaderName||!d.email||!d.whatsapp||!d.institution||!d.category||!d.paymentMethod) return "Semua field wajib harus diisi."; if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) return "Format email tidak valid."; if(!/^(\+62|62|08)\d{7,14}$/.test(d.whatsapp.replace(/[\s\-()]/g,""))) return "WhatsApp tidak valid."; if(d.memberCount<1||d.memberCount>5) return "Anggota 1-5."; return null; };
  const sb = async (e: React.FormEvent) => { e.preventDefault(); sem(""); sr(null); const ve=vl(); if(ve){ sem(ve); sst("error"); return; } sst("loading");
    try { const pl: AppsScriptPayload = { action:"register", nama_tim:d.teamName, nama_ketua:d.leaderName, email:d.email, whatsapp:d.whatsapp, instansi:d.institution, kategori_lomba:d.category, payment_method_code:d.paymentMethod, jumlah_anggota:d.memberCount, nama_anggota:d.memberNames, notes:d.notes };
      console.log("[Frontend] Payload:", pl);
      const rs = await fetch("/api/register", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(pl) });
      const dt: RegistrationResponse = await rs.json();
      console.log("[Frontend] Response:", dt);
      if(dt.status==="success"&&dt.data){ sr(dt); sst("success"); alert(`Pendaftaran Berhasil!\n\nID: ${dt.data.registration_id}\nOrder: ${dt.data.order_id}\nTotal: ${fmt(dt.data.total_amount)}`); if(dt.data.payment_url) window.location.href=dt.data.payment_url; }
      else { sem(dt.message||"Gagal menyimpan data."); sst("error"); }
    } catch { sem("Terjadi kesalahan jaringan."); sst("error"); }
  };
  const ic = "w-full p-3 border border-zinc-700/60 rounded-xl bg-zinc-900/60 text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-amber-500/50 focus:outline-none disabled:opacity-40 transition";
  const lc = "block text-sm font-semibold text-zinc-300 mb-1.5"; const ds = st==="loading";

  if(st==="success"&&r?.data){ const rd=r.data; return (
    <div className="p-8 rounded-2xl border border-amber-500/20 bg-zinc-900/50 shadow-[0_0_40px_rgba(245,158,11,0.08)]">
      <div className="text-center"><div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-6"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg></div>
      <h3 className="text-2xl font-extrabold text-amber-400 mb-2">Case Successfully Registered</h3>
      <p className="text-zinc-400 mb-8">Berkas investigasi Anda telah tercatat.</p></div>
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
        <div className="rounded-xl p-4 border border-zinc-800 bg-zinc-950/50"><span className="text-xs text-amber-400/70 uppercase tracking-wider">Registration ID</span><p className="text-lg font-bold text-amber-300 mt-1">{rd.registration_id}</p></div>
        <div className="rounded-xl p-4 border border-zinc-800 bg-zinc-950/50"><span className="text-xs text-amber-400/70 uppercase tracking-wider">Order ID</span><p className="text-lg font-bold text-amber-300 mt-1">{rd.order_id}</p></div>
      </div>
      <div className="rounded-xl p-4 border border-zinc-800 bg-zinc-950/50 max-w-md mx-auto mb-8"><h4 className="text-sm font-semibold text-amber-400 mb-3">Case Cost Summary</h4>
        <div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-zinc-400">Biaya Pendaftaran</span><span className="text-zinc-200">{fmt(rd.base_amount)}</span></div>
        <div className="flex justify-between"><span className="text-zinc-400">Biaya Admin</span><span className="text-zinc-200">{fmt(rd.admin_fee)}</span></div>
        <div className="border-t border-zinc-700 pt-2 flex justify-between"><span className="font-semibold text-zinc-300">Total</span><span className="font-bold text-amber-400 text-base">{fmt(rd.total_amount)}</span></div></div></div>
      <div className="text-center"><button onClick={()=>{sst("idle");sr(null);sd({teamName:"",leaderName:"",email:"",whatsapp:"",institution:"",category:"",paymentMethod:"",memberCount:1,memberNames:"",notes:""});}} className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.2)] transition">Daftar Lagi</button></div>
    </div>);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-5">
        <div className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40"><h3 className="text-lg font-bold text-white mb-4 flex gap-2"><svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>Informasi Kompetisi</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><span className="text-amber-400/70 font-semibold min-w-[80px]">Kategori</span><span className="text-zinc-300">Karya Tulis Ilmiah, Web Dev, UI/UX Design, Business Plan</span></li>
            <li className="flex gap-2"><span className="text-amber-400/70 font-semibold min-w-[80px]">Anggota</span><span className="text-zinc-300">1–5 orang (termasuk ketua)</span></li>
            <li className="flex gap-2"><span className="text-amber-400/70 font-semibold min-w-[80px]">Peserta</span><span className="text-zinc-300">Pelajar & Mahasiswa aktif se-Indonesia</span></li>
            <li className="flex gap-2"><span className="text-amber-400/70 font-semibold min-w-[80px]">Hadiah</span><span className="text-zinc-300">Total Rp 50 Juta+</span></li>
          </ul></div>
        <div className="p-6 rounded-2xl border border-zinc-800/60 bg-zinc-900/40"><h3 className="text-lg font-bold text-white mb-4 flex gap-2"><svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>Benefit</h3>
          <ul className="space-y-2 text-sm text-zinc-300"><li className="flex gap-2"><span className="text-amber-400">✓</span> Sertifikat Nasional</li><li className="flex gap-2"><span className="text-amber-400">✓</span> Total Hadiah Rp 50 Juta+</li><li className="flex gap-2"><span className="text-amber-400">✓</span> Networking Juri Profesional</li><li className="flex gap-2"><span className="text-amber-400">✓</span> Portofolio Digital</li></ul>
        </div>
      </div>

      <form onSubmit={sb} className="lg:col-span-3 p-6 md:p-8 rounded-2xl border border-zinc-800/60 bg-zinc-900/40">
        {st==="error"&&em&&<div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm font-medium">{em}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"><div><label className={lc}>Nama Tim <span className="text-red-400">*</span></label><input name="teamName" required value={d.teamName} onChange={hc} disabled={ds} className={ic} placeholder="Nama tim investigasi"/></div><div><label className={lc}>Nama Ketua <span className="text-red-400">*</span></label><input name="leaderName" required value={d.leaderName} onChange={hc} disabled={ds} className={ic} placeholder="Lead investigator"/></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"><div><label className={lc}>Email <span className="text-red-400">*</span></label><input name="email" type="email" required value={d.email} onChange={hc} disabled={ds} className={ic} placeholder="email@contoh.com"/></div><div><label className={lc}>WhatsApp <span className="text-red-400">*</span></label><input name="whatsapp" required value={d.whatsapp} onChange={hc} disabled={ds} className={ic} placeholder="08123456789"/></div></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5"><div><label className={lc}>Instansi <span className="text-red-400">*</span></label><input name="institution" required value={d.institution} onChange={hc} disabled={ds} className={ic} placeholder="Sekolah / Kampus / Umum"/></div><div><label className={lc}>Kategori <span className="text-red-400">*</span></label><select name="category" required value={d.category} onChange={hc} disabled={ds} className={ic}><option value="" disabled>Pilih Kategori</option><option>Karya Tulis Ilmiah</option><option>Web Development</option><option>UI/UX Design</option><option>Business Plan</option></select></div></div>
        <div className="mb-5"><label className={lc}>Metode Pembayaran <span className="text-red-400">*</span></label><select name="paymentMethod" required value={d.paymentMethod} onChange={hc} disabled={ds} className={ic}><option value="" disabled>Pilih Metode</option>{PAYMENT_METHODS.map(m=><option key={m.code} value={m.code}>{m.label}</option>)}</select></div>
        {pv&&<div className="mb-5 p-4 rounded-xl border border-amber-500/15 bg-amber-500/5"><h4 className="text-sm font-semibold text-amber-400 mb-3">Case Cost Summary</h4><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-zinc-400">Biaya Pendaftaran</span><span className="text-zinc-200">{fmt(pv.baseAmount)}</span></div><div className="flex justify-between"><span className="text-zinc-400">Biaya Admin</span><span className="text-zinc-200">{fmt(pv.adminFee)}</span></div><div className="border-t border-zinc-700 pt-2 flex justify-between"><span className="font-semibold text-zinc-300">Total</span><span className="font-bold text-amber-400 text-base">{fmt(pv.totalAmount)}</span></div></div></div>}
        <div className="grid grid-cols-[120px_1fr] gap-5 mb-5"><div><label className={lc}>Jml Anggota <span className="text-red-400">*</span></label><input name="memberCount" type="number" min="1" max="5" required value={d.memberCount} onChange={hc} disabled={ds} className={ic}/></div><div><label className={lc}>Nama Anggota</label><textarea name="memberNames" value={d.memberNames} onChange={hc} disabled={ds} rows={2} className={ic+" resize-none"} placeholder="Pisahkan dengan koma"/></div></div>
        <div className="mb-5"><label className={lc}>Catatan</label><textarea name="notes" value={d.notes} onChange={hc} disabled={ds} rows={2} className={ic+" resize-none"} placeholder="Opsional"/></div>
        <div className="border-t border-zinc-800 pt-6"><button type="submit" disabled={ds} className="w-full md:w-auto px-10 py-3 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl shadow-[0_0_25px_rgba(245,158,11,0.2)] hover:shadow-[0_0_40px_rgba(245,158,11,0.35)] disabled:opacity-50 transition float-right flex items-center gap-2">{ds&&<svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/></svg>}{ds?"Memproses...":"Kirim Pendaftaran"}</button><div className="clear-both"/></div>
      </form>
    </div>
  );
}