"use client";

import { useEffect, useState } from "react";
import { connect, iAmReady, getStoreInfo } from "@tiendanube/nexo";
import nexo from "@/lib/nexo";

export default function DashboardClient() {
  const [isConnect, setIsConnect] = useState(false);
  const [storeId, setStoreId] = useState(null);

  useEffect(() => {
    const connectToNexo = async () => {
      await connect(nexo);
      const storeInfo = await getStoreInfo(nexo);
      console.log("Store Info:", storeInfo);
      setStoreId(storeInfo.id);
      setIsConnect(true);
      iAmReady(nexo);
    };

    connectToNexo();
  }, []);

  if (!isConnect) return <div>Conectando con Tiendanube...</div>;

  return (
    <div style={{ padding: "16px" }}>
      <h1>✅ Conectado con Tiendanube</h1>
      <p>Tienda: {storeId ?? "No detectada"}</p>
    </div>
  );
}
