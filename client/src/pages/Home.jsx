import React, { useState, useEffect } from 'react';
import banner from '../assets/banner.jpg';
import bannerMobile from '../assets/banner-mobile.jpg';
import { useSelector } from 'react-redux';
import { valideURLConvert } from '../utils/valideURLConvert';
import { Link, useNavigate } from 'react-router-dom';
import CategoryWiseProductDisplay from '../components/CategoryWiseProductDisplay';
import RecommendedProducts from '../components/RecommendedProducts'; // Import the new component
import Axios from '../utils/Axios'; // Import Axios
import SummaryApi from '../common/SummaryApi'; // Import SummaryApi
import AxiosToastError from '../utils/AxiosToastError'; // Import error handler

const Home = () => {
    const loadingCategory = useSelector(state => state.product.loadingCategory);
    const categoryData = useSelector(state => state.product.allCategory);
    const subCategoryData = useSelector(state => state.product.allSubCategory);
    const userOrders = useSelector(state => state.orders.order); // Get user orders from Redux
    const navigate = useNavigate();

    // State for recommended products
    const [recommendedProducts, setRecommendedProducts] = useState([]);
    const [loadingRecommendations, setLoadingRecommendations] = useState(false);
    const [recommendationTitle, setRecommendationTitle] = useState('Recommended For You');

    const handleRedirectProductListpage = (id, cat) => {
        // Find the first subcategory associated with the main category
        const subcategory = subCategoryData.find(sub =>
            sub.category?.some(c => c._id === id)
        );
        // If a subcategory is found, navigate to its page
        if (subcategory) {
            const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
            navigate(url);
        } else {
            // Fallback or error handling if no subcategory is found for the category
            console.warn(`No subcategory found for category: ${cat} (${id})`);
            // Optionally navigate to a general category page or show a message
        }
    };

    // --- Recommendation Logic --- 
    useEffect(() => {
        const fetchRecommendations = async () => {
            setLoadingRecommendations(true);
            let fetchedProducts = [];
            let title = 'Recommended For You';

            try {
                if (userOrders && userOrders.length > 0) {
                    // Logic for users with order history
                    title = 'Based on Your Recent Orders';
                    // Get unique category IDs from the last 2 orders (or fewer if less than 2 orders)
                    const categoryIds = new Set();

                    // Get the last two orders (or fewer if less than 2)
                    const recentOrders = userOrders.slice(-2); // Get the last 2 elements

                    recentOrders.forEach(order => { // Iterate through ONLY the recent orders
                        order.products.forEach(item => {
                            // Check if productId is populated and has a category array
                            // Assumes the backend API populates order.products.productId with product details including category
                            if (item.productId && typeof item.productId === 'object' && Array.isArray(item.productId.category)) {
                                item.productId.category.forEach(catId => {
                                    if (catId) { // Ensure the ID is not null/undefined
                                       categoryIds.add(catId.toString()); // Add the category ID (convert ObjectId to string if needed)
                                    }
                                });
                            } else if (item.product_details?.category) {
                                // Fallback: Check the original location just in case structure varies
                                // Ensure it's treated as an array if the schema defines it so
                                const categoryData = item.product_details.category;
                                if (Array.isArray(categoryData)) {
                                    categoryData.forEach(catId => {
                                        if (catId) categoryIds.add(catId.toString());
                                    });
                                } else if (categoryData) {
                                    categoryIds.add(categoryData.toString());
                                }
                            } else {
                                 // Optional: Log if category info is missing for an item
                                 // console.warn("Category information missing for product:", item.productId || item.product_details?.name);
                            }
                        });
                    });

                    if (categoryIds.size > 0) {
                        // Fetch products for each category ID (limit to first 3 categories for performance)
                        const categoryFetchPromises = Array.from(categoryIds).map(catId =>
                            Axios({
                                ...SummaryApi.getProductByCategory,
                                data: { id: catId }
                            }).then(response => response.data.data || []) // Extract data array
                              .catch(err => { 
                                  console.error(`Error fetching products for category ${catId}:`, err);
                                  return []; // Return empty array on error for this category
                              })
                        );
                        
                        const results = await Promise.all(categoryFetchPromises);
                        fetchedProducts = results.flat(); // Combine products from all categories
                        
                        // Remove duplicates and limit total recommendations
                        const uniqueProducts = Array.from(new Map(fetchedProducts.map(p => [p._id, p])).values());
                        fetchedProducts = uniqueProducts.slice(0, 12); // Limit to 12 recommendations

                    } else {
                        // Fallback if no category IDs found in recent orders (will trigger random logic below)
                    }
                }


                setRecommendedProducts(fetchedProducts);
                setRecommendationTitle(title);

            } catch (error) {
                AxiosToastError(error);
                setRecommendedProducts([]); // Clear on error
            } finally {
                setLoadingRecommendations(false);
            }
        };

        // Only fetch recommendations if category data is loaded (needed for random fallback)
        if (categoryData && categoryData.length > 0) {
             fetchRecommendations();
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userOrders, categoryData]); // Re-run if orders or category data changes
    // --- End Recommendation Logic ---

    return (
        <section className='bg-white pb-8'> {/* Added padding-bottom */} 
            {/* Banner */}
            <div className='container mx-auto'>
                <div className={`w-full h-full min-h-48 bg-slate-200 rounded ${!banner && "animate-pulse my-2"} overflow-hidden`}> {/* Adjusted styling */} 
                    <img
                        src={banner}
                        className='w-full h-full object-cover hidden lg:block' // Use object-cover
                        alt='banner'
                    />
                    <img
                        src={bannerMobile}
                        className='w-full h-full object-cover lg:hidden' // Use object-cover
                        alt='banner'
                    />
                </div>
            </div>

            {/* Category Grid */}
            <div className='container mx-auto px-4 my-6 grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4'> {/* Adjusted grid cols and gap */} 
                {
                    loadingCategory ? (
                        new Array(10).fill(null).map((_, index) => { // Reduced loading items
                            return (
                                <div key={index + "loadingcategory"} className='bg-slate-100 rounded-lg p-2 h-24 md:h-28 flex flex-col items-center justify-center gap-2 shadow animate-pulse'>
                                    <div className='bg-slate-200 h-12 w-12 md:h-16 md:w-16 rounded-full'></div>
                                    <div className='bg-slate-200 h-3 w-16 rounded'></div>
                                </div>
                            )
                        })
                    ) : (
                        categoryData.map((cat) => {
                            return (
                                <div 
                                    key={cat._id + "displayCategory"} 
                                    className='w-full h-full flex flex-col items-center justify-start p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors group'
                                    onClick={() => handleRedirectProductListpage(cat._id, cat.name)}
                                >
                                    <div className='w-16 h-16 md:w-20 md:h-20 p-1 bg-white rounded-full shadow-sm flex items-center justify-center overflow-hidden mb-1
'>
                                        <img
                                            src={cat.image}
                                            alt={cat.name}
                                            className='w-full h-full object-contain group-hover:scale-110 transition-transform duration-200'
                                        />
                                    </div>
                                    <p className='text-xs md:text-sm text-center font-medium text-slate-600 capitalize'>{cat.name}</p>
                                </div>
                            )
                        })
                    )
                }
            </div>

            {/* Recommended Products Section - Only render if there are products */}
            {
                recommendedProducts.length > 0 && (
                    <RecommendedProducts 
                        title={recommendationTitle}
                        products={recommendedProducts} 
                        loading={loadingRecommendations} 
                    />
                )
            }

            {/* Existing Category-wise Product Displays */}
            {
                categoryData?.map((c) => {
                    return (
                        <CategoryWiseProductDisplay
                            key={c?._id + "CategorywiseProduct"}
                            id={c?._id}
                            name={c?.name}
                        />
                    )
                })
            }
        </section>
    )
}

export default Home;

