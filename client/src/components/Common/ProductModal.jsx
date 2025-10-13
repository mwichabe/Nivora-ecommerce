import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    const [mainImageIndex, setMainImageIndex] = useState(0);

    const images = (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0)
        ? product.imageUrls
        : ['https://placehold.co/600x400/CCCCCC/000000?text=No+Image+Available'];

    useEffect(() => {
        if (mainImageIndex >= images.length) {
            setMainImageIndex(0);
        }
    }, [images, mainImageIndex]);

    return (
        // ... (Modal container and structure remain the same) ...
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

                {/* Left Side: Image Gallery */}
                <div className="md:w-3/5 relative bg-gray-100 p-6 flex">
                    
                    {/* 1. Thumbnail Navigation: THIS IS THE KEY SECTION */}
                    {images.length > 1 || (images.length === 1 && images[0].includes('placehold.co')) ? (
                        <div className="flex flex-col space-y-3 p-4 pr-0"> 
                            {images.map((imgUrl, index) => (
                                <img
                                    key={index}
                                    // *** FIX IS HERE: USE imgUrl FOR SRC ***
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

                {/* ... (Right side details remain the same) ... */}
                <div className="md:w-2/5 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full mb-4">{product.category}</span>
                        <p className="text-4xl font-extrabold text-[#ea2e0e] mb-6">${product.price.toFixed(2)}</p>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600 text-sm overflow-y-auto max-h-24 pb-2">
                            {product.description || "A wonderful addition to your wardrobe, perfect for any occasion. Quickly view all details and sizes on the full product page."}
                        </p>
                    </div>

                    <div className="mt-6">
                        <button
                            className="w-full bg-[#ea2e0e] text-white py-3 rounded-lg text-lg font-semibold uppercase tracking-wider transition duration-300 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={product.stock === 0}
                        >
                            {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                        </button>
                        <Link 
                            to={`/product/${product._id}`} 
                            className="block text-center mt-3 text-sm text-gray-600 hover:text-gray-900 transition font-medium"
                        >
                            View Full Product Page Details & Sizes
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};