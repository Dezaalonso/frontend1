import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './App.css'
import { useNavigate } from "react-router-dom";
import { useQuote } from "../components/QuoteContext";
const API = "http://127.0.0.1:8000";

export default function Products() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const navigate = useNavigate();
  const { addToQuote } = useQuote();
  
  useEffect(() => {
  window.scrollTo(0, 0);
}, [category, currentPage]);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data[category] || []);
        setLoading(false);
        setCurrentPage(1);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [category]);

  const getImage = (p) => {
    // Check if we have a valid image
    if (p.image && 
        !p.image.includes("placeholder") && 
        !p.image.includes("placehold.co") && 
        !p.image.includes("Cargando") &&
        p.image.startsWith("http")) {
      return p.image;
    }
    
    // Category-based emoji placeholders
    const categoryIcons = {
      "Drinks": "🥤",
      "Snacks": "🍿",
      "Chocolates": "🍫",
      "Galletas": "🍪",
      "Golosinas": "🍬",
      "Limpieza": "🧹",
      "Alcohol": "🍺",
      "Other": "📦"
    };
    
    const icon = categoryIcons[category] || "📦";
    // Use a data:image SVG placeholder with emoji for better compatibility
    return `https://placehold.co/400x400/f0f0f0/666666?text=${encodeURIComponent(icon)}`;
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="products-grid">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="product-card skeleton">
              <div className="product-image-container skeleton-image"></div>
              <div className="product-info">
                <div className="skeleton-line"></div>
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="category-header">
        <h2 className="category-title">{category}</h2>
      </div>

      {products.length === 0 ? (
        <div className="no-products">
          <p>No hay productos en esta categoría</p>
        </div>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map((p, index) => (
              <div
                key={index}
                className="product-card"
                onClick={() => navigate(`/product/${encodeURIComponent(p.name)}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="product-image-container">
                  <img
                    src={getImage(p)}
                    alt={p.name}
                    loading="lazy"
                    onError={(e) => {
                      // Fallback to category emoji on error
                      const categoryIcons = {
                        "Drinks": "🥤", "Snacks": "🍿", "Chocolates": "🍫",
                        "Galletas": "🍪", "Golosinas": "🍬", "Limpieza": "🧹",
                        "Alcohol": "🍺", "Other": "📦"
                      };
                      const icon = categoryIcons[category] || "📦";
                      e.target.src = `https://placehold.co/400x400/f0f0f0/666666?text=${encodeURIComponent(icon)}`;
                    }}
                  />
                </div>

                <div className="product-info">
                  <h3 className="product-name">{p.name}</h3>
                  
                  <div className="product-footer">
                    <div className="price-stock">
                      <p className="product-price">S/ {Number(p.price).toFixed(2)}</p>
                      {p.stock !== undefined && (
                        <p className={`stock-info ${p.stock > 0 ? 'in-stock' : 'no-stock'}`}>
                          {p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado'}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="buy-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToQuote(p, 1);
                      }}
                      aria-label={`Agregar ${p.name} a lista de consulta`}
                    >
                      Agregar a consulta
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)} 
                disabled={currentPage === 1}
                className="pag-btn"
              >
                ← Anterior
              </button>
              
              <div className="page-numbers">
                {/* Show limited page numbers for better UX */}
                {(() => {
                  const pages = [];
                  const maxVisible = 5;
                  
                  if (totalPages <= maxVisible) {
                    // Show all pages
                    for (let i = 1; i <= totalPages; i++) {
                      pages.push(i);
                    }
                  } else {
                    // Show pages with ellipsis
                    if (currentPage <= 3) {
                      for (let i = 1; i <= 4; i++) pages.push(i);
                      pages.push('...');
                      pages.push(totalPages);
                    } else if (currentPage >= totalPages - 2) {
                      pages.push(1);
                      pages.push('...');
                      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      pages.push('...');
                      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                      pages.push('...');
                      pages.push(totalPages);
                    }
                  }
                  
                  return pages.map((page, idx) => (
                    <button
                      key={idx}
                      onClick={() => typeof page === 'number' && paginate(page)}
                      className={`pag-btn ${currentPage === page ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
                      disabled={page === '...'}
                    >
                      {page}
                    </button>
                  ));
                })()}
              </div>

              <button 
                onClick={() => paginate(currentPage + 1)} 
                disabled={currentPage === totalPages}
                className="pag-btn"
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Page info */}
          <div className="page-info">
            Mostrando {indexOfFirstProduct + 1} - {Math.min(indexOfLastProduct, products.length)} de {products.length} productos
          </div>
        </>
      )}
    </div>
  );
}