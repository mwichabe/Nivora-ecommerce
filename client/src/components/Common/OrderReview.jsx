import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCheckCircle, HiPhone, HiBanknotes, HiArrowLeft, HiXMark,  } from "react-icons/hi2";
import { HiOutlineClipboardCopy } from "react-icons/hi";

// ⚠️ CONSTANT TILL NUMBER (Placeholder)
const MPESA_TILL_NUMBER = "1234567";

// Helper Component for consistency
const Spinner = () => <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#ea2e0e] mx-auto"></div>;

// Helper Component for data rows
const DetailRow = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between py-2 ${isTotal ? 'border-t-2 border-gray-800 pt-3' : 'border-b border-gray-100'}`}>
      <span className={`font-${isTotal ? 'bold' : 'medium'} text-${isTotal ? 'lg' : 'base'} text-gray-700`}>{label}</span>
      <span className={`font-${isTotal ? 'extrabold' : 'semibold'} text-${isTotal ? 'xl' : 'lg'} text-${isTotal ? 'red-600' : 'gray-900'}`}>
        Ksh {value.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
      </span>
    </div>
);

// Helper Component for item details
const ItemDetail = ({ title, value }) => (
    <div className="flex justify-between text-sm py-1">
        <span className="text-gray-500 font-medium">{title}:</span>
        <span className="text-gray-700 font-semibold">{value}</span>
    </div>
);


export const OrderReview = ({ formData, onPrev, placeOrder, cartItems, totalCartPrice, loading, user, refreshCart }) => { // Added refreshCart prop
  const navigate = useNavigate();
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentContact, setPaymentContact] = useState(user?.phone || '');
  const [contactSubmissionLoading, setContactSubmissionLoading] = useState(false);
  const [contactSubmissionStatus, setContactSubmissionStatus] = useState(null); 
  const [copied, setCopied] = useState(false);

  // --- Calculations ---
  // Ensure these calculations use the original totalCartPrice, which is correctly passed from CheckoutScreen
  const shippingCost = formData.shippingCost || 0;
  const subtotal = totalCartPrice; // This is correct, it's the total from the cart before it was cleared
  const taxRate = 0.16;
  const tax = subtotal * taxRate;
  const orderTotal = subtotal + shippingCost + tax;

  // --- Handlers ---
  const handlePlaceOrderClick = async () => {
      const data = await placeOrder(orderTotal, subtotal, tax);
      
      if (data && data.order && data.order._id) {
          setOrderId(data.order._id);
          setShowPaymentModal(true);
      }
  };

  const handleSubmitPaymentContact = async (e) => {
    e.preventDefault();
    setContactSubmissionLoading(true);
    setContactSubmissionStatus(null);
    
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/orders/${orderId}/payment-contact`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ paymentContact }), 
        });

        if (response.ok) {
            setContactSubmissionStatus('success');
            // No navigation or cart clear here. Just update status.
        } else {
            const data = await response.json();
            setContactSubmissionStatus('error');
            console.error('API Error:', data.message);
        }
    } catch (error) {
        console.error('Network Error:', error);
        setContactSubmissionStatus('error');
    } finally {
        setContactSubmissionLoading(false);
    }
  };
  
  const handleCopy = () => {
      navigator.clipboard.writeText(MPESA_TILL_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  // Function to navigate and clear cart
  const handleViewOrderStatus = () => {
      refreshCart(); // Clear the cart when the user explicitly views their orders
      //navigate('/orders');
  };

  const handleModalDismiss = () => {
      refreshCart();
      setShowPaymentModal(false);
      navigate('/app');
  };

  // --- Payment Modal Component (Local to OrderReview) ---
  const PaymentModal = () => (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full transform transition-all p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h4 className="text-2xl font-bold text-gray-800 flex items-center">
            <HiBanknotes className="w-7 h-7 mr-2 text-blue-600" />
            Complete M-Pesa Payment
          </h4>
          <button onClick={handleModalDismiss} className="text-gray-400 hover:text-gray-600">
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Order Summary & Status */}
        <div className="text-center bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <p className="text-lg text-gray-800">Order ID: <strong className="text-[#ea2e0e]">{orderId.slice(-6).toUpperCase()}</strong></p>
            {/* The total amount displayed here should now be correct because refreshCart is moved */}
            <p className="text-3xl font-extrabold text-red-600 mt-1">Ksh {orderTotal.toLocaleString()}</p>
            <p className="text-sm text-yellow-800 mt-2">Please complete this payment via M-Pesa to finalize your order.</p>
        </div>

        {/* 1. M-Pesa Instructions */}
        <div className="space-y-4">
            <h5 className="text-xl font-semibold text-gray-700">Payment Steps:</h5>
            <ol className="list-decimal list-inside space-y-3 text-gray-700 ml-4">
                <li>Go to **Lipa Na M-Pesa** on your M-Pesa menu.</li>
                <li>Select **Buy Goods and Services**.</li>
                <li>Enter the Till Number:
                    <div className="flex items-center justify-between p-3 mt-2 bg-gray-100 rounded-lg border border-gray-300 shadow-sm">
                        <span className="text-2xl font-extrabold tracking-widest text-[#ea2e0e]">
                            {MPESA_TILL_NUMBER}
                        </span>
                        <button 
                            onClick={handleCopy} 
                            className="flex items-center px-3 py-1 bg-white border border-[#ea2e0e] text-[#ea2e0e] rounded-lg hover:bg-gray-50 transition duration-150"
                        >
                            <HiOutlineClipboardCopy className="w-5 h-5 mr-1" />
                            {copied ? 'Copied!' : 'Copy Till'}
                        </button>
                    </div>
                </li>
                <li>Enter the exact amount: **Ksh {orderTotal.toLocaleString()}**.</li>
            </ol>
        </div>
        
        {/* 2. Phone Number Confirmation */}
        <div className="border-t pt-4">
            <h5 className="text-xl font-semibold text-gray-700 mb-3">Confirmation Contact:</h5>
            <p className="text-sm text-gray-600 mb-4">We'll use this number to link your payment and confirm the order status.</p>

            <form onSubmit={handleSubmitPaymentContact} className="flex flex-col space-y-4">
                <div className="relative">
                    <HiPhone className="w-5 h-5 absolute top-3 left-3 text-gray-400" />
                    <input
                        type="tel"
                        pattern="[0-9]{10,12}" 
                        value={paymentContact}
                        onChange={(e) => setPaymentContact(e.target.value)}
                        className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., 07XXXXXXXX"
                        required
                        disabled={contactSubmissionLoading || contactSubmissionStatus === 'success'}
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={contactSubmissionLoading || paymentContact.length < 10 || contactSubmissionStatus === 'success'}
                    className={`w-full py-3 text-white font-semibold rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center ${
                        contactSubmissionStatus === 'success' 
                            ? 'bg-green-700' 
                            : 'bg-green-600 hover:bg-green-700'
                    }`}
                >
                    {contactSubmissionLoading ? (
                        <><Spinner />Submitting...</>
                    ) : contactSubmissionStatus === 'success' ? (
                        <><HiCheckCircle className='w-5 h-5 mr-2'/> Contact Saved!</>
                    ) : (
                        'CONFIRM CONTACT FOR RECONCILIATION'
                    )}
                </button>
            </form>
        </div>
        
        {/* Footer Button - Now clears cart before navigating */}
        <button 
            onClick={handleViewOrderStatus} // Use the new handler here
            disabled={!orderId}
            className="w-full py-3 bg-[#ea2e0e] text-white font-semibold rounded-lg hover:bg-[#c4250c] transition duration-200"
        >
            View Order Status
        </button>
      </div>
    </div>
  );

  // --- MAIN RENDER FUNCTION ---
  return (
    <div className="relative">
      {/* 1. Main Order Review Content */}
      <div className="space-y-8 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4 flex items-center"><HiCheckCircle className="w-6 h-6 mr-2 text-[#ea2e0e]"/>Review & Place Order</h3>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* Shipping and Payment Info */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <p className="text-lg font-semibold text-gray-800 mb-2">Delivery & Payment</p>
              <ItemDetail title="Recipient" value={formData.name} />
              <ItemDetail title="Shipping To" value={`${formData.address}, ${formData.city}`} />
              <ItemDetail title="Shipping Method" value={formData.shippingMethod === 'standard' ? 'Standard (3-5 Days)' : 'Express (1-2 Days)'} />
              <ItemDetail title="Payment Method" value={formData.paymentMethod.toUpperCase()} />
            </div>

            {/* Item List */}
            <div className="border border-gray-200 rounded-lg p-4">
                <p className="text-lg font-semibold text-gray-800 mb-4">Items ({cartItems.length})</p>
                {cartItems.map((item) => (
                    <div key={item._id} className="flex justify-between items-center text-sm py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-gray-700 line-clamp-1 w-2/3">{item.name} ({item.size})</span>
                        <span className="font-semibold">Ksh {item.price.toLocaleString()} x {item.quantity}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="md:col-span-1 border border-gray-200 rounded-lg p-6 bg-white shadow-md h-fit">
            <p className="text-xl font-bold text-gray-800 mb-4">Order Summary</p>
            <DetailRow label="Subtotal" value={subtotal} />
            <DetailRow label={`Tax (VAT ${taxRate*100}%)`} value={tax} />
            <DetailRow label="Shipping" value={shippingCost} />
            <DetailRow label="Order Total" value={orderTotal} isTotal={true} />
            <p className="text-xs text-gray-500 mt-2 text-right">All prices in Kenya Shillings (Ksh)</p>
          </div>
        </div>
      
        <div className="flex justify-between pt-4">
          <button onClick={onPrev} className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center transition duration-150">
            <HiArrowLeft className="w-5 h-5 mr-1" /> Edit Details
          </button>
          <button 
            onClick={handlePlaceOrderClick} 
            disabled={loading}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading ? <Spinner /> : 'PLACE ORDER & PAY'}
          </button>
        </div>
      </div>
      
      {/* 2. Payment Modal Overlay */}
      {showPaymentModal && <PaymentModal />}
    </div>
  );
};