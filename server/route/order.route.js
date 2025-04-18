import { Router } from 'express'
import auth from '../middleware/auth.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe } from '../controllers/order.controller.js'
import { updateOrderStatusController } from '../controllers/order.controller.js'
import { deleteOrder, getAllOrders, getOrderDetails, updateOrderStatus } from '../controllers/adminOrderController.js'
import { admin } from '../middleware/Admin.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.get('/orders',auth,admin,getAllOrders);
orderRouter.get('/order/:id',auth,getOrderDetails);
orderRouter.put('/order/:id',auth, updateOrderStatus);
orderRouter.delete('/order/:id',auth,deleteOrder);

export default orderRouter