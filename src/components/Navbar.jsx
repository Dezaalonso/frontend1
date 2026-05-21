import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./Navbar.css";
import { useQuote } from "./QuoteContext";

const API = "http://127.0.0.1:8000";

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const { quoteItems } = useQuote();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (search.length > 1) {
      const timeoutId = setTimeout(() => {
        fetch(`${API}/search?q=${encodeURIComponent(search)}`)
          .then((res) => res.json())
          .then((data) => {
            setSuggestions(data.slice(0, 5));
            setShowSuggestions(true);
          })
          .catch(console.error);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [search]);

  const handleSearch = (e) => {
    if (e.key === "Enter" && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search)}`);
      setShowSuggestions(false);
      setSearch("");
    }
  };

  const handleSuggestionClick = (productName) => {
    navigate(`/product/${encodeURIComponent(productName)}`);
    setShowSuggestions(false);
    setSearch("");
  };

  const quoteCount = quoteItems.reduce(
    (n, item) => n + Math.max(1, Number(item.quantity) || 1),
    0
  );

  return (
    <nav className="navbar">
      <div className="navbar-container" ref={searchRef}>
        <div onClick={() => navigate("/")} className="logo">
          <img src="/DACOMLOGO2.png" alt="Logo" />
        </div>

        <div className="search-wrapper">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() =>
              search.length > 1 &&
              suggestions.length > 0 &&
              setShowSuggestions(true)
            }
            placeholder="Buscar productos..."
            className="search-input"
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className="search-dropdown">
              {suggestions.map((item, idx) => (
                <div
                  key={idx}
                  className="search-item"
                  onClick={() => handleSuggestionClick(item.name)}
                >
                  <img
                    src={
                      item.image &&
                      !item.image.includes("placeholder")
                        ? item.image
                        : "https://placehold.co/40"
                    }
                    alt=""
                  />
                  <div>
                    <p>{item.name}</p>
                    <span>S/ {Number(item.price).toFixed(2)}</span>
                  </div>
                </div>
              ))}

              <div
                className="view-all"
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(search)}`);
                  setShowSuggestions(false);
                  setSearch("");
                }}
              >
                Ver todos los resultados →
              </div>
            </div>
          )}
        </div>

        <br></br>

        <div className="navbar-actions">
          <Link className="nav-link" to="/consulta">
            Lista ({quoteCount})
          </Link>
          <Link className="nav-link" to="/contacto">
            Contacto
          </Link>
        </div>
      </div>
    </nav>
  );
}
