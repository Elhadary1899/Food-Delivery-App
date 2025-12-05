const cartModel = require("../models/cartModel");
const response = require("../utils/response");

// ============================================
// ADD TO CART
// ============================================
exports.addToCart = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { item_id, quantity, size } = req.body;

        if (!item_id || !quantity || !size) {
            return response.error(res, "Missing required fields", 400);
        }

        const result = await cartModel.addToCart(
            userId,
            item_id,
            quantity,
            size
        );

        return response.success(res, { message: result.message || "Added to cart" });

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// GET CART CONTENT
// ============================================
exports.getCartItems = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { items, total } = await cartModel.getCartItems(userId);

        const itemsTotal = parseFloat(total) || 0;

        const deliveryFee = itemsTotal > 0 ? 5.78 : 0;

        const subtotal = itemsTotal + deliveryFee;

        return response.success(res, {
            items,
            items_total: itemsTotal.toFixed(2),
            delivery_fee: deliveryFee.toFixed(2),
            subtotal: subtotal.toFixed(2)
        });

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// INCREMENT ITEM'S QUANTITY
// ============================================
exports.incrementItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { item_id, size } = req.body;

        const result = await cartModel.updateQuantity(userId, item_id, size, +1);

        return response.success(res, result);
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// DECREMENT ITEM'S QUANTITY
// ============================================
exports.decrementItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { item_id, size } = req.body;

        const result = await cartModel.updateQuantity(userId, item_id, size, -1);

        return response.success(res, result);
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// REMOVE ITEM FROM CART
// ============================================
exports.removeItem = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { item_id, size } = req.body;

        const result = await cartModel.removeItem(userId, item_id, size);

        return response.success(res, result);
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// CLEAR CART
// ============================================
exports.clearCart = async (req, res) => {
    try {
        await cartModel.clearCart(req.user.userId);
        return response.success(res, { message: "Cart cleared" });
    } catch (err) {
        return response.error(res, err.message);
    }
};