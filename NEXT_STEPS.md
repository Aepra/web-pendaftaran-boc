# NEXT STEPS — Battle of Champions Season III (BoC 2026)

Dokumen ini berisi panduan untuk melanjutkan pengembangan setelah MVP tahap frontend selesai.

---

## 0. Backend Architecture Rule (WAJIB)

**Google Apps Script adalah backend utama project. Arsitektur ini SUDAH FINAL.**

```
Frontend (Next.js)
    ↓
API Route Next.js (/api/register)
    ↓
Google Apps Script
    ↓
Google Spreadsheet
```

**Spreadsheet Structure (3 sheet):**
- `registrations`
- `payment_methods`
- `logs`

**Dilarang:**
- ❌ Mengganti Apps Script
- ❌ Mengganti Spreadsheet
- ❌ Menambahkan database baru (PostgreSQL, MySQL, MongoDB, Supabase, Firebase Firestore, Prisma, Drizzle, dsb.)
- ❌ Membuat backend service baru (Express, Hono, Fastify, dsb.)
- ❌ Membuat API route terpisah (`/api/profile`, `/api/payment`, `/api/user`, `/api/history`, `/api/auth`)
- ❌ Migrasi dari Apps Script ke backend lain
- ❌ Mengubah struktur sheet atau nama kolom Spreadsheet
- ❌ Mengubah payload response Apps Script existing
- ❌ Menghapus fungsi Apps Script yang sudah berjalan (`handleRegistration()`, `handleWebhook()`, `logToSheet()`)

**Diperbolehkan:**
- ✅ Menambah action baru di Apps Script secara kompatibel (tidak merusak yang ada)
- ✅ Menambah kolom baru di Spreadsheet (tanpa menghapus yang ada)
- ✅ Menggunakan mock data di frontend untuk MVP

**Source of Truth:**
- Data pendaftaran → sheet `registrations` via Apps Script
- Biaya admin & metode pembayaran → sheet `payment_methods` via Apps Script
- Log → sheet `logs` via Apps Script

**API Route Satu-satunya:**
- `POST /api/register` — proxy ke Apps Script
- URL Apps Script: `https://script.google.com/macros/s/AKfycbyuJsCBgZJ1CJx9lrznkuR69rrMxbWWkYGIeLn-k6oASYYj5WqJGiXIonTEptgOiUMl/exec`

---

## 1. Fitur yang Masih Placeholder

| Fitur | Lokasi | Keterangan |
|-------|--------|------------|
| Kategori Lomba | `app/register/page.tsx` | Saat ini menggunakan kategori akademik generik. Nama final belum ditentukan. |
| Biaya pendaftaran per kategori | `lib/payment.ts:getBaseAmount()` | Semua kategori placeholder di-map ke harga default Rp100.000. Setelah kategori final ditentukan, tambahkan case di switch. |
| Nomor WhatsApp panitia | `components/sections/Contact.tsx` | Masih `0812-3456-7890` (placeholder). |
| Email panitia | `components/sections/Contact.tsx` | Masih `panitia@lomba.com` (placeholder). |
| URL Google Apps Script | `app/api/register/route.ts` | Saat ini hardcoded. Pindahkan ke `APPS_SCRIPT_URL` di `.env.local`. |

## 2. Fitur yang Masih Mock Data

| Fitur | Lokasi | Keterangan |
|-------|--------|------------|
| Autentikasi Google | `contexts/auth-context.tsx` | Login langsung set mock user. Tidak ada OAuth sungguhan. |
| Data user (nama, email, foto, instansi) | `contexts/auth-context.tsx` | Semua hardcoded di `MOCK_USER`. Harus diganti dengan data dari provider OAuth sungguhan. |
| Status pembayaran | `app/payment/page.tsx` | Ditentukan secara deterministic dari registration_id (mock PENDING/PAID/EXPIRED). Harus diganti dengan API call ke payment gateway. |
| Riwayat pendaftaran | `app/profile/page.tsx` | `MOCK_REGISTRATIONS` di-hardcode. Harus diganti dengan API call ke backend. |
| Status akun & verifikasi | `app/profile/page.tsx` | Selalu "Terverifikasi" dan "Akun Aktif". Harus diambil dari data asli. |
| Kategori & metode di halaman pembayaran | `app/payment/page.tsx` | Menampilkan "—" (dash). Harus diambil dari data pendaftaran yang tersimpan. |

## 3. Langkah Implementasi Google Authentication

Saat beralih dari mock ke autentikasi sungguhan, siapkan integrasi dengan **Google OAuth client-side only** (tidak perlu backend auth).

### Opsi A — NextAuth.js (Direkomendasikan)

1. Install: `npm install next-auth`
2. Buat `app/api/auth/[...nextauth]/route.ts`
3. Konfigurasi Google Provider di file tersebut
4. Ganti `login()` di `contexts/auth-context.tsx` dengan `signIn("google")`
5. Ganti `user` state dengan `useSession()` dari NextAuth
6. File yang perlu diubah:
   - `contexts/auth-context.tsx` — ganti mock dengan NextAuth session
   - `app/login/page.tsx` — sesuaikan tombol login
7. **Catatan:** NextAuth membuat API route `/api/auth/[...nextauth]` sendiri — ini adalah pengecualian yang diperbolehkan karena merupakan library standard. JANGAN membuat API route kustom untuk auth.

### Opsi B — Clerk

1. Install: `npm install @clerk/nextjs`
2. Wrap app dengan `<ClerkProvider>`
3. Gunakan `<SignInButton>` di halaman login
4. File yang perlu diubah:
   - `contexts/auth-context.tsx` — ganti dengan `useUser()` dari Clerk
   - `components/providers.tsx` — tambahkan ClerkProvider
   - `app/layout.tsx` — tambahkan ClerkProvider jika diperlukan
   - `app/login/page.tsx` — gunakan komponen Clerk

### Opsi C — Firebase Auth

1. Install: `npm install firebase`
2. Inisialisasi Firebase di file terpisah
3. Implementasi Google Sign-In popup
4. File yang perlu diubah:
   - `contexts/auth-context.tsx` — ganti `setUser(MOCK_USER)` dengan Firebase auth result
   - `app/login/page.tsx` — trigger Firebase Google sign-in

### Opsi D — Supabase Auth

1. Install: `npm install @supabase/supabase-js @supabase/ssr`
2. Setup Supabase client dengan cookie-based auth
3. Gunakan `supabase.auth.signInWithOAuth({ provider: "google" })`
4. File yang perlu diubah:
   - `contexts/auth-context.tsx` — ganti dengan Supabase session
   - `app/login/page.tsx` — trigger Supabase OAuth

## 4. Langkah Implementasi Payment Gateway

1. Tentukan payment gateway (Midtrans / Xendit / lainnya)
2. Tambahkan environment variables (lihat Section 6)
3. **Gunakan Apps Script** untuk membuat transaksi dan menangani webhook:
   - Tambahkan action baru di Apps Script: `createTransaction`, `handlePaymentWebhook`
   - JANGAN membuat API route baru di Next.js — gunakan proxy `/api/register`
4. Update `app/payment/page.tsx`:
   - Ambil status pembayaran dari Apps Script via `/api/register` (action: `getPaymentStatus`)
   - Tampilkan kode pembayaran / nomor VA / QR code asli
   - Handle redirect ke halaman payment gateway
5. Webhook handler:
   - Payment gateway → Apps Script (langsung, atau via `/api/register` proxy)
   - Verifikasi signature webhook di Apps Script
   - Update status di sheet `registrations`
   - Kirim email konfirmasi
6. Buat halaman status (jika diperlukan di luar /payment):
   - `/payment/success`
   - `/payment/pending`
   - `/payment/failed`
7. File yang perlu diubah:
   - `app/payment/page.tsx` — integrasi API payment gateway via Apps Script
   - `app/api/register/route.ts` — tambahkan action routing untuk payment
   - `lib/payment.ts` — ambil konfigurasi dari Apps Script, bukan hardcode

## 5. Langkah Integrasi Halaman Profil dengan Backend

1. **Tambahkan action di Apps Script** untuk mengambil data profil & riwayat (misal: `getProfile`)
2. Frontend memanggil `POST /api/register` dengan action: `getProfile`
3. Di `app/profile/page.tsx`:
   - Ganti `MOCK_REGISTRATIONS` dengan fetch dari `/api/register`
   - Gunakan data user asli dari auth provider, bukan `MOCK_USER`
4. Tambahkan loading state dan error handling
5. File yang perlu diubah:
   - `app/profile/page.tsx` — ganti mock data dengan API call ke `/api/register`
   - **JANGAN membuat** `/api/profile` — gunakan proxy `/api/register` yang sudah ada

## 6. Environment Variables yang Diperlukan

Buat file `.env.local` dengan variabel berikut:

```env
# Google OAuth (untuk NextAuth / Firebase / Supabase)
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET

# NextAuth (jika menggunakan NextAuth.js)
NEXTAUTH_SECRET=YOUR_SECRET
NEXTAUTH_URL=http://localhost:3000

# Payment Gateway (Midtrans / Xendit)
PAYMENT_PUBLIC_KEY=YOUR_KEY
PAYMENT_SECRET_KEY=YOUR_KEY
PAYMENT_WEBHOOK_SECRET=YOUR_WEBHOOK_SECRET

# Google Apps Script
APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# Email Service (Resend / SendGrid)
EMAIL_API_KEY=YOUR_EMAIL_API_KEY
EMAIL_FROM=panitia@boc2026.id

# Contact
NEXT_PUBLIC_WA_NUMBER=6281234567890
NEXT_PUBLIC_EMAIL=panitia@boc2026.id
```

## 7. Checklist Sebelum Production

- [ ] Ganti seluruh mock data dengan data asli
- [ ] Integrasi Google OAuth sungguhan
- [ ] Implementasi payment gateway dengan webhook
- [ ] Tambahkan halaman status pembayaran terpisah (success/pending/failed)
- [ ] Setup email service untuk konfirmasi otomatis
- [ ] Ganti placeholder kategori lomba dengan nama final
- [ ] Update biaya pendaftaran sesuai kategori final
- [ ] Ganti nomor WhatsApp dan email panitia dengan kontak asli
- [ ] Pindahkan semua credential ke environment variables
- [ ] Setup domain production dan SSL
- [ ] Uji end-to-end: login → daftar → bayar → konfirmasi
- [ ] Uji webhook payment gateway
- [ ] Uji email konfirmasi terkirim
- [ ] Optimasi SEO metadata di `app/layout.tsx`
- [ ] Tambahkan `robots.txt` dan `sitemap.xml`
- [ ] Setup monitoring dan error logging
- [ ] Setup rate limiting di API route
- [ ] Validasi aksesibilitas (WCAG)
- [ ] Test di mobile dan berbagai browser

---

## Mapping File yang Perlu Diubah Saat Integrasi Nyata

| File | Alasan Perubahan |
|------|-----------------|
| `contexts/auth-context.tsx` | Ganti mock auth dengan OAuth provider sungguhan |
| `components/providers.tsx` | Wrap dengan provider OAuth (ClerkProvider, SessionProvider, dll) |
| `app/login/page.tsx` | Gunakan komponen/tombol OAuth asli |
| `app/register/page.tsx` | Mungkin perlu sesuaikan field berdasarkan kategori final |
| `app/payment/page.tsx` | Hapus mock status, integrasi via Apps Script |
| `app/profile/page.tsx` | Hapus mock data, fetch via `/api/register` |
| `app/api/register/route.ts` | Routing action dinamis untuk payment/profile (via proxy) |
| `lib/payment.ts` | Ambil konfigurasi dari Apps Script, update getBaseAmount() |
| `components/sections/Contact.tsx` | Ganti nomor WA dan email dengan kontak asli |
| `components/sections/Hero.tsx` | Update statistik jika ada perubahan jumlah kategori |
| `.env.local` | Tambahkan semua credential dan URL production |
| **Google Apps Script** | **Tambahkan action baru: getProfile, getPaymentStatus, createTransaction, handlePaymentWebhook (kompatibel, tanpa merusak fungsi yang ada)** |
