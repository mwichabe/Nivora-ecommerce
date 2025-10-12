import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// MOCK AUTH CONTEXT:
// This is a temporary mock implementation to resolve the compilation error 
// related to the unresolved path '../context/AuthContext'.
// In your actual application, you MUST replace 'useMockAuth' with 'useAuth' 
// and ensure your real AuthContext file exists at the specified path.
const useMockAuth = () => {
    // --- MOCK DATA ---
    // Change these values to test different states:
    const authLoading = false; // Set to true to see the loading spinner
    const isLoggedIn = true; // Set to false to test redirection to /login
    const user = { isAdmin: true }; // Set isAdmin to false to test the Access Denied screen
    // -----------------
    
    return { isLoggedIn, user, authLoading };
};

/**
 * AdminRoute Component
 *
 * This component acts as a wrapper around routes that should only be accessible
 * to users with the 'admin' role. It uses the user's authentication and role status
 * from the AuthContext (currently using the mock) to determine access.
 *
 * If the user is:
 * 1. Not logged in: Redirect to /login
 * 2. Logged in but not an admin: Display an access denied message (403 Forbidden style)
 * 3. Logged in AND an admin: Render the child route components via <Outlet />
 */
const AdminRoute = () => {
  // Switched to useMockAuth to fix compilation, REPLACE with useAuth in your setup
  const { isLoggedIn, user, authLoading } = useMockAuth();
  
  // Inline SVG for the warning icon (Replaces react-icons/hi)
  const ShieldExclamationIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.865-1.559-.865-3.375 0-4.934l7.303-13.119c.928-1.666 3.193-1.666 4.121 0l7.303 13.119c.865 1.559.865 3.375 0 4.934-1.423 2.55-3.992 3.934-6.85 3.934H8.232c-2.858 0-5.427-1.384-6.85-3.934Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h.008v.008H12V7.5Zm-1.5-3h3a.75.75 0 0 1 .75.75V15h-4.5V5.25a.75.75 0 0 1 .75-.75ZM12 17.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
    </svg>
  );

  // 1. Show nothing while checking initial auth status
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#ea2e0e]"></div>
      </div>
    );
  }

  // 2. Not logged in: Redirect to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if the user object exists and has the necessary isAdmin flag
  const isAdmin = user?.isAdmin === true;

  // 3. Logged in but NOT an admin: Display a clear access denied page
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
        <div className="text-center p-10 bg-white shadow-xl rounded-xl max-w-lg w-full border-t-4 border-red-500">
          <ShieldExclamationIcon className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You do not have the required administrative permissions to view this page.
          </p>
          <Navigate to="/" className="text-[#ea2e0e] hover:underline font-medium">
            Go to Home
          </Navigate>
        </div>
      </div>
    );
  }

  // 4. Logged in AND an Admin: Render the protected child components
  return <Outlet />;
};

export default AdminRoute;
