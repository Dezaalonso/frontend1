// Footer.jsx

import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
} from "react-icons/fa";

import "./Footer.css";
import { CONTACT, getContact } from "../config/contact";

function SocialWrap({ href, title, children }) {
  if (!href) {
    return (
      <div
        className="icon icon-static"
        aria-hidden
        title={title}
      >
        {children}
      </div>
    );
  }

  return (
    <a
      href={href}
      className="icon"
      aria-label={title}
      title={title}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}

export default function Footer() {
  const [contact, setContact] = useState(CONTACT);

  useEffect(() => {
    getContact().then(setContact);
  }, []);

  const whatsappUrl = useMemo(() => {
    return `https://wa.me/${contact.whatsappDigits}`;
  }, [contact.whatsappDigits]);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">
          <div className="logo">
            DACOM
            <br />
            COMERCIAL
            <br />
            EIRL
          </div>
        </div>

        <div className="footer-center">
          <p>Síguenos y contácto</p>

          <div className="social-icons">
            <SocialWrap
              href={contact.social?.instagram}
              title="Instagram"
            >
              <FaInstagram />
            </SocialWrap>

            <SocialWrap
              href={contact.social?.facebook}
              title="Facebook"
            >
              <FaFacebookF />
            </SocialWrap>

            <a
              href={whatsappUrl}
              className="icon"
              aria-label="WhatsApp"
              title="WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaWhatsapp />
            </a>
          </div>

          <div className="footer-quick-links">
            <a href={`tel:${contact.phoneTel}`}>
              Llamar
            </a>

            <span className="footer-dot">·</span>

            <a href={`mailto:${contact.email}`}>
              Correo
            </a>

            <span className="footer-dot">·</span>

            <Link to="/consulta">
              Lista de consulta
            </Link>

            <span className="footer-dot">·</span>

            <Link to="/contacto">
              Contacto
            </Link>
          </div>
        </div>

        <div className="footer-right">
          <p>Medios de Pago</p>

          <div className="payments">
            <span>VISA</span>
            <span>YAPE</span>
            <span>PLIN</span>
            <span>BCP</span>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        {contact.legalName}
        {contact.ruc ? (
          <>
            &nbsp;&nbsp;R.U.C N° {contact.ruc}
          </>
        ) : null}
        &nbsp;&nbsp;—&nbsp;&nbsp;
        {contact.address}
      </div>
    </footer>
  );
}