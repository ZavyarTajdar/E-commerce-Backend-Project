import { Router } from "express";
import { createProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// All routes here are protected
router.use(verifyJWT);
router.use(isAdmin);

// Admin: create product
router.post(
  "/publish-product",
  upload.fields([
    { name: "pictures", maxCount: 5 },
    { name: "video", maxCount: 1 }
  ]),
  createProduct
);

// Admin: update product
router.put("/products/:id", updateProduct);

// Admin: delete product
router.delete("/products/:id", deleteProduct);

export default router;
