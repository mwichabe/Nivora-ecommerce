import React from "react";
import { Link } from "react-router-dom";
import mensCollectionImage from "../../assets/men.png";
import womensCollectionImage from "../../assets/women.png";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 lg:px-0">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Womens collection */}
        <div className="relative flex-1">
          <img
            src={womensCollectionImage}
            alt="Women's collection"
            className="w-full h-[700px] object-cover rounded-2xl"
          />
          <div className="absolute bottom-8 left-8 bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>

        {/* Mens collection */}
        <div className="relative flex-1">
          <img
            src={mensCollectionImage}
            alt="Men's collection"
            className="w-full h-[700px] object-cover rounded-2xl"
          />
          <div className="absolute bottom-8 left-8 bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=men"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default GenderCollectionSection;
