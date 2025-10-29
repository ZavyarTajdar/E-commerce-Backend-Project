import { Router } from "express";
import {
    createPayment,
    getUserPayments,
    getPaymentById,
    updatePaymentStatus,
    getAllPayments
} from "../controllers/payment.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/create/:orderId", createPayment);
router.get("/user", getUserPayments);
router.get("/:paymentId", getPaymentById);
router.put("/:paymentId/status", isAdmin, updatePaymentStatus);
router.get("/", isAdmin, getAllPayments);

export default router;
