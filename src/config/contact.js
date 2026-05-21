const API = "http://127.0.0.1:8000";

// Fallback values if backend is down
const FALLBACK = {
  phone: "+51902342121",
  whatsapp: "51902342121",
  email: "ventas@dacom.pe",
  address: "Av. Los Girasoles 123 — Lima",
  hours: "Lunes a Sábado, 8:00 AM — 7:00 PM",
  instagram: "",
  facebook: "",
};

let _contact = null;

export async function getContact() {
  if (_contact) return _contact;
  try {
    const res = await fetch(`${API}/contact`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    _contact = {
      legalName: "Tienda Está de Oferta S.A.C",
      brandingName: "DACOM COMERCIAL E.I.R.L",
      phoneTel: data.phone || FALLBACK.phone,
      whatsappDigits: (data.whatsapp || FALLBACK.whatsapp).replace(/\D/g, ""),
      email: data.email || FALLBACK.email,
      address: data.address || FALLBACK.address,
      hours: data.hours || FALLBACK.hours,
      social: {
        instagram: data.instagram || FALLBACK.instagram,
        facebook: data.facebook || FALLBACK.facebook,
      },
    };
    return _contact;
  } catch {
    return {
      legalName: "Tienda Está de Oferta S.A.C",
      brandingName: "DACOM COMERCIAL E.I.R.L",
      phoneTel: FALLBACK.phone,
      whatsappDigits: FALLBACK.whatsapp,
      email: FALLBACK.email,
      address: FALLBACK.address,
      hours: FALLBACK.hours,
      social: { instagram: FALLBACK.instagram, facebook: FALLBACK.facebook },
    };
  }
}

// Keep CONTACT export for any components still using it synchronously
// They'll get fallback values until async fetch completes
export const CONTACT = {
  legalName: "Tienda Está de Oferta S.A.C",
  brandingName: "DACOM COMERCIAL E.I.R.L",
  phoneTel: FALLBACK.phone,
  whatsappDigits: FALLBACK.whatsapp,
  email: FALLBACK.email,
  address: FALLBACK.address,
  hours: FALLBACK.hours,
  social: { instagram: FALLBACK.instagram, facebook: FALLBACK.facebook },
};

// Hydrate CONTACT in background on import
getContact().then((data) => Object.assign(CONTACT, data));