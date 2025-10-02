import { Router } from "express";
import {
    createProduct
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT)

router.route("/publish-product").post(
    upload.fields([
        { name: "pictures", maxCount: 5 }, // up to 5 images
        { name: "video", maxCount: 1 }     // one video file
    ]),
    createProduct
);

export default router;