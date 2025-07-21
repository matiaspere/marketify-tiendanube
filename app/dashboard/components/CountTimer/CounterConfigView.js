"use client";

import { useEffect, useState } from "react";
import { Box, Card, Button, Text, Skeleton } from "@nimbus-ds/components";
import CountTimer from "./CountTimer";
import { getStoreInfo } from "@tiendanube/nexo";
import nexo from "@/lib/nexo";

export default function CounterConfigView() {
  const [counter, setCounter] = useState(null); // Guardamos el counter si existe
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("view"); // "view" | "create" | "edit"

  useEffect(() => {
    fetchCounter();
  }, []);

  async function fetchCounter() {
    try {
      const { id: storeId } = await getStoreInfo(nexo);
      setLoading(true);
      const res = await fetch(`/api/counters?storeId=${storeId}`);
      if (!res.ok) throw new Error("Error obteniendo contador");
      const data = await res.json();
      setCounter(data?.counter || null);
    } catch (err) {
      console.error("⛔ Error fetching counter:", err);
      setCounter(null);
    } finally {
      setLoading(false);
      setMode("view");
    }
  }

  async function handleDelete() {
    if (!confirm("¿Seguro que querés eliminar este contador?")) return;
    try {
      const res = await fetch(`/api/counters/${counter.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Error eliminando contador");
      alert("✅ Contador eliminado correctamente");
      setCounter(null);
      setMode("view");
    } catch (err) {
      console.error("⛔ Error eliminando contador:", err);
      alert("Hubo un error al eliminar el contador");
    }
  }

  if (loading) {
    return (
      <Card p="4">
        <Skeleton height="50px" />
      </Card>
    );
  }

  // === CREACIÓN ===
  if (mode === "create") {
    return (
      <CountTimer
        mode="create"
        onSave={() => {
          fetchCounter();
        }}
      />
    );
  }

  // === EDICIÓN ===
  if (mode === "edit" && counter) {
    return (
      <CountTimer
        mode="edit"
        initialData={counter}
        onSave={() => {
          fetchCounter();
        }}
      />
    );
  }

  // === VISTA PREVIEW (sin edición) ===
  return (
    <Card p="4">
      <Text fontSize="highlight" color="neutral-textHigh">
        Configuración del contador de tiempo
      </Text>

      {!counter ? (
        <Box mt="4">
          <Button appearance="primary" onClick={() => setMode("create")}>
            + Crear nuevo contador
          </Button>
        </Box>
      ) : (
        <Box
          mt="4"
          display="flex"
          flexDirection="column"
          gap="3"
          border="neutral-medium"
          borderRadius="2"
          p="4"
        >
          <Text fontSize="base">
            <strong>Texto:</strong> {counter.counterText}
          </Text>
          <Text fontSize="base">
            <strong>Productos:</strong> {counter.products.join(", ")}
          </Text>
          <Text fontSize="base">
            <strong>Inicio:</strong> {counter.startDate} {counter.startTime}
          </Text>
          <Text fontSize="base">
            <strong>Fin:</strong> {counter.endDate} {counter.endTime}
          </Text>
          <Box display="flex" gap="3" mt="2">
            <Button appearance="primary" onClick={() => setMode("edit")}>
              Editar
            </Button>
            <Button appearance="danger" onClick={handleDelete}>
              Eliminar
            </Button>
          </Box>
        </Box>
      )}
    </Card>
  );
}
