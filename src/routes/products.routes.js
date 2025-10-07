import { Router } from "express";
import {
    getAllProducts,
    getSingleProduct,
    searchProducts,
    filterProducts,
    rateProduct,
    getFeaturedProducts
} from "../controllers/product.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/products", getAllProducts);
router.get("/products/:id", getSingleProduct);
router.get("/products/search", searchProducts);
router.get("/products/filter", filterProducts);
router.get("/products/featured", getFeaturedProducts);

// Protected (user must be logged in)
router.post("/products/:productId/rate", verifyJWT, rateProduct);

export default router;
