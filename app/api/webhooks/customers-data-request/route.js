import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req) {
  console.log("Webhook recibido:", req.url);
  return NextResponse.json({ success: true }, { status: 200 });
}
