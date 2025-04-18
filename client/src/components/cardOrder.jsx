import React from 'react'
import { Link } from 'react-router-dom'

const CardOrder = ({ data }) => {
  const product = data?.product_details
  const productName = product?.name || "Product"
  const productImage = product?.image?.[0]

  return (
    <div className='bg-white rounded-lg shadow p-4'>
      <div className='mb-2'>
        <h3 className='text-lg font-semibold'>Order ID: <span className='text-gray-600'>{data.orderId}</span></h3>
        <p className='text-sm text-gray-500'>Placed On: {new Date(data.createdAt).toLocaleString()}</p>
        <p className='text-sm text-gray-500'>Status: <span className='font-medium text-black'>{data.status}</span></p>
      </div>

      

      <div className='flex justify-between items-center mt-4'>
        <p className='font-semibold'>Total: ₹{data.totalAmt}</p>
        <Link
          to={`/dashboard/order/${data._id}`}
          className='text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded'
        >
          View Details
        </Link>
      </div>
    </div>
  )
}

export default CardOrder
