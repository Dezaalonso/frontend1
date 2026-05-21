import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import "./App.css";
import { useQuote } from "../components/QuoteContext";

const API = "http://127.0.0.1:8000";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToQuote } = useQuote();

  useEffect(() => {
    if (!query || query.trim() === "") {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    fetch(`${API}/search?q=${encodeURIComponent(query.trim())}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setResults(data || []);
      })
      .catch((err) => {
        console.error("Search error:", err);
        setResults([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  const getImage = (p) => {
    if (p.image && !p.image.includes("placeholder")) return p.image;
    return `https://www.google.com/s2/favicons?sz=128&domain=${encodeURIComponent(p.name)}`;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-2">Resultados para: &quot;{query}&quot;</h2>
      <p className="text-gray-600 mb-6">
        {results.length} producto{results.length !== 1 ? "s" : ""} encontrado
        {results.length !== 1 ? "s" : ""}
      </p>

      {results.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No se encontraron productos para &quot;{query}&quot;</p>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mt-4 text-[#E31E24] hover:underline"
          >
            ← Volver
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {results.map((p, i) => (
            <div key={i} className="product-card">
              <Link to={`/product/${encodeURIComponent(p.name)}`}>
                <div className="product-image-container">
                  <img src={getImage(p)} alt={p.name} loading="lazy" />
                </div>
              </Link>
              <div className="product-info">
                <Link to={`/product/${encodeURIComponent(p.name)}`}>
                  <h3 className="product-name">{p.name}</h3>
                </Link>

                <div className="product-footer">
                  <div className="price-stock">
                    <p className="product-price">S/ {Number(p.price).toFixed(2)}</p>

                    {p.stock !== undefined && (
                      <p className={`stock-info ${p.stock > 0 ? "in-stock" : "no-stock"}`}>
                        {p.stock > 0 ? `Stock: ${p.stock}` : "Agotado"}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    className="buy-button"
                    onClick={() => addToQuote(p, 1)}
                  >
                    Agregar a consulta
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
