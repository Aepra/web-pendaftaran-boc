# Panduan Migrasi: Mock → Google Login Nyata

**Tujuan:** Ganti placeholder `NEXT_PUBLIC_MOCK_USER_*` dengan login Google beneran.

---

## Step 1 — Daftarkan Project di Google Cloud Console

Ini adalah **satu-satunya cara** mendapatkan `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET`.

1. Buka https://console.cloud.google.com/apis/credentials
2. Buat project baru (atau pilih existing)
3. Klik **+ Create Credentials** → **OAuth client ID**
4. Application type → **Web application**
5. Name → `BoC Web App`
6. **Authorized JavaScript origins:**
   ```
   http://localhost:3000
   ```
   (nanti tambahin domain production setelah deploy)
7. **Authorized redirect URIs:**
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Klik **Create**
9. Akan muncul modal → **Copy Client ID dan Client Secret**

```
┌─────────────────────────────────────────────┐
│ OAuth client created                         │
│                                              │
│ Client ID: 1234567890-xxx.apps.googleusercontent.com  │
│ Client Secret: GOCSPX-xxxxx                 │
│                                              │
│ [Download JSON]  [OK]                        │
└─────────────────────────────────────────────┘
```

---

## Step 2 — Isi `.env.local`

Buka `.env.local` dan isi bagian yang kosong:

```env
GOOGLE_CLIENT_ID=1234567890-xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-xxxxx
NEXTAUTH_SECRET=(generate pakai perintah di bawah)
```

Generate `NEXTAUTH_SECRET`:

```bash
npx auth secret
```

Copy outputnya, paste ke `NEXTAUTH_SECRET=` di `.env.local`.

---

## Step 3 — Install NextAuth.js

```bash
npm install next-auth@beta @auth/core
```

> **Catatan:** Next.js 16 menggunakan `next-auth@beta` (v5). Jangan install `next-auth` v4 biasa.

---

## Step 4 — Buat Auth Route Handler

Buat file baru `app/api/auth/[...nextauth]/route.ts`:

```ts
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      // Pastikan user id tersedia
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
```

---

## Step 5 — Update `contexts/auth-context.tsx`

Ganti isi file dengan kode yang pakai NextAuth session:

```tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useSession, signIn, signOut, SessionProvider } from "next-auth/react";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  image: string;
  institution: string;
}

interface AuthContextType {
  user: MockUser | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();

  // Ambil institution dari Apps Script nantinya (via API)
  const user: MockUser | null = session?.user
    ? {
        id: session.user.id || "",
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
        institution: "", // Nanti diisi dari Apps Script
      }
    : null;

  const login = () => signIn("google", { callbackUrl: "/register" });
  const logout = () => signOut({ callbackUrl: "/" });

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
```

---

## Step 6 — Update `components/providers.tsx`

Bungkus dengan `SessionProvider` dari NextAuth:

```tsx
"use client";

import type { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "@/contexts/auth-context";
import { RegistrationProvider } from "@/contexts/registration-context";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <RegistrationProvider>
          {children}
        </RegistrationProvider>
      </AuthProvider>
    </SessionProvider>
  );
}
```

---

## Step 7 — Hapus Mock User dari `.env.local`

Setelah semua berfungsi, hapus baris ini dari `.env.local`:

```
NEXT_PUBLIC_MOCK_USER_ID=...
NEXT_PUBLIC_MOCK_USER_NAME=...
NEXT_PUBLIC_MOCK_USER_EMAIL=...
NEXT_PUBLIC_MOCK_USER_IMAGE=...
NEXT_PUBLIC_MOCK_USER_INSTITUTION=...
```

Login sekarang pakai data asli dari Google.

---

## Ringkasan Checklist

| # | Task | Estimated Time | Done |
|---|------|---------------|------|
| 1 | Buka Google Cloud Console → buat OAuth Client ID | 10 menit | ☐ |
| 2 | Isi `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET` di `.env.local` | 1 menit | ☐ |
| 3 | Generate `NEXTAUTH_SECRET` dengan `npx auth secret` | 1 menit | ☐ |
| 4 | Install `next-auth@beta` | 2 menit | ☐ |
| 5 | Buat `app/api/auth/[...nextauth]/route.ts` | 5 menit | ☐ |
| 6 | Update `contexts/auth-context.tsx` (ganti mock → session) | 10 menit | ☐ |
| 7 | Update `components/providers.tsx` (tambah SessionProvider) | 2 menit | ☐ |
| 8 | Hapus `NEXT_PUBLIC_MOCK_USER_*` dari `.env.local` | 1 menit | ☐ |
| 9 | Restart dev server (`npm run dev`) | — | ☐ |
| 10 | Test login Google dari halaman `/login` | 2 menit | ☐ |

**Total estimasi: ~35 menit** (termasuk setup Google Cloud Console).

---

## Troubleshooting

**Error: "redirect_uri_mismatch"**
→ Google Cloud Console → Authorized redirect URIs harus persis:
`http://localhost:3000/api/auth/callback/google`

**Error: "Something went wrong" setelah login**
→ `NEXTAUTH_SECRET` belum diisi atau salah.

**Session kosong / user null**
→ Cek apakah `SessionProvider` sudah membungkus komponen (Step 6).