import React, { useEffect, useRef, useState } from 'react'
import { Link, } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import CardLoading from './CardLoading'
import CardProduct from './CardProduct'
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6"
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'

const CategoryWiseProductDisplay = ({ id, name }) => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const containerRef = useRef()
    const subCategoryData = useSelector(state => state.product.allSubCategory)
    const loadingCardNumber = new Array(6).fill(null)

    const fetchCategoryWiseProduct = async () => {
        try {
            setLoading(true)
            const response = await Axios({
                ...SummaryApi.getProductByCategory,
                data: {
                    id: id
                }
            })

            const { data: responseData } = response

            if (responseData.success) {
                setData(responseData.data)
            }
        } catch (error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategoryWiseProduct()
    }, [])

    const handleScrollRight = () => {
        containerRef.current.scrollLeft += 200
    }

    const handleScrollLeft = () => {
        containerRef.current.scrollLeft -= 200
    }

    const handleRedirectProductListpage = () => {
        const subcategory = subCategoryData.find(sub => {
            const filterData = sub.category.some(c => {
                return c._id == id
            })

            return filterData ? true : null
        })
        const url = `/${valideURLConvert(name)}-${id}/${valideURLConvert(subcategory?.name)}-${subcategory?._id}`

        return url
    }

    const redirectURL = handleRedirectProductListpage()
    
    return (
        <div className="py-4 bg-gray-50 my-4 rounded-lg">
            <div className='container mx-auto px-4 md:px-6 flex items-center justify-between gap-4 mb-4'>
                <div className="flex items-center">
                    <div className="w-1 bg-green-600 h-6 rounded mr-3"></div>
                    <h3 className='font-semibold text-lg md:text-xl text-gray-800'>{name}</h3>
                </div>
                <Link to={redirectURL} className='text-green-600 hover:text-green-500 text-sm md:text-base font-medium flex items-center'>
                    See All
                    <FaAngleRight className="ml-1" />
                </Link>
            </div>
            
            <div className='relative'>
                <div className='flex gap-4 md:gap-5 lg:gap-6 container mx-auto px-4 md:px-6 overflow-x-scroll scrollbar-none scroll-smooth py-2' 
                    ref={containerRef}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {loading &&
                        loadingCardNumber.map((_, index) => {
                            return (
                                <CardLoading key={"CategorywiseProductDisplay123" + index} />
                            )
                        })
                    }

                    {
                        data.map((p, index) => {
                            return (
                                <CardProduct
                                    data={p}
                                    key={p._id + "CategorywiseProductDisplay" + index}
                                />
                            )
                        })
                    }
                </div>
                
                {data.length > 0 && (
                    <div className='absolute top-1/2 transform -translate-y-1/2 left-0 right-0 container mx-auto px-4 hidden lg:flex justify-between pointer-events-none'>
                        <button 
                            onClick={handleScrollLeft} 
                            className='z-10 pointer-events-auto bg-white hover:bg-gray-50 shadow-md text-gray-700 p-2.5 rounded-full transition-all duration-300 flex items-center justify-center w-10 h-10'
                        >
                            <FaAngleLeft size={18} />
                        </button>
                        <button 
                            onClick={handleScrollRight} 
                            className='z-10 pointer-events-auto bg-white hover:bg-gray-50 shadow-md text-gray-700 p-2.5 rounded-full transition-all duration-300 flex items-center justify-center w-10 h-10'
                        >
                            <FaAngleRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default CategoryWiseProductDisplay