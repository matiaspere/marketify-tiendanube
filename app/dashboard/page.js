"use client";

import { useEffect } from "react";
import { Nexo } from "@tiendanube/nexo";

export default function DashboardPage({ searchParams }) {
  const storeId = searchParams.store_id;

  useEffect(() => {
    const nexo = new Nexo();
    nexo.render(); // Inicializa la comunicación con Tiendanube
  }, []);

  return (
    <div>
      <h1>Bienvenido, Tienda {storeId}</h1>
      <p>La app está funcionando dentro del admin.</p>
    </div>
  );
}
