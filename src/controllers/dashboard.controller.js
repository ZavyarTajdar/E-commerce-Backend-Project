import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Product } from "../models/product.model.js"
import { User } from "../models/user.model.js"
import { Order } from "../models/order.model.js"
import { Review } from "../models/review.model.js"

const getDashboardStats = asyncHandler(async (req, res, next) => {
    const stats = {
        totalUsers: await User.countDocuments(),
        totalProducts: await Product.countDocuments(),
        totalOrders: await Order.countDocuments(),
        totalReviews: await Review.countDocuments()
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(200, "Dashboard statistics retrieved successfully", stats)
    )
})

const getProductList = asyncHandler(async (req, res, next) => {
    const products = await Product.find().populate('category sku barcode variants isActive isAvailable price stock ratings isFeatured')
    if (!products) {
        return next(new ApiError(404, "No products found"))
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(200, "Products retrieved successfully", products)
    )
})

const getOrdersList = asyncHandler(async (req, res, next) => {  
   const orders = await Order.find()
        .populate({
            path: "user",
            select: "name email", // only fetch essential user fields
        })
        .populate({
            path: "items.product",
            select: "title price images", // get basic product info
        })
        .populate({
            path: "shippingAddress",
            select: "street city state postalCode country type",
        })
        .sort({ createdAt: -1 });
    if (!orders) {
        return next(new ApiError(404, "No orders found"))
    }
    return res 
    .status(200)
    .json(
        new ApiResponse(200, "Orders retrieved successfully", orders)
    )
})

export { 
    getDashboardStats, 
    getProductList, 
    getOrdersList 
}