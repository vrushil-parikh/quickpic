import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrderById = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        method: SummaryApi.getOrderDetailsById.method,
        url: SummaryApi.getOrderDetailsById.url(id),
      });
      setOrder(response.data?.order);
    } catch (err) {
      console.error("Error fetching order details:", err.response ? err.response.data : err.message);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderById();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Order Details</h1>

      {order && (
        <>
          <div className="space-y-2 mb-6">
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Total Amount:</strong> ₹{order.totalAmt}</p>
            <p><strong>Subtotal:</strong> ₹{order.subTotalAmt}</p>
          </div>

          {/* Shipping Info */}
          <div className="border-t pt-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">Shipping Information</h2>
            <p><strong>Address:</strong> {order.delivery_address?.address_line}</p>
            <p><strong>City:</strong> {order.delivery_address?.city}</p>
            <p><strong>Postal Code:</strong> {order.delivery_address?.pincode}</p>
            <p><strong>Mobile:</strong> {order.delivery_address?.mobile}</p>
            <p><strong>Country:</strong> {order.delivery_address?.country}</p>
          </div>

          {/* Payment Info */}
          <div className="border-t pt-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">Payment Information</h2>
            <p><strong>Payment ID:</strong> {order.paymentId || "N/A"}</p>
            <p><strong>Payment Status:</strong> {order.payment_status}</p>
          </div>

          {/* Ordered Products */}
          <div className="border-t pt-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            <div className="space-y-4">
              {order.products?.map((item, index) => (
                <div key={index} className="flex items-start gap-4 bg-gray-50 p-4 rounded">
                  <img
                    src={item.product_details?.image?.[0]}
                    alt={item.product_details?.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                  <div>
                    <p><strong>Name:</strong> {item.product_details?.name}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Price:</strong> ₹{item.price}</p>
                    <p><strong>Total:</strong> ₹{item.price * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default OrderDetails;
