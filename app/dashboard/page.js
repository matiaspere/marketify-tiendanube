"use client";

import { useEffect, useState } from "react";
import { connect, iAmReady } from "@tiendanube/nexo/helpers";
import nexo from "@/lib/nexoClient";

export default function DashboardPage() {
  const [isConnect, setIsConnect] = useState(false);

  useEffect(() => {
    connect(nexo).then(() => {
      setIsConnect(true);
      iAmReady(nexo);
    });
  }, []);

  if (!isConnect) return <div>Conectando...</div>;

  return <div>¡Conectado con Tiendanube!</div>;
}
