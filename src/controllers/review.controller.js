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

    let imagesUrl = [];
    if (req.files && req.files.images && req.files.images.length > 0) {
        imagesUrl = await Promise.all(
            req.files.image.map(file => uploadOnCloudinary(file.path))
        );
    }

    let videoUrl = null;
    if (req.files?.video?.[0]) {
        const uploadedVideo = await uploadOnCloudinary(req.files.video[0].path);
        videoUrl = uploadedVideo?.url || null;
    }
    const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        content,
        images: imagesUrl || [],
        video: videoUrl || null
    });

    product.review.push(review._id)
    await product.save()

    res.status(201).json(new ApiResponse(201, "Review created successfully", review))
})

const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params
    const { rating, content } = req.body

    const userId = req.user._id
    const review = await Review.findById(reviewId)

    if (!review) {
        throw new ApiError(404, "Review not found")
    }

    const now = new Date()
    const diffInMinutes = (now - review.createdAt) / (1000 * 60)

    if (diffInMinutes > 30) {
        throw new ApiError(400, "You can update review within 30 minutes of creation")
    }

    if (review.user.toString() !== userId) {
        throw new ApiError(403, "You are not allowed to update this review")
    }
    review.rating = rating || review.rating
    review.content = content || review.content
    await review.save()

    res.status(200).json(new ApiResponse(200, "Review updated successfully", review))
})

const removeReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params
    const userId = req.user._id
    const review = await Review.findById(reviewId)

    if (!review) {
        throw new ApiError(404, "Review not found")
    }
    if (review.user.toString() !== userId) {
        throw new ApiError(403, "You are not allowed to delete this review")
    }
    await review.remove()

    res.status(200).json(new ApiResponse(200, "Review deleted successfully"))
})

const ToggleLikeReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params
    const userId = req.user._id

    const review = await Review.findById(reviewId)

    if (!review) {
        throw new ApiError(404, "Review not found")
    }
    let likeCount = 0
    if (review.likes.includes(userId)) {
        review.likes.pull(userId)
        likeCount = likeCount - 1
        return res
            .status(200)
            .json(
                new ApiResponse(200, "Review Unliked successfully", review)
            )
    } else {
        review.likes.push(userId)
        likeCount = likeCount + 1
        return res
        .status(200)
        .json(
            new ApiResponse(200, "Review liked successfully", review)
        )
    }
})

export {
    CreateReview,
    updateReview,
    removeReview,
    ToggleLikeReview
}