export const ProductModal = ({ product, onClose }) => {
    if (!product) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4 cursor-pointer"
            onClick={onClose} // Close when clicking the backdrop
        >
            <div 
                className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
                onClick={e => e.stopPropagation()} // Prevent modal from closing when clicking inside
            >
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition z-10"
                    aria-label="Close product view"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Left Side: Main Image */}
                <div className="md:w-3/5 relative bg-gray-100 p-4">
                    <img
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="w-full h-full object-contain max-h-[85vh]"
                    />
                </div>

                {/* Right Side: Quick Details */}
                <div className="md:w-2/5 p-6 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h2>
                        <p className="text-sm text-gray-500 mb-4">{product.category}</p>
                        <p className="text-4xl font-extrabold text-[#ea2e0e] mb-6">${product.price.toFixed(2)}</p>
                        
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                        <p className="text-gray-600 text-sm overflow-y-auto max-h-24">
                            {product.description || "A wonderful addition to your wardrobe, perfect for any occasion. View full details on the product page."}
                        </p>
                    </div>

                    <div className="mt-6">
                        <button
                            className="w-full bg-[#ea2e0e] text-white py-3 rounded-lg text-lg font-semibold uppercase tracking-wider transition duration-300 hover:bg-red-700 disabled:bg-gray-400"
                            disabled={product.stock === 0}
                        >
                            {product.stock > 0 ? 'Add to Cart' : 'Sold Out'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};