import { getStore } from "@/helpers/getStore";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const storeId = Number(searchParams.get("storeId"));

    const store = await getStore(storeId);

    const counter = await prisma.counter.findFirst({
      where: { storeId: store.id },
    });

    return Response.json({ counter });
  } catch (error) {
    console.error("⛔ Error GET /counters:", error);
    return new Response(JSON.stringify({ error: "Error fetching counter" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      storeId,
      products,
      startDate,
      startTime,
      endDate,
      endTime,
      counterText,
      counterStyleSelected,
      counterBgColor,
      counterTextColor,
      counterBoxStyle = {},
      timeStyle = {},
      colonStyle = {},
    } = body;

    const store = await getStore(storeId);

    // 🔥 POST a TiendaNube
    await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authentication: `bearer ${process.env.TIENDANUBE_TOKEN}`,
        "User-Agent": "Marketify2 dev@marketify.com",
      },
      body: JSON.stringify({
        script_id: 2090,
        query_params: JSON.stringify({
          startDate,
          endDate,
          counterText,
          counterBgColor,
          counterTextColor,
          counterStyleSelected, // ✅ Lo necesita el script para elegir estilo
          counterBoxStyle, // ✅ Enviado como JSON completo
          timeStyle,
          colonStyle,
          allowedProducts: products, // ✅ Productos seleccionados
        }),
      }),
    });

    // ✅ Guardar en BD
    const counter = await prisma.counter.create({
      data: {
        storeId: store.id,
        scriptId: 2090,
        products,
        startDate: new Date(startDate),
        startTime,
        endDate: new Date(endDate),
        endTime,
        counterText,
        counterStyleSelected,
        counterBgColor,
        counterTextColor,
        counterBoxStyle,
        timeStyle,
        colonStyle,
      },
    });

    return Response.json({ counter });
  } catch (error) {
    console.error("⛔ Error POST /counters:", error);
    return new Response(JSON.stringify({ error: "Error creating counter" }), {
      status: 500,
    });
  }
}
