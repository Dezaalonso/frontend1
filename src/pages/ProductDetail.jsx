import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import "./ProductDetail.css";
import { useQuote } from "../components/QuoteContext";
import { CONTACT } from "../config/contact";
import { buildSingleProductMessage, whatsappChatUrl } from "../utils/whatsappQuote";

const API = "https://dacomstore.com/api/products";

export default function ProductDetail() {
  const { addToQuote } = useQuote();
  const { name } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => {
        const all = Object.values(data).flat();

        const normalize = (str) =>
          str
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]/g, "");

        const decodedName = normalize(decodeURIComponent(name));

        const found = all.find((p) => normalize(p.name) === decodedName);

        setProduct(found || null);
        setQty(1);
      })
      .catch(console.error);
  }, [name]);

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const whatsappHref = useMemo(() => {
    if (!product) return "#";
    const q = Math.max(1, Math.floor(Number(qty)) || 1);
    return whatsappChatUrl(
      CONTACT.whatsappDigits,
      buildSingleProductMessage(product, q, pageUrl)
    );
  }, [product, qty, pageUrl]);

  if (!product) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Producto no encontrado</p>
      </div>
    );
  }

  const qtyForAdd = Math.max(1, Math.floor(Number(qty)) || 1);

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-image-box">
          <img src={product.image} alt={product.name} className="product-image" />
        </div>

        <div className="product-info-box">
          <h1 className="product-title">{product.name}</h1>

          <p className="product-price">S/ {Number(product.price).toFixed(2)}</p>

          <p className={`product-stock ${product.stock > 0 ? "in" : "out"}`}>
            {product.stock > 0
              ? `Stock disponible: ${product.stock}`
              : "Agotado"}
          </p>

          <div className="product-qty-row">
            <label className="product-qty-label" htmlFor="detail-qty">
              Cantidad
            </label>
            <input
              id="detail-qty"
              type="number"
              min={1}
              className="product-qty-input"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <div className="product-actions-stack">
            <button
              type="button"
              className="contact-button"
              onClick={() => addToQuote(product, qtyForAdd)}
            >
              Agregar a lista de consulta
            </button>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-button whatsapp-button"
            >
              Consultar por WhatsApp
            </a>

            <a href={`tel:${CONTACT.phoneTel}`} className="contact-outline">
              Llamar para pedidos: {CONTACT.phoneTel}
            </a>

            <a
              href={`mailto:${CONTACT.email}?subject=${encodeURIComponent(
                `Consulta: ${product.name}`
              )}`}
              className="contact-muted-link"
            >
              Enviar consulta por correo
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
