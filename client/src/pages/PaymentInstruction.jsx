// import React, { useState, useEffect } from "react"; // 🔑 ADD useEffect
// import { useParams, useNavigate } from "react-router-dom";
// import { HiCheckCircle, HiPhone, HiBanknotes } from "react-icons/hi2";
// import { HiOutlineClipboardCopy } from "react-icons/hi";
// import { IoMdClose } from "react-icons/io";

// // Assuming a Spinner component exists (add it if you haven't)
// const Spinner = () => (
//   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#ea2e0e] mx-auto"></div>
// );

// // ⚠️ IMPORTANT: Replace with your actual Till Number
// const MPESA_TILL_NUMBER = "1234567";

// const PaymentInstructionsScreen = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();

//   // 🔑 STATE TO HOLD REAL ORDER DATA
//   const [order, setOrder] = useState(null);
//   const [loadingOrder, setLoadingOrder] = useState(true);
//   const [orderError, setOrderError] = useState(null);

//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [submissionLoading, setSubmissionLoading] = useState(false);

//   // 🔑 EFFECT TO FETCH ORDER DETAILS
//   useEffect(() => {
//     const fetchOrder = async () => {
//       if (!orderId) {
//         setOrderError("Missing Order ID.");
//         setLoadingOrder(false);
//         return;
//       }

//       try {
//         const token = localStorage.getItem("token");
//         const response = await fetch(
//           `http://localhost:5000/api/orders/${orderId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         const data = await response.json();

//         if (response.ok) {
//           setOrder(data);
//         } else {
//           setOrderError(data.message || "Could not load order details.");
//         }
//       } catch (error) {
//         console.error("Fetch Order Network Error:", error);
//         setOrderError("Network error while fetching order.");
//       } finally {
//         setLoadingOrder(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId]); // Dependency array ensures fetch runs when orderId changes

//   const handleCopy = () => {
//     // ... (copy logic remains the same) ...
//     navigator.clipboard.writeText(MPESA_TILL_NUMBER);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   // 🔑 handleSubmitPhoneNumber remains the same (it correctly updates the backend)
//   const handleSubmitPhoneNumber = async (e) => {
//     e.preventDefault();
//     setSubmissionLoading(true);
//     setSubmissionStatus(null);

//     try {
//       const token = localStorage.getItem("token");
//       const response = await fetch(
//         `http://localhost:5000/api/orders/${orderId}/payment-contact`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({ phoneNumber }),
//         }
//       );

//       const data = await response.json();

//       if (response.ok) {
//         setSubmissionStatus("success");
//       } else {
//         setSubmissionStatus("error");
//         // You might want to update the UI with a more prominent error message here
//         console.error("API Error:", data.message);
//       }
//     } catch (error) {
//       console.error("Network Error:", error);
//       setSubmissionStatus("error");
//     } finally {
//       setSubmissionLoading(false);
//     }
//   };

//   // --- Render Logic ---

//   // Loading State
//   if (loadingOrder) {
//     return (
//       <div className="max-w-xl mx-auto mt-20 p-8 text-center">
//         <Spinner />
//         <p className="mt-4 text-gray-600">Loading order details...</p>
//       </div>
//     );
//   }

//   // Error State
//   if (orderError || !order) {
//     return (
//       <div className="max-w-xl mx-auto mt-20 p-8 text-center bg-red-100 border border-red-400 text-red-700 rounded-xl">
//         <IoMdClose className="w-8 h-8 mx-auto mb-3" />
//         <h2 className="text-xl font-bold mb-2">Error</h2>
//         <p>{orderError || "Order not found or access denied."}</p>
//         <button
//           onClick={() => navigate("/")}
//           className="mt-4 text-sm text-red-600 hover:text-red-800"
//         >
//           Go Home
//         </button>
//       </div>
//     );
//   }

//   // Success State (remains the same)
//   if (submissionStatus === "success") {
//     return (
//       <div className="max-w-xl mx-auto mt-20 p-8 text-center bg-white rounded-xl shadow-2xl border-t-4 border-green-500">
//         <HiCheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
//         <h2 className="text-3xl font-bold text-gray-800 mb-3">
//           Order Confirmed!
//         </h2>
//         <p className="text-lg text-gray-600 mb-6">
//           Thank you for placing your order. We will contact you soon via the
//           provided phone number to confirm payment and shipping details.
//         </p>

//         <p className="font-semibold text-gray-700">
//           Your Order ID: <span className="text-[#ea2e0e]">{orderId}</span>
//         </p>
//         <button
//           onClick={() => navigate("/")}
//           className="mt-8 px-8 py-3 bg-[#ea2e0e] text-white font-semibold rounded-lg hover:bg-[#c4250c] transition duration-200"
//         >
//           Return to Home
//         </button>
//       </div>
//     );
//   }

//   // Order Price Formatting
//   const formattedTotalPrice = order.totalPrice.toLocaleString("en-KE", {
//     minimumFractionDigits: 0,
//     maximumFractionDigits: 0,
//   });

//   return (
//     <div className="container mx-auto px-4 py-10 min-h-screen bg-gray-50">
//       <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-2xl">
//         <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3 flex items-center">
//           <HiBanknotes className="w-7 h-7 mr-2 text-blue-500" />
//           Complete Payment for Order #{orderId.slice(-6)}
//         </h1>

//         <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
//           <p className="font-semibold text-yellow-800">
//             Total Due: Ksh {formattedTotalPrice}
//           </p>{" "}
//           {/* 🔑 USING REAL PRICE */}
//           <p className="text-sm text-yellow-700">
//             Payment must be completed within 2 hours.
//           </p>
//         </div>

//         {/* M-PESA Instructions (remains the same) */}
//         <div className="mb-8">
//           <h3 className="text-xl font-semibold text-gray-700 mb-3">
//             1. Pay via M-Pesa
//           </h3>
//           <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
//             <li>Go to M-Pesa on your phone.</li>
//             <li>Select **Lipa Na M-Pesa**.</li>
//             <li>Select **Buy Goods and Services**.</li>
//             <li>Enter the Till Number below:</li>
//           </ol>

//           {/* Till Number Display */}
//           <div className="flex items-center justify-between p-4 mt-4 bg-gray-100 rounded-lg border border-gray-300">
//             <span className="text-2xl font-extrabold tracking-widest text-[#ea2e0e]">
//               {MPESA_TILL_NUMBER}
//             </span>
//             <button
//               onClick={handleCopy}
//               className="flex items-center px-3 py-1 bg-white border border-[#ea2e0e] text-[#ea2e0e] rounded-lg hover:bg-gray-50 transition duration-150"
//             >
//               <HiOutlineClipboardCopy className="w-5 h-5 mr-1" />
//               {copied ? "Copied!" : "Copy"}
//             </button>
//           </div>
//         </div>

//         {/* Phone Number Submission (remains the same) */}
//         <div className="border-t pt-6">
//           <h3 className="text-xl font-semibold text-gray-700 mb-3">
//             2. Submit Your Phone Number
//           </h3>
//           <p className="text-sm text-gray-600 mb-4">
//             Please provide the number you will use (or used) for payment
//             confirmation.
//           </p>

//           <form
//             onSubmit={handleSubmitPhoneNumber}
//             className="flex flex-col space-y-4"
//           >
//             <div className="relative">
//               <HiPhone className="w-5 h-5 absolute top-3 left-3 text-gray-400" />
//               <input
//                 type="tel"
//                 pattern="[0-9]{10}"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//                 className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ea2e0e]"
//                 placeholder="e.g., 0712345678"
//                 required
//                 disabled={submissionLoading}
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={submissionLoading || phoneNumber.length < 10}
//               className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition duration-200 disabled:opacity-50 flex items-center justify-center"
//             >
//               {submissionLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//                   Confirming...
//                 </>
//               ) : (
//                 "CONFIRM PHONE NUMBER"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentInstructionsScreen;
