import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req) {
  const { store_id, product_id, end_date } = await req.json();

  if (!store_id || !product_id || !end_date) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const counter = await prisma.counter.create({
    data: {
      storeId: parseInt(store_id),
      productId: parseInt(product_id),
      endDate: new Date(end_date),
    },
  });

  return NextResponse.json(counter);
}
