import { Product } from "../models/product.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = req.cart;

  if (!productId) throw new ApiError(400, "Product ID is required");
  if (!quantity || quantity <= 0)
    throw new ApiError(400, "Quantity must be at least 1");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product added to cart successfully"));
});

const removeItemFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const cart = req.cart;

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1)
    throw new ApiError(404, "Item not found in your cart");

  cart.items.splice(itemIndex, 1);

  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});

const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = req.cart;

  if (!quantity || quantity <= 0)
    throw new ApiError(400, "Quantity must be at least 1");

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1)
    throw new ApiError(404, "Item not found in your cart");

  cart.items[itemIndex].quantity = quantity;

  cart.totalItems = cart.items.reduce((acc, item) => acc + item.quantity, 0);
  cart.totalPrice = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart item quantity updated successfully"));
});

const getCart = asyncHandler(async (req, res) => {
  const cart = await req.cart.populate(
    "items.product",
    "pictures price title ratings"
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        cart,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
      },
      "Cart fetched successfully"
    )
  );
});

const clearCart = asyncHandler(async (req, res) => {
  const cart = req.cart;

  cart.items = [];
  cart.totalItems = 0;
  cart.totalPrice = 0;

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

export {
  addToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  getCart,
  clearCart,
};
