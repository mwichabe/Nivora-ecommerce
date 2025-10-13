import React from "react";
import { IoMdClose } from "react-icons/io";
import { useCart } from "../../context/CartContext";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const { cartItems, totalItems, loading } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 flex justify-between items-center border-b">
        <h2 className="text-lg font-semibold">My Cart ({totalItems})</h2>
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="w-6 h-6" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto h-[calc(100%-80px)]">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <p className="text-gray-500 text-sm">Your cart is empty.</p>
        ) : (
          cartItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center mb-4 pb-4 border-b border-gray-100"
            >
              <img
                src={item.product?.imageUrls?.[0] || "https://placehold.co/100x100"}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md mr-3"
              />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800">{item.name}</h3>
                <p className="text-xs text-gray-500">Size: {item.size}</p>
                <p className="text-sm font-medium text-gray-700">${item.price}</p>
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CartDrawer;