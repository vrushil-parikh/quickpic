// backend/controllers/adminOrderController.js (or wherever you have your controllers)
import OrderModel from "../models/order.model.js";

// Get all orders - Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate('userId', 'name email')
      .populate('productId', 'name price')
      .populate('delivery_address');

      console.log(`Found ${orders.length} orders`);

    let totalAmount = 0;
    orders.forEach(order => {
      totalAmount += order.totalAmt;
    });

    res.status(200).json({
      success: true,
      totalAmount,
      orders
    });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};

// Get single order - Admin
export const getOrderDetails = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('productId', 'name price')
      .populate('delivery_address');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID"
      });
    }

    res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message
    });
  }
};

// Update order status - Admin
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID"
      });
    }

    // Check if status is valid according to enum values
    const validStatuses = ['ordered', 'picked up', 'out for delivery', 'delivered'];
    if (!validStatuses.includes(req.body.status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    // Update the status
    order.status = req.body.status;
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating order status",
      error: error.message
    });
  }
};

// Delete order - Admin (optional)
export const deleteOrder = async (req, res) => {
  try {
    const order = await OrderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found with this ID"
      });
    }

    await OrderModel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting order",
      error: error.message
    });
  }
};