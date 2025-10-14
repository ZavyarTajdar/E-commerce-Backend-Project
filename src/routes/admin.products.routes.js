import { Router } from "express";
import { 
  createProduct, 
  updateProduct, 
  SoftdeleteProduct,
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

router.put("/products/:productId", updateProduct);

router.delete("/products/:productId", SoftdeleteProduct);

router.patch("/products/:productId/featured", toggleIsFeatured);

router.patch("/products/:productId/availability", toggleAvailability);

router.patch("/products/:productId/stock", updateProductStock);

export default router;
