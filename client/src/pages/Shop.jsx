import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, LayoutDashboard, ChevronDown } from 'lucide-react'; 
import axios from 'axios'; 
import { Link, useNavigate } from 'react-router-dom'; 
import { ProductModal } from '../components/Common/ProductModal';

// --- Constants ---
const API_URL = 'http://localhost:5000/api/admin/products'; 
const CATEGORIES = ["All", "Men", "Women", "Top Wear", "Bottom Wear", "Accessories"];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All'); 
  
  // NEW STATES for Modal/Image View
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();

  // --- Data Fetching (Auth Logic) ---
  useEffect(() => {
    // ... (Auth and Data fetching logic remains the same) ...
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
        const response = await axios.get(API_URL, config);
        
        const safeProducts = response.data.map(p => ({
            ...p,
            imageUrls: p.imageUrls && p.imageUrls.length > 0 
                ? p.imageUrls 
                : ['https://placehold.co/600x400/000000/FFFFFF?text=No+Image'],
        }));
        setProducts(safeProducts);

      } catch (error) {
        console.error("Error fetching products:", error);

        if (error.response && error.response.status === 401) {
          console.error("Authorization failed. Redirecting to /signup.");
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

  // --- Filtering & Searching Logic (No Change) ---
  const filteredProducts = useMemo(() => {
    let tempProducts = [...products];
    if (activeCategory !== 'All') {
      tempProducts = tempProducts.filter((product) => product.category === activeCategory);
    }
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      tempProducts = tempProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowerCaseSearch) ||
          product.description.toLowerCase().includes(lowerCaseSearch)
      );
    }
    return tempProducts;
  }, [products, activeCategory, searchTerm]);

  // --- Modal Handlers ---
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };


  // --- Product Card Component (UPDATED with onClick) ---
  const ProductCard = ({ product }) => (
    <div 
        className="bg-white border border-gray-100 shadow-md rounded-xl overflow-hidden group transition-all hover:shadow-xl hover:scale-[1.02] duration-300 relative cursor-pointer"
        onClick={() => handleProductClick(product)} // NEW: Click opens modal
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
        <button
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wider transition duration-300 hover:bg-[#ea2e0e] disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={product.stock === 0}
          onClick={(e) => { e.stopPropagation(); /* Add to cart logic */ }} // Prevents modal from opening when clicking button
        >
          {product.stock > 0 ? 'Quick Add' : 'Notify Me'}
        </button>
      </div>
    </div>
  );

  // --- Main Render ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* ... (Header and Controls sections remain the same) ... */}
        {/* --- Header Section: Title & Dashboard Link --- */}
        <div className="flex justify-between items-center mb-10 border-b pb-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#ea2e0e] tracking-tight">
                Shop Collection
            </h1>
            <Link 
                to="/" 
                className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition duration-200 shadow-sm"
            >
                <LayoutDashboard className="w-5 h-5" />
                <span>Go to Dashboard</span>
            </Link>
        </div>

        {/* --- Controls Section: Search & Filters --- */}
        <div className="sticky top-0 bg-gray-50 z-10 py-4 mb-6 border-b border-gray-100">
          
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} 
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition duration-150 shadow-md text-base"
            />
          </div>

          <div className="hidden md:flex flex-wrap gap-3">
            <span className="text-sm font-semibold text-gray-600 self-center mr-2">Filter By Category:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition duration-200 
                  ${activeCategory === cat
                    ? 'bg-[#ea2e0e] text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="md:hidden">
              <label htmlFor="mobile-category" className="flex items-center text-sm font-semibold text-gray-600 mb-2">
                <Filter className="w-4 h-4 mr-1"/> Filter By Category
              </label>
              <div className="relative">
                <select
                    id="mobile-category"
                    value={activeCategory}
                    onChange={(e) => setActiveCategory(e.target.value)}
                    className="appearance-none w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-1 focus:ring-black focus:border-black shadow-sm pr-10"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
          </div>

        </div>

        {/* --- Product Display --- */}
        {loading ? (
          // ... (Skeleton Loader remains the same) ...
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
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          // ... (Empty State remains the same) ...
          <div className="text-center p-16 border-4 border-dashed border-gray-200 rounded-2xl bg-white shadow-inner mt-10">
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">No Matches Found</h2>
            <p className="text-gray-500 mt-2 text-lg">
              We couldn't find any products matching **"{searchTerm || 'your search'}"** in the **{activeCategory}** category.
            </p>
            <button 
                onClick={() => { setActiveCategory('All'); setSearchTerm(''); }}
                className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-[#ea2e0e] transition duration-300"
            >
                Clear Filters
            </button>
          </div>
        )}
        
      </div>
      
      {/* --- Image Modal --- */}
      {isModalOpen && <ProductModal product={selectedProduct} onClose={closeModal} />}

    </div>
  );
};

export default ShopPage;