import { Router } from "express";
import { 
  createProduct, 
  updateProduct, 
  deleteProduct,
  toggleIsFeatured,
  toggleAvailability,
  updateProductStock,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(isAdmin);

router.post(
  "/publish-product",
  upload.fields([
    { name: "pictures", maxCount: 5 },
    { name: "video", maxCount: 1 }
  ]),
  createProduct
);

router.put("/products/:id", updateProduct);

router.delete("/products/:id", deleteProduct);

router.patch("/products/:id/featured", toggleIsFeatured);

router.patch("/products/:id/availability", toggleAvailability);

router.patch("/products/:id/stock", updateProductStock);

export default router;
