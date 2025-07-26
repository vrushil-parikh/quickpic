import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import CardLoading from './CardLoading'; // Assuming path is correct
import CardProduct from './CardProduct'; // Assuming path is correct
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

// This component is designed to display a list of products passed via props.
const RecommendedProducts = ({ title, products, loading }) => {
    const containerRef = useRef();
    const loadingCardNumber = new Array(6).fill(null); // Number of loading cards

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 300; // Scroll distance
    };

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 300; // Scroll distance
    };

    // Determine if scroll buttons should be shown (only if there are products and not loading)
    const showScrollButtons = !loading && products && products.length > 4; // Show if more than ~4 products

    return (
        // Section container with styling similar to CategoryWiseProductDisplay
        <div className="my-8 md:my-12 py-6 bg-gradient-to-b from-emerald-50/30 via-white to-white rounded-lg shadow-sm">
            <div className='container mx-auto px-4 md:px-6 mb-4 md:mb-6'>
                <div className='flex items-baseline justify-between gap-4'>
                    {/* Section Title - Passed as prop */}
                    <h2 className='font-bold text-xl sm:text-2xl md:text-3xl text-gray-700 capitalize'>{title || 'Recommended Products'}</h2>
                    {/* Optional: Add a 'See All' link if applicable, maybe link to a general products page? */}
                    {/* <Link to={'/products'} className='text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center group transition-colors duration-200'>
                        <span>View All</span>
                        <FaAngleRight className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </Link> */}
                </div>
            </div>

            {/* Product Carousel Section */}
            <div className='relative'>
                {/* Scrollable container */}
                <div
                    className='flex gap-4 md:gap-6 container mx-auto px-4 md:px-6 overflow-x-auto scrollbar-none scroll-smooth py-4'
                    ref={containerRef}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Loading State: Render skeleton loaders */}
                    {loading &&
                        loadingCardNumber.map((_, index) => (
                            <CardLoading key={`loading-recommend-${index}`} />
                        ))
                    }

                    {/* Product Cards: Render actual products when not loading */}
                    {!loading && products && products.map((product) => (
                        <CardProduct
                            data={product}
                            key={product._id + "-recommend"} // Use product ID for a unique key
                        />
                    ))}

                    {/* Empty State: Show message if no products and not loading */}
                    {!loading && (!products || products.length === 0) && (
                        <div className="w-full text-center text-slate-500 py-10 px-4">
                            No recommendations available at the moment.
                        </div>
                    )}
                </div>

                {/* Scroll Buttons: Visible on larger screens, improved styling */}
                {showScrollButtons && (
                    <>
                        {/* Left Scroll Button */}
                        <button
                            onClick={handleScrollLeft}
                            aria-label="Scroll Left"
                            className='absolute top-1/2 left-0 transform -translate-y-1/2 z-10 pointer-events-auto bg-amber-50/80 backdrop-blur-sm hover:bg-amber-100 shadow-md hover:shadow-lg text-gray-600 hover:text-orange-600 p-2 rounded-full transition-all duration-300 flex items-center justify-center w-10 h-10 border border-amber-200/50 ml-1 hidden lg:flex'
                        >
                            <FaAngleLeft size={20} />
                        </button>
                        {/* Right Scroll Button */}
                        <button
                            onClick={handleScrollRight}
                            aria-label="Scroll Right"
                            className='absolute top-1/2 right-0 transform -translate-y-1/2 z-10 pointer-events-auto bg-amber-50/80 backdrop-blur-sm hover:bg-amber-100 shadow-md hover:shadow-lg text-gray-600 hover:text-orange-600 p-2 rounded-full transition-all duration-300 flex items-center justify-center w-10 h-10 border border-amber-200/50 mr-1 hidden lg:flex'
                        >
                            <FaAngleRight size={20} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default RecommendedProducts;

