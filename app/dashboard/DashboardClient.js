"use client";

import { useEffect, useState } from "react";
import { connect, iAmReady } from "@tiendanube/nexo";
import nexo from "@/lib/nexo";
import { Card, CardBody } from "@nimbus-ds/components";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@nimbus-ds/tabs";

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
      console.log("Conectado a Tiendanube:", storeData);
      console.log("nexo", nexo);
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
          <TabsTrigger value="contador">⏳ Contador de tiempo</TabsTrigger>
          <TabsTrigger value="optimizador">
            ⚡ Optimizador de conversiones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contador">
          <Card>
            <CardBody>
              <h2>Configura tu Contador de tiempo</h2>
              <p>Aquí podrás agregar contadores a tus productos.</p>
            </CardBody>
          </Card>
        </TabsContent>

        <TabsContent value="optimizador">
          <Card>
            <CardBody>
              <h2>Optimizador de conversiones</h2>
              <p>Próximamente podrás activar recomendaciones de conversión.</p>
            </CardBody>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
