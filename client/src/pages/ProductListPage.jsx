import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link, useParams } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import CardProduct from '../components/CardProduct'
import { useSelector } from 'react-redux'
import { valideURLConvert } from '../utils/valideURLConvert'
import { FiFilter, FiChevronRight } from 'react-icons/fi'
import { FaLeaf } from 'react-icons/fa6'

// Feature Flag Configuration
const FEATURES = {
  NEW_DESIGN: true, // Toggle this to switch between old and new design
  ANIMATIONS: true, // Enable/disable animations
  CATEGORY_ICONS: true, // Show icons with category items
  STICKY_FILTERS: true, // Keep filters sticky on scroll
}

const ProductListPage = () => {
  const [data, setData] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [totalPage, setTotalPage] = useState(1)
  const params = useParams()
  const AllSubCategory = useSelector(state => state.product.allSubCategory)
  const [DisplaySubCatory, setDisplaySubCategory] = useState([])
  
  const subCategory = params?.subCategory?.split("-")
  const subCategoryName = subCategory?.slice(0, subCategory?.length - 1)?.join(" ")
  const categoryId = params.category.split("-").slice(-1)[0]
  const subCategoryId = params.subCategory.split("-").slice(-1)[0]
  
  const fetchProductdata = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId: categoryId,
          subCategoryId: subCategoryId,
          page: page,
          limit: 8,
        }
      })
      const { data: responseData } = response
      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data)
        } else {
          setData([...data, ...responseData.data])
        }
        setTotalPage(responseData.totalCount)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchProductdata()
  }, [params])
  
  useEffect(() => {
    const sub = AllSubCategory.filter(s => {
      const filterData = s.category.some(el => {
        return el._id == categoryId
      })
      return filterData ? filterData : null
    })
    setDisplaySubCategory(sub)
  }, [params, AllSubCategory])

  // Old Design Component
  const OldDesign = () => (
    <section className='sticky top-24 lg:top-20'>
      <div className='container sticky top-24  mx-auto grid grid-cols-[90px,1fr]  md:grid-cols-[200px,1fr] lg:grid-cols-[280px,1fr]'>
        {/**sub category **/}
        <div className=' min-h-[88vh] max-h-[88vh] overflow-y-scroll  grid gap-1 shadow-md scrollbarCustom bg-white py-2'>
          {
            DisplaySubCatory.map((s, index) => {
               const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
              return (
                <Link to={link} className={`w-full p-2 lg:flex items-center lg:w-full lg:h-16 box-border lg:gap-4 border-b 
                  hover:bg-green-100 cursor-pointer
                  ${subCategoryId === s._id ? "bg-green-100" : ""}
                `}
                >
                  <div className='w-fit max-w-28 mx-auto lg:mx-0 bg-white rounded  box-border' >
                    <img
                      src={s.image}
                      alt='subCategory'
                      className=' w-14 lg:h-14 lg:w-12 h-full object-scale-down'
                    />
                  </div>
                  <p className='-mt-6 lg:mt-0 text-xs text-center lg:text-left lg:text-base'>{s.name}</p>
                </Link>
              )
            })
          }
        </div>
        {/**Product **/}
        <div className='sticky top-20'>
          <div className='bg-white shadow-md p-4 z-10'>
            <h3 className='font-semibold'>{subCategoryName}</h3>
          </div>
          <div>
           <div className='min-h-[80vh] max-h-[80vh] overflow-y-auto relative'>
            <div className=' grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 p-4 gap-4 '>
                {
                  data.map((p, index) => {
                    return (
                      <CardProduct
                        data={p}
                        key={p._id + "productSubCategory" + index}
                      />
                    )
                  })
                }
              </div>
           </div>
            {
              loading && (
                <Loading />
              )
            }
          </div>
        </div>
      </div>
    </section>
  )
  
  // New Design Component
  const NewDesign = () => (
    <section className={`${FEATURES.STICKY_FILTERS ? 'sticky top-24 lg:top-20' : ''}`}>
      <div className='container mx-auto'>
        <div className='flex flex-col md:flex-row gap-6'>
          {/* Category Sidebar */}
          <div className={`md:w-1/4 lg:w-1/5 ${FEATURES.STICKY_FILTERS ? 'md:sticky md:top-24 md:self-start' : ''}`}>
            <div className='bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100'>
              <div className='p-4 border-b border-gray-100 flex items-center justify-between bg-green-50'>
                <div className='flex items-center gap-2'>
                  <FiFilter className='text-green-600' />
                  <h3 className='font-bold text-gray-800'>Categories</h3>
                </div>
                <span className='text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full'>
                  {DisplaySubCatory.length}
                </span>
              </div>
              
              <div className='max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-gray-50'>
                {DisplaySubCatory.map((s, index) => {
                  const link = `/${valideURLConvert(s?.category[0]?.name)}-${s?.category[0]?._id}/${valideURLConvert(s.name)}-${s._id}`
                  const isActive = subCategoryId === s._id;
                  
                  return (
                    <Link 
                      to={link} 
                      key={s._id + "subcategory"}
                      className={`block border-b border-gray-100 ${FEATURES.ANIMATIONS ? 'transition-all duration-200' : ''} ${
                        isActive 
                          ? 'bg-green-50 border-l-4 border-l-green-500' 
                          : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className='p-3 flex items-center gap-3'>
                        <div className='w-12 h-12 bg-white rounded-md flex items-center justify-center p-1 shadow-sm'>
                          <img
                            src={s.image}
                            alt={s.name}
                            className='w-10 h-10 object-contain'
                          />
                        </div>
                        <div className='flex-1'>
                          <p className={`${isActive ? 'font-medium text-green-700' : 'text-gray-700'}`}>
                            {s.name}
                          </p>
                        </div>
                        {FEATURES.CATEGORY_ICONS && (
                          <FiChevronRight className={`${isActive ? 'text-green-500' : 'text-gray-400'}`} />
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Products Area */}
          <div className='flex-1'>
            <div className='bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100'>
              <div className='flex items-center gap-2'>
                <div className='p-1.5 bg-green-100 rounded-md'>
                  <FaLeaf className='text-green-500' size={16} />
                </div>
                <h2 className='font-bold text-lg text-gray-800'>{subCategoryName}</h2>
              </div>
            </div>
            
            <div className='min-h-[60vh] bg-gray-50 rounded-lg p-4'>
              {data.length === 0 && !loading ? (
                <div className='flex items-center justify-center h-60'>
                  <p className='text-gray-500'>No products found in this category</p>
                </div>
              ) : (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6'>
                  {data.map((p, index) => (
                    <CardProduct
                      data={p}
                      key={p._id + "productSubCategory" + index}
                      featured={index === 0}
                    />
                  ))}
                </div>
              )}
              
              {loading && <Loading />}
              
              {/* Load More Section */}
              {data.length > 0 && data.length < totalPage && !loading && (
                <div className='mt-8 text-center'>
                  <button 
                    onClick={() => setPage(page + 1)} 
                    className={`px-6 py-2 bg-green-50 text-green-600 rounded-full font-medium ${
                      FEATURES.ANIMATIONS ? 'hover:bg-green-100 transition-all duration-300' : ''
                    }`}
                  >
                    Load More Products
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
  
  // Use the feature flag to determine which design to render
  return FEATURES.NEW_DESIGN ? <NewDesign /> : <OldDesign />
}

export default ProductListPage