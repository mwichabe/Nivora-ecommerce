import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isLoggedIn, authLoading } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const CART_API_URL = "http://localhost:5000/api/cart";

  const getAuthHeaders = () => {
      const token = localStorage.getItem("token");
      return {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
      };
  };
  
  // Helper to process response data
  const handleCartResponse = (data) => {
    setCartItems(data.items || []);
    const calculatedTotal = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(calculatedTotal);
  };

  const fetchCart = async () => {
    const token = localStorage.getItem("token"); 
    if (!token || !isLoggedIn) {
      setCartItems([]);
      setTotalItems(0);
      setLoading(false);
      return; 
    }

    setLoading(true);
    try {
      const response = await fetch(CART_API_URL, { headers: getAuthHeaders() });
      const data = await response.json();

      if (response.ok) {
        handleCartResponse(data);
      } else if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login"); 
      }
    } catch (err) {
      console.error("Fetch Cart Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItemQuantity = async (itemId, quantity) => {
    if (quantity < 1) return removeCartItem(itemId);

    try {
      const response = await fetch(`${CART_API_URL}/${itemId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
      });
      
      // 🔑 FIX 1: Safely parse JSON response
      let data;
      try {
          data = await response.json();
      } catch (e) {
          // Log non-JSON response content if possible, but safely exit
          console.error("Update failed. Server response was not JSON.");
          return { success: false, message: 'Server error: Invalid response format or unhandled server error.' };
      }
      
      if (response.ok) {
        handleCartResponse(data);
        return { success: true };
      }
      // Handle the case where the server returns a 4xx error with JSON data
      return { success: false, message: data.message || 'Update failed' };
    } catch (err) {
      console.error("Update Cart Network Error:", err);
      return { success: false, message: 'Network error or server connection failed.' };
    } 
  };

  const removeCartItem = async (itemId) => {
    try {
      const response = await fetch(`${CART_API_URL}/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      // 🔑 FIX 2: Safely parse JSON response
      let data;
      try {
          data = await response.json();
      } catch (e) {
          // Log non-JSON response content if possible, but safely exit
          console.error("Removal failed. Server response was not JSON.");
          return { success: false, message: 'Server error: Invalid response format or unhandled server error.' };
      }
      
      if (response.ok) {
        handleCartResponse(data);
        return { success: true };
      }
      // Handle the case where the server returns a 4xx error with JSON data
      return { success: false, message: data.message || 'Removal failed' };
    } catch (err) {
      console.error("Remove Cart Network Error:", err);
      return { success: false, message: 'Network error or server connection failed.' };
    }
  };


  useEffect(() => {
    if (!authLoading) {
      if (isLoggedIn) {
        fetchCart();
      } else {
        setCartItems([]);
        setTotalItems(0);
        setLoading(false); 
      }
    }
  }, [isLoggedIn, authLoading]);

  const refreshCart = () => fetchCart();

  const totalCartPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  
  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        totalItems, 
        loading, 
        refreshCart, 
        updateCartItemQuantity,
        removeCartItem,        
        totalCartPrice,        
      }}
    >
      {children}
    </CartContext.Provider>
  );
};