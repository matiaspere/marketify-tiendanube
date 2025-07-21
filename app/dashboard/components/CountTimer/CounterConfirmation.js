"use client";

import { Card, Box, Text, Label } from "@nimbus-ds/components";

export default function CounterConfirmation({
  startDate,
  startTime,
  endDate,
  endTime,
  counterText,
  counterStyleSelected,
  counterBgColor,
  counterTextColor,
  selectedProducts,
}) {
  return (
    <Card p="4">
      <Text fontSize="highlight" color="neutral-textHigh">
        ¿Confirmas que quieres crear este contador?
      </Text>

      <Box mt="4" display="flex" flexDirection="column" gap="3">
        <Box>
          <Label>Fecha y hora de inicio:</Label>
          <Text>
            {startDate?.toLocaleDateString()} {startTime}
          </Text>
        </Box>

        <Box>
          <Label>Fecha y hora de fin:</Label>
          <Text>
            {endDate?.toLocaleDateString()} {endTime}
          </Text>
        </Box>

        <Box>
          <Label>Texto del contador:</Label>
          <Text>{counterText}</Text>
        </Box>

        <Box>
          <Label>Estilo seleccionado:</Label>
          <Text>{counterStyleSelected}</Text>
        </Box>

        <Box>
          <Label>Colores elegidos:</Label>
          <Text>
            Fondo:{" "}
            <span style={{ color: counterBgColor }}>{counterBgColor}</span> |
            Texto:{" "}
            <span style={{ color: counterTextColor }}>{counterTextColor}</span>
          </Text>
        </Box>

        <Box>
          <Label>Productos seleccionados:</Label>
          <Text>{selectedProducts.join(", ")}</Text>
        </Box>
      </Box>
    </Card>
  );
}
