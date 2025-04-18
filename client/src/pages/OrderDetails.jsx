// frontend/src/components/admin/OrderDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import Sidebar from './Sidebar';

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        };
        const { data } = await axios.get(`/api/order/${id}`, config);
        setOrder(data.order);
        setStatus(data.order.status);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error.response);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const updateOrderStatus = async () => {
    try {
      setUpdating(true);
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      };
      
      await axios.put(
        `/api/admin/order/${id}`,
        { status },
        config
      );
      
      // Update the local order object
      setOrder({ ...order, status });
      setUpdating(false);
      
      alert('Order status updated successfully');
    } catch (error) {
      console.error('Error updating order status:', error.response);
      setUpdating(false);
      alert('Failed to update order status');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* <div className="col-md-2">
          <Sidebar />
        </div> */}

        <div className="col-md-10">
          <h1 className="my-4">Order Details</h1>
          
          {loading ? (
            <p>Loading...</p>
          ) : order ? (
            <div className="row">
              <div className="col-md-8">
                <div className="card mb-4">
                  <div className="card-header">
                    <h4>Order #{order.orderId}</h4>
                  </div>
                  <div className="card-body">
                    <div className="mb-3">
                      <h5>Order Information</h5>
                      <p><strong>Order ID:</strong> {order.orderId}</p>
                      <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                      <p><strong>Payment ID:</strong> {order.paymentId || 'N/A'}</p>
                      <p><strong>Payment Status:</strong> {order.payment_status || 'N/A'}</p>
                    </div>
                    
                    <div className="mb-3">
                      <h5>Payment</h5>
                      <p><strong>Subtotal:</strong> ${order.subTotalAmt.toFixed(2)}</p>
                      <p><strong>Total Amount:</strong> ${order.totalAmt.toFixed(2)}</p>
                    </div>

                    <div className="mb-3">
                      <h5>Order Status</h5>
                      <div className="form-group d-flex align-items-center">
                        <select
                          className="form-control col-md-6"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="ordered">Ordered</option>
                          <option value="picked up">Picked Up</option>
                          <option value="out for delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                        <button
                          className="btn btn-primary ml-3"
                          onClick={updateOrderStatus}
                          disabled={updating || status === order.status}
                        >
                          {updating ? 'Updating...' : 'Update Status'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h4>Product Details</h4>
                  </div>
                  <div className="card-body">
                    <div className="d-flex mb-3 align-items-center">
                      {order.product_details?.image && order.product_details.image.length > 0 && (
                        <img 
                          src={order.product_details.image[0]} 
                          alt={order.product_details.name} 
                          height="80" 
                          width="80"
                          className="mr-3"
                        />
                      )}
                      <div>
                        <h6>{order.product_details?.name || 'Product Not Available'}</h6>
                        <p>Total: ${order.totalAmt.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p>Order not found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;