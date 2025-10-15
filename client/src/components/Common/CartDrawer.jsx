import React from "react";
import { IoMdClose } from "react-icons/io";
import { HiOutlineTrash, HiPlus, HiMinus } from "react-icons/hi2"; // Import new icons
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";


const CartItemDisplay = ({ item, updateQuantity, removeItem }) => {
    // Calculate total price for this item
    const itemTotalPrice = (item.price * item.quantity).toFixed(2);
    // Use the sub-document ID from the item for updates/deletes
    const itemId = item._id; 

    return (
        <div className="flex justify-between items-start py-3 border-b border-gray-100">
            {/* Image and Details */}
            <div className="flex flex-grow items-start space-x-3">
                <img
                    // The backend is populating 'item.product', but the image property
                    // might be nested differently. Using the existing structure for now.
                    src={item.product?.imageUrls?.[0] || "https://placehold.co/100x100"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex flex-col">
                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Size: {item.size}</p>
                    <p className="text-sm font-bold text-[#ea2e0e] mt-1">Ksh {item.price.toFixed(2)}</p>
                </div>
            </div>

            {/* Controls and Total Price */}
            <div className="flex flex-col items-end space-y-2">
                {/* Quantity Controls */}
                <div className="flex items-center space-x-2 bg-gray-100 rounded-md p-1">
                    <button
                        onClick={() => updateQuantity(itemId, item.quantity - 1)}
                        className="text-gray-600 hover:text-[#ea2e0e] transition duration-150 p-1"
                        aria-label="Decrease quantity"
                    >
                        <HiMinus className="w-4 h-4" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button
                        onClick={() => updateQuantity(itemId, item.quantity + 1)}
                        className="text-gray-600 hover:text-[#ea2e0e] transition duration-150 p-1"
                        aria-label="Increase quantity"
                    >
                        <HiPlus className="w-4 h-4" />
                    </button>
                </div>

                {/* Item Total and Delete */}
                <p className="text-sm font-bold text-gray-700">Total: Ksh {itemTotalPrice}</p>
                <button
                    onClick={() => removeItem(itemId)}
                    className="text-red-500 hover:text-red-700 transition duration-150 p-1"
                    aria-label="Remove item"
                >
                    <HiOutlineTrash className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const { 
    cartItems, 
    totalItems, 
    loading, 
    updateCartItemQuantity, 
    removeCartItem,
    totalCartPrice, // Get the overall total price
  } = useCart();
  const navigate = useNavigate();
  
  // Format the total price for display
  const formattedTotalPrice = totalCartPrice.toFixed(2);

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b">
          <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
          <button 
            onClick={toggleCartDrawer}
            className="text-gray-500 hover:text-gray-800 transition duration-150"
            aria-label="Close cart"
          >
            <IoMdClose className="w-7 h-7" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-grow overflow-y-auto mt-4 pr-2">
          {loading ? (
            <p className="text-center text-gray-500 mt-10">Loading cart...</p>
          ) : cartItems.length === 0 ? (
            <div className="text-center mt-10">
              <p className="text-gray-500 text-md">Your cart is empty.</p>
              <button 
                onClick={toggleCartDrawer}
                className="mt-4 text-[#ea2e0e] hover:text-[#c4250c] font-medium text-sm transition duration-150"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <CartItemDisplay 
                key={item._id} // Use the item's unique _id from MongoDB
                item={item} 
                updateQuantity={updateCartItemQuantity} 
                removeItem={removeCartItem}
              />
            ))
          )}
        </div>

        {/* Footer: Subtotal and Checkout Button */}
        {cartItems.length > 0 && (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">Subtotal ({totalItems} items):</span>
              <span className="text-xl font-bold text-[#ea2e0e]">Ksh {formattedTotalPrice}</span>
            </div>
            <button
            onClick={() => navigate("/checkout")}
              className="w-full py-3 bg-[#ea2e0e] text-white font-semibold rounded-lg hover:bg-[#c4250c] transition duration-200 shadow-md"
            >
              PROCEED TO CHECKOUT
            </button>
            <button 
                onClick={toggleCartDrawer}
                className="w-full mt-2 py-2 text-sm text-gray-600 hover:text-gray-800 transition duration-150"
            >
                Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;