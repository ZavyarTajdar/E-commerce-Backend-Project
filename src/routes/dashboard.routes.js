import { Router } from 'express';import { Router } from "express";
import {
    getDashboardStats, 
    getProductList, 
    getOrdersList
} from "../controllers/dashboard.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT, isAdmin); 

router.get("/dashboard/stats", getDashboardStats);
router.get("/dashboard/products", getProductList);
router.get("/dashboard/orders", getOrdersList);

export default router;
