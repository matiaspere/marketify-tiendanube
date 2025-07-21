"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Text,
  Stepper,
  Button,
  Skeleton,
} from "@nimbus-ds/components";
import CategoryTable from "./CategoryTable";
import { getStoreInfo } from "@tiendanube/nexo";
import nexo from "@/lib/nexo";
import CounterConfiguration from "./CounterConfiguration";
import CounterConfirmation from "./CounterConfirmation";

export default function CountTimer({
  mode = "create", // 🔥 NUEVO: puede ser "create" o "edit"
  initialData = null, // 🔥 NUEVO: datos precargados
  onSave = () => {}, // 🔥 NUEVO: callback para refrescar vista superior
}) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedStep, setSelectedStep] = useState(0);

  // === STATES FOR STEP 1 ===
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState({});
  const [rows, setRows] = useState({});
  const [checkedRows, setCheckedRows] = useState({});
  const [headerCheckboxStatus, setHeaderCheckboxStatus] = useState({});
  const [headerIndeterminateStatus, setHeaderIndeterminateStatus] = useState(
    {}
  );

  // === STATES FOR STEP 2 (CON INITIALDATA) ===
  const [startDate, setStartDate] = useState(
    initialData?.startDate || undefined
  );
  const [endDate, setEndDate] = useState(initialData?.endDate || undefined);
  const [startTime, setStartTime] = useState(initialData?.startTime || "");
  const [endTime, setEndTime] = useState(initialData?.endTime || "");
  const [counterText, setCounterText] = useState(
    initialData?.counterText || "¡Tiempo limitado!"
  );
  const [counterStyleSelected, setCounterStyleSelected] = useState(
    initialData?.counterStyleSelected || "style1"
  );
  const [counterBgColor, setCounterBgColor] = useState(
    initialData?.counterBgColor || "#000000"
  );
  const [counterTextColor, setCounterTextColor] = useState(
    initialData?.counterTextColor || "#ffffff"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id: storeId } = await getStoreInfo(nexo);

        const res = await fetch(`/api/product-categories?storeId=${storeId}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const data = await res.json();
        setCategories(data.categories);

        const initialRows = {};
        const initialChecked = {};
        const initialHeader = {};
        const initialIndeterminate = {};

        for (const cat of data.categories) {
          initialRows[cat.id] = data.productsByCategory[cat.id] || [];
          initialHeader[cat.id] = false;
          initialIndeterminate[cat.id] = false;
        }

        setRows(initialRows);
        setCheckedRows(
          mode === "edit" && initialData?.products
            ? { selected: initialData.products }
            : initialChecked
        );
        setHeaderCheckboxStatus(initialHeader);
        setHeaderIndeterminateStatus(initialIndeterminate);
      } catch (err) {
        console.error("Error fetching categories/products:", err);
      }
    };

    fetchData();
  }, []);

  const handleConfirm = async () => {
    try {
      const products = Object.values(checkedRows).flat();
      const { id: storeId } = await getStoreInfo(nexo);

      const counterStyles = {
        style1: {
          counterBoxStyle: {
            display: "flex",
            gap: "5px",
          },
          timeStyle: {
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: counterTextColor,
            backgroundColor: counterBgColor,
            borderRadius: "8px",
            padding: "10px 20px",
            fontFamily: "monospace",
          },
          colonStyle: {
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            color: counterBgColor,
          },
        },
        style2: {
          counterBoxStyle: {
            display: "flex",
            gap: "5px",
          },
          timeStyle: {
            fontSize: "1.2rem",
            fontWeight: "normal",
            backgroundColor: counterBgColor,
            color: counterTextColor,
            borderRadius: "4px",
            padding: "8px 15px",
            fontFamily: "Arial, sans-serif",
          },
          colonStyle: {
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            color: counterBgColor,
          },
        },
        style3: {
          counterBoxStyle: {
            display: "flex",
            gap: "5px",
            backgroundColor: "#fff",
            color: counterTextColor,
            border: `2px solid ${counterBgColor}`,
            borderRadius: "12px",
            padding: "12px 25px",
            fontFamily: "Roboto, sans-serif",
          },
          timeStyle: {
            fontSize: "1.8rem",
            fontWeight: "600",
          },
          colonStyle: {
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            fontSize: "1.2rem",
            color: counterBgColor,
          },
        },
      };

      const selectedStyles = counterStyles[counterStyleSelected];

      const body = {
        products,
        startDate,
        startTime,
        endDate,
        endTime,
        counterText,
        counterStyleSelected,
        counterBgColor,
        counterTextColor,
        storeId,
        counterBoxStyle: selectedStyles.counterBoxStyle,
        timeStyle: selectedStyles.timeStyle,
        colonStyle: selectedStyles.colonStyle,
      };
      console.log("EL BODY", body);
      const endpoint =
        mode === "create"
          ? "/api/counters"
          : `/api/counters/${initialData.id}`;

      const method = mode === "create" ? "POST" : "PUT";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error guardando contador");

      alert(
        mode === "create"
          ? "✅ Contador creado correctamente"
          : "✅ Contador editado correctamente"
      );
      onSave();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar el contador");
    }
  };

  return (
    <Card p="4">
      <Text fontSize="highlight" color="neutral-textHigh">
        {mode === "create"
          ? "Configura el contador de tiempo"
          : "Edita tu contador de tiempo"}
      </Text>
      {/* === STEPPER === */}
      <Box
        mt="4"
        display="flex"
        flexDirection="column"
        gap="3"
        minWidth="250px"
      >
        <Stepper
          activeStep={activeStep}
          selectedStep={selectedStep}
          onSelectStep={setSelectedStep}
          justifyContent="flex-start"
        >
          <Stepper.Item label="Selecciona los productos" />
          <Stepper.Item label="Configura el contador" />
          <Stepper.Item label="Confirma" />
        </Stepper>
      </Box>
      {/* === STEP 1: CATEGORY TABLE === */}
      {activeStep === 0 && (
        <Box mt="4">
          {categories.length > 0 ? (
            <CategoryTable
              categories={categories}
              openCategories={openCategories}
              setOpenCategories={setOpenCategories}
              rows={rows}
              setRows={setRows}
              checkedRows={checkedRows}
              setCheckedRows={setCheckedRows}
              headerCheckboxStatus={headerCheckboxStatus}
              setHeaderCheckboxStatus={setHeaderCheckboxStatus}
              headerIndeterminateStatus={headerIndeterminateStatus}
              setHeaderIndeterminateStatus={setHeaderIndeterminateStatus}
            />
          ) : (
            <Skeleton height="50px" />
          )}
        </Box>
      )}

      {activeStep === 1 && (
        <Box mt="4">
          <CounterConfiguration
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            counterText={counterText}
            setCounterText={setCounterText}
            counterStyleSelected={counterStyleSelected}
            setCounterStyleSelected={setCounterStyleSelected}
            counterBgColor={counterBgColor}
            setCounterBgColor={setCounterBgColor}
            counterTextColor={counterTextColor}
            setCounterTextColor={setCounterTextColor}
          />
        </Box>
      )}

      {activeStep === 2 && (
        <CounterConfirmation
          startDate={startDate}
          startTime={startTime}
          endDate={endDate}
          endTime={endTime}
          counterText={counterText}
          counterStyleSelected={counterStyleSelected}
          counterBgColor={counterBgColor}
          counterTextColor={counterTextColor}
          selectedProducts={Object.values(checkedRows).flat()}
        />
      )}
      <Box display="flex" gap="3" mt="4">
        <Button
          onClick={() => {
            setActiveStep(activeStep - 1);
            setSelectedStep(activeStep - 1);
          }}
          disabled={activeStep === 0}
        >
          Volver
        </Button>
        <Button
          appearance="primary"
          onClick={async () => {
            if (activeStep === 2) {
              await handleConfirm();
            } else {
              setActiveStep(activeStep + 1);
              setSelectedStep(activeStep + 1);
            }
          }}
          disabled={
            Object.values(checkedRows).flat().length === 0 ||
            (activeStep === 1 &&
              (!startDate || !startTime || !endDate || !endTime))
          }
        >
          {activeStep === 2 ? "Confirmar" : "Siguiente"}
        </Button>
      </Box>
    </Card>
  );
}
