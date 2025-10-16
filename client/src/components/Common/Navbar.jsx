import React, { useState } from "react";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight,
  HiOutlineTag, // Added for profile menu icon
  HiOutlineArrowRightOnRectangle, // Added for logout icon
} from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo.png";
import CartDrawer from "./CartDrawer";
import { useCart } from "../../context/CartContext";

// // Assuming these components exist for styling completeness
// const SearchBar = () => (
//   <input
//     type="text"
//     placeholder="Search..."
//     className="p-1 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#ea2e0e] w-32 hidden lg:block transition duration-150"
//   />
// );

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout, authLoading, user } = useAuth();
  const { totalItems } = useCart();

  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // New state for profile popover

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
    setProfileMenuOpen(false); // Close profile menu if opening nav drawer
  };

  const toggleCartDrawer = () => {
    setCartDrawerOpen(!cartDrawerOpen);
    setProfileMenuOpen(false); // Close profile menu if opening cart drawer
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  // Function to handle clicking the profile/login button
  const handleAuthClick = () => {
    if (isLoggedIn) {
      // If logged in, toggle the menu
      toggleProfileMenu();
    } else {
      // If logged out, navigate to the login page
      navigate("/login");
      setNavDrawerOpen(false);
      setProfileMenuOpen(false);
    }
  };

  // Custom logout handler
  const handleLogout = () => {
    logout(); // Call the context logout function
    setProfileMenuOpen(false);
    navigate("/login"); // Redirect to home after logout
  };

  if (authLoading) {
    // Return null while authentication status is being checked (prevent flicker)
    return null;
  }

  // Determine user initials or default avatar text
  // Only try to generate initials if the user object is present
  const userInitial = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  return (
    <>
      <nav className="sticky top-0 bg-white shadow-md z-40">
        <div className="container mx-auto flex items-center justify-between py-4 px-6">
          {/* Left Logo: Image for better branding */}
          <div className="flex items-center space-x-2">
            <Link to="/app" className="flex items-center">
              <img
                src={logo}
                alt="ONE MAN Logo"
                className="h-7 w-auto mr-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/120x28/ea2e0e/ffffff?text=ONE+MAN";
                }}
              />
              <span className="text-xl font-extrabold tracking-tight text-gray-800 hidden sm:inline">
                ONE MAN
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Uppercase and styled) */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/category/men"
              className="text-gray-700 hover:text-[#ea2e0e] text-sm font-semibold uppercase transition duration-150"
            >
              Men
            </Link>
            <Link
              to="/category/women"
              className="text-gray-700 hover:text-[#ea2e0e] text-sm font-semibold uppercase transition duration-150"
            >
              Women
            </Link>
            <Link
              to="/category/top-wear"
              className="text-gray-700 hover:text-[#ea2e0e] text-sm font-semibold uppercase transition duration-150"
            >
              Top Wear
            </Link>
            <Link
              to="/category/bottom-wear"
              className="text-gray-700 hover:text-[#ea2e0e] text-sm font-semibold uppercase transition duration-150"
            >
              Bottom Wear
            </Link>
          </div>

          {/* Right Section: Search, Cart, Auth */}
          <div className="flex items-center space-x-5">
            {/* Search Bar
            <div className="hidden lg:block">
              <SearchBar />
            </div> */}

            {/* Cart Icon */}
            <button
              onClick={toggleCartDrawer}
              className="relative text-gray-700 hover:text-[#ea2e0e] transition duration-150 p-1"
              aria-label="View Shopping Cart"
            >
              <HiOutlineShoppingBag className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#ea2e0e] text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* AUTH SECTION (Enhanced Profile UX) */}
            <div className="relative">
              <button
                onClick={handleAuthClick}
                className={`p-1 rounded-full transition duration-150 focus:outline-none 
                                ${
                                  isLoggedIn && user
                                    ? "bg-gray-200 hover:bg-[#ea2e0e] hover:text-white"
                                    : "text-gray-700 hover:text-[#ea2e0e]"
                                }`}
                aria-label={isLoggedIn ? "User Profile Menu" : "Sign In"}
              >
                {/* 🟢 MODIFIED: Check for BOTH isLoggedIn AND user */}
                {isLoggedIn && user ? (
                  <div className="w-7 h-7 flex items-center justify-center bg-[#ea2e0e] text-white text-xs font-semibold rounded-full shadow-inner">
                    {userInitial}
                  </div>
                ) : (
                  <HiOutlineUser className="h-6 w-6" />
                )}
              </button>

              {/* Profile Dropdown Menu (Only visible when logged in and toggled) */}
              {/* 🟢 MODIFIED: Check for BOTH isLoggedIn AND user */}
              {isLoggedIn && user && profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-xl py-2 z-50 transform translate-x-1/4 md:translate-x-0">
                  <div className="px-4 py-2 text-sm font-medium text-gray-800 border-b border-gray-100">
                    Hello, {user?.name.split(" ")[0] || "User"}
                  </div>
                  <Link
                    to="profile"
                    onClick={() => {
                      navigate("profile");
                      setProfileMenuOpen(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#ea2e0e]"
                  >
                    <HiOutlineUser className="w-4 h-4 mr-2" /> My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <HiOutlineArrowRightOnRectangle className="w-4 h-4 mr-2" />{" "}
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Nav Toggle */}
            <button
              onClick={toggleNavDrawer}
              className="md:hidden text-gray-700 hover:text-[#ea2e0e] p-1 transition duration-150"
              aria-label="Open Navigation Menu"
            >
              <HiBars3BottomRight className="h-7 w-7" />
            </button>
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      {/* <CartDrawer drawerOpen={cartDrawerOpen} toggleCartDrawer={toggleCartDrawer} /> */}
      <CartDrawer
        drawerOpen={cartDrawerOpen}
        toggleCartDrawer={toggleCartDrawer}
      />

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 h-full bg-white shadow-2xl transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-8 border-b pb-4">
            <div className="flex items-center">
              <img
                src={logo}
                alt="ONE MAN Logo"
                className="h-8 w-auto mr-2"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/120x32/ea2e0e/ffffff?text=ONE+MAN";
                }}
              />
              <span className="text-xl font-extrabold tracking-tight text-gray-800">
                ONE MAN
              </span>
            </div>
            <button
              onClick={toggleNavDrawer}
              aria-label="Close Navigation Menu"
            >
              <IoMdClose className="h-7 w-7 text-gray-600 hover:text-[#ea2e0e]" />
            </button>
          </div>

          <nav className="space-y-6">
            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-lg font-medium text-gray-700 hover:text-[#ea2e0e] uppercase"
            >
              Men
            </Link>
            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-lg font-medium text-gray-700 hover:text-[#ea2e0e] uppercase"
            >
              Women
            </Link>
            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-lg font-medium text-gray-700 hover:text-[#ea2e0e] uppercase"
            >
              Top Wear
            </Link>
            <Link
              to="#"
              onClick={toggleNavDrawer}
              className="block text-lg font-medium text-gray-700 hover:text-[#ea2e0e] uppercase"
            >
              Bottom Wear
            </Link>

            <hr className="mt-6 border-gray-200" />

            {/* MOBILE AUTH LINK: Conditional Display */}
            {isLoggedIn && user ? (
              <>
                <Link
                  to="/profile"
                  onClick={toggleNavDrawer}
                  className="flex items-center text-lg font-medium text-gray-700 hover:text-[#ea2e0e]"
                >
                  <HiOutlineUser className="w-6 h-6 mr-2 text-[#ea2e0e]" /> My
                  Profile
                </Link>
                <button
                  onClick={() => {
                    toggleNavDrawer();
                    handleLogout();
                  }}
                  className="flex items-center text-lg font-medium text-gray-700 hover:text-[#ea2e0e] w-full text-left"
                >
                  <HiOutlineArrowRightOnRectangle className="w-6 h-6 mr-2 text-red-500" />{" "}
                  Logout ({user?.name.split(" ")[0] || "User"})
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={toggleNavDrawer}
                className="block text-lg font-medium text-gray-700 hover:text-[#ea2e0e]"
              >
                <span className="text-[#ea2e0e] font-bold">Sign In</span> / Sign
                Up
              </Link>
            )}
          </nav>
        </div>
      </div>
      {/* Optional: Backdrop for the drawer */}
      {navDrawerOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 md:hidden"
          onClick={toggleNavDrawer}
        ></div>
      )}
    </>
  );
};
export default Navbar;
