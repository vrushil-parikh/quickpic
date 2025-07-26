import React from 'react';
import { useSelector } from 'react-redux';
import NoData from '../components/NoData';
import { Link } from 'react-router-dom';

const MyOrders = () => {
  const orders = useSelector(state => state.orders.order);

  return (
    <section className='p-4'>
      <div className='bg-white shadow-md p-4 mb-4'>
        <h1 className='text-xl font-semibold'>My Orders</h1>
      </div>

      {!orders?.length ? (
        <NoData />
      ) : (
        <div className='grid gap-4'>
          {orders.map((order, index) => (
            <div key={order._id + index} className='bg-white rounded-lg shadow p-4'>
              <div className='mb-2'>
                <h3 className='text-sm text-gray-600'>Order ID: {order.orderId}</h3>
                <p className='text-xs text-gray-500'>
                  Placed On: {new Date(order.createdAt).toLocaleString()}
                </p>
                <p className='text-sm font-medium text-black'>Status: {order.status}</p>
                <p className='text-sm'>Payment: {order.payment_status}</p>
              </div>

              <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                {order.products.map((item, idx) => (
                  <div key={idx} className='flex items-center gap-3'>
                    <img
                      src={item.product_details?.image?.[0]}
                      alt={item.product_details?.name}
                      className='w-16 h-16 object-cover rounded'
                    />
                    <div>
                      <p className='text-sm font-semibold'>{item.product_details?.name}</p>
                      <p className='text-xs text-gray-600'>Qty: {item.quantity}</p>
                      <p className='text-xs text-gray-600'>Price: ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='mt-4 flex justify-between items-center'>
                <p className='font-semibold'>Total: ₹{order.totalAmt}</p>
                
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyOrders;
