// FloatingContact.jsx

import { useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { CONTACT, getContact } from "../config/contact";
import "./FloatingContact.css";

export default function FloatingContact() {
  const [contact, setContact] = useState(CONTACT);

  useEffect(() => {
    getContact().then(setContact);
  }, []);

  const waUrl = useMemo(() => {
    return `https://wa.me/${contact.whatsappDigits}?text=${encodeURIComponent(
      "Hola, quiero información sobre pedidos."
    )}`;
  }, [contact.whatsappDigits]);

  return (
    <div
      className="floating-contact"
      aria-label="Contacto rápido"
    >
      <a
        href={`tel:${contact.phoneTel}`}
        className="floating-contact-btn floating-contact-tel"
        title="Llamar por pedidos"
      >
        📞
      </a>

      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact-btn floating-contact-wa"
        title="WhatsApp"
      >
        <FaWhatsapp size={26} aria-hidden />
      </a>
    </div>
  );
}