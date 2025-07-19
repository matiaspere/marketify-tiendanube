"use client";

import { useEffect, useState } from "react";
import { connect, iAmReady, getStoreInfo } from "@tiendanube/nexo";
import nexo from "@/lib/nexo";

import { Box, Text, Card, Tag, Icon, IconButton } from "@nimbus-ds/components";
import { Menu } from "@nimbus-ds/menu";
import {
  TiendanubeIcon,
  ExternalLinkIcon,
  ClockIcon,
  MoneyIcon,
  StatsIcon,
  CogIcon,
} from "@nimbus-ds/icons";

import "@nimbus-ds/styles/dist/index.css";

export default function DashboardClient() {
  const [isConnected, setIsConnected] = useState(false);
  const [storeId, setStoreId] = useState(null);
  const [activeTab, setActiveTab] = useState("counter");
  const [readyCalled, setReadyCalled] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (readyCalled) return;
      await connect(nexo);
      const { id } = await getStoreInfo(nexo);
      setStoreId(id);
      setIsConnected(true);
      iAmReady(nexo);
      setReadyCalled(true);
    };
    init();
  }, [readyCalled]);

  if (!isConnected) return <Text>Conectando con Tiendanube...</Text>;

  return (
    <Box display="flex" bg="neutral-surface">
      {/* === SIDEBAR CON MENU === */}
      <Box width="260px" bg="neutral-surface-strong" height="100vh">
        <Menu>
          {/* HEADER */}
          <Menu.Header>
            <Box display="flex" gap="2" alignItems="center" width="100%">
              {/* <Icon color="neutral-textHigh" source={<TiendanubeIcon size="medium" />} /> */}
              <Box display="inline-flex" flex="1">
                <Text
                  fontSize="highlight"
                  color="neutral-textHigh"
                  fontWeight="bold"
                >
                  Marketify
                </Text>
              </Box>
              {/* <IconButton source={<ExternalLinkIcon />} size="2rem" /> */}
            </Box>
          </Menu.Header>

          {/* BODY */}
          <Menu.Body>
            <Menu.Section title="Funciones">
              <Menu.Button
                startIcon={ClockIcon}
                label="Contador de tiempo"
                active={activeTab === "counter"}
                onClick={() => setActiveTab("counter")}
              >
                <Tag appearance="primary">Activa</Tag>
              </Menu.Button>

              <Menu.Button
                startIcon={MoneyIcon}
                label="Optimizador de conversiones"
                active={activeTab === "optimizer"}
                onClick={() => setActiveTab("optimizer")}
              >
                {/* <Tag appearance="primary">Activa</Tag> */}
              </Menu.Button>
              {/* 
              <Menu.Button
                startIcon={StatsIcon}
                label="Estadísticas"
                active={activeTab === "stats"}
                onClick={() => setActiveTab("stats")}
              /> */}
            </Menu.Section>
          </Menu.Body>

          {/* FOOTER */}
          <Menu.Footer
            label={`Tienda: ${storeId || "Cargando..."}`}
            startIcon={CogIcon}
            onClick={() => console.log("Configuración clickeada")}
          />
        </Menu>
      </Box>

      {/* === CONTENIDO === */}
      <Box flex="1" p="6">
        {activeTab === "counter" && (
          <Card p="4">
            <Text fontSize="highlight" color="neutral-textHigh">
              Configura tu Contador
            </Text>
            <Text mt="2" fontSize="base" color="neutral-textLow">
              Aquí podrás agregar contadores a tus productos.
            </Text>
          </Card>
        )}

        {activeTab === "optimizer" && (
          <Card p="4">
            <Text fontSize="highlight" color="neutral-textHigh">
              Optimizador de Conversiones
            </Text>
            <Text mt="2" fontSize="base" color="neutral-textLow">
              Próximamente podrás mejorar la conversión de tu tienda.
            </Text>
          </Card>
        )}

        {activeTab === "stats" && (
          <Card p="4">
            <Text fontSize="highlight" color="neutral-textHigh">
              Estadísticas
            </Text>
            <Text mt="2" fontSize="base" color="neutral-textLow">
              Visualiza métricas de tus campañas y conversiones.
            </Text>
          </Card>
        )}
      </Box>
    </Box>
  );
}
