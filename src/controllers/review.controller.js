import { Order } from "../models/order.models.js"
import { Review } from "../models/review.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Product } from "../models/product.models.js"

const CreateReview = asyncHandler(async (req, res) => {
    const { orderId, productId } = req.params
    const { rating, content } = req.body

    const userId = req.user._id

    const order = await Order.findOne({ _id: orderId, user: userId })

    if (!order) {
        throw new ApiError(404, "You can give review, because you haven't purchased this item")
    }

    if (order.user.toString() !== userId) {
        throw new ApiError(403, "You are not allowed to review this order")
    }

    if (!productId) {
        throw new ApiError(404, "Product Id Is Neccessary")
    }

    const product = await Product.findById(productId)

    if (!product) {
        throw new ApiError(404, "Product Id Is Neccessary")
    }

    const isProductInOrder = order.items.some(
        (item) => item.product.toString() === productId.toString()
    );

    if (!isProductInOrder) {
        throw new ApiError(400, "You cannot review a product not included in this order");
    }
    const existingReview = await Review.findOne({
        user: userId,
        order: orderId,
        product: productId,
    });
    if (existingReview) {
        throw new ApiError(400, "You have already reviewed this product");
    }

    const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        content,
    });

    product.review.push(review._id)
    await product.save()

    res.status(201).json(new ApiResponse(201, "Review created successfully", review))
})

export {
    CreateReview
}