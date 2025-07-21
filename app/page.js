"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    console.log("✅ Contador Tiendanube MOCK v7 cargado en Next.js");

    // ✅ Parámetros mockeados (se van a reemplazar por dinámicos en v8)
    const params = {
      startDate: "2025-07-21T14:40:00Z",
      endDate: "2025-07-25T23:59:59Z",
      counterText: "🔥 ¡Mega Oferta SOLO HOY! 🔥",
      counterBgColor: "#FFD700",
      counterTextColor: "#000000",
      counterBoxStyle: { borderRadius: "8px", padding: "6px 12px" },
      timeStyle: { margin: "0 4px", fontSize: "18px", fontWeight: "bold" },
      colonStyle: { margin: "0 4px", opacity: "0.7" },
    };

    // ✅ Helper para transformar objeto de estilos en string inline
    function styleToString(styleObj = {}) {
      return Object.entries(styleObj)
        .map(
          ([k, v]) =>
            `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`
        )
        .join(";");
    }

    // ✅ Construir la UI del contador
    function buildCounterUI() {
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.alignItems = "center";
      container.style.gap = "8px";
      container.style.marginTop = "12px";

      // 🔹 Título
      const title = document.createElement("h2");
      title.textContent = params.counterText || "¡Oferta!";
      title.style.fontSize = "1.5rem";
      title.style.color = params.counterBgColor || "#000";
      title.style.fontWeight = "bold";
      title.style.margin = "0";
      container.appendChild(title);

      // 🔹 Caja del contador
      const counterBox = document.createElement("div");
      counterBox.id = "tn-counter";
      counterBox.style.backgroundColor = params.counterBgColor || "#000";
      counterBox.style.color = params.counterTextColor || "#fff";
      counterBox.style.display = "flex";
      counterBox.style.alignItems = "center";
      counterBox.style.justifyContent = "center";
      counterBox.style.fontFamily = "monospace";
      counterBox.style.fontSize = "18px";
      Object.assign(counterBox.style, params.counterBoxStyle); // aplicar estilos dinámicos
      container.appendChild(counterBox);

      return container;
    }

    // ✅ Lógica del contador
    function startCounter() {
      const start = new Date(params.startDate).getTime();
      const end = new Date(params.endDate).getTime();
      const counterEl = document.getElementById("tn-counter");

      function updateCounter() {
        const now = new Date().getTime();

        if (now < start || now > end) {
          counterEl?.parentElement?.remove();
          return;
        }

        const diff = end - now;
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        let html = "";
        if (d > 0)
          html += `<div style="${styleToString(
            params.timeStyle
          )}">${d}d</div><div style="${styleToString(
            params.colonStyle
          )}">:</div>`;
        if (h > 0)
          html += `<div style="${styleToString(
            params.timeStyle
          )}">${h}h</div><div style="${styleToString(
            params.colonStyle
          )}">:</div>`;
        html += `<div style="${styleToString(
          params.timeStyle
        )}">${m}m</div><div style="${styleToString(
          params.colonStyle
        )}">:</div>`;
        html += `<div style="${styleToString(
          params.timeStyle
        )}">${s}s</div>`;

        counterEl.innerHTML = html;
        setTimeout(updateCounter, 1000);
      }

      updateCounter();
    }

    // ✅ Montar el contador en el contenedor
    const rootCounter = document.getElementById("root-counter");
    if (rootCounter) {
      const counterUI = buildCounterUI();
      rootCounter.appendChild(counterUI);
      startCounter();
    }
  }, []);

  return (
    <main style={{ padding: "20px" }}>
      <h1>🏪 Tienda Test</h1>
      <p>Este es un mock del contador en Next.js</p>
      <div id="root-counter"></div>
    </main>
  );
}
