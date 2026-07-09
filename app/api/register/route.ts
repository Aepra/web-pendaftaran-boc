import { NextResponse } from "next/server";
import https from "node:https";
import http from "node:http";
import { URL } from "node:url";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";

// Timeout configs
const SOCKET_TIMEOUT_MS = 90_000; // 90 detik (cover upload gambar ke Drive)
const MAX_RETRIES       = 3;

/**
 * POST ke URL menggunakan node:https, ikuti redirect secara manual.
 * Ini menghindari bug ECONNRESET & ConnectTimeout dari undici/native fetch
 * saat payload besar dikirim ke Google Apps Script.
 */
function nodePost(targetUrl: string, payload: string, redirectCount = 0): Promise<string> {
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
        nodePost(res.headers.location, payload, redirectCount + 1).then(resolve).catch(reject);
        return;
      }

      let data = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => resolve(data));
      res.on("error", reject);
    });

    // Socket timeout mencakup connect + TLS + read
    req.setTimeout(SOCKET_TIMEOUT_MS, () => {
      req.destroy(new Error("Socket timeout after " + SOCKET_TIMEOUT_MS + "ms"));
    });

    req.on("error", reject);

    if (isPost) req.write(payload);
    req.end();
  });
}

async function callGAS(body: unknown, attempt = 0): Promise<string> {
  try {
    return await nodePost(APPS_SCRIPT_URL, JSON.stringify(body));
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

    if (isRetryable && attempt < MAX_RETRIES) {
      const delay = (attempt + 1) * 3000;
      console.warn(`[API] Retry ${attempt + 1}/${MAX_RETRIES} setelah ${delay}ms... (${code || msg.slice(0, 50)})`);
      await new Promise((r) => setTimeout(r, delay));
      return callGAS(body, attempt + 1);
    }

    throw err;
  }
}

export async function POST(request: Request) {
  try {
    const body   = await request.json();
    const action = body.action;
    console.log("[API] Action:", action);

    const text = await callGAS(body);

    console.log("=========================================");
    console.log("[API] RAW Apps Script Response:");
    console.log(text);
    console.log("=========================================");

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[API] JSON parse error:", text.slice(0, 200));
      return NextResponse.json(
        { status: "error", message: "Server Google merespons dengan format yang tidak valid." },
        { status: 502 }
      );
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