const orderModel = require("../models/orderModel");
const response = require("../utils/response");

// ============================================
// GET CHECKOUT SUMMARY
// ============================================
exports.getCheckoutSummary = async (req, res) => {
    try {
        // Get user ID from token (not from params!)
        const userId = req.user.userId;
        const username = req.user.username;

        const checkoutData = await orderModel.getCheckoutSummary(userId);

        if (!checkoutData.items || checkoutData.items.length === 0) {
            return response.error(res, "Cart is empty", 400);
        }

        // Add user info to response
        checkoutData.current_user = {
            id: userId,
            username: username
        };

        return response.success(res, checkoutData, "Checkout data retrieved successfully");

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// PLACE ORDER
// ============================================
exports.placeOrder = async (req, res) => {
    try {
        // Get user ID from token (more secure!)
        const userId = req.user.userId;
        const username = req.user.username;

        const { address_name, payment_name } = req.body;

        if (!address_name || !payment_name) {
            return response.error(res, "Missing address_name or payment_name", 400);
        }

        const result = await orderModel.placeOrder(userId, address_name, payment_name);

        if (!result.order_number) {
            return response.error(res, "Failed to place order", 500);
        }

        // Add user info to response
        result.ordered_by = username;

        return response.success(res, result, `Order placed successfully by ${username}`);

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// GET ORDER BY ORDER NUMBER
// ============================================
exports.getOrderByNumber = async (req, res) => {
    try {
        // Get user ID from token
        const userId = req.user.userId;
        const username = req.user.username;

        const orderNumber = req.params.orderNumber;

        if (!orderNumber) {
            return response.error(res, "Order number is required", 400);
        }

        const orderData = await orderModel.getOrderByNumber(orderNumber);

        if (!orderData.order) {
            return response.error(res, "Order not found", 404);
        }

        // Security: Check if order belongs to this user
        if (orderData.order.UserID !== userId && req.user.role !== 'Admin') {
            return response.error(res, "You can only view your own orders", 403);
        }

        // Add user info
        orderData.viewed_by = username;

        return response.success(res, orderData, "Order details retrieved successfully");

    } catch (err) {
        return response.error(res, err.message);
    }
};
