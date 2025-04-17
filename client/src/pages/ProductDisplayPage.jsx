import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import SummaryApi from '../common/SummaryApi'
import Axios from '../utils/Axios'
import AxiosToastError from '../utils/AxiosToastError'
import { FaAngleRight, FaAngleLeft, FaClock, FaLeaf, FaTruck, FaStar } from "react-icons/fa";
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import Divider from '../components/Divider'
import image1 from '../assets/minute_delivery.png'
import image2 from '../assets/Best_Prices_Offers.png'
import image3 from '../assets/Wide_Assortment.png'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import AddToCartButton from '../components/AddToCartButton'

const ProductDisplayPage = () => {
  const params = useParams()
  let productId = params?.product?.split("-")?.slice(-1)[0]
  const [data, setData] = useState({
    name: "",
    image: []
  })
  const [image, setImage] = useState(0)
  const [loading, setLoading] = useState(false)
  const imageContainer = useRef()

  const fetchProductDetails = async() => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductDetails,
        data: {
          productId: productId 
        }
      })

      const { data: responseData } = response

      if(responseData.success){
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProductDetails()
  }, [params])
  
  const handleScrollRight = () => {
    imageContainer.current.scrollLeft += 100
  }
  
  const handleScrollLeft = () => {
    imageContainer.current.scrollLeft -= 100
  }
  
  return (
    <section className='bg-gradient-to-br from-green-50 to-blue-50 min-h-screen'>
      <div className='container mx-auto p-4 lg:py-12 lg:px-6'>
        {/* Main Product Card */}
        <div className='bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100'>
          <div className='grid lg:grid-cols-2 gap-0'>
            {/* Product Image Section */}
            <div className='bg-gradient-to-br from-green-600/5 to-blue-500/5 p-6 lg:p-8'>
              {loading ? (
                <div className='animate-pulse bg-white/50 rounded-xl lg:min-h-[50vh] min-h-64 w-full'></div>
              ) : (
                <div className='bg-white rounded-xl lg:min-h-[50vh] min-h-64 flex items-center justify-center border-2 border-green-100 shadow-sm transition-all duration-300 hover:shadow-md'>
                  <img
                    src={data.image[image]}
                    alt={data.name}
                    className='w-full h-full object-contain p-6'
                  /> 
                </div>
              )}
              
              {/* Image Navigation Dots */}
              <div className='flex items-center justify-center gap-3 my-5'>
                {data.image.map((img, index) => (
                  <button 
                    key={img + index + "point"} 
                    onClick={() => setImage(index)}
                    className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 ${
                      index === image 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 scale-125 shadow-md' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Thumbnail Slider */}
              <div className='relative mt-4'>
                <div 
                  ref={imageContainer} 
                  className='flex gap-4 z-10 relative w-full overflow-x-auto py-3 px-1 scrollbar-none scroll-smooth'
                >
                  {data.image.map((img, index) => (
                    <div 
                      className={`w-20 h-20 min-h-20 min-w-20 cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                        index === image 
                          ? 'ring-2 ring-green-500 ring-offset-2 shadow-lg transform scale-105' 
                          : 'opacity-80 hover:opacity-100 hover:shadow-md'
                      }`} 
                      key={img + index}
                      onClick={() => setImage(index)}
                    >
                      <img
                        src={img}
                        alt={`${data.name} thumbnail ${index + 1}`}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  ))}
                </div>
                
                {/* Scroll Buttons - Desktop Only */}
                {data.image.length > 4 && (
                  <div className='w-full h-full hidden lg:flex justify-between absolute top-0 items-center pointer-events-none'>
                    <button 
                      onClick={handleScrollLeft} 
                      className='z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-green-100 transition-colors pointer-events-auto'
                      aria-label="Scroll thumbnails left"
                    >
                      <FaAngleLeft className="text-green-700"/>
                    </button>
                    <button 
                      onClick={handleScrollRight} 
                      className='z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-green-100 transition-colors pointer-events-auto'
                      aria-label="Scroll thumbnails right"
                    >
                      <FaAngleRight className="text-green-700"/>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details Section */}
            <div className='p-6 lg:p-8 flex flex-col'>
              {/* Delivery Badge */}
              <div className='flex items-center gap-2 mb-4'>
                <span className='bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm'>
                  <FaClock className="text-xs" /> 10 Min Delivery
                </span>
                <span className='bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm'>
                  <FaLeaf className="text-xs" /> Fresh Quality
                </span>
              </div>
              
              {/* Product Title and Unit */}
              <h1 className='text-xl lg:text-3xl font-bold text-gray-800 mb-2 tracking-tight'>{data.name}</h1>
              <p className='text-emerald-700 font-medium mb-6'>{data.unit}</p>
              
              {/* Price Section */}
              <div className='bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl mb-6 border border-green-100 shadow-sm'>
                <p className='text-sm uppercase tracking-wider text-green-800 font-semibold mb-3'>Current Price</p>
                <div className='flex items-center flex-wrap gap-3'>
                  <div className='bg-white border-2 border-green-200 px-5 py-3 rounded-lg shadow-sm'>
                    <p className='font-bold text-xl lg:text-2xl text-gray-800 bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent'>
                      {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))}
                    </p>
                  </div>
                  
                  {data.discount > 0 && (
                    <>
                      <p className='text-gray-500 line-through'>{DisplayPriceInRupees(data.price)}</p>
                      <span className='bg-gradient-to-r from-pink-500 to-rose-500 text-white text-sm px-4 py-1 rounded-full font-bold shadow-sm'>
                        {data.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>
              
              {/* Availability Badge */}
              {data.stock > 0 && (
                <div className='mb-4 flex items-center gap-2'>
                  <span className='inline-flex items-center bg-emerald-100 text-emerald-800 text-sm px-3 py-1 rounded-full'>
                    <span className='bg-emerald-500 w-2 h-2 rounded-full mr-2'></span>
                    In Stock
                  </span>
                  <span className='text-gray-500 text-sm'>{data.stock > 10 ? 'Many available' : `Only ${data.stock} left`}</span>
                </div>
              )}
              
              {/* Add to Cart Button */}
              {data.stock === 0 ? (
                <div className='mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-xl text-center shadow-sm'>
                  <p className='font-medium'>Currently Out of Stock</p>
                  <p className='text-sm mt-1 text-red-600'>We're working to restock this item soon!</p>
                </div>
              ) : (
                <div className='mb-6 transform hover:scale-[1.01] transition-transform'>
                  <AddToCartButton data={data} />
                </div>
              )}
              
              {/* Delivery Info */}
              <div className='flex items-center gap-3 mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100'>
                <div className='bg-blue-100 p-2 rounded-full'>
                  <FaTruck className="text-blue-700" />
                </div>
                <div>
                  <p className='font-medium text-blue-900'>Delivery Information</p>
                  <p className='text-sm text-blue-700'>Free delivery for orders above ₹499</p>
                </div>
              </div>
              
              {/* Product Description - Desktop */}
              <div className='mb-6 border-t border-dashed border-green-200 pt-6 hidden lg:block'>
                <div className='mb-4'>
                  <h2 className='font-semibold text-emerald-800 mb-3 flex items-center gap-2'>
                    <span className='bg-emerald-100 p-1 rounded-full'>
                      <FaLeaf className="text-emerald-600 text-xs" />
                    </span>
                    Product Description
                  </h2>
                  <p className='text-gray-700'>{data.description}</p>
                </div>
                
                {data?.more_details && Object.keys(data.more_details).length > 0 && (
                  <div className='grid gap-4 mt-5 bg-gray-50 p-4 rounded-xl'>
                    <h3 className='font-semibold text-gray-700'>Additional Details</h3>
                    {Object.keys(data.more_details).map((element, index) => (
                      <div key={element + index} className='border-b border-gray-100 pb-2 last:border-0 last:pb-0'>
                        <h4 className='font-medium text-gray-800 mb-1'>{element}</h4>
                        <p className='text-gray-600'>{data.more_details[element]}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Why Shop Section */}
          <div className='bg-gradient-to-r from-emerald-50 to-blue-50 p-8 border-t border-green-100'>
            <h2 className='text-xl font-bold text-gray-800 mb-6 text-center'>
              <span className='bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent'>
                Why shop from QuickPick?
              </span>
            </h2>
            
            <div className='grid md:grid-cols-3 gap-6'>
              <div className='bg-white p-5 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300'>
                <div className='bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto'>
                  <img
                    src={image1}
                    alt='Superfast Delivery'
                    className='w-12 h-12'
                  />
                </div>
                <div className='text-center'>
                  <h3 className='font-bold text-gray-800 mb-2'>Superfast Delivery</h3>
                  <p className='text-gray-600'>Get your order delivered to your doorstep at the earliest from dark stores near you.</p>
                </div>
              </div>
              
              <div className='bg-white p-5 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300'>
                <div className='bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto'>
                  <img
                    src={image2}
                    alt='Best Prices & Offers'
                    className='w-12 h-12'
                  />
                </div>
                <div className='text-center'>
                  <h3 className='font-bold text-gray-800 mb-2'>Best Prices & Offers</h3>
                  <p className='text-gray-600'>Best price destination with offers directly from the manufacturers.</p>
                </div>
              </div>
              
              <div className='bg-white p-5 rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow transform hover:-translate-y-1 duration-300'>
                <div className='bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 mx-auto'>
                  <img
                    src={image3}
                    alt='Wide Assortment'
                    className='w-12 h-12'
                  />
                </div>
                <div className='text-center'>
                  <h3 className='font-bold text-gray-800 mb-2'>Wide Assortment</h3>
                  <p className='text-gray-600'>Choose from 5000+ products across food, personal care, household & other categories.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Description - Mobile */}
          <div className='p-6 border-t border-green-100 lg:hidden bg-white'>
            <h2 className='text-lg font-bold text-gray-800 mb-4 flex items-center gap-2'>
              <span className='text-green-600'><FaLeaf /></span>
              Product Details
            </h2>
            
            <div className='mb-5 bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-green-800 mb-2'>Description</h3>
              <p className='text-gray-700'>{data.description}</p>
            </div>
            
            <div className='mb-5 bg-gray-50 p-4 rounded-lg'>
              <h3 className='font-semibold text-green-800 mb-2'>Unit</h3>
              <p className='text-gray-700'>{data.unit}</p>
            </div>
            
            {data?.more_details && Object.keys(data.more_details).length > 0 && (
              <div className='grid gap-4'>
                {Object.keys(data.more_details).map((element, index) => (
                  <div key={element + index} className='bg-gray-50 p-4 rounded-lg'>
                    <h3 className='font-semibold text-green-800 mb-2'>{element}</h3>
                    <p className='text-gray-700'>{data.more_details[element]}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProductDisplayPage