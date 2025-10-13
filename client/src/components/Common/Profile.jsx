import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { HiOutlinePencil, HiOutlineCheckCircle } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, isLoggedIn, authLoading, updateUser } = useAuth();
    const navigate = useNavigate();
    
    // Local state for form fields
    const [name, setName] = useState('');
    // ⚠️ Removed email state setter, as it won't be edited via input
    const [password, setPassword] = useState(''); // New password field
    const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password field
    
    // UI state
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Populate state from auth context when component loads or user changes
    useEffect(() => {
        if (!authLoading && user) {
            setName(user.name || '');
            // ⚠️ Email state setting is no longer needed since it's displayed directly from user.email
            // setEmail(user.email || '');
        }
        
        if (!authLoading && !isLoggedIn) {
            navigate('/login');
        }
    }, [user, authLoading, isLoggedIn, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setIsLoading(true);
        
        // Prepare data to send to the AuthContext function
        const updateData = {
            name,
            // ⚠️ DO NOT include email in updateData, even if the backend allows it, 
            // since the user can't change it here. We only update name/password.
            // email: user.email, 
        };
        
        // Only send password if it's set
        if (password) {
            updateData.password = password;
        }

        try {
            const result = await updateUser(updateData); 

            if (result.success) {
                setSuccess(result.message);
                setIsEditing(false);
                
                // Clear password fields for security
                setPassword('');
                setConfirmPassword('');

            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error(err);
            setError('An unexpected error occurred during profile update.');
        } finally {
            setIsLoading(false);
        }
    };
    
    if (authLoading || !isLoggedIn || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ea2e0e]"></div>
            </div>
        );
    }
    
    const isFormDisabled = isLoading || !isEditing;

    return (
        <div className="container mx-auto p-4 sm:p-8 min-h-screen bg-gray-50">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
                
                <div className="flex justify-between items-center border-b pb-4 mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800 flex items-center">
                        My Profile
                    </h1>
                    
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition duration-200 
                            ${isEditing 
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                : 'bg-[#ea2e0e] text-white hover:bg-[#c4250c]'
                            }`}
                        disabled={isLoading}
                    >
                        {isEditing ? 'Cancel Edit' : <><HiOutlinePencil className="inline-block w-4 h-4 mr-1"/> Edit Profile</>}
                    </button>
                </div>
                
                {/* Status Messages */}
                {success && (
                    <div className="flex items-center p-3 mb-4 text-sm font-medium text-green-700 bg-green-100 rounded-lg border border-green-300">
                        <HiOutlineCheckCircle className="w-5 h-5 mr-2" />
                        {success}
                    </div>
                )}
                {error && (
                    <div className="p-3 mb-4 text-sm font-medium text-red-700 bg-red-100 rounded-lg border border-red-300">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    
                    {/* Name Field (Editable) */}
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700 block mb-1">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isFormDisabled}
                            className={`w-full px-4 py-3 border rounded-lg text-gray-900 focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition duration-150 
                                ${isFormDisabled ? 'bg-gray-100 border-gray-200' : 'bg-white border-gray-300'}`}
                        />
                    </div>

                    {/* 🟢 MODIFIED: Email Field (Static Display Only) */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 block mb-1">Email address</label>
                        <div
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-600 bg-gray-100 text-base"
                        >
                            {user.email}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                            Email address cannot be changed.
                        </p>
                    </div>
                    
                    {/* Password Fields (Only visible when editing) */}
                    {isEditing && (
                        <div className="pt-4 border-t border-gray-100 space-y-6">
                            <p className="text-sm text-gray-500 font-semibold">Change Password (optional)</p>
                            
                            {/* New Password */}
                            <div>
                                <label htmlFor="password" className="text-sm font-medium text-gray-700 block mb-1">New Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Leave blank to keep current password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition duration-150"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block mb-1">Confirm New Password</label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Re-enter new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition duration-150"
                                />
                            </div>
                        </div>
                    )}

                    {/* Submission Button (Only visible when editing) */}
                    {isEditing && (
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-[#ea2e0e] hover:bg-[#c4250c] shadow-md transition duration-150 disabled:bg-gray-400 disabled:shadow-none"
                            >
                                {isLoading ? 'Saving Changes...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </form>
                
                {/* Admin Status Display */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-sm font-semibold text-gray-700">Account Status:</p>
                    <p className="mt-1 text-base">
                        Role: 
                        <span className={`ml-2 font-bold ${user.isAdmin ? 'text-red-600' : 'text-green-600'}`}>
                            {user.isAdmin ? 'Administrator' : 'Standard User'}
                        </span>
                    </p>
                    {user.isAdmin && (
                        <p className="text-sm text-gray-500 mt-2">
                            You have elevated privileges to manage the shop.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;