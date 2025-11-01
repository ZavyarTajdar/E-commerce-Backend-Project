import { Order } from "../models/order.models.js"
import { Review } from "../models/review.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Address } from "../models/address.models.js"

const CreateReview = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    const { rating, content } = req.body

    const userId = req.user._id

    const order = await Order.findOne({ _id: orderId })

    if (!order) {
        throw new ApiError(404, "Order not found")
    }

    if (order.user.toString() !== userId) {
        throw new ApiError(403, "You are not allowed to review this order")
    }

    const review = await Review.create({
        user: userId,
        order: orderId,
        rating,
        content
    })

    res.status(201).json(new ApiResponse(201, "Review created successfully", review))
})