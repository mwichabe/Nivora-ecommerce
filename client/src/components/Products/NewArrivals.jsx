import React, { useState, useEffect, useMemo } from "react";
import { LayoutDashboard, Search, Filter } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ProductModal } from "../Common/ProductModal";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const API_URL = "http://localhost:5000/api/admin/products";
const CART_API_URL = "http://localhost:5000/api/cart";

const NewArrivals = () => {
  const { isLoggedIn } = useAuth();
  const { refreshCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingProductId, setAddingProductId] = useState(null);
  const [quickAddError, setQuickAddError] = useState(null);

  // Fetch only new arrivals (sorted by createdAt descending)
  useEffect(() => {
    const fetchNewArrivals = async () => {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      try {
        setLoading(true);
        const response = await axios.get(API_URL, config);
        const sorted = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        const safeProducts = sorted.slice(0, 10).map((p) => ({
          ...p,
          imageUrls:
            p.imageUrls && p.imageUrls.length > 0
              ? p.imageUrls
              : [
                  "https://placehold.co/600x400/000000/FFFFFF?text=No+Image+Available",
                ],
        }));

        setProducts(safeProducts);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/signup");
        } else {
          setProducts([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [navigate]);

  // Search filter
  const filteredProducts = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  // Select size for quick add
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
  };

  // Open/close modal
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Quick Add Logic (identical to ShopPage)
  const handleQuickAddToCart = async (product) => {
    if (addingProductId) return;

    if (!isLoggedIn) {
      setQuickAddError("You must be logged in to add items.");
      setTimeout(() => setQuickAddError(null), 3000);
      return;
    }

    const size =
      product.sizes.length > 0
        ? selectedSizes[product._id]
        : "One Size";

    if (product.sizes.length > 0 && !size) {
      setQuickAddError("Please select a size first.");
      setTimeout(() => setQuickAddError(null), 3000);
      return;
    }

    setAddingProductId(product._id);
    setQuickAddError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        CART_API_URL,
        {
          productId: product._id,
          size,
          quantity: 1,
          price: parseFloat(product.price.toFixed(2)),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        setQuickAddError(`✅ Added: ${product.name} (${size})`);
        refreshCart();
        setTimeout(() => setQuickAddError(null), 2000);
      } else {
        setQuickAddError("Failed to add item to cart.");
        setTimeout(() => setQuickAddError(null), 3000);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Network error.";
      setQuickAddError(errorMessage);
      setTimeout(() => setQuickAddError(null), 3000);
    } finally {
      setAddingProductId(null);
    }
  };

  // Reusable Product Card
  const ProductCard = ({ product }) => {
    const isAdding = addingProductId === product._id;
    const isOneSize = product.sizes.length === 0;
    const currentSelectedSize = isOneSize
      ? "One Size"
      : selectedSizes[product._id];
    const isAddButtonEnabled =
      product.stock > 0 && !isAdding && (isOneSize || currentSelectedSize);

    return (
      <div
        className="bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden group transition-all hover:shadow-xl hover:scale-[1.02] duration-300 cursor-pointer"
        onClick={() => handleProductClick(product)}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white text-lg font-bold uppercase tracking-widest p-2 border-2 border-white rounded-full">
                Sold Out
              </span>
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col items-start">
          <h3 className="text-lg font-bold text-gray-900 truncate w-full mb-1">
            {product.name}
          </h3>
          <p className="text-2xl font-extrabold text-[#333] mb-3">
            Ksh {product.price.toFixed(2)}
          </p>

          {/* Size selector */}
          <div className="w-full mb-3">
            {isOneSize ? (
              <span className="text-xs text-gray-500 font-medium">
                One Size
              </span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`text-xs px-2 py-1 rounded border transition-all duration-150 ${
                      currentSelectedSize === size
                        ? "bg-[#ea2e0e] text-white border-[#ea2e0e]"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSizeSelect(product._id, size);
                    }}
                    disabled={product.stock === 0}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider transition duration-300 hover:bg-[#c4250c] disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!isAddButtonEnabled}
            onClick={(e) => {
              e.stopPropagation();
              if (isAddButtonEnabled) handleQuickAddToCart(product);
            }}
          >
            {isAdding
              ? "Adding..."
              : product.stock === 0
              ? "Notify Me"
              : !isOneSize && !currentSelectedSize
              ? "Select Size"
              : "Quick Add"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10 border-b pb-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ea2e0e] tracking-tight">
            New Arrivals
          </h1>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search New Arrivals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition duration-150 shadow-md text-base"
          />
        </div>

        {quickAddError && (
          <div
            className={`p-3 mb-4 text-sm font-medium rounded-lg border ${
              quickAddError.startsWith("✅")
                ? "text-green-700 bg-green-100 border-green-300"
                : "text-red-700 bg-red-100 border-red-300"
            }`}
          >
            {quickAddError}
          </div>
        )}

        {/* Product grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array(10)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden p-4 space-y-3 animate-pulse"
                >
                  <div className="aspect-square bg-gray-200 rounded-lg"></div>
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-7 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-11 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center p-16 border-4 border-dashed border-gray-200 rounded-2xl bg-white shadow-inner mt-10">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">
              No New Arrivals Found
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Check back soon for the latest additions!
            </p>
          </div>
        )}
      </div>

      {isModalOpen && <ProductModal product={selectedProduct} onClose={closeModal} />}
    </div>
  );
};

export default NewArrivals;
