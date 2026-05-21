import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CONTACT, getContact } from "../config/contact";
import "./Contact.css";

export default function Contact() {
  const [contact, setContact] = useState(CONTACT);

  const [form, setForm] = useState({
    company: "",
    ruc: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    getContact().then(setContact);
  }, []);

  const mapsHref = useMemo(() => {
    if (!contact.address) return "#";

    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      contact.address
    )}`;
  }, [contact.address]);

  const handleMailQuote = (e) => {
    e.preventDefault();

    const bodyLines = [
      "Solicitud de cotización / factura para empresa",
      "",
      `Empresa / Razón social: ${form.company || "(sin indicar)"}`,
      `RUC: ${form.ruc || "(sin indicar)"}`,
      `Teléfono contacto: ${form.phone || "(sin indicar)"}`,
      "",
      "Detalle:",
      form.message || "(Sin mensaje)",
    ];

    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(
      "Solicitud de cotización / factura con RUC"
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;
  };

  return (
    <div className="contact-page">
      <h1 className="contact-heading">Contacto</h1>

      <p className="contact-lead">
        Pedidos mayoristas por teléfono, WhatsApp o correo. También puede armar
        una{" "}
        <Link className="contact-inline-link" to="/consulta">
          lista de consulta
        </Link>{" "}
        y enviarla en un solo mensaje.
      </p>

      <div className="contact-grid">
        <section className="contact-card contact-card-primary">
          <h2>Ventas rápidas</h2>

          <ul className="contact-list">
            <li>
              <strong>Teléfono (pedidos):</strong>{" "}
              <a
                href={`tel:${contact.phoneTel}`}
                className="contact-link-strong"
              >
                {contact.phoneTel}
              </a>
            </li>

            <li>
              <strong>WhatsApp:</strong>{" "}
              <a
                href={`https://wa.me/${contact.whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link-strong"
              >
                Abrir chat con ventas
              </a>
            </li>

            <li>
              <strong>Correo:</strong>{" "}
              <a href={`mailto:${contact.email}`}>
                {contact.email}
              </a>
            </li>
          </ul>

          <h3 className="contact-subheading">Empresa</h3>

          <p className="contact-muted">{contact.brandingName}</p>
          <p className="contact-muted">{contact.legalName}</p>

          <h3 className="contact-subheading">
            Horario de atención
          </h3>

          <p>{contact.hours}</p>

          <h3 className="contact-subheading">Dirección</h3>

          <p>{contact.address}</p>

          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-inline-link"
          >
            Ver en Google Maps →
          </a>

          {(contact.social?.instagram ||
            contact.social?.facebook) && (
            <>
              <h3 className="contact-subheading">
                Redes sociales
              </h3>

              <ul className="contact-list">
                {contact.social?.instagram && (
                  <li>
                    <a
                      href={contact.social.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                )}

                {contact.social?.facebook && (
                  <li>
                    <a
                      href={contact.social.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Facebook
                    </a>
                  </li>
                )}
              </ul>
            </>
          )}
        </section>

        <section className="contact-card">
          <h2>Cotización y factura (RUC)</h2>

          <p className="contact-form-intro">
            Complete el siguiente formulario; al enviarlo se abrirá su cliente
            de correo con el texto listo para revisar antes de mandar el mensaje
            a <strong>{contact.email}</strong>.
          </p>

          <form
            className="contact-form"
            onSubmit={handleMailQuote}
          >
            <label className="contact-field">
              Empresa / razón social

              <input
                type="text"
                autoComplete="organization"
                value={form.company}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    company: e.target.value,
                  }))
                }
                placeholder="Ej. Tienda SAC"
              />
            </label>

            <label className="contact-field">
              RUC

              <input
                type="text"
                inputMode="numeric"
                value={form.ruc}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    ruc: e.target.value,
                  }))
                }
                placeholder="20XXXXXXXXX"
              />
            </label>

            <label className="contact-field">
              Teléfono contacto

              <input
                type="tel"
                autoComplete="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    phone: e.target.value,
                  }))
                }
                placeholder="+51 ..."
              />
            </label>

            <label className="contact-field">
              Mensaje (productos, cantidades,
              facturación…)

              <textarea
                rows={5}
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    message: e.target.value,
                  }))
                }
                placeholder="Necesito cotización formal de..."
              />
            </label>

            <button
              type="submit"
              className="contact-submit"
            >
              Redactar correo para cotización
            </button>
          </form>

          <p className="contact-mailto-note">
            Si no se abre el correo automáticamente,
            copie datos y envíenos un correo desde su
            equipo.
          </p>
        </section>
      </div>
    </div>
  );
}