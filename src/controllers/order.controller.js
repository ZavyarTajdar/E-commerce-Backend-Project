import { Product } from "../models/product.models.js"
import { Order } from "../models/order.models.js"
import { User } from "../models/user.models.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const createOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const cart = req.cart

    const { shippingAddress } = req.body

    if (!shippingAddress) {
        throw new ApiError(400, "Shipping address is required")
    }

    if (!cart || cart.items.length === 0) {
        throw new ApiError(400, "Cart is empty")
    }

    const totalAmount = cart.items.reduce((acc, item) => {
        const price = item.price || 0;
        const quantity = item.quantity || 0;
        return acc + price * quantity;
    }, 0);

    const order = await Order.create({
        user: userId,
        items: cart.items.map((item) => ({
            product: item.product,
            price: item.price,
            quantity: item.quantity,
        })),
        shippingAddress: {
            fullName: shippingAddress.fullName,
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country,
        },
        totalAmount,
        orderStatus: "pending",
        paymentStatus: "unpaid",
    });

    cart.items = [];
    cart.totalItems = 0;
    cart.totalPrice = 0;
    await cart.save();

    return res
        .status(201)
        .json(new ApiResponse(201, order, "Order created successfully"));
})

const getUserOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .lean()

    if (!orders || orders.length === 0) {
        return res
        .status(200)
        .json(new ApiResponse(200, [], "No orders found for this user"));
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, orders, "User orders fetched successfully")
    );
});

const getOrderById = asyncHandler(async (req, res) => {
    const { orderId } = req.params

    if (!orderId) {
        throw new ApiError(400, "order Id is Required")
    }

    const order = await Order.findById(orderId).
    populate("items.product" , "title description price sku barcode").
    populate("user", "_id username email")


    if (!order) {
        throw new ApiError(404, "Order Not Found")
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, order, "Order Fetched Successfully")
    )
});

const updateOrderStatus = asyncHandler(async (req, res) => {
    // TODO: Extract new status from req.body
    // TODO: Validate status (pending → processing → shipped → delivered)
    // TODO: Find order by ID
    // TODO: Update orderStatus
    // TODO: Save order and return updated order
});

const cancelOrder = asyncHandler(async (req, res) => {
    // TODO: Extract order ID
    // TODO: Find order and verify ownership or admin access
    // TODO: Check if order is cancellable (not shipped/delivered)
    // TODO: Update status to "cancelled"
    // TODO: Save order and return confirmation
});

const getAllOrders = asyncHandler(async (req, res) => {
    // TODO: Admin only - fetch all orders
    // TODO: Populate user details
    // TODO: Sort by latest created
    // TODO: Return all orders
});

const getMonthlySalesAnalytics = asyncHandler(async (req, res) => {
    // TODO: Aggregate orders by month
    // TODO: Calculate total revenue and total orders per month
    // TODO: Return formatted analytics data
});
export {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    getMonthlySalesAnalytics,
};
