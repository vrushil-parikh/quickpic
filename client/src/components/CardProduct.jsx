import React from 'react'
import { DisplayPriceInRupees } from '../utils/DisplayPriceInRupees'
import { Link } from 'react-router-dom'
import { valideURLConvert } from '../utils/valideURLConvert'
import { pricewithDiscount } from '../utils/PriceWithDiscount'
import { useState } from 'react'
import AddToCartButton from './AddToCartButton'

const CardProduct = ({data}) => {
    const url = `/product/${valideURLConvert(data.name)}-${data._id}`
    const [loading, setLoading] = useState(false)
  
    return (
        <Link 
            to={url} 
            className='relative border border-gray-100 py-3 lg:p-4 flex flex-col w-64 h-72 rounded-lg hover:shadow-md transition-shadow duration-300 cursor-pointer bg-white'
        >
            {/* Image container with fixed height */}
            <div className='h-28 w-full rounded overflow-hidden flex items-center justify-center mb-2'>
                <img 
                    src={data.image[0]}
                    alt={data.name}
                    className='max-h-full max-w-full object-contain hover:scale-110 transition-transform duration-500'
                />
            </div>
            
            {/* Badges row */}
            <div className='flex items-center gap-1.5 px-2 lg:px-0'>
                <div className='rounded-full text-xs py-0.5 px-2 text-green-600 bg-green-50 font-medium'>
                    10 min 
                </div>
                {Boolean(data.discount) && (
                    <div className='rounded-full text-xs py-0.5 px-2 text-green-600 bg-green-50 font-medium'>
                        {data.discount}% off
                    </div>
                )}
            </div>
            
            {/* Product name - fixed height with line clamp */}
            <div className='px-2 lg:px-0 font-medium text-sm lg:text-base line-clamp-2 h-12 text-gray-800 mt-1'>
                {data.name}
            </div>
            
            {/* Unit */}
            <div className='px-2 lg:px-0 text-xs lg:text-sm text-gray-500'>
                {data.unit} 
            </div>

            {/* Price and add to cart - pushed to bottom with margin-top auto */}
            <div className='px-2 lg:px-0 flex items-center justify-between gap-1 lg:gap-3 mt-auto'>
                <div className='flex items-center gap-2'>
                    <div className='font-semibold text-gray-900'>
                        {DisplayPriceInRupees(pricewithDiscount(data.price, data.discount))} 
                    </div>
                    {Boolean(data.discount) && (
                        <span className='text-xs text-gray-400 line-through'>
                            {DisplayPriceInRupees(data.price)}
                        </span>
                    )}
                </div>
                <div>
                    {data.stock === 0 ? (
                        <p className='text-red-500 text-xs font-medium bg-red-50 px-2 py-1 rounded'>Out of stock</p>
                    ) : (
                        <AddToCartButton data={data} />
                    )}
                </div>
            </div>
        </Link>
    )
}

export default CardProduct