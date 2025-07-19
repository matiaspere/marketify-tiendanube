"use client";

import { useEffect, useState } from "react";
import { connect, iAmReady } from "@tiendanube/nexo";
import nexo from "@/lib/nexo";
import { Card, CardBody, Tabs, TabsList, TabsTab } from "@nimbus-ds/components";

export default function DashboardClient() {
  const [isConnect, setIsConnect] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [tab, setTab] = useState("contador");

  useEffect(() => {
    connect(nexo).then(() => {
      const storeData = nexo.getStore();
      setStoreId(storeData.id);
      setIsConnect(true);
      iAmReady(nexo);
    });
  }, []);

  if (!isConnect) return <div>Conectando con Tiendanube...</div>;

  return (
    <div style={{ padding: "16px" }}>
      <h1 style={{ marginBottom: "12px" }}>
        Marketify - Tienda {storeId ?? "desconocida"}
      </h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTab value="contador" label="⏳ Contador de tiempo" />
          <TabsTab value="optimizador" label="⚡ Optimizador de conversiones" />
        </TabsList>

        {tab === "contador" && (
          <Card>
            <CardBody>
              <h2>Configura tu Contador de tiempo</h2>
              <p>Aquí podrás agregar contadores a tus productos.</p>
            </CardBody>
          </Card>
        )}

        {tab === "optimizador" && (
          <Card>
            <CardBody>
              <h2>Optimizador de conversiones</h2>
              <p>Próximamente podrás activar recomendaciones de conversión.</p>
            </CardBody>
          </Card>
        )}
      </Tabs>
    </div>
  );
}
