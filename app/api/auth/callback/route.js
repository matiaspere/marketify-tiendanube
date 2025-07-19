import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";
export const preferredRegion = "auto";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 });
  }

  const response = await fetch(
    "https://www.tiendanube.com/apps/authorize/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: process.env.NEXT_PUBLIC_TIENDANUBE_CLIENT_ID,
        client_secret: process.env.TIENDANUBE_CLIENT_SECRET,
        grant_type: "authorization_code",
        code,
      }),
    }
  );

  const data = await response.json();
  const { access_token, user_id } = data;

  if (!access_token || !user_id) {
    return NextResponse.json({ error: "No token or user_id" }, { status: 400 });
  }

  await prisma.store.upsert({
    where: { storeId: user_id },
    update: { accessToken: access_token },
    create: { storeId: user_id, accessToken: access_token },
  });

  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_APP_URL}/tiendanube/dashboard?store_id=${user_id}`,
    { status: 302 }
  );
}
