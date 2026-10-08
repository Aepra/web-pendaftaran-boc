import { NextResponse } from "next/server";
import https from "node:https";
import http from "node:http";
import { URL } from "node:url";
import { auth } from "@/auth";
import { normalizeWhatsAppNumber } from "@/lib/utils";
import { IS_REGISTRATION_OPEN } from "@/lib/constants";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";

const SUPER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || "abelekaputra05@gmail.com").trim().toLowerCase();
const ADMIN_CACHE_TTL_MS = 30_000;
const ADMIN_ACTIONS = new Set([
  "admin_get_all_registrations",
  "admin_get_registration_detail",
  "admin_update_status",
  "admin_get_admins",
  "admin_add_admin",
  "admin_remove_admin",
]);
const READ_ACTIONS = new Set([
  "get_user",
  "get_registrations",
  "get_registration_detail",
  "admin_get_all_registrations",
  "admin_get_registration_detail",
  "admin_get_admins",
]);

type RequestPolicy = {
  timeoutMs: number;
  maxRetries: number;
};

let adminCache: { emails: string[]; expiresAt: number } | null = null;
let adminCacheRequest: Promise<string[]> | null = null;

function getRequestPolicy(body: unknown): RequestPolicy {
  const action = body && typeof body === "object" && "action" in body
    ? String(body.action)
    : "";

  if (action === "upload_file") return { timeoutMs: 90_000, maxRetries: 2 };
  if (READ_ACTIONS.has(action)) return { timeoutMs: 20_000, maxRetries: 1 };
  return { timeoutMs: 30_000, maxRetries: 1 };
}

/**
 * POST ke URL menggunakan node:https, ikuti redirect secara manual.
 * Ini menghindari bug ECONNRESET & ConnectTimeout dari undici/native fetch
 * saat payload besar dikirim ke Google Apps Script.
 */
function nodePost(targetUrl: string, payload: string, timeoutMs: number, redirectCount = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    if (redirectCount > 10) {
      reject(new Error("Too many redirects"));
      return;
    }

    const parsed   = new URL(targetUrl);
    const isHttps  = parsed.protocol === "https:";
    const lib      = isHttps ? https : http;
    const isPost   = redirectCount === 0; // hanya POST pada request pertama

    const options = {
      hostname: parsed.hostname,
      port:     parsed.port || (isHttps ? 443 : 80),
      path:     parsed.pathname + parsed.search,
      method:   isPost ? "POST" : "GET",
      headers:  isPost
        ? {
            "Content-Type":   "application/json",
            "Content-Length": Buffer.byteLength(payload),
          }
        : {},
    };

    const req = lib.request(options, (res) => {
      // Ikuti redirect (301/302/303/307/308)
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume(); // buang body
        nodePost(res.headers.location, payload, timeoutMs, redirectCount + 1).then(resolve).catch(reject);
        return;
      }

      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve(data));
      res.on("error", reject);
    });

    // Socket timeout mencakup connect + TLS + read
    req.setTimeout(timeoutMs, () => {
      req.destroy(new Error("Socket timeout after " + timeoutMs + "ms"));
    });

    req.on("error", reject);

    if (isPost) req.write(payload);
    req.end();
  });
}

async function callGAS(
  body: unknown,
  attempt = 0,
  policy = getRequestPolicy(body)
): Promise<string> {
  try {
    return await nodePost(APPS_SCRIPT_URL, JSON.stringify(body), policy.timeoutMs);
  } catch (err: unknown) {
    const msg  = err instanceof Error ? err.message : String(err);
    const code = (err as NodeJS.ErrnoException).code ?? "";

    const isRetryable =
      code === "ECONNRESET"   ||
      code === "ECONNREFUSED" ||
      code === "ETIMEDOUT"    ||
      code === "ENOTFOUND"    ||
      msg.includes("timeout") ||
      msg.includes("ECONNRESET");

    if (isRetryable && attempt < policy.maxRetries) {
      const delay = (attempt + 1) * 1500;
      console.warn(`[API] Retry ${attempt + 1}/${policy.maxRetries} setelah ${delay}ms... (${code || msg.slice(0, 50)})`);
      await new Promise((r) => setTimeout(r, delay));
      return callGAS(body, attempt + 1, policy);
    }

    throw err;
  }
}

function parseGasResponse(text: string): Record<string, unknown> | null {
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

async function getAuthorizedAdminEmails(): Promise<string[]> {
  if (adminCache && adminCache.expiresAt > Date.now()) return adminCache.emails;
  if (adminCacheRequest) return adminCacheRequest;

  adminCacheRequest = (async () => {
    const response = parseGasResponse(await callGAS({ action: "admin_get_admins" }));
    if (response?.status !== "success" || !Array.isArray(response.data)) {
      throw new Error("Daftar admin tidak dapat diverifikasi.");
    }

    const emails = response.data
      .map((item) => {
        if (!item || typeof item !== "object" || !("email" in item)) return "";
        return String(item.email).trim().toLowerCase();
      })
      .filter(Boolean);
    const authorizedEmails = Array.from(new Set([SUPER_ADMIN_EMAIL, ...emails]));
    adminCache = { emails: authorizedEmails, expiresAt: Date.now() + ADMIN_CACHE_TTL_MS };
    return authorizedEmails;
  })();

  try {
    return await adminCacheRequest;
  } finally {
    adminCacheRequest = null;
  }
}

function invalidateAdminCache() {
  adminCache = null;
}

export async function POST(request: Request) {
  try {
    const body   = await request.json();
    const action = body.action;
    console.log("[API] Action:", action);

    if (typeof action !== "string") {
      return NextResponse.json({ status: "error", message: "Action tidak valid." }, { status: 400 });
    }

    if (action === "register" && !IS_REGISTRATION_OPEN) {
      return NextResponse.json(
        { status: "error", message: "Pendaftaran telah resmi ditutup pada 7 Oktober 2026." },
        { status: 403 }
      );
    }

    if (ADMIN_ACTIONS.has(action)) {
      const session = await auth();
      const email = session?.user?.email?.trim().toLowerCase();
      if (!email) {
        return NextResponse.json({ status: "error", message: "Silakan login terlebih dahulu." }, { status: 401 });
      }

      const adminEmails = await getAuthorizedAdminEmails();
      const isAdmin = adminEmails.includes(email);

      if (action === "admin_get_admins") {
        return NextResponse.json(
          { status: "success", data: isAdmin ? adminEmails.map((adminEmail) => ({ email: adminEmail })) : [] },
          { status: 200 }
        );
      }

      if (!isAdmin) {
        return NextResponse.json({ status: "error", message: "Akses admin diperlukan." }, { status: 403 });
      }
    }

    // Normalisasi nomor WhatsApp pada server proxy untuk mencegah Formula Parse Error di Google Sheets
    if (body && typeof body === "object") {
      const b = body as Record<string, unknown>;
      if (typeof b.whatsapp === "string") {
        b.whatsapp = normalizeWhatsAppNumber(b.whatsapp);
      }
      if (typeof b.whatsapp_anggota_1 === "string") {
        b.whatsapp_anggota_1 = normalizeWhatsAppNumber(b.whatsapp_anggota_1);
      }
      if (typeof b.whatsapp_anggota_2 === "string") {
        b.whatsapp_anggota_2 = normalizeWhatsAppNumber(b.whatsapp_anggota_2);
      }
    }

    const text = await callGAS(body);

    const data = parseGasResponse(text);
    if (!data) {
      console.error("[API] JSON parse error. Raw response sample:", text.slice(0, 500));
      let cleanMessage = "Server Google merespons dengan format yang tidak valid.";
      
      const summaryMatch = text.match(/<div id="summary">([\s\S]*?)<\/div>/);
      const titleMatch   = text.match(/<title>(.*?)<\/title>/i);
      const exceptionMatch = text.match(/Exception:\s*([^\n<]+)/i);

      if (summaryMatch && summaryMatch[1]) {
        cleanMessage = summaryMatch[1].replace(/<[^>]+>/g, "").trim();
      } else if (exceptionMatch && exceptionMatch[1]) {
        cleanMessage = exceptionMatch[1].trim();
      } else if (titleMatch && titleMatch[1]) {
        cleanMessage = titleMatch[1].trim();
      }

      return NextResponse.json(
        { status: "error", message: `Server Google Script Error: ${cleanMessage}` },
        { status: 502 }
      );
    }

    if (
      data.status === "success" &&
      (action === "admin_add_admin" || action === "admin_remove_admin")
    ) {
      invalidateAdminCache();
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("[API] Network Error:", err);
    return NextResponse.json(
      { status: "error", message: "Gagal menghubungi server. Silakan coba lagi." },
      { status: 502 }
    );
  }
}
