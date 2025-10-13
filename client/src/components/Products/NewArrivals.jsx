import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// Assuming ProductModal is imported from the correct relative path
import { ProductModal } from "../Common/ProductModal";

// --- Constants ---
const API_URL = "http://localhost:5000/api/admin/products";
const MAX_PRODUCTS = 8;
const FALLBACK_IMAGE_URL =
  "https://placehold.co/600x400/000000/FFFFFF?text=No+Image";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // UI States
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasToken, setHasToken] = useState(false);

  // Data State
  const [products, setProducts] = useState([]);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mouse Drag States
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  // 🟢 NEW: Ref to track if the mouse has moved enough to count as a drag
  const hasMoved = useRef(false); 
  const DRAG_TOLERANCE = 5; // Pixels threshold for detecting a drag

  // Handler to open the modal
  const handleProductClick = (product) => {
    // 🟢 MODIFIED: Check if the drag flag was set during the click cycle
    if (hasMoved.current) {
        // Log to debug: if you see this, the click was blocked due to drag detection
        console.log('Click blocked: Detected as drag/scroll.');
        return; 
    }
    
    // Log to debug: if you see this, the modal should open
    console.log('Click processed: Opening modal for', product.name);
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // --- Data Fetching Logic (Unchanged) ---
  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(!!token);

    if (!token) {
      setLoading(false);
      setProducts([]);
      return;
    }

    const fetchNewArrivals = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      };

      try {
        setLoading(true);
        const response = await axios.get(API_URL, config);

        const newArrivalsData = response.data
          .slice(0, MAX_PRODUCTS)
          .map((p) => ({
            _id: p._id,
            name: p.name,
            price: p.price,
            category: p.category || 'Apparel',
            description: p.description || 'Quick details available.',
            stock: p.stock !== undefined ? p.stock : 1,
            sizes: Array.isArray(p.sizes) ? p.sizes : [],
            imageUrls:
              p.imageUrls && p.imageUrls.length > 0
                ? p.imageUrls
                : [FALLBACK_IMAGE_URL],
          }));

        setProducts(newArrivalsData);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNewArrivals();
  }, [navigate]);

  // --- Scroll Logic (Unchanged) ---
  const updateScrollButtons = () => {
    const container = scrollRef.current;
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  // --- Mouse Drag Logic (MODIFIED) ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    hasMoved.current = false; // 🟢 Reset drag flag on press
    scrollRef.current.style.cursor = "grabbing";
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    scrollRef.current.style.cursor = "grab";
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Note: We don't reset hasMoved here; the click handler uses its final state
    scrollRef.current.style.cursor = "grab";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeft - walk;

    // 🟢 Set flag if movement exceeds tolerance
    if (Math.abs(x - startX) > DRAG_TOLERANCE) {
        hasMoved.current = true;
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      updateScrollButtons();
      container.addEventListener("scroll", updateScrollButtons);
      container.addEventListener("mousedown", handleMouseDown);
      container.addEventListener("mouseup", handleMouseUp);
      container.addEventListener("mouseleave", handleMouseLeave);
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", updateScrollButtons);
        container.removeEventListener("mousedown", handleMouseDown);
        container.removeEventListener("mouseup", handleMouseUp);
        container.removeEventListener("mouseleave", handleMouseLeave);
        container.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, [isDragging, startX, scrollLeft, products]);

  // --- Helper Component: Skeleton Loader (Unchanged) ---
  const CardSkeleton = () => (
    <div className="min-w-[100%] sm:min-w-[50%] md:min-w-[33%] lg:min-w-[25%] xl:min-w-[12.5%] relative animate-pulse">
      <div className="w-full h-[350px] bg-gray-200 rounded-lg"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </div>
    </div>
  );

  // --- Helper Component: Product Card UI/UX ---
  const ArrivalCard = ({ product }) => {
    return (
      <div
        className="min-w-[100%] sm:min-w-[50%] md:min-w-[33%] lg:min-w-[25%] xl:min-w-[12.5%] transition-all duration-300 group hover:shadow-xl rounded-lg overflow-hidden relative bg-white cursor-pointer"
        onClick={() => handleProductClick(product)}
      >
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrls[0]}
            alt={product.name}
            className="w-full h-[350px] object-cover transition-transform duration-500 group-hover:scale-105"
            draggable="false"
          />
          {/* <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div> */}
        </div>
        <div className="p-4">
          <h4 className="font-semibold text-lg text-gray-800 truncate mb-2">
            {product.name}
          </h4>
          <p className="font-bold text-xl text-[#ea2e0e] mb-3">
            ${product.price.toFixed(2)}
          </p>

          {/* SIZES DISPLAY */}
          {product.sizes && product.sizes.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              <span className="text-xs font-medium text-gray-500 mr-1">
                Sizes:
              </span>
              {product.sizes.slice(0, 4).map((size, index) => (
                <span
                  key={index}
                  className="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs font-medium text-gray-500 px-2 py-0.5">
                  +{product.sizes.length - 4} more
                </span>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Sizes not listed.</p>
          )}
        </div>
      </div>
    );
  };

  // --- Main Render ---
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto relative">
        {/* Section Header */}
        <div className="flex justify-between items-end mb-10 border-b pb-3">
          <h2 className="text-4xl font-extrabold text-gray-900">
            New Arrivals
          </h2>
          <Link
            to="/shop"
            className="text-sm font-semibold text-[#ea2e0e] hover:text-gray-900 transition duration-200"
          >
            View All Products &rarr;
          </Link>
        </div>

        {/* --- Content Area --- */}
        {loading ? (
          <div className="flex space-x-6 overflow-hidden">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <CardSkeleton key={i} />
              ))}
          </div>
        ) : !hasToken ? (
          // --- UX Refinement: Sign Up Prompt ---
          <div className="text-center p-20 bg-gray-100 rounded-xl shadow-inner my-10 border-2 border-dashed border-gray-300">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Unlock Exclusive New Arrivals
            </h3>
            <p className="text-gray-600 mb-6">
              Please sign up or log in to view our full range of newly added
              products.
            </p>
            <button
              onClick={() => navigate("/signup")}
              className="px-8 py-3 bg-[#ea2e0e] text-white rounded-lg text-lg font-semibold uppercase tracking-wider transition duration-300 hover:bg-red-700 shadow-lg"
            >
              Sign Up to View Arrivals
            </button>
          </div>
        ) : (
          // --- Scrollable Carousel ---
          <>
            <div
              ref={scrollRef}
              className="flex space-x-6 overflow-x-scroll scrollbar-hide relative cursor-grab"
              onScroll={updateScrollButtons}
            >
              {products.map((product) => (
                <ArrivalCard key={product._id} product={product} />
              ))}
            </div>

            {/* Scroll buttons overlay */}
            {products.length > 4 && (
              <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none">
                <div className="flex justify-between mx-[-50px]">
                  <button
                    onClick={handleScrollLeft}
                    disabled={!canScrollLeft}
                    className={`p-3 rounded-full bg-white border border-gray-300 text-gray-800 transition-all duration-300 shadow-lg hover:bg-[#ea2e0e] hover:text-white pointer-events-auto ${
                      !canScrollLeft
                        ? "opacity-0 invisible"
                        : "opacity-100 visible"
                    }`}
                    aria-label="Scroll left"
                  >
                    <FiChevronLeft className="text-2xl" />
                  </button>
                  <button
                    onClick={handleScrollRight}
                    disabled={!canScrollRight}
                    className={`p-3 rounded-full bg-white border border-gray-300 text-gray-800 transition-all duration-300 shadow-lg hover:bg-[#ea2e0e] hover:text-white pointer-events-auto ${
                      !canScrollRight
                        ? "opacity-0 invisible"
                        : "opacity-100 visible"
                    }`}
                    aria-label="Scroll right"
                  >
                    <FiChevronRight className="text-2xl" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Render the Product Modal */}
      {isModalOpen && <ProductModal product={selectedProduct} onClose={closeModal} />}

      {/* Optional: Add a simple CSS class for hiding the default scrollbar */}
      <style jsx="true">{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
      `}</style>
    </section>
  );
};

export default NewArrivals;