import React, { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const NewArrivals = () => {
    const scrollRef = useRef(null);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [canScrollLeft, setCanScrollLeft] = useState(false);

    // New state for mouse-based scrolling
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const newArrivals = [
        {
            _id: "1",
            name: "Stylish Jacket",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?/random=1",
                    altText: "Stylish Jacket",
                },
            ],
        },
        {
            _id: "2",
            name: "Stylish Jacket",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?/random=2",
                    altText: "Stylish Jacket",
                },
            ],
        },
        {
            _id: "8",
            name: "Stylish Jacket",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?/random=1",
                    altText: "Stylish Jacket",
                },
            ],
        },
        {
            _id: "3",
            name: "Stylish Jacket",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?/random=3",
                    altText: "Stylish Jacket",
                },
            ],
        },
        {
            _id: "4",
            name: "Stylish Jacket",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?/random=4",
                    altText: "Stylish Jacket",
                },
            ],
        },
        {
            _id: "5",
            name: "Stylish Jacket",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?/random=5",
                    altText: "Stylish Jacket",
                },
            ],
        },
        {
            _id: "6",
            name: "Stylish Jacket",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?/random=6",
                    altText: "Stylish Jacket",
                },
            ],
        },
        {
            _id: "7",
            name: "Stylish Jacket",
            price: 120,
            images: [
                {
                    url: "https://picsum.photos/500/500?/random=7",
                    altText: "Stylish Jacket",
                },
            ],
        },
    ];

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
            scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
        }
    };

    const handleScrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
    };

    // Mouse event handlers for scrolling
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.pageX - scrollRef.current.offsetLeft);
        setScrollLeft(scrollRef.current.scrollLeft);
        // Add a "grabbing" cursor class to provide feedback to the user
        scrollRef.current.style.cursor = "grabbing";
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
        // Reset cursor to default
        scrollRef.current.style.cursor = "grab";
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        // Reset cursor to default
        scrollRef.current.style.cursor = "grab";
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - scrollRef.current.offsetLeft;
        const walk = (x - startX) * 2; // Adjust scroll speed
        scrollRef.current.scrollLeft = scrollLeft - walk;
    };

    useEffect(() => {
        const container = scrollRef.current;
        if (container) {
            container.addEventListener("scroll", updateScrollButtons);

            // Add mouse event listeners for dragging
            container.addEventListener("mousedown", handleMouseDown);
            container.addEventListener("mouseup", handleMouseUp);
            container.addEventListener("mouseleave", handleMouseLeave);
            container.addEventListener("mousemove", handleMouseMove);

            updateScrollButtons();
        }
        return () => {
            if (container) {
                container.removeEventListener("scroll", updateScrollButtons);
                // Remove mouse event listeners
                container.removeEventListener("mousedown", handleMouseDown);
                container.removeEventListener("mouseup", handleMouseUp);
                container.removeEventListener("mouseleave", handleMouseLeave);
                container.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, [isDragging, startX, scrollLeft]);

    return (
        <section className="py-16 px-4 lg:px-0 ">
            <div className="container mx-auto text-center mb-10 relative">
                <h2 className="text-3xl font-bold mb-4">Explore New Arrivals</h2>
                <p className="text-lg text-gray-600 mb-8">
                    Discover the latest styles straight off the runway, freshly added to
                    keep your wardrobe on the cutting edge of fashion.
                </p>

                {/* Scroll buttons */}
                <div className="absolute right-0 bottom-[-30px] flex space-x-2">
                    <button
                        onClick={handleScrollLeft}
                        disabled={!canScrollLeft}
                        className={`p-2 rounded border bg-white text-black transition-colors duration-200 ${!canScrollLeft ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        <FiChevronLeft className="text-2xl" />
                    </button>
                    <button
                        onClick={handleScrollRight}
                        disabled={!canScrollRight}
                        className={`p-2 rounded border bg-white text-black transition-colors duration-200 ${!canScrollRight ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
                    >
                        <FiChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>
            {/* Scrollable content with mouse drag */}
            <div
                ref={scrollRef}
                className="container mx-auto overflow-x-scroll flex space-x-6 relative cursor-grab"
            >
                {newArrivals.map((product) => (
                    <div
                        key={product._id}
                        className="min-w-[100%] sm:min-w-[50%] lg:min-w-[30%] relative"
                    >
                        <img
                            src={product.images[0]?.url}
                            alt={product.images[0]?.altText || product.name}
                            className="w-full h-[500px] object-cover rounded-lg"
                            draggable="false"
                        />
                        <div className="absolute bottom-0 left-0 right-0 backdrop-blur-md text-white p-4 rounded-b-lg">
                            <Link to={`/product/${product._id}`} className="block ">
                                <h4 className="font-medium text-black">{product.name}</h4>
                                <p className="mt-1 text-black font-bold">${product.price}</p>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewArrivals;