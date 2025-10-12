// This file initializes and configures Axios globally for your application.

import axios from 'axios';

// --- CRITICAL CONFIGURATION: Enable sending cookies (JWT) ---
// This setting is essential for sending the 'jwt' cookie with requests
// made from your frontend (e.g., localhost:5173) to your backend (e.g., localhost:5000).
axios.defaults.withCredentials = true;

// -------------------------------------------------------------
// Define the Base URL for all API requests
axios.defaults.baseURL = 'http://localhost:5000/api'; 
// -------------------------------------------------------------

/**
 * Example function for making an authenticated product creation request.
 * Since the base URL is set, the endpoint is now just '/admin/products'.
 */
export const createProduct = async (productData) => {
    try {
        // The JWT cookie is automatically sent thanks to axios.defaults.withCredentials = true
        const response = await axios.post('/admin/products', productData);
        return response.data;
    } catch (error) {
        // Handle token expiration/invalid status
        if (error.response && error.response.status === 401) {
            console.error("Authentication expired or token invalid. The AuthContext should handle logout.");
        }
        throw error;
    }
};

export default axios;