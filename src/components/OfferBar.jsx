import { useEffect, useMemo, useState } from "react";
import "./OfferBar.css";

const API = "http://127.0.0.1:8000";

const FALLBACK_OFFERS = [
  "🔥 20% OFF en snacks seleccionados 🔥",
  "🚚 Delivery gratis en compras mayores a S/50 🚚",
  "💥 Nuevos productos disponibles 💥",
];

export default function OfferBar() {
  const [offers, setOffers] = useState(FALLBACK_OFFERS);

  useEffect(() => {
    fetch(`${API}/offers`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.length) return;

        const msgs = data.map((o) => {
          let text = o.title;

          if (o.discount_percent) {
            text = `🏷️ ${text} — ${o.discount_percent}% OFF`;
          } else {
            text = `🔥 ${text}`;
          }

          if (o.description) {
            text += ` — ${o.description}`;
          }

          return text;
        });

        setOffers(msgs);
      })
      .catch(() => {});
  }, []);

  // Repeat many times so loop is always smooth
  const loopMessages = useMemo(() => {
    return Array(10).fill(offers).flat();
  }, [offers]);

  return (
    <div className="offer-bar">
      <div className="offer-track">
        {loopMessages.map((msg, i) => (
          <span key={i}>{msg}</span>
        ))}
      </div>
    </div>
  );
}