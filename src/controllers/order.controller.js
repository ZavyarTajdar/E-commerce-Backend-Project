import { Order } from "../models/order.models.js"
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
    const { orderId } = req.params
    const { orderStatus } = req.body
    
    if (!orderId) {
        throw new ApiError(400, "Order Is Is Required")
    }
    
    if (!orderStatus) {
        throw new ApiError(400, "Order status Must Be Updated")
    }

    const validStatus =  ["pending", "processing", "shipped", "delivered", "cancelled"];

    if (!validStatus.includes(orderStatus)) {
        throw new ApiError(400, `Invalid status. Allowed: ${validStatus.join(", ")}`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    order.orderStatus = orderStatus;
    await order.save();

    return res
    .status(200)
    .json(
        new ApiResponse(200, order , "Order Status Updated Successfully")
    )
});

const cancelOrder = asyncHandler(async (req, res) => {
    const { orderId } = req.params
    if (!orderId) {
        throw new ApiError(400, "Order Is Is Required")
    }
    
    const order = await Order.findById(orderId);
    if (!order) {
        throw new ApiError(404, "Order not found");
    }

    if (["shipped", "delivered"].includes(order.orderStatus)) {
        throw new ApiError(400, "Order cannot be cancelled after being shipped or delivered");
    }

    order.orderStatus = "cancelled";
    await order.save()

    return res
    .status(200)
    .json(
        new ApiResponse(200, order , "Order Cancelled Successfully")
    )
});

const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().
    populate("items.product" , "title description price sku barcode").
    populate("user", "_id username email")
    .sort({createdAt : -1})

    if (!orders.length) {
        throw new ApiError(404, "No orders found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200, orders , "All Order Fetched Successfully")
    )
});

const getMonthlySalesAnalytics = asyncHandler(async (req, res) => {
    const analytics = await Order.aggregate([
        {
            $group: {
                _id: { 
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" }
                },
                totalRevenue: { $sum: "$totalAmount" },
                totalOrders: { $sum: 1 }
            }
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 }
        },
        {
            $project: {
                _id: 0,
                year: "$_id.year",
                month: "$_id.month",
                totalRevenue: 1,
                totalOrders: 1
            }
        }
    ]);

    const formatted = analytics.map(item => ({
        year: item.year,
        month: item.month,
        totalRevenue: item.totalRevenue,
        totalOrders: item.totalOrders
    }));

    return res.status(200).json(
        new ApiResponse(200, formatted, "Monthly sales analytics fetched successfully")
    );

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
