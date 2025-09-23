import React, { useState } from "react";

const selectedProduct = {
  name: "Stylish Leather Jacket",
  price: 120,
  originalPrice: 150,
  description:
    "This is a stylish and versatile leather jacket, perfect for any occasion. It features a classic design with modern touches, ensuring you'll look great whether you're heading out for a night on the town or a casual weekend gathering. The high-quality leather is durable and comfortable, and it's designed to last for years.",
  brand: "FashionBrand",
  material: "100% genuine leather",
  sizes: ["S", "M", "L", "XL", "XXL"],
  colors: ["Black", "Brown", "Burgundy"],
  images: [
    {
      url: "https://picsum.photos/500/500?/random=1",
      altText: "Stylish Leather Jacket front view",
    },
    {
      url: "https://picsum.photos/500/500?/random=2",
      altText: "Stylish Leather Jacket side view",
    },
    {
      url: "https://picsum.photos/500/500?/random=3",
      altText: "Stylish Leather Jacket back view",
    },
  ],
};

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(
    selectedProduct.images[0]?.url
  );
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  const formatPrice = (price) => `$${price.toFixed(2)}`;
  const discount =
    ((selectedProduct.originalPrice - selectedProduct.price) /
      selectedProduct.originalPrice) *
    100;

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden md:flex">
        {/* Image Gallery */}
        <div className="md:w-1/2 p-6 flex flex-col items-center">
          {/* Main Image */}
          <div className="w-full mb-4">
            <img
              src={selectedImage}
              alt={selectedProduct.name}
              className="w-full h-auto object-contain rounded-lg shadow-md"
            />
          </div>
          {/* Thumbnails (desktop and mobile) */}
          <div className="w-full flex justify-center md:justify-start space-x-4 overflow-x-auto pb-4">
            {selectedProduct.images.map((image, index) => (
              <img
                key={index}
                src={image.url}
                alt={image.altText}
                className={`w-24 h-24 object-cover rounded-lg cursor-pointer transition-transform duration-200 transform hover:scale-105 ${
                  selectedImage === image.url
                    ? "border-4 border-black-500 shadow-md"
                    : "border-2 border-gray-300"
                }`}
                onClick={() => setSelectedImage(image.url)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            {selectedProduct.name}
          </h1>
          <p className="text-lg text-gray-600 mb-4">{selectedProduct.brand}</p>

          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-bold text-red-600">
              {formatPrice(selectedProduct.price)}
            </span>
            <span className="ml-2 text-xl text-gray-500 line-through">
              {formatPrice(selectedProduct.originalPrice)}
            </span>
            <span className="ml-4 text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {discount.toFixed(0)}% OFF
            </span>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-6">
            {selectedProduct.description}
          </p>

          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-2">
              Material:{" "}
              <span className="font-normal text-gray-600">
                {selectedProduct.material}
              </span>
            </p>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Colors</h3>
            <div className="flex space-x-3">
              {selectedProduct.colors.map((color, index) => (
                <button
                  key={index}
                  className={`w-10 h-10 rounded-full border-2 transform transition-transform duration-200 hover:scale-110 ${
                    selectedColor === color
                      ? "ring-2 ring-black-500 ring-offset-2"
                      : "ring-0"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                  onClick={() => setSelectedColor(color)}
                ></button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Sizes</h3>
            <div className="flex flex-wrap gap-2">
              {selectedProduct.sizes.map((size, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 border rounded-lg font-medium transition-colors duration-200 ${
                    selectedSize === size
                      ? "bg-gray-600 text-white border-black-600"
                      : "bg-black-200 text-gray-800 border-black-300 hover:bg-gray-300"
                  }`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full py-4 text-lg font-bold text-white bg-gray-600 rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300 transform hover:scale-105">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;