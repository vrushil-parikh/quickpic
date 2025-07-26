import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import { useSelector } from 'react-redux';

const CardOrder = ({ data, onStatusChange }) => {
  const user = useSelector((state) => state.user);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;

    try {
      const response = await Axios({
        ...SummaryApi.updateOrderStatus(data._id),
        data: { status: newStatus }
      });

      if (response.data.success) {
        toast.success('Order status updated');
        onStatusChange?.();
      } else {
        toast.error('Failed to update status');
      }
    } catch (err) {
      toast.error('Error updating order status');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-2">
        <h3 className="text-lg font-semibold">
          Order ID: <span className="text-gray-600">{data.orderId}</span>
        </h3>
        <p className="text-sm text-gray-500">
          Placed On: {new Date(data.createdAt).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500">
          Status: <span className="font-medium text-black capitalize">{data.status}</span>
        </p>
      </div>

      {/* Product List */}
      <div className="my-4 space-y-2">
        {data.products?.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center border-b pb-1">
            <span className="text-sm text-gray-800">
              {item.product_details?.name || 'Unknown Product'}
            </span>
            <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <p className="font-semibold">Total: ₹{data.totalAmt}</p>
        <Link
          to={`/dashboard/order/${data.orderId}`}
          className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
        >
          View Details
        </Link>
      </div>

      {/* Admin Controls */}
      {user?.role === 'ADMIN' && (
        <div className="mt-4">
          <label htmlFor="status" className="text-sm font-medium text-gray-700">
            Update Status:
          </label>
          <select
            id="status"
            value={data.status}
            onChange={handleStatusChange}
            className="ml-2 p-1 border rounded"
          >
            <option value="ordered">Ordered</option>
            <option value="picked up">Picked Up</option>
            <option value="out for delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default CardOrder;
