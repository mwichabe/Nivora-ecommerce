import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token")); // ✅ Track token state
  const navigate = useNavigate();

  const CART_API_URL = "http://localhost:5000/api/cart";

  // ✅ Watch for token changes in localStorage (login/logout)
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const fetchCart = async () => {
    try {
      if (!token) {
        console.warn("No token found — redirecting to signup...");
        navigate("/signup");
        return;
      }

      setLoading(true);
      console.log(`🟢 Fetching cart with token: ${token}`);

      const response = await fetch(CART_API_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data;
      try {
        data = await response.json();
      } catch {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        return;
      }

      if (response.ok) {
        setCartItems(data.items || []);
        setTotalItems(data.totalItems || 0);
      } else {
        console.error("Failed to load cart:", data.message);
        if (response.status === 401) {
          localStorage.removeItem("token");
          setToken(null);
          navigate("/signup");
        }
      }
    } catch (err) {
      console.error("Fetch Cart Error:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (token) {
      fetchCart();
    }
  }, [token]);

  const refreshCart = () => fetchCart();

  return (
    <CartContext.Provider value={{ cartItems, totalItems, loading, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
};
