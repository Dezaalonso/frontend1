import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuote } from "../components/QuoteContext";
import { CONTACT } from "../config/contact";
import { buildQuoteListMessage, whatsappChatUrl } from "../utils/whatsappQuote";
import "./QuotePage.css";

export default function QuotePage() {
  const { quoteItems, removeFromQuote, updateQuantity, clearQuote } = useQuote();

  const catalogUrl =
    typeof window !== "undefined" ? window.location.origin : "";

  const whatsappHref = useMemo(() => {
    if (quoteItems.length === 0) return "#";
    const text = buildQuoteListMessage(quoteItems, catalogUrl);
    return whatsappChatUrl(CONTACT.whatsappDigits, text);
  }, [quoteItems, catalogUrl]);

  const lineTotal = (p) =>
    (Number(p.price) || 0) * Math.max(1, Number(p.quantity) || 1);

  const grandTotal = quoteItems.reduce((s, p) => s + lineTotal(p), 0);

  return (
    <div className="quote-page">
      <h1 className="quote-title">Lista de consulta</h1>
      <p className="quote-sub">
        Agregue productos desde el catálogo. La lista se guarda en este dispositivo. Cuando esté
        listo, envíe todo en un solo mensaje por WhatsApp.
      </p>

      {quoteItems.length === 0 ? (
        <div className="quote-empty">
          <p>Su lista está vacía.</p>
          <Link className="quote-empty-link" to="/">
            Ir al inicio y explorar categorías →
          </Link>
        </div>
      ) : (
        <>
          <ul className="quote-list">
            {quoteItems.map((item) => (
              <li key={item.name} className="quote-row">
                <img
                  src={
                    item.image &&
                    String(item.image).startsWith("http") &&
                    !item.image.includes("placeholder")
                      ? item.image
                      : "https://placehold.co/96x96/f3f4f6/6b7280?text=📦"
                  }
                  alt=""
                  className="quote-thumb"
                />
                <div className="quote-row-body">
                  <h2 className="quote-item-name">{item.name}</h2>
                  <p className="quote-item-price">
                    Precio ref. S/ {Number(item.price || 0).toFixed(2)} — Subtotal: S/{" "}
                    {lineTotal(item).toFixed(2)}
                  </p>
                  <label className="quote-qty-label">
                    Cantidad
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.name, Number(e.target.value))
                      }
                      className="quote-qty-input"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  className="quote-remove"
                  onClick={() => removeFromQuote(item.name)}
                >
                  Quitar
                </button>
              </li>
            ))}
          </ul>

          <div className="quote-footer-bar">
            <p className="quote-total">
              Total referencial: <strong>S/ {grandTotal.toFixed(2)}</strong>
            </p>
            <div className="quote-actions">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="quote-wa"
              >
                Enviar lista por WhatsApp
              </a>
              <button type="button" className="quote-clear" onClick={clearQuote}>
                Limpiar lista
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
