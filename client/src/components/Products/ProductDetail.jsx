import React, { useState, useEffect, useContext, createContext } from "react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

// --- API Endpoints ---
const PRODUCT_API_BASE_URL = 'http://localhost:5000/api/admin/products'; 
const CART_API_URL = 'http://localhost:5000/api/cart';
// --- End API Endpoints ---

// Define a universal placeholder image for robustness
const PLACEHOLDER_IMAGE = 'https://placehold.co/600x600/CCCCCC/666666?text=No+Image';

const CheckIcon = ({ className }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={2.5} 
        stroke="currentColor" 
        className={className}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ProductDetail = () => {
  // Destructuring isLoggedIn from the context stub
  const { isLoggedIn } = useAuth(); 
  const { refreshCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false); // New state for add to cart loading

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [successMessage, setSuccessMessage] = useState(''); // State for success messages


  // Function to fetch the random product
  useEffect(() => {
    const fetchRandomProduct = async () => {
      try {
        setLoading(true);
        // Using the product-specific endpoint
        const response = await fetch(`${PRODUCT_API_BASE_URL}/random`);

        if (!response.ok) {
            // Handle non-200 responses gracefully
            const errorText = await response.text();
            console.error("Server Error Response:", errorText); 
            throw new Error(`Failed to fetch product. Status: ${response.status}`);
        }

        const data = await response.json();
        
        // Check if data is null (handled by controller for count === 0)
        if (!data || !data.name) {
            setProduct(null); // Explicitly set to null if no product is returned
            setLoading(false);
            return;
        }

        setProduct(data);
        
        // Safely set the selectedImage state
        const firstImage = data.imageUrls && data.imageUrls.length > 0
            ? data.imageUrls[0] 
            : PLACEHOLDER_IMAGE;
        
        setSelectedImage(firstImage);
        
      } catch (err) {
        console.error("Fetch Error:", err);
        setError("We encountered an issue loading the product data.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRandomProduct();
  }, []); // Run only once on mount

  // Helper function to format price
  const formatPrice = (price) => `Ksh ${(price).toFixed(2)}`;

  // --- Derived Calculations (moved up to be available for handleAddToCart) ---
  let originalPrice = 0;
  let discountedPrice = 0;
  const DISCOUNT_RATE = 0.20; // Fixed 20% discount

  if (product) {
    originalPrice = product.price; 
    discountedPrice = originalPrice * (1 - DISCOUNT_RATE);
    // Note: discountPercentage is still calculated for display later
  }
  // ----------------------------

  // Handles the API call to add the item to the cart
  const handleAddToCart = async () => {
    
    // Pre-check: Not logged in
    if (!isLoggedIn) {
      setError("You must be logged in to add items to your cart.");
      setTimeout(() => setError(null), 5000); 
      return;
    }

    // Pre-check: Size not selected
    if (product.sizes.length > 0 && !selectedSize) {
      setError("Please select a size before adding to cart.");
      setTimeout(() => setError(null), 5000); 
      return;
    }
    
    // Pre-check: Product data missing
    if (!product) {
      setError("Cannot add to cart: Product data is unavailable.");
      setTimeout(() => setError(null), 5000); 
      return;
    }

    setError(null);
    setSuccessMessage('');
    setIsAdding(true);
    
    // Assuming DISCOUNT_RATE is defined as a constant in this file (e.g., const DISCOUNT_RATE = 0.20;)
    const DISCOUNT_RATE = 0.20; 
    
    // ✅ MODIFICATION: Calculate the discounted price (20% off)
    const priceToSend = product.price * (1 - DISCOUNT_RATE);

    // Determine the size to send
    const finalSize = selectedSize || (product.sizes.length === 0 ? 'One Size' : null);
    const quantity = 1;

    try {
      const token = localStorage.getItem('token'); 

      // Use axios for consistency if possible, but fetch works too. Sticking to fetch as provided.
      const response = await fetch(CART_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product._id,
          size: finalSize, 
          quantity: quantity,
          // ✅ MODIFICATION: Send the discounted price (Product Details price rule)
          price: parseFloat(priceToSend.toFixed(2)), 
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message || 'Item added to cart successfully!');
        refreshCart();
        setTimeout(() => setSuccessMessage(''), 3000); 
      } else {
        setError(data.message || 'Failed to add item to cart. Please try again.');
        setTimeout(() => setError(null), 5000); 
      }
    } catch (err) {
      console.error("Add to Cart Error:", err);
      setError('A network error occurred while adding to cart.');
      setTimeout(() => setError(null), 5000); 
    } finally {
      setIsAdding(false);
    }
  };

  // --- Derived Calculations for Display (can remain here) ---
  const discountPercentage = DISCOUNT_RATE * 100;
  // ----------------------------------------------------------

  // --- Loading and Error States ---
  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen py-12 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-700">
          Searching for the best deals...
        </div>
      </div>
    );
  }

  // Determine availability status based on stock
  const isAvailable = product && product.stock > 0;
  const isButtonDisabled = isAdding || !isAvailable || (product?.sizes.length > 0 && !selectedSize);


  if (error || !product) {
    // Note: The original logic here was confusing. It should primarily check for errors 
    // or if a product wasn't found, not just login status.
    return (
      <div className="bg-gray-100 min-h-screen py-12 flex items-center justify-center px-4">
        <div className="max-w-md w-full p-10 bg-white shadow-2xl rounded-xl text-center border-t-4 border-[#ea2e0e]">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {product === null ? "Product Not Found" : "Error Loading Data"}
          </h2>
          <p className="text-gray-600">
            {error || (product === null ? "The requested product is currently unavailable." : "An unexpected error occurred.")}
          </p>
        </div>
      </div>
    );
  }
  
  // Destructure product for clean rendering
  const { name, description, imageUrls, sizes, stock, category } = product;
  const imagesToDisplay = imageUrls.length > 0 ? imageUrls : [PLACEHOLDER_IMAGE];


  return (
    // 🟢 Smaller container padding and fixed max-width for cleaner look
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden md:flex">
        
        {/* Image Gallery */}
        {/* 🟢 Reduced padding and made image container slightly smaller (md:w-5/12) */}
        <div className="md:w-5/12 p-4 md:p-6 flex flex-col items-center border-r border-gray-100">
          {/* Main Image */}
          <div className="w-full mb-4 aspect-square">
            <img
              src={selectedImage}
              alt={name}
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          {/* Thumbnails */}
          <div className="w-full flex justify-center space-x-3 overflow-x-auto pb-2">
            {imagesToDisplay.map((url, index) => (
              <img
                key={index}
                src={url} 
                alt={`${name} thumbnail ${index + 1}`}
                // 🟢 Smaller thumbnails for better use of space
                className={`w-20 h-20 object-cover rounded-md cursor-pointer transition-all duration-200 hover:opacity-80
                  ${selectedImage === url
                    ? "border-3 border-[#ea2e0e] shadow-md ring-2 ring-[#ea2e0e]"
                    : "border border-gray-300"
                  }`}
                onClick={() => setSelectedImage(url)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        {/* 🟢 Slightly larger detail container (md:w-7/12) and refined padding */}
        <div className="md:w-7/12 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <span className="text-sm font-semibold uppercase text-[#ea2e0e] mb-1 block">{category}</span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {name}
            </h1>

            {/* Price and Stock Row (CONSOLIDATED) */}
            <div className="flex flex-col mb-6 pt-3 border-t border-gray-100">
                <div className="flex items-baseline">
                    {/* 🟢 Display Discounted Price */}
                    <span className="text-4xl font-extrabold text-[#ea2e0e] mr-4">
                        {formatPrice(discountedPrice)}
                    </span>
                    {/* 🟢 Display Original Price */}
                    <span className="text-xl text-gray-500 line-through mr-3">
                        {formatPrice(originalPrice)}
                    </span>
                    {/* 🟢 Display Discount Percentage (Fixed 20%) */}
                    <span className="text-sm font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                        SAVE {discountPercentage.toFixed(0)}%
                    </span>
                </div>
                
                {/* 🟢 Display Stock */}
                <div className="mt-2">
                    <span className={`text-md font-semibold ${stock > 0 ? 'text-green-700' : 'text-red-700'}`}>
                        {stock > 0 ? `In Stock: ${stock} items` : 'Currently Sold Out'}
                    </span>
                </div>
            </div>
            {/* Status Messages */}
            {successMessage && (
              <div className="flex items-center p-3 mb-4 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-300">
                  <CheckIcon className="w-5 h-5 mr-2" />
                  {successMessage}
              </div>
            )}
            {error && (
              <div className="p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300">
                  {error}
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-base text-gray-700 leading-relaxed">
                    {description}
                </p>
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Select Size
                {sizes.length === 0 && <span className="text-sm font-normal text-gray-500 ml-2">(One size fits all)</span>}
            </h3>
            <div className="flex flex-wrap gap-3">
              {sizes.length > 0 ? (
                sizes.map((size, index) => (
                  <button
                    key={index}
                    disabled={stock === 0}
                    className={`px-5 py-2 border-2 rounded-lg font-medium text-sm transition-all duration-200 
                      ${selectedSize === size
                        ? "bg-[#ea2e0e] text-white border-[#ea2e0e] shadow-md"
                        : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
                      }
                      ${stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))
              ) : (
                <button
                    disabled={stock === 0}
                    className={`px-5 py-2 border-2 rounded-lg font-medium text-sm opacity-70 
                      ${stock === 0 ? 'bg-gray-200 cursor-not-allowed' : 'bg-gray-100 text-gray-500'}`}
                >
                    One Size
                </button>
              )}
            </div>
          </div>

         {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            className={`w-full py-4 text-xl font-bold text-white rounded-lg shadow-lg transition-all duration-300 
                ${!isButtonDisabled
                    ? 'bg-[#ea2e0e] hover:bg-[#c4250c] active:scale-[0.99]'
                    : 'bg-gray-400 cursor-not-allowed'
                }`
            }
            disabled={isButtonDisabled}
          >
            {isAdding 
                ? 'Adding...' 
                : !isAvailable 
                    ? 'Notify Me When Available' 
                    : (sizes.length > 0 && !selectedSize) 
                        ? 'Select Size to Add'
                        : 'Add to Cart'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;