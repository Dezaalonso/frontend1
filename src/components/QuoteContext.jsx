import { createContext, useContext, useEffect, useState } from "react";

const QuoteContext = createContext();

export function QuoteProvider({ children }) {
  const [quoteItems, setQuoteItems] = useState(() => {
    const saved = localStorage.getItem("quoteItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("quoteItems", JSON.stringify(quoteItems));
  }, [quoteItems]);

  const addToQuote = (product, qtyToAdd = 1) => {
    const add = Math.max(1, Math.floor(Number(qtyToAdd)) || 1);

    setQuoteItems((prev) => {
      const existing = prev.find((p) => p.name === product.name);

      if (existing) {
        return prev.map((p) =>
          p.name === product.name ? { ...p, quantity: p.quantity + add } : p
        );
      }

      return [...prev, { ...product, quantity: add }];
    });
  };

  const removeFromQuote = (name) => {
    setQuoteItems((prev) => prev.filter((p) => p.name !== name));
  };

  const updateQuantity = (name, quantity) => {
    const qty = Math.max(1, Math.floor(Number(quantity)) || 1);
    setQuoteItems((prev) =>
      prev.map((p) => (p.name === name ? { ...p, quantity: qty } : p))
    );
  };

  const clearQuote = () => {
    setQuoteItems([]);
  };

  return (
    <QuoteContext.Provider
      value={{
        quoteItems,
        addToQuote,
        removeFromQuote,
        updateQuantity,
        clearQuote,
      }}
    >
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  return useContext(QuoteContext);
}