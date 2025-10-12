import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowNarrowRight } from "react-icons/hi"; 
import logo from '../assets/logo.png' // Assuming this path is correct

const API_URL = 'http://localhost:5000/api/users';


const SignUp = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { checkAuthStatus } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
        setError("Passwords do not match. Please try again.");
        return;
    }
    
    setIsLoading(true);

    try {
      // API Call to the backend's registration route
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Backend expects 'name', 'email', and 'password'
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        
        // Update the global auth state and navigate
        await checkAuthStatus(); 
        navigate('/login'); 

      } else {
        // FAILURE: Server returned 400 (e.g., "User already exists" or validation error)
        setError(data.message || 'Registration failed. Please try a different email.');
      }
    } catch (err) {
      // NETWORK ERROR: Unable to connect to the server
      console.error('Network Error during registration:', err);
      setError('Could not connect to the server. Please check that the backend is running.');
    } finally {
      setIsLoading(false);
    }
    
    // Clear passwords after attempt (successful or failed)
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 md:p-8">
      {/* Main Container: Two-column on desktop, single column on mobile */}
      <div className="max-w-4xl w-full flex rounded-2xl shadow-2xl overflow-hidden bg-white">

        {/* Left Panel: Branding and Visual Appeal (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 p-12 bg-[#ea2e0e] text-white flex-col justify-center items-center text-center">
            {/* LOGO on Desktop Panel: Significantly Larger and Circular */}
            <div className="mb-8">
                <img 
                    src={logo} 
                    alt="ONE MAN Logo" 
                    // New styling: Large (h-32), square (w-32) for perfect circularity, shadow-2xl, and a white ring border
                    className="h-32 w-32 object-contain mx-auto mb-4 bg-white p-6 rounded-full shadow-2xl ring-4 ring-white transform hover:scale-105 transition duration-300"
                    // Updated onerror placeholder size to match the new H/W (128px)
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/128x128/ea2e0e/ffffff?text=LOGO"; }}
                />
                <h1 className="text-5xl font-extrabold tracking-widest mt-4">
                    ONE MAN
                </h1>
            </div>
            {/* End LOGO */}
            
            <p className="text-lg font-light italic mb-8">
                Your style, your statement.
            </p>
            <p className="text-sm">
                Join our community today and get 15% off your first purchase.
            </p>
        </div>

        {/* Right Panel: Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 space-y-8">
          <div>
            {/* LOGO on Mobile/Form: Bigger and Square */}
            <div className="flex justify-center items-center mb-8">
                <img 
                    src={logo} 
                    alt="ONE MAN Logo" 
                    // New styling: Bigger (h-20), square (w-20), thicker border-4, and large rounded corners (rounded-xl)
                    className="h-20 w-20 object-contain p-2 bg-white border-4 border-[#ea2e0e] rounded-xl shadow-lg" 
                    // Updated onerror placeholder size to match the new H/W (80px)
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/ea2e0e/ffffff?text=LOGO"; }}
                />
            </div>
            {/* End LOGO */}

            <h2 className="text-center text-3xl font-bold text-gray-800">
              Create an Account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Start your journey with us.
            </p>
          </div>
          
          {/* Display Error Message */}
          {error && (
              <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300 animate-pulse">
                  {error}
              </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4"> {/* Increased spacing between inputs */}
              
              {/* Field Group: Username */}
              <div className="relative">
                <label htmlFor="username" className="text-sm font-medium text-gray-700 block mb-1">Full Name / Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="name"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] sm:text-sm transition duration-150"
                  placeholder="John Doe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              {/* Field Group: Email */}
              <div className="relative">
                <label htmlFor="email-address" className="text-sm font-medium text-gray-700 block mb-1">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] sm:text-sm transition duration-150"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Field Group: Password */}
              <div className="relative">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] sm:text-sm transition duration-150"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Field Group: Confirm Password */}
              <div className="relative">
                <label htmlFor="confirm-password" className="text-sm font-medium text-gray-700 block mb-1">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] sm:text-sm transition duration-150"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                <Link to="/login" className="font-medium text-[#ea2e0e] hover:text-[#c4250c] transition duration-150 flex items-center space-x-1">
                  <span>Already have an account? Sign In</span>
                  <HiOutlineArrowNarrowRight className="w-4 h-4"/>
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-[#ea2e0e] hover:bg-[#c4250c] shadow-md hover:shadow-lg transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea2e0e] disabled:bg-gray-400 disabled:shadow-none"
              >
                {isLoading ? 'Registering...' : 'Sign Up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
