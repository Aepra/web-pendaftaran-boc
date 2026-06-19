import { NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL || "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action;
    console.log("[API] Action:", action, "Payload:", body);

    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("[API] Apps Script HTTP Error:", res.status, res.statusText);
      return NextResponse.json(
        { status: "error", message: `Apps Script returned HTTP ${res.status}: ${res.statusText}` },
        { status: 502 }
      );
    }

    const data = await res.json();
    console.log("[API] Apps Script Response:", data);

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("[API] Network Error:", err);
    return NextResponse.json(
      { status: "error", message: "Gagal menghubungi server. Silakan coba lagi." },
      { status: 502 }
    );
  }
}