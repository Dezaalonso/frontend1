import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Home.css'

const API = "http://127.0.0.1:8000";

const CATEGORY_IMAGES = {
  Drinks: "/DACOMBEBIDAS.png",
  Snacks: "/DACOMSANCKS.png",
  Limpieza: "/DACOMRecurso 27.png",
  Golosinas: "/DACOMGOLOSINAS.png",
  Chocolates: "/DACOMCHOCOLATES.png",
  Conservas: "/DACOMCONSERVAS.png",
  Salsas: "/DACOMSALSAS.png",
  Pilas: "/DACOMPILAS.png",
  Alcohol: "/DACOMBEBIDAS alcoholicas.png",
  Galletas: "/DACOMGALLETAS.png",
  Nuevos: "/DACOMNUEVO.png",
  Colageno: "/DACOMCOLAGENO.PNG"
};

/** Match API category names to images even if accent/casing differs (e.g. Colágeno vs Colageno). */
function normalizeCategoryKey(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

const CATEGORY_IMAGE_BY_NORMAL = Object.fromEntries(
  Object.entries(CATEGORY_IMAGES).map(([key, src]) => [
    normalizeCategoryKey(key),
    src,
  ])
);

function categoryImageSrc(apiCategoryName) {
  return (
    CATEGORY_IMAGES[apiCategoryName] ??
    CATEGORY_IMAGE_BY_NORMAL[normalizeCategoryKey(apiCategoryName)] ??
    "/other_cat.png"
  );
}

export default function Home() {
  const [data, setData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div className="bg-white">

      {/* 🔥 BANNER */}
      <div className="h-[600px] relative">
        <img src="/DACOMSODAS.png" className="w-full h-full object-cover" />
      </div>

      {/* 🔥 CATEGORIES */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-xl font-bold text-center mb-8">CATEGORÍAS</h2>

        <div className="categories-grid">
          {Object.keys(data).map((cat) => (
  <div
  key={cat}
  onClick={() => navigate(`/category/${cat}`)}
  className="category-card"
>
  <img
    src={categoryImageSrc(cat)}
    className="category-image"
    alt={cat}
    onError={(e) => {
      const el = e.currentTarget;
      if (el.dataset.fallbackApplied === "1") return;
      el.dataset.fallbackApplied = "1";
      el.src = "/other_cat.png";
    }}
  />

</div>
))}
        </div>
      </div>

    </div>
  );
}