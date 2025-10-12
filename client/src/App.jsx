// App.jsx
import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserLayout from "./components/Layout/UserLayout"
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import { AuthProvider } from './context/AuthContext';
import AdminRoute from './components/Admin/AdminProtectedRoute';
import AdminProductManager from './components/Admin/AdminProductManager'
import ShopPage from './pages/Shop';
import CategoryPage from './pages/Category';

const App = () => {
  return (
   <AuthProvider> 
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserLayout/>}>
          <Route index element={<Home/>} />
          {/* Add a protected route example */}
          <Route path="/profile" element={<Profile />} />
        </Route>
        
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        {/* Dashboard route */}
        <Route path="/shop" element={<ShopPage />} />
        <Route 
          path="/category/men" 
          element={<CategoryPage categoryName="Men" />} 
        />
        <Route 
          path="/category/women" 
          element={<CategoryPage categoryName="Women" />} 
        />
        <Route 
          path="/category/top-wear" 
          element={<CategoryPage categoryName="Top Wear" />} 
        />
        <Route 
          path="/category/bottom-wear" 
          element={<CategoryPage categoryName="Bottom Wear" />} 
        />
        {/*Admin Layout */}
         {/* PROTECTED ADMIN ROUTE */}
    <Route path="/admin" element={<AdminRoute />}>
        <Route index element={<AdminProductManager />} />
    </Route>
      </Routes>
     </BrowserRouter>
   </AuthProvider>
  );
}
export default App;

// You'll need to create a placeholder Profile component
const Profile = () => <h1>User Profile Page (Protected)</h1>;