"use client";

import { useState, useEffect } from "react";
import { Box, Card, Text, Input, Label, Select } from "@nimbus-ds/components";
import { Calendar } from "@nimbus-ds/calendar";

export default function CounterConfiguration({
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  endDate,
  setEndDate,
  endTime,
  setEndTime,
  counterText,
  setCounterText,
  counterStyleSelected,
  setCounterStyleSelected,
}) {
  const today = new Date();

  const [showCalendarStartDate, setShowCalendarStartDate] = useState(false);
  const [showCalendarEndDate, setShowCalendarEndDate] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // === ESTILOS SEGÚN SELECCIÓN ===
  const counterStyles = {
    style1: {
      counterBoxStyle: {
        backgroundColor: "#000",
        color: "#fff",
        borderRadius: "8px",
        padding: "10px 20px",
        fontFamily: "monospace",
      },
      timeStyle: {
        fontSize: "1.5rem",
        fontWeight: "bold",
      },
    },
    style2: {
      counterBoxStyle: {
        backgroundColor: "#f5f5f5",
        color: "#333",
        borderRadius: "4px",
        padding: "8px 15px",
        fontFamily: "Arial, sans-serif",
      },
      timeStyle: {
        fontSize: "1.2rem",
        fontWeight: "normal",
      },
    },
    style3: {
      counterBoxStyle: {
        backgroundColor: "#fff",
        color: "#0070f3",
        border: "2px solid #0070f3",
        borderRadius: "12px",
        padding: "12px 25px",
        fontFamily: "Roboto, sans-serif",
      },
      timeStyle: {
        fontSize: "1.8rem",
        fontWeight: "600",
      },
    },
  };

  const selectedStyles = counterStyles[counterStyleSelected];

  // === CALCULAR TIEMPO RESTANTE ===
  useEffect(() => {
    if (!startDate || !startTime || !endDate || !endTime) return;

    const [startHours, startMinutes] = startTime.split(":");
    const [endHours, endMinutes] = endTime.split(":");

    if (
      isNaN(parseInt(startHours)) ||
      isNaN(parseInt(startMinutes)) ||
      isNaN(parseInt(endHours)) ||
      isNaN(parseInt(endMinutes))
    ) {
      return;
    }

    const startTargetDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate(),
      parseInt(startHours, 10),
      parseInt(startMinutes, 10),
      0
    );

    const endTargetDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate(),
      parseInt(endHours, 10),
      parseInt(endMinutes, 10),
      0
    );

    const totalTime = endTargetDate.getTime() - startTargetDate.getTime();
    const startTimeMs = Date.now();

    const updateTimer = () => {
      const elapsed = Date.now() - startTimeMs;
      const diff = totalTime - elapsed;

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hoursLeft = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secondsLeft = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours: hoursLeft,
        minutes: minutesLeft,
        seconds: secondsLeft,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [startDate, startTime, endDate, endTime]);

  return (
    <Card p="4">
      <Text fontSize="highlight" color="neutral-textHigh">
        Configura el Contador
      </Text>

      <Box mt="4" display="flex" flexDirection="column" gap="4">
        {/* === FECHA DE INICIO === */}
        <Label>Fecha de inicio</Label>
        <Input
          readOnly
          value={startDate ? startDate.toLocaleDateString() : ""}
          placeholder="Seleccionar fecha"
          onClick={() => setShowCalendarStartDate((prev) => !prev)}
        />

        {showCalendarStartDate && (
          <Box mt="2" border="1px solid #ddd" borderRadius="4px" p="2">
            <Calendar
              mode="single"
              fromDate={today}
              showOutsideDays
              selected={startDate}
              onSelect={(date) => {
                setStartDate(date);
                setShowCalendarStartDate(false);
              }}
              month={startDate || today}
              onMonthChange={setStartDate}
              containerProps={{
                height: "100%",
                overflowY: "auto",
                maxHeight: "400px",
              }}
            />
          </Box>
        )}

        <Label>Hora de inicio (HH:mm)</Label>
        <Input
          type="text"
          value={startTime}
          maxLength={5}
          onChange={(e) => {
            let rawValue = e.target.value;

            if (startTime.length === 3 && rawValue.length === 2) {
              setStartTime(rawValue);
              return;
            }

            let value = rawValue.replace(/\D/g, "");

            if (value.length > 1) {
              value = value.slice(0, 2) + ":" + value.slice(2, 4);
            }

            setStartTime(value);
          }}
          placeholder="Ej: 09:00"
        />

        {/* === FECHA DE FIN === */}
        <Label>Fecha de fin</Label>
        <Input
          readOnly
          value={endDate ? endDate.toLocaleDateString() : ""}
          placeholder="Seleccionar fecha"
          onClick={() => setShowCalendarEndDate((prev) => !prev)}
        />

        {showCalendarEndDate && (
          <Box mt="2" border="1px solid #ddd" borderRadius="4px" p="2">
            <Calendar
              mode="single"
              showOutsideDays
              selected={endDate}
              onSelect={(date) => {
                setEndDate(date);
                setShowCalendarEndDate(false);
              }}
              month={endDate || today}
              onMonthChange={setEndDate}
              containerProps={{
                height: "100%",
                overflowY: "auto",
                maxHeight: "400px",
              }}
              fromDate={startDate || today}
            />
          </Box>
        )}

        <Label>Hora de fin (HH:mm)</Label>
        <Input
          type="text"
          value={endTime}
          maxLength={5}
          onChange={(e) => {
            let rawValue = e.target.value;

            if (endTime.length === 3 && rawValue.length === 2) {
              setEndTime(rawValue);
              return;
            }

            let value = rawValue.replace(/\D/g, "");

            if (value.length > 1) {
              value = value.slice(0, 2) + ":" + value.slice(2, 4);
            }

            setEndTime(value);
          }}
          placeholder="Ej: 09:00"
        />

        {/* === TEXTO DEL CONTADOR === */}
        <Label>Texto del contador</Label>
        <Input
          type="text"
          value={counterText}
          onChange={(e) => setCounterText(e.target.value)}
        />

        {/* === ESTILO === */}
        <Label>Estilo del contador</Label>
        <Select
          value={counterStyleSelected}
          onChange={(e) => setCounterStyleSelected(e.target.value)}
        >
          <option value="style1">Estilo Digital</option>
          <option value="style2">Estilo Minimal</option>
          <option value="style3">Estilo Elegante</option>
        </Select>

        {/* === PREVIEW === */}
        <Box
          mt="4"
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="2"
        >
          <Text fontSize="highlight" color="primary-textHigh">
            {counterText}
          </Text>

          <div
            style={{
              display: "flex",
              gap: "5px",
              ...selectedStyles.counterBoxStyle,
            }}
          >
            {timeLeft.days > 0 && (
              <>
                <div style={selectedStyles.timeStyle}>{timeLeft.days}d</div>:
              </>
            )}
            {timeLeft.hours > 0 && (
              <>
                <div style={selectedStyles.timeStyle}>{timeLeft.hours}h</div>:
              </>
            )}
            <div style={selectedStyles.timeStyle}>{timeLeft.minutes}m</div>:
            <div style={selectedStyles.timeStyle}>{timeLeft.seconds}s</div>
          </div>
        </Box>
      </Box>
    </Card>
  );
}
