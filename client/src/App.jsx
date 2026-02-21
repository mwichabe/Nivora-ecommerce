import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout";
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminRoute from './components/Admin/AdminProtectedRoute';
import AdminProductManager from './components/Admin/AdminProductManager';
import ShopPage from './pages/Shop';
import CategoryPage from './pages/Category';
import Profile from './components/Common/Profile';
import CheckoutScreen from './components/Common/CheckoutScreen';
import ContactUs from './pages/Footer/ContactUs';
import AboutUs from './pages/Footer/AboutUs';
import Landing from './pages/Landing';
import Policy from './pages/Footer/Policy';
import ProductDetail from './components/Products/ProductDetail';
import Reviews from './pages/Reviews';
import PaystackCallback from './components/Common/PaystackCallback';

const AppRoutes = () => {
  const { isLoggedIn, authLoading } = useAuth();


  if (authLoading) {

    return null;
  }

  return (
    <Routes>

      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/app" replace /> : <Navigate to="/landing" replace />}
      />

      <Route path="/landing" element={<Landing />} />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/app" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={isLoggedIn ? <Navigate to="/app" replace /> : <SignUp />}
      />

      {/* User Layout Routes (Protected by the above logic) */}
      <Route path="/app" element={<UserLayout />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="paystack-callback" element={<PaystackCallback />} />
      </Route>

      {/* Shop, Checkout, and Footer Routes (Generally public) */}
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/category/men" element={<CategoryPage categoryName="Men" />} />
      <Route path="/category/women" element={<CategoryPage categoryName="Women" />} />
      <Route path="/category/top-wear" element={<CategoryPage categoryName="Top Wear" />} />
      <Route path="/category/bottom-wear" element={<CategoryPage categoryName="Bottom Wear" />} />
      <Route path="/product/:id" element={<ProductDetail />} />

      {/* Checkout Screen - Best practice is to protect this */}
      <Route
        path="/checkout"
        element={isLoggedIn ? <CheckoutScreen /> : <Navigate to="/login" replace />}
      />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/policy" element={<Policy />} />

      {/* Admin Layout - Still protected by AdminRoute component */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminProductManager />} />
      </Route>

      {/* Optional: Add a 404/Not Found Route */}
      <Route path="*" element={<h1>404 - Not Found</h1>} />
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;