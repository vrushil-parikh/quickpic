import Stripe from "../config/stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

export async function updateOrderStatusController(request, response) {
    try {
      const { orderId } = request.params;
      const { status } = request.body;
      
      // Validate status value
      const validStatuses = ['ordered', 'picked up', 'out for delivery', 'delivered'];
      if (!validStatuses.includes(status)) {
        return response.status(400).json({ 
          message: 'Invalid status value',
          error: true,
          success: false
        });
      }
      
      // Find order and update status
      const order = await OrderModel.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      );
      
      if (!order) {
        return response.status(404).json({
          message: 'Order not found',
          error: true,
          success: false
        });
      }
      
      return response.status(200).json({
        message: 'Order status updated successfully',
        data: order,
        error: false,
        success: true
      });
      
    } catch (error) {
      return response.status(500).json({
        message: error.message || error,
        error: true,
        success: false
      });
    }
  }
  export async function CashOnDeliveryOrderController(req, res) {
    try {
      const userId = req.userId;
      const { list_items, totalAmt, addressId, subTotalAmt } = req.body;
  
      const payload = {
        userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        products: list_items.map(el => ({
          productId: el.productId._id,
          product_details: {
            name: el.productId.name,
            image: el.productId.image
          },
          quantity: el.quantity,
          price: pricewithDiscount(el.productId.price, el.productId.discount)
        })),
        paymentId: "",
        payment_status: "CASH ON DELIVERY",
        delivery_address: addressId,
        subTotalAmt,
        totalAmt
      };
  
      const createdOrder = await OrderModel.create(payload);
  
      await CartProductModel.deleteMany({ userId });
      await UserModel.updateOne({ _id: userId }, { shopping_cart: [] });
  
      return res.json({
        message: "Order placed successfully",
        success: true,
        data: createdOrder
      });
  
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        error: true
      });
    }
  }
  

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await Stripe.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


const getOrderProductItems = async ({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status
  }) => {
    const orderPayload = {
      userId,
      orderId: `ORD-${new mongoose.Types.ObjectId()}`,
      products: [],
      paymentId,
      payment_status,
      delivery_address: addressId,
      subTotalAmt: 0,
      totalAmt: 0
    };
  
    for (const item of lineItems.data) {
      const product = await Stripe.products.retrieve(item.price.product);
      const price = Number(item.amount_total / 100);
  
      orderPayload.products.push({
        productId: product.metadata.productId,
        product_details: {
          name: product.name,
          image: product.images
        },
        quantity: item.quantity,
        price
      });
  
      orderPayload.subTotalAmt += price;
      orderPayload.totalAmt += price;
    }
  
    return orderPayload;
  };
  
//http://localhost:8080/api/order/webhook
export async function webhookStripe(req, res) {
    const event = req.body;
  
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const lineItems = await Stripe.checkout.sessions.listLineItems(session.id);
        const userId = session.metadata.userId;
  
        const orderPayload = await getOrderProductItems({
          lineItems,
          userId,
          addressId: session.metadata.addressId,
          paymentId: session.payment_intent,
          payment_status: session.payment_status
        });
  
        const order = await OrderModel.create(orderPayload);
  
        if (order) {
          await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
          await CartProductModel.deleteMany({ userId });
        }
  
        break;
  
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
  
    res.json({ received: true });
  }
  
  export async function getOrderDetailsController(req, res) {
    try {
      const userId = req.userId;
  
      const orderList = await OrderModel.find({ userId })
        .sort({ createdAt: -1 })
        .populate('products.productId')
        .populate('delivery_address');
  
      return res.json({
        message: "Order list retrieved",
        success: true,
        data: orderList
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        error: true
      });
    }
  }
  