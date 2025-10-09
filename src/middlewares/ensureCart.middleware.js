// middlewares/ensureCart.middleware.js
import { Cart } from "../models/cart.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const ensureCart = asyncHandler(async (req, res, next) => {
  // Find the user's cart
  let cart = await Cart.findOne({ user: req.user._id });

  // If cart doesn't exist, create it
  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
      totalItems: 0,
      totalPrice: 0
    });
    await cart.save();
  }

  // Attach cart to request for easy access in controllers
  req.cart = cart;
  next();
});
