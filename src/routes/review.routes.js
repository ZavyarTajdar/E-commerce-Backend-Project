import { Router } from "express";
import {
    CreateReview,
    updateReview,
    removeReview,
    ToggleLikeReview
} from "../controllers/review.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/reviews", verifyJWT, CreateReview);
router.put("/reviews/:reviewId", verifyJWT, updateReview);
router.delete("/reviews/:reviewId", verifyJWT, removeReview);
router.post("/reviews/:reviewId/like", verifyJWT, ToggleLikeReview);

export default router;
