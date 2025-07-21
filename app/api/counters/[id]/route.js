import prisma from "@/lib/prisma";

// ✅ PUT: actualiza un contador existente
export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

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
    } = body;

    if (!storeId) {
      return new Response(JSON.stringify({ error: "storeId es requerido" }), {
        status: 400,
      });
    }

    // 🔥 PUT en TiendaNube
    await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts/2090`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authentication: `bearer ${process.env.TIENDANUBE_TOKEN}`,
        "User-Agent": "Marketify2 dev@marketify.com",
      },
      body: JSON.stringify({
        query_params: JSON.stringify({
          startDate,
          endDate,
          counterText,
          counterBgColor,
          counterTextColor,
          allowedProducts: products,
        }),
      }),
    });

    // ✅ Actualizar en BD
    const counter = await prisma.counter.update({
      where: { id: Number(id) },
      data: {
        products,
        startDate: new Date(startDate),
        startTime,
        endDate: new Date(endDate),
        endTime,
        counterText,
        counterStyleSelected,
        counterBgColor,
        counterTextColor,
      },
    });

    return Response.json({ counter });
  } catch (error) {
    console.error("⛔ Error PUT /counters:", error);
    return new Response(JSON.stringify({ error: "Error updating counter" }), {
      status: 500,
    });
  }
}

// ✅ DELETE: elimina un contador existente
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const { searchParams } = new URL(req.url);
    const storeId = Number(searchParams.get("storeId"));

    if (!storeId) {
      return new Response(JSON.stringify({ error: "storeId es requerido" }), {
        status: 400,
      });
    }

    // 🔥 DELETE en TiendaNube
    await fetch(`https://api.tiendanube.com/v1/${storeId}/scripts/2090`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authentication: `bearer ${process.env.TIENDANUBE_TOKEN}`,
        "User-Agent": "Marketify2 dev@marketify.com",
      },
    });

    // ✅ Eliminar en BD
    await prisma.counter.delete({
      where: { id: Number(id) },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("⛔ Error DELETE /counters:", error);
    return new Response(JSON.stringify({ error: "Error deleting counter" }), {
      status: 500,
    });
  }
}
