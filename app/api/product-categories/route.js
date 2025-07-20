import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get("storeId");

    if (!storeId) {
      return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
    }

    // 1. Buscar el accessToken en la base
    const store = await prisma.store.findUnique({
      where: { storeId: parseInt(storeId, 10) },
    });

    if (!store || !store.accessToken) {
      return NextResponse.json(
        { error: "Store or access token not found" },
        { status: 404 }
      );
    }
    const headers = {
      Authentication: `bearer ${store.accessToken}`,
      "User-Agent": "Marketify (tuemail@dominio.com)", // Modifica con tus datos reales
      "Content-Type": "application/json",
    };

    // 2. Obtener categorías
    const categoriesRes = await fetch(
      `https://api.tiendanube.com/v1/${storeId}/categories`,
      { headers, cache: "no-store" }
    );
    if (!categoriesRes.ok) {
      throw new Error(`Error fetching categories: ${categoriesRes.status}`);
    }
    const rawCategories = await categoriesRes.json();

    // Normalizamos los nombres al idioma español
    const categories = rawCategories.map((cat) => ({
      id: cat.id,
      name: cat.name?.es || "",
    }));

    // 3. Obtener productos por categoría
    const productsByCategory = {};
    for (const category of rawCategories) {
      const productsRes = await fetch(
        `https://api.tiendanube.com/v1/${storeId}/products?category_id=${category.id}`,
        { headers, cache: "no-store" }
      );
      const products = await productsRes.json();

      productsByCategory[category.id] = products.map((p) => ({
        id: p.id,
        name: p.name?.es || "",
        stock: p.stock || 0,
        status: false,
      }));
    }

    return NextResponse.json({ categories, productsByCategory });
  } catch (error) {
    console.error("Error fetching categories/products:", error);
    return NextResponse.json(
      { error: "Error fetching categories/products" },
      { status: 500 }
    );
  }
}
