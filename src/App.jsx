import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SearchResults from "./pages/SearchResults";
import ProductDetail from "./pages/ProductDetail";
import QuotePage from "./pages/QuotePage";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"
import OfferBar from "./components/OfferBar";
import { QuoteProvider } from "./components/QuoteContext";
import FloatingContact from "./components/FloatingContact";



function App() {
  return (
    <QuoteProvider>
    <BrowserRouter>
      <Navbar />
      <OfferBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<Products />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/product/:name" element={<ProductDetail />} />
        <Route path="/consulta" element={<QuotePage />} />
        <Route path="/contacto" element={<Contact />} />    
      </Routes>
      <Footer />
      <FloatingContact />
    </BrowserRouter>
    </QuoteProvider>
  );
}

export default App;