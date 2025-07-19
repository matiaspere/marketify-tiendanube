import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const storeId = searchParams.get("store_id");

  if (!storeId) {
    return NextResponse.json({ error: "No store_id" }, { status: 400 });
  }

  const store = await prisma.store.findUnique({
    where: { storeId: parseInt(storeId) },
  });

  return NextResponse.json(store);
}
