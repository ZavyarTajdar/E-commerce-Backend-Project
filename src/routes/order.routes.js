import { Router } from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
} from "../controllers/order.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT)

router.post("/createOrder" , createOrder)
router.get("/UserOrder" , getUserOrders)
router.get("/CheckOrder/:orderId" , getOrderById)


export default router;
