import React, { useState, useEffect, useMemo } from 'react';
import { 
    //WrenchScrewdriver as IconWrenchScrewdriver, 
    //ArrowLeftOnRectangle as IconArrowLeftOnRectangle, 
    Plus as IconPlus, 
    //Cube as IconCube, 
    Sparkles as IconSparkles, 
    Check as IconCheck, 
    X as IconXMark, 
    Pencil as IconPencil, 
    Trash as IconTrash,
    Images as IconImages,
    Maximize2 as IconMaximize2
} from 'lucide-react';
// --- Configuration ---
const API_BASE_URL = 'http://localhost:5000/api/admin/products';

// --- Inline SVG Icons ---
// const IconPlus = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
// const IconSparkles = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9.35 18.785l1.625.541c.216.072.433.072.649 0l1.625-.541-1.613-2.887c-.126-.226-.14-.492-.036-.725.103-.233.327-.374.577-.374h.963a.875.875 0 0 0 .825-.54l-.875-1.574-1.574-.875a.875.875 0 0 0-.54-.825v-.963c0-.25.141-.474.374-.577.233-.104.499-.09.725-.036l2.887 1.613.541-1.625c.072-.216.072-.433 0-.649l-.541-1.625-1.613-2.887a.875.875 0 0 0-.725-.036.875.875 0 0 0-.577.374h-.963a.875.875 0 0 0-.825.54l-.875 1.574-1.574.875a.875.875 0 0 0-.54.825v.963c0 .25-.141.474-.374.577.233.104.499-.09.725-.036l2.887 1.613.541-1.625c.072-.216.072-.433 0-.649l-.541-1.625L.813 10.487c-.126-.226-.14-.492-.036-.725.103-.233.327-.374.577-.374h.963a.875.875 0 0 1 .825.54l.875 1.574 1.574.875a.875.875 0 0 1 .54.825v.963c0 .25.141.474.374.577.233.104.499-.09.725-.036l1.625-.908a.875.875 0 0 1 .825-.54h.963c.25 0 .474.141.577.374.104.233.09.499-.036.725L14.187 15.904Z" /></svg>;
const IconCube = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" /></svg>;
const IconCurrencyDollar = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-2.25 0h4.5m-1.5-6h1.5m-3 0V6a2.25 2.25 0 0 1 2.25-2.25h1.5m-3 0a2.25 2.25 0 0 1 2.25 2.25v1.5m0 0a2.25 2.25 0 0 0 2.25 2.25H16.5m-2.25 4.5h1.5m-4.5 0h4.5m-1.5-6h1.5m-3 0V6a2.25 2.25 0 0 1 2.25-2.25h1.5m-3 0a2.25 2.25 0 0 1 2.25 2.25v1.5m0 0a2.25 2.25 0 0 0 2.25 2.25H16.5m-2.25 4.5h1.5m-4.5 0h4.5" /></svg>;
const IconWrenchScrewdriver = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 13.5V6.75a6.75 6.75 0 0 1 6.75-6.75h1.5a6.75 6.75 0 0 1 6.75 6.75v6.75m-7.5-6h3m-3 6h3m-3 6h3m-6 0h.008v.008H6v-.008Zm0-3h.008v.008H6v-.008Zm0-3h.008v.008H6v-.008Zm0-3h.008v.008H6v-.008Zm-3 6h.008v.008H3v-.008Zm0-3h.008v.008H3v-.008Zm0-3h.008v.008H3v-.008Zm0-3h.008v.008H3v-.008Zm9 12h.008v.008H12v-.008Zm0-3h.008v.008H12v-.008Zm0-3h.008v.008H12v-.008Zm0-3h.008v.008H12v-.008Zm3 6h.008v.008H15v-.008Zm0-3h.008v.008H15v-.008Zm0-3h.008v.008H15v-.008Zm0-3h.008v.008H15v-.008Zm3 6h.008v.008H18v-.008Zm0-3h.008v.008H18v-.008Zm0-3h.008v.008H18v-.008Zm0-3h.008v.008H18v-.008Zm-15 12h.008v.008H3v-.008Z" /></svg>;
// const IconTrash = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.262 9m10.92-7.24a.875.875 0 0 0-.54-.825h-12a.875.875 0 0 0-.825.54L.222 20.336a.875.875 0 0 0-.725.036.875.875 0 0 0-.577.374H.222a.875.875 0 0 1-.825-.54l-.875-1.574-1.574-.875a.875.875 0 0 1-.54-.825V18.15c0-.25.141-.474.374-.577.233-.104.499-.09.725.036l2.887 1.613.541-1.625c.072-.216.072-.433 0-.649l-.541-1.625L.813 10.487c-.126-.226-.14-.492-.036-.725.103-.233.327-.374.577-.374h.963a.875.875 0 0 1 .825.54l.875 1.574 1.574.875a.875.875 0 0 1 .54.825v.963c0 .25.141.474.374.577.233.104.499-.09.725-.036l1.625-.908a.875.875 0 0 1 .825-.54h.963c.25 0 .474.141.577.374.104.233.09.499-.036.725L14.187 15.904Z" /></svg>;
// const IconPencil = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.498 1.498 1.498 1.498-12.636 12.636-1.498-1.498-1.498-1.498L16.862 4.487zm0 0l-12.636 12.636m12.636-12.636L10.5 8.25" /></svg>;
// const IconCheck = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-12" /></svg>;
// const IconXMark = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>;
const IconArrowLeftOnRectangle = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" /></svg>;


// --- API Client Functions (Now real fetch calls) ---

/**
 * Common fetch utility to handle JSON, credentials, and error responses.
 * @param {string} url - The API endpoint URL.
 * @param {object} options - Fetch options.
 * @returns {Promise<object>} The parsed JSON response data.
 */
const apiFetch = async (url, options = {}) => {
    // 1. Get the token from localStorage (as shown in your screenshot)
    const token = localStorage.getItem('token'); 
    
    let headers = {
        'Content-Type': 'application/json',
        // Merge with any custom headers passed in options
        ...(options.headers || {}) 
    };

    // 2. If a token exists, add the Authorization header
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const defaultOptions = {
        headers: headers,
        // IMPORTANT: Must include credentials to send the JWT cookie (http-only)
        credentials: 'include', 
        ...options
    };
    
    // Ensure body isn't duplicated if options already specified it
    if (options.body) {
        defaultOptions.body = options.body;
    }

    const response = await fetch(url, defaultOptions);
    
    // Check for network or server errors
    if (!response.ok) {
        // Attempt to parse JSON error body for detailed message
        let errorBody = await response.json().catch(() => ({ message: 'Unknown error occurred on the server.' }));
        // Prioritize the message field from the server response
        throw new Error(errorBody.message || `API Error: ${response.statusText} (${response.status})`);
    }

    // Return JSON data (handles empty response for DELETE)
    const text = await response.text();
    return text ? JSON.parse(text) : {};
};

// GET /api/admin/products
const fetchProducts = () => apiFetch(API_BASE_URL, { method: 'GET' });

// POST /api/admin/products
const addProduct = (productData) => apiFetch(API_BASE_URL, { 
    method: 'POST', 
    body: JSON.stringify(productData) 
});

// PUT /api/admin/products/:id
const updateProduct = (id, updatedData) => apiFetch(`${API_BASE_URL}/${id}`, { 
    method: 'PUT', 
    body: JSON.stringify(updatedData) 
});

// DELETE /api/admin/products/:id
const deleteProduct = (id) => apiFetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });


// ----------------------------------------------------------------------

const AdminProductManager = () => {
    // Authentication is assumed successful by the backend middleware for this UI to load
    const isAuthenticated = true; 

    const [products, setProducts] = useState([]);
    const [dataLoading, setDataLoading] = useState(false);
    const [isDataReady, setIsDataReady] = useState(false);
    const [error, setError] = useState(null);
    const [refetchTrigger, setRefetchTrigger] = useState(0); 
    
    // State for Add Product Form
    const [newProduct, setNewProduct] = useState({
        name: '', price: '', description: '', category: 'Men', imageUrls: ['', '', ''], stock: '10',sizes: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    // State for Editing
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    // --- HANDLER FUNCTIONS ---

    /**
     * Handles changes for the Add New Product form inputs.
     */
    const handleInputChange = (e) => {
        const { name, value, checked } = e.target;
         // 1. Handle Size Checkboxes
        if (name === 'sizes') {
            const size = value;
            setNewProduct(prev => {
                const currentSizes = prev.sizes;
                if (checked) {
                    // Add size if checked
                    return { ...prev, sizes: [...currentSizes, size].sort((a, b) => AVAILABLE_SIZES.indexOf(a) - AVAILABLE_SIZES.indexOf(b)) };
                } else {
                    // Remove size if unchecked
                    return { ...prev, sizes: currentSizes.filter(s => s !== size) };
                }
            });
        // 2. Handle Multiple Image URL Inputs (using indices 1, 2, 3)
        } else if (name.startsWith('imageUrl')) {
            const index = parseInt(name.slice(-1), 10);
            if (index >= 1 && index <= 3) {
                setNewProduct(prev => {
                    const newUrls = [...prev.imageUrls];
                    newUrls[index - 1] = value; // Update the specific index (0, 1, or 2)
                    return { ...prev, imageUrls: newUrls };
                });
            }

            } else {
            setNewProduct(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleEditChange = (e) => {
        const { name, value, checked } = e.target;
        // 1. Handle Size Checkboxes for Editing
        if (name === 'sizes') {
            const size = value;
            setEditData(prev => {
                const currentSizes = prev.sizes || [];
                if (checked) {
                    return { ...prev, sizes: [...currentSizes, size] };
                } else {
                     return { ...prev, sizes: currentSizes.filter(s => s !== size) };
                }
            });

            // 2. Handle Multiple Image URL Inputs for Editing (using indices 1, 2, 3)
        } else if (name.startsWith('editImageUrl')) {
            const index = parseInt(name.slice(-1), 10);
            if (index >= 1 && index <= 3) {
                setEditData(prev => {
                    // Ensure we have a base array of 3 if missing or shorter
                    const newUrls = [...(prev.imageUrls || ['', '', ''])]; 
                    newUrls[index - 1] = value;
                    return { ...prev, imageUrls: newUrls };
                });
            }

       // 3. Handle Regular Inputs
        } else {
            setEditData(prev => ({ ...prev, [name]: value }));
        }
    };

    /**
     * Navigates the user to the root path, simulating a redirect to the login screen.
     */
    const handleGoToLogin = () => {
        // Clear the stored token to force a logout/re-authentication
        localStorage.removeItem('token'); 
        console.log("LOGOUT simulated.");
        window.location.href = '/';
    };


    // --- Data Fetch Effect (GET) ---
    useEffect(() => {
        const loadProducts = async () => {
            if (!isAuthenticated) return;

            setDataLoading(true);
            setError(null);
            try {
                const fetchedProducts = await fetchProducts();
                setProducts(fetchedProducts);
            } catch (e) {
                // If 401/403 (unauthorized), set a specific error message
                const msg = e.message.includes("401") || e.message.includes("403") 
                    ? "Authentication failed. Please log in as an Admin (check server logs)." 
                    : e.message;
                setError(msg);
                setProducts([]);
            } finally {
                setDataLoading(false);
                setIsDataReady(true);
            }
        };

        loadProducts();
    }, [isAuthenticated, refetchTrigger]);

    // --- Add Product Handler (POST) ---
    const handleAddProduct = async (e) => {
        e.preventDefault();
        if (isSubmitting || !isAuthenticated) return;

        if (!newProduct.name || !newProduct.price || !newProduct.description || !newProduct.stock) {
            setError("Please fill in all required fields (Name, Price, Description, Stock).");
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {

            // Filter out empty URL strings
            let finalImageUrls = newProduct.imageUrls.filter(url => url.trim() !== '');
             // Ensure a default image if all fields were left empty
            if (finalImageUrls.length === 0) {
                 finalImageUrls = ['https://placehold.co/600x400/000000/FFFFFF?text=Product+Image'];
            }

            const productData = {
                ...newProduct,
                price: parseFloat(newProduct.price),
                stock: parseInt(newProduct.stock, 10),
                imageUrls: finalImageUrls,
                sizes: newProduct.sizes, 
            };

            await addProduct(productData);
            setRefetchTrigger(prev => prev + 1); 

          // Reset form
            setNewProduct({
                name: '', price: '', description: '', category: 'Men', 
                imageUrls: ['', '', ''], stock: '10', sizes: [],
            });
        } catch (e) {
            console.error("Error adding product: ", e);
            setError(`Failed to add product: ${e.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };
    
    // --- Delete Product Handler (DELETE) ---
   const handleDeleteProduct = async (productId) => {
        if (!isAuthenticated || isUpdating || isSubmitting) return;

        // Use prompt as a safer alternative to window.confirm()
        const confirmation = prompt(`Type 'DELETE' to confirm deletion of product ID: ${productId}`);

        if (confirmation === 'DELETE') {
            setIsUpdating(true);
            setError(null);

            try {
                await deleteProduct(productId);
                setRefetchTrigger(prev => prev + 1); 
            } catch (e) {
                console.error("Error deleting product: ", e);
                setError(`Failed to delete product: ${e.message}`);
            } finally {
                setIsUpdating(false);
            }
        }
    };
    
    // --- Edit/Update Handlers (PUT) ---
    const startEditing = (product) => {
        setEditingId(product._id);
        
        // Pad imageUrls array to ensure it always has 3 elements for the inputs
        const paddedImageUrls = [...(product.imageUrls || []), '', ''].slice(0, 3);

        setEditData({
            name: product.name,
            price: String(product.price), 
            stock: String(product.stock),
            category: product.category,
            description: product.description,
            imageUrls: paddedImageUrls, // Array of 3 for form inputs
            sizes: product.sizes || [], // Array of selected sizes
        });
        setError(null);
    };

    const handleUpdateSubmit = async () => {
        if (!editingId || isUpdating) return;
        
        setIsUpdating(true);
        setError(null);

        try {
            // Filter out empty URLs before sending
            let finalImageUrls = editData.imageUrls.filter(url => url.trim() !== '');

            if (finalImageUrls.length === 0) {
                 finalImageUrls = ['https://placehold.co/600x400/000000/FFFFFF?text=Product+Image'];
            }
            
            const updatedProductData = {
                ...editData,
                price: parseFloat(editData.price),
                stock: parseInt(editData.stock, 10),
                imageUrls: finalImageUrls,
                sizes: editData.sizes,
            };

            await updateProduct(editingId, updatedProductData);
            setEditingId(null);
            setRefetchTrigger(prev => prev + 1); 
            
        } catch (e) {
            console.error("Error updating product: ", e);
            setError(`Failed to update product: ${e.message}`);
        } finally {
            setIsUpdating(false);
        }
    };
    
    const cancelEditing = () => {
        setEditingId(null);
        setEditData({});
    };

    const totalProducts = useMemo(() => products.length, [products]);

    // --- Render Logic ---
    if (!isDataReady) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <p className="text-xl font-medium text-[#ea2e0e]">Attempting connection to server at **{API_BASE_URL}**...</p>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8 pt-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 flex items-center">
                        <IconWrenchScrewdriver className="w-8 h-8 mr-3 text-[#ea2e0e]" />
                        E-Commerce Product Manager (Admin)
                    </h1>
                    {/* --- LOGIN BUTTON ADDED HERE --- */}
                    <button
                        onClick={handleGoToLogin}
                        className="flex items-center py-2 px-4 border border-gray-300 rounded-full text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 shadow-sm transition duration-150"
                        title="LogOut"
                    >
                        <IconArrowLeftOnRectangle className="w-5 h-5 mr-1" />
                        Logout
                    </button>
                    {/* ---------------------------------- */}
                </header>
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 shadow-md" role="alert">
                        <p className="font-bold">Server Error:</p>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* --- ADD PRODUCT FORM SECTION --- */}
                <div className="bg-white p-6 rounded-2xl shadow-xl mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
                        <IconPlus className="w-6 h-6 mr-2 text-green-500" />
                        Add New Product (POST /api/admin/products)
                    </h2>
                    <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Fields */}
                        <div className="col-span-full md:col-span-1">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                            <input type="text" name="name" id="name" value={newProduct.name} onChange={handleInputChange} required placeholder="e.g., Slim Fit Casual Shirt" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition duration-150"/>
                        </div>
                        <div className="flex space-x-4 col-span-full md:col-span-1">
                            <div className="flex-1">
                                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                                <div className="relative">
                                    <IconCurrencyDollar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                    <input type="number" name="price" id="price" value={newProduct.price} onChange={handleInputChange} required min="0.01" step="0.01" placeholder="39.99" className="w-full border border-gray-300 rounded-lg p-3 pl-9 focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition duration-150"/>
                                </div>
                            </div>
                             <div className="flex-1">
                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                                <div className="relative">
                                    <IconCube className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"/>
                                    <input type="number" name="stock" id="stock" value={newProduct.stock} onChange={handleInputChange} required min="0" placeholder="10" className="w-full border border-gray-300 rounded-lg p-3 pl-9 focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition duration-150"/>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-full md:col-span-1">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select name="category" id="category" value={newProduct.category} onChange={handleInputChange} className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition duration-150">
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Top Wear">Top Wear</option>
                                <option value="Bottom Wear">Bottom Wear</option>
                                <option value="Accessories">Accessories</option>
                            </select>
                        </div>
                        <div className="md:col-span-1 space-y-4">
                             <h3 className="text-base font-semibold text-gray-800 flex items-center border-b pb-2">
                                <IconImages className="w-5 h-5 mr-2 text-blue-500" />
                                Product Images (Max 3 URLs)
                            </h3>
                            {[1, 2, 3].map(i => (
                                <div key={i}>
                                    <label htmlFor={`imageUrl${i}`} className="block text-sm font-medium text-gray-700 mb-1">Image URL {i} (Primary if 1)</label>
                                    <input 
                                        type="url" 
                                        name={`imageUrl${i}`} 
                                        id={`imageUrl${i}`} 
                                        value={newProduct.imageUrls[i-1] || ''} 
                                        onChange={handleInputChange} 
                                        placeholder={`https://placehold.co/600x400 (Optional)`} 
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition duration-150"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea name="description" id="description" rows="3" value={newProduct.description} onChange={handleInputChange} required placeholder="A brief description of the product, its features, and materials." className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition duration-150 resize-none"></textarea>
                        </div>
                         <div className="col-span-full border-t pt-6 mt-4">
                            <h3 className="text-base font-semibold text-gray-800 mb-3 flex items-center">
                                <IconMaximize2 className="w-5 h-5 mr-2 text-purple-500" />
                                Available Sizes
                            </h3>
                            <div className="flex flex-wrap gap-4">
                                {AVAILABLE_SIZES.map(size => (
                                    <label key={size} className="flex items-center space-x-2 p-2 px-4 border border-gray-300 rounded-full hover:bg-gray-50 cursor-pointer transition">
                                        <input
                                            type="checkbox"
                                            name="sizes"
                                            value={size}
                                            checked={newProduct.sizes.includes(size)}
                                            onChange={handleInputChange}
                                            className="form-checkbox h-4 w-4 text-[#ea2e0e] rounded focus:ring-[#ea2e0e] border-gray-300"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        {/* Submit Button */}
                        <div className="col-span-full flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting || isUpdating}
                                className={`flex items-center justify-center py-3 px-8 rounded-full text-white font-semibold shadow-lg transition duration-300 
                                    ${isSubmitting ? 'bg-gray-400' : 'bg-[#ea2e0e] hover:bg-[#c4250c]'}`
                                }
                            >
                                {isSubmitting ? 'Publishing...' : 'Publish Product'}
                                <IconSparkles className="w-5 h-5 ml-2"/>
                            </button>
                        </div>
                    </form>
                </div>
                
                {/* --- PRODUCTS LIST SECTION --- */}
                <div className="bg-white p-6 rounded-2xl shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center justify-between">
                        Products Inventory ({totalProducts})
                        {dataLoading && <span className="text-sm text-gray-500 ml-4">Loading Products...</span>}
                    </h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                           <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product) => {
                                    const isEditing = editingId === product._id;
                                    // Use the first image URL for the primary display
                                    const primaryImageUrl = product.imageUrls && product.imageUrls.length > 0 
                                        ? product.imageUrls[0] 
                                        : 'https://placehold.co/40x40/f1f1f1/4a4a4a?text=IMG';

                                    return (
                                    <tr key={product._id} className={isEditing ? 'bg-yellow-50/50' : ''}>
                                        {/* Product Info */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img 
                                                        className="h-10 w-10 rounded-lg object-cover" 
                                                        src={primaryImageUrl} 
                                                        alt={product.name} 
                                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/f1f1f1/4a4a4a?text=IMG"; }}
                                                    />
                                                </div>
                                                <div className="ml-4">
                                                    {isEditing ? (
                                                        <input type="text" name="name" value={editData.name || ''} onChange={handleEditChange} className="w-full border rounded p-1 text-sm font-medium" />
                                                    ) : (
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    )}
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {isEditing ? (
                                                            <textarea name="description" rows="2" value={editData.description || ''} onChange={handleEditChange} className="w-full border rounded p-1 text-xs resize-none" />
                                                        ) : (
                                                            product.description.substring(0, 50) + (product.description.length > 50 ? '...' : '')
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        {/* Category */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {isEditing ? (
                                                <select name="category" value={editData.category} onChange={handleEditChange} className="border rounded p-1 text-xs bg-white">
                                                    <option value="Men">Men</option>
                                                    <option value="Women">Women</option>
                                                    <option value="Top Wear">Top Wear</option>
                                                    <option value="Bottom Wear">Bottom Wear</option>
                                                    <option value="Accessories">Accessories</option>
                                                </select>
                                            ) : (
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {product.category}
                                                </span>
                                            )}
                                        </td>
                                        
                                        {/* Price */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {isEditing ? (
                                                <input type="number" name="price" value={editData.price} onChange={handleEditChange} min="0.01" step="0.01" className="w-20 border rounded p-1 text-sm" />
                                            ) : (
                                                `$${product.price ? product.price.toFixed(2) : '0.00'}`
                                            )}
                                        </td>

                                        {/* Stock */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {isEditing ? (
                                                <input type="number" name="stock" value={editData.stock} onChange={handleEditChange} min="0" className="w-16 border rounded p-1 text-sm" />
                                            ) : (
                                                product.stock
                                            )}
                                        </td>
                                        {/* Sizes (NEW) */}
                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 w-40">
                                            {isEditing ? (
                                                <div className="flex flex-wrap gap-1 border p-1 rounded bg-white">
                                                    {AVAILABLE_SIZES.map(size => (
                                                        <label key={size} className="flex items-center text-xs p-1">
                                                            <input
                                                                type="checkbox"
                                                                name="sizes"
                                                                value={size}
                                                                checked={(editData.sizes || []).includes(size)}
                                                                onChange={(e) => handleEditChange(e, true)}
                                                                className="form-checkbox h-3 w-3 text-[#ea2e0e] rounded focus:ring-[#ea2e0e] border-gray-300 mr-1"
                                                            />
                                                            {size}
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {(product.sizes || []).map(size => (
                                                        <span key={size} className="px-2 py-0.5 text-xs font-medium rounded bg-gray-200 text-gray-700">
                                                            {size}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {isEditing ? (
                                                <>
                                                    <button 
                                                        onClick={handleUpdateSubmit}
                                                        disabled={isUpdating}
                                                        className="text-green-600 hover:text-green-900 transition disabled:text-gray-400"
                                                        title="Save Changes (PUT)"
                                                    >
                                                        {isUpdating ? 'Saving...' : <IconCheck className='w-5 h-5 inline'/>}
                                                    </button>
                                                    <button 
                                                        onClick={cancelEditing}
                                                        className="text-gray-500 hover:text-gray-700 transition"
                                                        title="Cancel"
                                                    >
                                                        <IconXMark className='w-5 h-5 inline'/>
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button 
                                                        onClick={() => startEditing(product)}
                                                        disabled={isUpdating || isSubmitting}
                                                        className="text-blue-600 hover:text-blue-900 transition disabled:text-gray-400"
                                                        title="Edit (PUT)"
                                                    >
                                                        <IconPencil className='w-5 h-5 inline'/>
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDeleteProduct(product._id)}
                                                        disabled={isUpdating || isSubmitting}
                                                        className={`text-red-600 hover:text-red-900 transition disabled:text-gray-400`}
                                                        title="Delete (DELETE)"
                                                    >
                                                        <IconTrash className='w-5 h-5 inline'/>
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                        
                        {totalProducts === 0 && !dataLoading && (
                            <div className="text-center py-10 text-gray-500">
                                No products found. Try adding one above!
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <footer className="mt-10 text-center text-xs text-gray-500">
                Client is connected to **{API_BASE_URL}** using standard **fetch** calls with `credentials: 'include'` for cookie-based authentication.
            </footer>
        </div>
    );
};

export default AdminProductManager;
