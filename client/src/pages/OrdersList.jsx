import React, { useEffect, useState } from 'react'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import { Link } from 'react-router-dom'
import AxiosToastError from '../utils/AxiosToastError'
import Loading from '../components/Loading'
import { useSelector } from 'react-redux'
import CardOrder from '../components/CardOrder'

const OrdersListPage = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalAmount, setTotalAmount] = useState(0)
  const [orderFilter, setOrderFilter] = useState('all')

  const user = useSelector(state => state.user)

  const fetchOrdersData = async () => {
    try {
      setLoading(true)
      const response = await Axios({
        ...SummaryApi.getOrderList,
        data: {
          userId: user?._id,
          // remove pagination params to load all orders at once
          status: orderFilter !== 'all' ? orderFilter : undefined
        }
      })

      const { data: responseData } = response

      if (responseData.success) {
        setOrders(responseData.orders)
        setTotalAmount(responseData.totalAmount)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?._id) {
      fetchOrdersData()
    }
  }, [orderFilter, user])

  const filterOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'ordered', label: 'Ordered' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  return (
    <section className='sticky top-24 lg:top-20'>
      <div className='container mx-auto px-4 py-6'>
        <div className='bg-white shadow-md p-4 z-10 mb-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-semibold'>My Orders</h2>
            <div className='text-right'>
              <p className='text-sm text-gray-500'>Total Amount</p>
              <p className='font-semibold text-lg'>₹{totalAmount}</p>
            </div>
          </div>

          {/* Filter Controls */}
          <div className='mt-4 flex flex-wrap gap-2'>
            {filterOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setOrderFilter(option.value)}
                className={`px-4 py-2 rounded-md text-sm ${
                  orderFilter === option.value
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className='min-h-[80vh] bg-gray-50 rounded-lg shadow'>
          {loading ? (
            <Loading />
          ) : orders.length > 0 ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 p-4'>
              {orders.map(order => (
                <CardOrder
                  data={order}
                  key={order._id}
                />
              ))}
            </div>
          ) : (
            <div className='flex flex-col items-center justify-center h-64'>
              <p className='text-gray-500 text-lg'>No orders found</p>
              <Link to='/' className='mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600'>
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default OrdersListPage
