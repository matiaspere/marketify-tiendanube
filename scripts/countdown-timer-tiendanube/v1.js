(function () {
  console.log("✅ Contador Tiendanube v8 cargado");

  // ✅ Obtener parámetros desde la URL del script
  function getScriptParams() {
    const scripts = document.querySelectorAll('script[src*="countdown-timer"]');
    const script = scripts[scripts.length - 1];
    const urlParams = new URLSearchParams(script.src.split("?")[1]);
    const params = {};

    urlParams.forEach((value, key) => {
      try {
        params[key] = JSON.parse(value);
      } catch {
        params[key] = decodeURIComponent(value);
      }
    });

    return params;
  }

  const params = getScriptParams();
  console.log("🛠️ Parámetros recibidos:", params);

  // ✅ Normalizar allowedProducts (ya funcional en v7)
  let allowedProducts = params.allowedProducts || [];
  if (!Array.isArray(allowedProducts)) {
    allowedProducts = [parseInt(allowedProducts, 10)];
  }
  console.log("📦 allowedProducts normalizado:", allowedProducts);

  const { startDate, endDate, counterText, counterBgColor, counterTextColor } =
    params;

  // ✅ Normalizar estilos dinámicos (NUEVO en v8)
  const counterBoxStyle = params.counterBoxStyle || {};
  const timeStyle = params.timeStyle || {};
  const colonStyle = params.colonStyle || {};

  if (!startDate || !endDate) {
    console.warn("⛔ No hay fechas configuradas");
    return;
  }

  // ✅ Detectar productId en el DOM (igual que v7)
  const productElement = document.querySelector(
    "[data-store^='product-info-']"
  );
  let productId = null;
  if (productElement) {
    const attr = productElement.getAttribute("data-store");
    const match = attr.match(/product-info-(\d+)/);
    if (match) productId = parseInt(match[1], 10);
  }

  console.log("📦 Product ID detectado:", productId);

  if (!productId || !allowedProducts.includes(productId)) {
    console.warn("⛔ Producto no permitido para este contador");
    return;
  }

  // ✅ Helper para transformar objetos de estilo a string inline
  function styleToString(styleObj = {}) {
    return Object.entries(styleObj)
      .map(
        ([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}:${v}`
      )
      .join(";");
  }

  // ✅ Crear contenedor del contador (mejorado)
  const container = document.createElement("div");
  container.style.display = "flex";
  container.style.flexDirection = "column";
  container.style.alignItems = "center";
  container.style.gap = "8px";
  container.style.marginTop = "12px";
  container.style.padding = "0 15px";

  // 🔹 Título
  const title = document.createElement("h2");
  title.textContent = counterText || "¡Oferta!";
  title.style.fontSize = "1.5rem";
  title.style.color = counterBgColor || "#000";
  title.style.fontWeight = "bold";
  title.style.margin = "0";
  container.appendChild(title);

  // 🔹 Caja del contador
  const counterBox = document.createElement("div");
  counterBox.id = "tn-counter";
  counterBox.style.backgroundColor = counterBgColor || "#000";
  counterBox.style.color = counterTextColor || "#fff";
  counterBox.style.display = "flex";
  counterBox.style.alignItems = "center";
  counterBox.style.justifyContent = "center";
  counterBox.style.fontFamily = "monospace";
  counterBox.style.fontSize = "18px";
  counterBox.style.borderRadius = "8px";
  counterBox.style.padding = "6px 12px";
  Object.assign(counterBox.style, counterBoxStyle); // 🔥 Aplica estilos dinámicos
  container.appendChild(counterBox);

  // ✅ Insertar debajo del botón de compra
  const buyButton = document.querySelector(".js-buy-button-container");
  if (buyButton) {
    buyButton.insertAdjacentElement("afterend", container);
  } else {
    console.warn("⛔ No se encontró el botón de compra");
    return;
  }

  // ✅ Lógica del contador
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  function updateCounter() {
    const now = new Date().getTime();

    if (now < start || now > end) {
      container.remove();
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
        timeStyle
      )}">${d}d</div><div style="${styleToString(colonStyle)}">:</div>`;
    if (h > 0)
      html += `<div style="${styleToString(
        timeStyle
      )}">${h}h</div><div style="${styleToString(colonStyle)}">:</div>`;
    html += `<div style="${styleToString(
      timeStyle
    )}">${m}m</div><div style="${styleToString(
      colonStyle
    )}">:</div><div style="${styleToString(timeStyle)}">${s}s</div>`;

    document.getElementById("tn-counter").innerHTML = html;

    setTimeout(updateCounter, 1000);
  }

  updateCounter();
})();
