/**
 * Builds the WhatsApp pre-filled body for the full quote list (wholesale).
 */
export function buildQuoteListMessage(items, catalogUrl = "") {
  const lines = items.map((p) => {
    const qty = Math.max(1, Number(p.quantity) || 1);
    const unit = Number(p.price) || 0;
    const sub = unit * qty;
    return `• ${p.name}\n    Cant.: ${qty} × S/ ${unit.toFixed(2)} = S/ ${sub.toFixed(2)}`;
  });

  const total = items.reduce(
    (s, p) => s + (Number(p.price) || 0) * Math.max(1, Number(p.quantity) || 1),
    0
  );

  const parts = [
    "Hola, solicito cotización de los siguientes productos:",
    "",
    ...lines,
    "",
    `Total referencial: S/ ${total.toFixed(2)}`,
  ];
  if (catalogUrl) {
    parts.push("", `Lista enviada desde: ${catalogUrl}`);
  }
  return parts.join("\n");
}

/**
 * Opens WhatsApp chat URL with UTF-8 text.
 */
export function whatsappChatUrl(digitsWithoutPlus, message) {
  return `https://wa.me/${digitsWithoutPlus}?text=${encodeURIComponent(message)}`;
}

/**
 * One-line intro for a single product inquiry.
 */
export function buildSingleProductMessage(product, quantity = 1, pageUrl = "") {
  const qty = Math.max(1, Number(quantity) || 1);
  const unit = Number(product.price) || 0;
  const parts = [
    `Hola, me interesa: ${product.name}`,
    `Cantidad deseada: ${qty}`,
    `Precio publicado (referencial): S/ ${unit.toFixed(2)}`,
  ];
  if (pageUrl) parts.push(`Link: ${pageUrl}`);
  return parts.join("\n");
}
