import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { HiCheckCircle, HiArrowLeft, HiCreditCard, HiTruck, HiMapPin } from 'react-icons/hi2';
import { OrderReview } from './OrderReview';

const Spinner = () => <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ea2e0e] mx-auto"></div>;

// --- Step Components (Defined for context, keep them in this file) ---

const ShippingAddress = ({ formData, setFormData, onNext, user }) => {
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.address) newErrors.address = "Shipping address is required.";
    if (!formData.city) newErrors.city = "City is required.";
    if (!formData.postalCode) newErrors.postalCode = "Postal Code is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onNext();
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  useEffect(() => {
    if (user && !formData.address) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        country: 'Kenya',
      }));
    }
  }, [user, setFormData, formData.address]);

  const inputStyle = "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea2e0e] transition duration-150";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center"><HiMapPin className="w-6 h-6 mr-2 text-[#ea2e0e]"/>Shipping Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelStyle}>Recipient Name</label>
            <input type="text" name="name" value={formData.name || user?.name || ''} readOnly className={`${inputStyle} bg-gray-100 text-gray-600 cursor-not-allowed`} />
          </div>
          <div>
            <label className={labelStyle}>Email</label>
            <input type="email" name="email" value={formData.email || user?.email || ''} readOnly className={`${inputStyle} bg-gray-100 text-gray-600 cursor-not-allowed`} />
          </div>
      </div>
      <div>
        <label htmlFor="address" className={labelStyle}>Street Address</label>
        <input type="text" id="address" name="address" value={formData.address || ''} onChange={handleChange} className={inputStyle} placeholder="Apartment, suite, etc." />
        {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="city" className={labelStyle}>City</label>
          <input type="text" id="city" name="city" value={formData.city || ''} onChange={handleChange} className={inputStyle} placeholder="e.g., Nairobi" />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
        </div>
        <div>
          <label htmlFor="postalCode" className={labelStyle}>Postal Code</label>
          <input type="text" id="postalCode" name="postalCode" value={formData.postalCode || ''} onChange={handleChange} className={inputStyle} placeholder="e.g., 00100" />
          {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode}</p>}
        </div>
        <div>
          <label htmlFor="country" className={labelStyle}>Country</label>
          <select id="country" name="country" value={formData.country || 'Kenya'} onChange={handleChange} className={inputStyle}>
            <option value="Kenya">Kenya</option>
          </select>
          {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" className="px-6 py-2 bg-[#ea2e0e] text-white font-semibold rounded-lg hover:bg-[#c4250c] transition duration-200">
          Continue to Shipping
        </button>
      </div>
    </form>
  );
};


const ShippingMethod = ({ formData, setFormData, onNext, onPrev }) => {
  const methods = [
    { id: 'standard', name: 'Standard Delivery', cost: 300, time: '3-5 business days' },
    { id: 'express', name: 'Express Delivery', cost: 700, time: '1-2 business days' },
    { id: 'free', name: 'Free Delivery', cost: 0, time: 'Those around Kitale/Bungoma' },
  ];

  const handleSelect = (method) => {
    setFormData(prev => ({
      ...prev,
      shippingMethod: method.id,
      shippingCost: method.cost,
    }));
  };

  useEffect(() => {
    if (!formData.shippingMethod) {
      handleSelect(methods[0]);
    }
  }, [formData.shippingMethod, setFormData, methods]);

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center"><HiTruck className="w-6 h-6 mr-2 text-[#ea2e0e]"/>Shipping Method</h3>
      <div className="space-y-3">
        {methods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleSelect(method)}
            className={`p-4 border rounded-lg cursor-pointer transition duration-150 ${
              formData.shippingMethod === method.id 
                ? 'border-[#ea2e0e] ring-2 ring-[#ea2e0e] bg-red-50' 
                : 'border-gray-200 hover:border-[#ea2e0e]'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-800">{method.name}</span>
              <span className="text-lg font-bold text-[#ea2e0e]">Ksh {method.cost.toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-500">{method.time}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={onPrev} className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center transition duration-150">
          <HiArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <button onClick={onNext} className="px-6 py-2 bg-[#ea2e0e] text-white font-semibold rounded-lg hover:bg-[#c4250c] transition duration-200">
          Continue to Payment
        </button>
      </div>
    </div>
  );
};


const PaymentMethod = ({ formData, setFormData, onNext, onPrev }) => {
  const methods = [
    { id: 'mpesa', name: 'M-Pesa (Mobile Money)' },
    { id: 'card', name: 'Credit/Debit Card' },
    { id: 'bank', name: 'Bank Transfer' },
  ];

  const handleSelect = (id) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: id,
    }));
  };

  useEffect(() => {
    if (!formData.paymentMethod) {
      handleSelect(methods[0].id);
    }
  }, [formData.paymentMethod, setFormData, methods]);

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center"><HiCreditCard className="w-6 h-6 mr-2 text-[#ea2e0e]"/>Payment Method</h3>
      <div className="space-y-3">
        {methods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleSelect(method.id)}
            className={`p-4 border rounded-lg cursor-pointer transition duration-150 ${
              formData.paymentMethod === method.id 
                ? 'border-[#ea2e0e] ring-2 ring-[#ea2e0e] bg-red-50' 
                : 'border-gray-200 hover:border-[#ea2e0e]'
            }`}
          >
            <span className="font-semibold text-gray-800">{method.name}</span>
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={onPrev} className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center transition duration-150">
          <HiArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <button onClick={onNext} className="px-6 py-2 bg-[#ea2e0e] text-white font-semibold rounded-lg hover:bg-[#c4250c] transition duration-200">
          Review Order
        </button>
      </div>
    </div>
  );
};

// --- Main Checkout Component ---

const steps = [
  { name: 'Shipping Address', icon: HiMapPin },
  { name: 'Shipping Method', icon: HiTruck },
  { name: 'Payment Method', icon: HiCreditCard },
  { name: 'Review & Pay', icon: HiCheckCircle },
];

const CheckoutScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, totalCartPrice, refreshCart } = useCart();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems && cartItems.length === 0 && !loading) {
         //navigate('/app'); // Keep commented for now if you need to test with an empty cart temporarily
    }
  }, [cartItems, navigate, loading]);

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handlePlaceOrder = async (orderTotal, subtotal, tax) => {
    if (!user) {
      //navigate('/login?redirect=/checkout'); // Keep commented for now if you need to test without login
      return null;
    }

    setLoading(true);
    setError(null);
    
    const orderData = {
      shippingAddress: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      shippingMethod: formData.shippingMethod,
      paymentMethod: formData.paymentMethod,
      items: cartItems.map(item => ({
        product: item.product._id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      itemsPrice: subtotal,
      taxPrice: tax,
      shippingPrice: formData.shippingCost,
      totalPrice: orderTotal,
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        // SUCCESS: DO NOT refreshCart() here.
        // It will be refreshed when the user navigates away from the modal.
        return data; // Return data for OrderReview to launch modal
      } else {
        setError(data.message || 'Failed to place order. Please try again.');
        return null;
      }
    } catch (err) {
      console.error('Order Submission Error:', err);
      setError('Network error: Could not connect to the server.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <ShippingAddress formData={formData} setFormData={setFormData} onNext={nextStep} user={user} />;
      case 2:
        return <ShippingMethod formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />;
      case 3:
        return <PaymentMethod formData={formData} setFormData={setFormData} onNext={nextStep} onPrev={prevStep} />;
      case 4:
        return <OrderReview formData={formData} 
                  onPrev={prevStep} 
                  placeOrder={handlePlaceOrder}
                  cartItems={cartItems} 
                  totalCartPrice={totalCartPrice}
                  loading={loading}
                  user={user}
                  refreshCart={refreshCart} // Pass refreshCart to OrderReview
                />;
      default:
        return <ShippingAddress formData={formData} setFormData={setFormData} onNext={nextStep} user={user} />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Secure Checkout</h1>
      
      {/* Stepper Navigation */}
      <div className="mb-10 flex justify-between max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center w-1/4 relative">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold transition-colors duration-300 ${
              currentStep === index + 1
                ? 'bg-[#ea2e0e] shadow-lg'
                : currentStep > index + 1
                ? 'bg-green-500'
                : 'bg-gray-400'
            }`}>
              <step.icon className="w-5 h-5" />
            </div>
            <p className={`mt-2 text-sm text-center font-medium ${
              currentStep === index + 1 ? 'text-[#ea2e0e]' : 'text-gray-500'
            }`}>{step.name}</p>
            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className={`absolute top-5 right-1/2 w-full h-0.5 transform translate-x-full transition-colors duration-300 ${
                currentStep > index + 1 ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
            )}
          </div>
        ))}
      </div>

      {error && (
        <div className="max-w-4xl mx-auto p-4 mb-6 bg-red-100 border border-red-400 text-red-700 rounded-lg" role="alert">
          <p className="font-bold">Error submitting order:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Step Content */}
      <div className="max-w-4xl mx-auto">
        {renderStep()}
      </div>
    </div>
  );
};

export default CheckoutScreen;