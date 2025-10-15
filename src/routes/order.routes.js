import { Router } from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    getMonthlySalesAnalytics,
} from "../controllers/order.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/create", createOrder);
router.get("/my-orders", getUserOrders);
router.get("/:orderId", getOrderById);
router.patch("/:orderId/cancel", cancelOrder);

router.get("/", isAdmin, getAllOrders);
router.patch("/:orderId/status", isAdmin, updateOrderStatus);
router.get("/analytics/monthly", isAdmin, getMonthlySalesAnalytics);

export default router;
