import React, { useState } from 'react';
import axios from 'axios';
import { FiMail, FiUser, FiMessageSquare, FiPhoneCall } from 'react-icons/fi';
import { FaMapMarkerAlt } from 'react-icons/fa';

// ⚠️ CHANGE THIS URL to your actual backend endpoint ⚠️
const CONTACT_API_URL = 'http://localhost:5000/api/contact'; 

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ message: '', type: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ message: '', type: '' });

        try {
            // Note: The backend will handle the email sending using the data below
            const response = await axios.post(CONTACT_API_URL, formData);

            setStatus({ 
                message: response.data.message || 'Your message was sent successfully! We will get back to you soon.', 
                type: 'success' 
            });
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form

        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again later.';
            setStatus({ message: errorMessage, type: 'error' });
            console.error("Contact Form Submission Error:", error);

        } finally {
            setLoading(false);
            // Clear status message after 5 seconds
            setTimeout(() => setStatus({ message: '', type: '' }), 5000);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Get in Touch
                    </h1>
                    <p className="mt-4 text-xl text-gray-600">
                        We're here to answer your questions and help you with anything you need.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 bg-white p-8 rounded-xl shadow-lg">
                    
                    {/* Contact Information */}
                    <div className="lg:col-span-1 space-y-8">
                        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Our Details</h2>
                        
                        <div className="flex items-start space-x-4">
                            <FiMail className="w-6 h-6 text-[#ea2e0e] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Email Us</h3>
                                <a href="mailto:support@onemanboutique.com" className="text-gray-600 hover:text-[#ea2e0e] transition">
                                    support@onemanboutique.com
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <FiPhoneCall className="w-6 h-6 text-[#ea2e0e] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Call Us</h3>
                                <a href="tel:+254704858069" className="text-gray-600 hover:text-[#ea2e0e] transition block">
                                    +254 704 858 069
                                </a>
                                <a href="tel:+254707392813" className="text-gray-600 hover:text-[#ea2e0e] transition block">
                                    +254 707 392 813
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <FaMapMarkerAlt className="w-6 h-6 text-[#ea2e0e] flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800">Visit Us</h3>
                                <p className="text-gray-600">
                                    MidTown, Kitale, Kenya
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
                        
                        {/* Status Message Display */}
                        {status.message && (
                            <div className={`p-4 mb-4 rounded-lg text-white font-medium ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Name and Email */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition text-base"
                                    />
                                </div>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Your Email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition text-base"
                                    />
                                </div>
                            </div>
                            
                            {/* Subject */}
                            <div className="relative">
                                <FiMessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition text-base"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <textarea
                                    name="message"
                                    placeholder="Your Message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="6"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-[#ea2e0e] focus:border-[#ea2e0e] transition text-base"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#ea2e0e] text-white py-3 rounded-lg text-lg font-semibold uppercase tracking-wider transition duration-300 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;