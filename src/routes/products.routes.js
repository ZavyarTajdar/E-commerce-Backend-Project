import { Router } from "express";
import {
    createProduct
} from "../controllers/product.controller.js";
const router = Router();

// Public can view products
router.get("/products", getAllProducts);
router.get("/products/:id", getSingleProduct);


export default router;