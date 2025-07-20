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

export default function CountTimer() {
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

  // === STATES FOR STEP 2 ===
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [counterText, setCounterText] = useState("¡Tiempo limitado!");
  const [counterStyleSelected, setCounterStyleSelected] = useState("style1");

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
        setCheckedRows(initialChecked);
        setHeaderCheckboxStatus(initialHeader);
        setHeaderIndeterminateStatus(initialIndeterminate);
      } catch (err) {
        console.error("Error fetching categories/products:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <Card p="4">
      <Text fontSize="highlight" color="neutral-textHigh">
        Configura el contador de tiempo
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

      {/* === STEP 2: COUNTER CONFIGURATION === */}
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
          />
        </Box>
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
          onClick={() => {
            setActiveStep(activeStep + 1);
            setSelectedStep(activeStep + 1);
          }}
          disabled={
            activeStep === 2 ||
            Object.values(checkedRows).flat().length === 0 ||
            (activeStep === 1 &&
              (!startDate || !startTime || !endDate || !endTime))
          }
        >
          Siguiente
        </Button>
      </Box>
    </Card>
  );
}
