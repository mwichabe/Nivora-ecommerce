import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, LayoutDashboard } from 'lucide-react'; 
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { ProductModal } from '../components/Common/ProductModal';
// 🔥 NEW IMPORTS for Quick Add functionality 🔥
import {useAuth} from '../context/AuthContext';
import { useCart} from '../context/CartContext';

// --- Constants ---
const API_URL = 'http://localhost:5000/api/admin/products'; 
const CART_API_URL = 'http://localhost:5000/api/cart'; // Add Cart API URL

// --- Product Card Component (UPDATED with Quick Add Logic) ---
const ProductCard = ({ product, handleProductClick, handleQuickAddToCart, addingProductId, selectedSizes, handleSizeSelect }) => {
    const isAdding = addingProductId === product._id;
    const isOneSize = !product.sizes || product.sizes.length === 0;
    
    // Get the currently selected size for THIS product
    const currentSelectedSize = isOneSize ? 'One Size' : selectedSizes[product._id];

    // Determine if the Add button should be enabled
    const isAddButtonEnabled = product.stock > 0 && !isAdding && (isOneSize || currentSelectedSize);
    
    return (
        <div 
            className="bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden group transition-all hover:shadow-xl hover:scale-[1.02] duration-300 relative cursor-pointer"
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
                        <span className="text-white text-lg font-bold uppercase tracking-widest p-2 border-2 border-white rounded-full">Sold Out</span>
                    </div>
                )}
                <span className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-medium px-3 py-1 rounded-full">
                    {product.category}
                </span>
            </div>
            <div className="p-4 flex flex-col items-start">
                <h3 className="text-lg font-bold text-gray-900 truncate w-full mb-1">
                    {product.name}
                </h3>
                <p className="text-2xl font-extrabold text-[#333] mb-3">
                    ${product.price.toFixed(2)}
                </p>
                
                {/* 🔥 Size Selection Row 🔥 */}
                <div className="w-full mb-3">
                    {isOneSize ? (
                        <span className="text-xs text-gray-500 font-medium">One Size</span>
                    ) : (
                        <div className="flex flex-wrap gap-1">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    className={`text-xs px-2 py-1 rounded border transition-all duration-150 
                                        ${currentSelectedSize === size 
                                            ? 'bg-[#ea2e0e] text-white border-[#ea2e0e]' 
                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                        }`
                                    }
                                    onClick={(e) => { e.stopPropagation(); handleSizeSelect(product._id, size); }}
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
                            if (isAddButtonEnabled) {
                                handleQuickAddToCart(product); 
                            }
                        }}
                >
                    {isAdding 
                        ? 'Adding...' 
                        : product.stock === 0 
                            ? 'Notify Me' 
                            : !isOneSize && !currentSelectedSize
                                ? 'Select Size'
                                : 'Quick Add'
                    }
                </button>
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// --- CategoryPage Component ---
// ----------------------------------------------------------------------
const CategoryPage = ({ categoryName }) => {
  
  // 🔥 HOOKS & CONTEXT 🔥
  const { isLoggedIn } = useAuth(); 
  const { refreshCart } = useCart();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // 🔥 NEW Quick Add States 🔥
  const [addingProductId, setAddingProductId] = useState(null);
  const [quickAddError, setQuickAddError] = useState(null);
  const [selectedSizes, setSelectedSizes] = useState({});
  
  const navigate = useNavigate();

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem('token'); 

      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      try {
        setLoading(true);
        
        if (!token) {
            navigate('/signup'); 
            return; 
        }

        // Fetch ALL products
        const response = await axios.get(API_URL, config); 
        
        const safeProducts = response.data.map(p => ({
            ...p,
            imageUrls: p.imageUrls && p.imageUrls.length > 0 
                ? p.imageUrls 
                : ['https://placehold.co/600x400/000000/FFFFFF?text=No+Image'],
        }));
        setProducts(safeProducts); // Store all products fetched

      } catch (error) {
        console.error(`Error fetching products for client-side filtering:`, error);

        if (error.response && error.response.status === 401) {
          localStorage.removeItem('token');
          navigate('/signup'); 
          return; 
        }
        
        setProducts([]); 
        
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [navigate]); 

  // --- Filtering & Searching Logic (No change) ---
  const filteredProducts = useMemo(() => {
    let tempProducts = [...products];

    // 1. MANDATORY CATEGORY FILTER
    tempProducts = tempProducts.filter(
        (product) => product.category === categoryName
    );

    // 2. Search Filter
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearch) ||
          product.description.toLowerCase().includes(lowerCaseSearch)
      );
    }
    return tempProducts;
  }, [products, searchTerm, categoryName]);
  
  // --- Modal Handlers (No change) ---
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // 🔥 NEW: Handler for size selection 🔥
  const handleSizeSelect = (productId, size) => {
    setSelectedSizes(prevSizes => ({
        ...prevSizes,
        [productId]: size
    }));
  };

  // 🔥 NEW: handleQuickAddToCart logic (Full Price / 0% Discount) 🔥
  const handleQuickAddToCart = async (product) => {
    if (addingProductId) return;

    if (!isLoggedIn) {
      setQuickAddError("You must be logged in to add items.");
      setTimeout(() => setQuickAddError(null), 3000); 
      return;
    }

    // Determine the size (uses selectedSizes state)
    const size = product.sizes.length > 0 ? selectedSizes[product._id] : 'One Size';
    
    // Check if a size is required but not selected
    if (product.sizes.length > 0 && !size) {
        setQuickAddError("Please select a size first.");
        setTimeout(() => setQuickAddError(null), 3000); 
        return;
    }

    setAddingProductId(product._id);
    setQuickAddError(null);

    // Use the full product price (0% discount for this page)
    const priceToSend = product.price; 

    try {
      const token = localStorage.getItem('token'); 

      const response = await axios.post(CART_API_URL, {
        productId: product._id,
        size: size, 
        quantity: 1,
        // Send the full product price
        price: parseFloat(priceToSend.toFixed(2)), 
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });

      if (response.status === 201) {
        // Include size in the success message
        setQuickAddError(`✅ Added: ${product.name} (${size})`); 
        refreshCart();
        setTimeout(() => setQuickAddError(null), 2000); 
      } else {
        setQuickAddError('Failed to add item to cart.');
        setTimeout(() => setQuickAddError(null), 3000); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'A network error occurred.';
      setQuickAddError(errorMessage);
      setTimeout(() => setQuickAddError(null), 3000); 
    } finally {
      setAddingProductId(null);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* --- Header Section --- */}
        <div className="flex justify-between items-center mb-10 border-b pb-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ea2e0e] tracking-tight">
                {categoryName} Collection
            </h1>
            <Link 
                to="/app" 
                className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition duration-200 shadow-sm"
            >
                <LayoutDashboard className="w-5 h-5" />
                <span>Dashboard</span>
            </Link>
        </div>

        {/* --- Controls Section: Search Only --- */}
        <div className="sticky top-0 bg-gray-50 z-10 py-4 mb-6 border-b border-gray-100">
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={`Search within ${categoryName}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition duration-150 shadow-md text-base"
            />
          </div>
        </div>
        
        {/* 🔥 NEW: Quick Add Status Message 🔥 */}
        {quickAddError && (
          <div className={`p-3 mb-4 text-sm font-medium rounded-lg border 
            ${quickAddError.startsWith('✅') ? 'text-green-700 bg-green-100 border-green-300' : 'text-red-700 bg-red-100 border-red-300'}`}>
              {quickAddError}
          </div>
        )}

        {/* --- Product Display --- */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden p-4 space-y-3 animate-pulse">
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
              <ProductCard 
                  key={product._id} 
                  product={product} 
                  handleProductClick={handleProductClick}
                  // 🔥 Pass Quick Add Props 🔥
                  handleQuickAddToCart={handleQuickAddToCart}
                  addingProductId={addingProductId}
                  selectedSizes={selectedSizes}
                  handleSizeSelect={handleSizeSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center p-16 border-4 border-dashed border-gray-200 rounded-2xl bg-white shadow-inner mt-10">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">No Products Found</h2>
            <p className="text-gray-500 mt-2 text-lg">
              There are no products currently listed in the {categoryName} category that match your search.
            </p>
          </div>
        )}
        
      </div>
      
      {isModalOpen && <ProductModal product={selectedProduct} onClose={closeModal} />}

    </div>
  );
};

export default CategoryPage;