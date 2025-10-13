import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiOutlineArrowNarrowRight, HiOutlineUserCircle } from "react-icons/hi";
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); 
  const [isLoading, setIsLoading] = useState(false); 
  
  const navigate = useNavigate();
  // We don't rely on the context's user state *immediately* after login, 
  // but we rely on the returned result object.
  const { login, isLoggedIn, user, authLoading } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); 
    setIsLoading(true);

    try {
      const result = await login(email, password);

      if (result.success) {
        
        // 🟢 Using the returned user object from the login function for immediate redirect
        if (result.user && result.user.isAdmin === true) {
          navigate('/admin'); // Redirect admin users directly to the dashboard
        } else {
          navigate('/');      // Redirect standard users to the homepage
        }

      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('Could not connect to the server. Please check that the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  // If Auth status is loading, show a simple loading message
  if (authLoading) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
             <div className="animate-pulse text-xl text-gray-500">Checking credentials...</div>
        </div>
    );
  }

  // Check if the user is already logged in and is an Admin
  const isAdmin = isLoggedIn && user?.isAdmin;

  if (isAdmin) {
    // ... (Already logged in Admin welcome screen logic remains the same)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 md:p-8">
            <div className="max-w-md w-full flex rounded-2xl shadow-2xl overflow-hidden bg-white p-8 sm:p-12 space-y-8 text-center">
                <div className="w-full">
                    <img 
                        src={logo} 
                        alt="ONE MAN Logo" 
                        className="h-20 w-20 p-2 mx-auto bg-[#ea2e0e] rounded-full shadow-lg mb-6 transition duration-300 transform hover:scale-105" 
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/80x80/ea2e0e/ffffff?text=ONE+MAN"; }}
                    />
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome, Admin {user?.name.split(' ')[0]}
                    </h2>
                    <p className="text-gray-600 mb-8">
                        You have administrative access to the shop management tools.
                    </p>
                    <Link
                        to="/admin"
                        className="group relative w-full inline-flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-[#ea2e0e] hover:bg-[#c4250c] shadow-md hover:shadow-xl transition duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ea2e0e]"
                    >
                        <HiOutlineUserCircle className="h-6 w-6 mr-2" />
                        Go to Admin Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
  }

  // --- STANDARD LOGIN FORM ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 md:p-8">
      {/* Main Container: Two-column on desktop, single column on mobile */}
      <div className="max-w-4xl w-full flex rounded-2xl shadow-2xl overflow-hidden bg-white">

        {/* Left Panel: Branding and Visual Appeal (Hidden on mobile) */}
        <div className="hidden md:flex w-1/2 p-12 bg-[#ea2e0e] text-white flex-col justify-center items-center text-center">
            {/* LOGO on Desktop Panel (Image Display) */}
            <div className="mb-6">
                <img 
                    src={logo} 
                    alt="ONE MAN Logo" 
                    className="h-24 w-24 p-2 mx-auto bg-white rounded-full shadow-2xl mb-4"
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x96/ffffff/ea2e0e?text=LOGO"; }}
                />
                <h1 className="text-5xl font-extrabold tracking-wider">
                    ONE MAN
                </h1>
            </div>
            {/* End LOGO */}
            
            <p className="text-lg font-light italic mb-8">
                Your style, your statement.
            </p>
            <p className="text-sm">
                Manage your products with ease.
            </p>
        </div>

        {/* Right Panel: Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 space-y-8">
          <div>
            {/* LOGO on Mobile/Form (Image Display) */}
            <div className="flex justify-center items-center mb-6">
                <img 
                    src={logo} 
                    alt="ONE MAN Logo" 
                    className="h-10 w-10 p-1 bg-white border border-[#ea2e0e] rounded-xl" 
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/40x40/ea2e0e/ffffff?text=ONE+MAN"; }}
                />
            </div>
            {/* End LOGO */}

            <h2 className="text-center text-3xl font-bold text-gray-800">
              Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Welcome back!
            </p>
          </div>
          
          {/* Display Error Message */}
          {error && (
              <div className="p-3 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300 animate-pulse">
                  {error}
              </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4"> 
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
                      autoComplete="current-password"
                      required
                      className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] sm:text-sm transition duration-150"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-sm">
                <Link to="/signup" className="font-medium text-[#ea2e0e] hover:text-[#c4250c] transition duration-150 flex items-center space-x-1">
                  <span>Don't have an account? Sign Up</span>
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
                {isLoading ? 'Authenticating...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;