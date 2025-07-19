"use client";

import { useEffect, useState } from "react";
import { connect, iAmReady } from "@tiendanube/nexo";
import nexo from "@/lib/nexo";

export default function DashboardClient({ searchParams }) {
  const [isConnect, setIsConnect] = useState(false);
  const storeId = searchParams?.store_id;

  useEffect(() => {
    connect(nexo).then(() => {
      setIsConnect(true);
      iAmReady(nexo);
    });
  }, []);

  if (!isConnect) return <div>Conectando con Tiendanube...</div>;

  return (
    <div>
      <h1>Bienvenido Tienda {storeId}</h1>
      <p>¡Marketify funcionando en el admin!</p>
    </div>
  );
}
