import { Router } from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  toggleIsFeatured,
  getCategoryById,
  SoftdeleteCategory,
  updateCategoryThumbnail
} from "../controllers/category.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);
router.use(isAdmin);

router.post("/create", upload.single("thumbnail"), createCategory);
router.get("/", getCategories);
router.get("/:categoryId", getCategoryById);
router.put("/:categoryId", updateCategory);
router.patch("/:categoryId/thumbnail", upload.single("thumbnail"), updateCategoryThumbnail);
router.patch("/:categoryId/featured", toggleIsFeatured);
router.delete("/:categoryId", SoftdeleteCategory);

export default router;
