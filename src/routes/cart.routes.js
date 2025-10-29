import { Router } from "express";
import {
    addToCart,
    removeItemFromCart,
    updateCartItemQuantity,
    getCart,
    clearCart,
} from "../controllers/cart.controller.js";
import { verifyJWT, isAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.post("/", addToCart);
router.delete("/:itemId", removeItemFromCart);
router.put("/:itemId", updateCartItemQuantity);
router.get("/", getCart);
router.delete("/", clearCart);

export default router;
