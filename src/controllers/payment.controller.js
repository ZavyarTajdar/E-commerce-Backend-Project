import { Order } from "../models/order.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Address } from "../models/address.models.js"
import { Payment } from "../models/payment.models.js"


const createPayment = asyncHandler(async (req, res) => {
 
    const { orderId } = req.params
    const { paymentMethod } = req.body

    if (!paymentMethod) {
        throw new ApiError(400, "Choose Atleast One Payment Method")
    }
    const userId = req.user._id
    const order = await Order.findById(orderId)
    .populate("totalAmount")

    if (!order) {
        throw new ApiError(400, "Order Is Not Found")
    }

    if (order.user.toString() !== userId.toString()) {
        throw new ApiError(403, "This order does not belong to you");
    }

    if (order.paymentStatus === "paid") {
        throw new ApiError(400, "Order is already paid");
    }

    const payment = await Payment.create({
        user: user,
        order: order._id,
        amount: order.totalAmount,
        paymentMethod,
        paymentStatus: "pending",
    });

    payment.paymentStatus = "paid";
    payment.transactionId = `TXN-${Date.now()}`;
    await payment.save();

    // Update order payment status
    order.paymentStatus = "paid";
    order.orderStatus = "processing";
    await order.save();

    return res
        .status(201)
        .json(new ApiResponse(201, payment, "Payment successful"));
});

const getUserPayments = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const payments = await Payment.find({ user: userId })
    .populate({
            path: "order",
            select: "orderStatus totalAmount items",
            populate: {
                path: "items.product",
                select: "title price"
            }
        })
    .sort({ createdAt: -1 });

    if (!payments || payments.length === 0) {
        throw new ApiError(404, "No payments found for this user");
    }

    return res
    .status(201)
    .json(new ApiResponse(201, payments, "Payment Fetched successfully"));
});

const getPaymentById = asyncHandler(async (req, res) => {
    const { paymentId } = req.params
    if (!paymentId) {
        throw new ApiError(400, "Payment Id Is required")
    }

    const payment = await Payment.findOne({
        _id: paymentId,
        user: req.user._id
    }).populate({
            path: "order",
            select: "orderStatus totalAmount items",
            populate:{
                path: "items.product",
                select: "title price"
            }
    })

    if (!payment) {
        throw new ApiError(404, "Payment not found or unauthorized access");
    }

    return res
    .status(201)
    .json(new ApiResponse(201, payment, "Payment Fetched successfully"));
});

const updatePaymentStatus = asyncHandler(async (req, res) => {
    // TODO: Check if the user has admin privileges
    // TODO: Extract paymentId and newStatus from req.body
    // TODO: Validate newStatus (paid, failed, refunded)
    // TODO: Update paymentStatus in DB
    // TODO: Reflect change in related Order if needed
    // TODO: Return updated payment
});

const getAllPayments = asyncHandler(async (req, res) => {
    // TODO: Verify admin access
    // TODO: Fetch all payments, populate user and order info
    // TODO: Add filters (status, date range) if needed
    // TODO: Sort by newest first
    // TODO: Return payments in ApiResponse
});


export {
    createPayment,
    getUserPayments,
    getPaymentById,
    updatePaymentStatus,
    getAllPayments
};
