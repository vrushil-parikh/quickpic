import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "product"
  },
  product_details: {
    name: String,
    image: [String]
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  orderId: {
    type: String,
    required: true,
    unique: true
  },
  products: [productSchema],
  paymentId: {
    type: String,
    default: ""
  },
  payment_status: {
    type: String,
    default: ""
  },
  delivery_address: {
    type: mongoose.Schema.ObjectId,
    ref: 'address'
  },
  subTotalAmt: {
    type: Number,
    default: 0
  },
  totalAmt: {
    type: Number,
    default: 0
  },
  invoice_receipt: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ['ordered', 'picked up', 'out for delivery', 'delivered'],
    default: 'ordered',
    required: true
  },
}, {
  timestamps: true
});

const OrderModel = mongoose.model('order', orderSchema);
export default OrderModel;
