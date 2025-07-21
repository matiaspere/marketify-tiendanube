import prisma from "@/lib/prisma";

export async function getStore(storeIdTiendaNube) {
  if (!storeIdTiendaNube) {
    throw new Response(JSON.stringify({ error: "storeId es requerido" }), {
      status: 400,
    });
  }

  const store = await prisma.store.findUnique({
    where: { storeId: Number(storeIdTiendaNube) },
  });

  if (!store) {
    throw new Response(
      JSON.stringify({ error: "La tienda no existe en la BD" }),
      { status: 404 }
    );
  }

  return store;
}
