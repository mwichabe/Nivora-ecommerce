import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// Import Context Hooks
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

// --- Constants ---
const CART_API_URL = 'http://localhost:5000/api/cart';

export const ProductModal = ({ product, onClose }) => {
    
    // Hooks and Context
    const { isLoggedIn } = useAuth(); 
    const { refreshCart } = useCart();

    if (!product) return null;

    // State
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null); 
    const [isAdding, setIsAdding] = useState(false);
    const [addError, setAddError] = useState(null);

    // Image data preparation
    const images = (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0)
        ? product.imageUrls
        : ['https://placehold.co/600x400/CCCCCC/000000?text=No+Image+Available'];

    // --- Effects and Helpers ---
    const requiresSizeSelection = product.sizes && product.sizes.length > 0;
    
    useEffect(() => {
        if (mainImageIndex >= images.length) {
            setMainImageIndex(0);
        }
        
        // Initialize size state
        if (!requiresSizeSelection) {
            setSelectedSize('One Size');
        } else {
            // Reset size selection when product changes
            setSelectedSize(null); 
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [images, mainImageIndex, product._id, requiresSizeSelection]);

    // Check if Add to Cart button should be enabled
    const isAddButtonEnabled = product.stock > 0 && !isAdding && (selectedSize !== null);

    // --- Size Selection Handler ---
    const handleSizeSelect = (size) => {
        if (product.stock > 0) {
            setSelectedSize(size);
            setAddError(null); // Clear error when a size is chosen
        }
    };
    
    // --- Add to Cart Logic (Full Price / 0% Discount) ---
    const handleAddToCart = async (e) => {
        e.stopPropagation();
        
        if (!isAddButtonEnabled || isAdding) return;

        if (!isLoggedIn) {
            setAddError("You must be logged in to add items.");
            setTimeout(() => setAddError(null), 3000); 
            return;
        }

        // Final size validation before API call (should be redundant due to button state, but good for safety)
        if (requiresSizeSelection && !selectedSize) {
            setAddError("Please select a size first.");
            setTimeout(() => setAddError(null), 3000); 
            return;
        }

        setIsAdding(true);
        setAddError(null);

        // Use the full product price (0% discount for this quick view)
        const priceToSend = product.price; 
        const size = selectedSize;

        try {
            const token = localStorage.getItem('token'); 

            const response = await axios.post(CART_API_URL, {
                productId: product._id,
                size: size, 
                quantity: 1,
                price: parseFloat(priceToSend.toFixed(2)), 
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                }
            });

            if (response.status === 201) {
                setAddError(`Added: ${product.name} (${size})`); 
                refreshCart();
                // Close modal after successful addition
                setTimeout(() => { setAddError(null); onClose(); }, 1500); 
            } else {
                setAddError('Failed to add item to cart.');
                setTimeout(() => setAddError(null), 3000); 
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'A network error occurred.';
            setAddError(errorMessage);
            setTimeout(() => setAddError(null), 3000); 
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={onClose} 
        >
            <div 
                className="bg-white rounded-xl shadow-2xl max-w-6xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col md:flex-row transition-transform duration-300 scale-100"
                onClick={e => e.stopPropagation()} 
            >
                
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition z-20 shadow-md"
                    aria-label="Close product view"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left Side: Image Gallery (Image Fix Applied) */}
                <div className="md:w-3/5 relative bg-gray-100 p-6 flex">
                    
                    {/* 1. Thumbnail Navigation */}
                    {images.length > 1 && !images[0].includes('placehold.co') ? (
                        <div className="flex flex-col space-y-3 p-4 pr-0"> 
                            {images.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    src={imgUrl} 
                                    alt={`Product view ${index + 1}`}
                                    onClick={() => setMainImageIndex(index)}
                                    className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 transition duration-200 shadow-sm
                                        ${index === mainImageIndex 
                                            ? 'border-[#ea2e0e] scale-105' 
                                            : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                />
                            ))}
                        </div>
                    ) : null }

                    {/* 2. Main Image View */}
                    <div className="flex-grow flex items-center justify-center overflow-hidden p-4"> 
                        <img
                            src={images[mainImageIndex]}
                            alt={`${product.name} main view`}
                            className="w-full h-full object-contain max-h-[75vh] transition-opacity duration-300"
                        />
                    </div>
                </div>

                {/* Right side details */}
                <div className="md:w-2/5 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                        
                        {/* Status Tags */}
                        <div className="mb-4">
                            <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mr-2">
                                {product.category}
                            </span>
                            {requiresSizeSelection ? (
                                <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    Choose Size
                                </span>
                            ) : (
                                <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                                    One Size
                                </span>
                            )}
                        </div>

                        <p className="text-4xl font-extrabold text-[#ea2e0e] mb-6">Ksh {product.price.toFixed(2)}</p>
                        
                        {/* Size Selector */}
                        <div className="mb-6">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">
                                {requiresSizeSelection ? "Select Size" : "Size"}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {requiresSizeSelection ? (
                                    product.sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => handleSizeSelect(size)}
                                            disabled={product.stock === 0}
                                            className={`px-3 py-1 text-sm rounded-full border transition duration-150 
                                                ${selectedSize === size 
                                                    ? 'bg-[#ea2e0e] text-white border-[#ea2e0e] shadow-md' 
                                                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                                                }
                                                ${product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                                            `}
                                        >
                                            {size}
                                        </button>
                                    ))
                                ) : (
                                    <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-600 font-medium">
                                        One Size
                                    </span>
                                )}
                            </div>
                        </div>
                        
                        {/* Quick Add Status Message */}
                        {addError && (
                          <div className={`p-2 mb-4 text-sm font-medium rounded-lg border 
                            ${addError.startsWith('✅') ? 'text-green-700 bg-green-100 border-green-300' : 'text-red-700 bg-red-100 border-red-300'}`}>
                              {addError}
                          </div>
                        )}

                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600 text-sm overflow-y-auto max-h-24 pb-2">
                            {product.description || "A wonderful addition to your wardrobe. Use the button below to quickly add it to your cart."}
                        </p>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleAddToCart}
                            className="w-full bg-[#ea2e0e] text-white py-3 rounded-lg text-lg font-semibold uppercase tracking-wider transition duration-300 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={!isAddButtonEnabled}
                        >
                            {isAdding 
                                ? 'Adding...' 
                                : product.stock === 0 
                                    ? 'Sold Out' 
                                    : requiresSizeSelection && !selectedSize
                                        ? 'Select Size'
                                        : 'Add to Cart'
                            }
                        </button>
                        {/* <Link 
                            to={`/product/${product._id}`} 
                            className="block text-center mt-3 text-sm text-gray-600 hover:text-gray-900 transition font-medium"
                            onClick={onClose} 
                        >
                            View Full Product Page Details
                        </Link> */}
                    </div>
                </div>
            </div>
        </div>
    );
};