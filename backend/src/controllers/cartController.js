const cartModel = require("../models/cartModel");
const response = require("../utils/response");

// ============================================
// ADD TO CART
// ============================================
exports.addToCart = async (req, res) => {
    try {
        const { user_id, item_name, restaurant_name, quantity, size } = req.body;

        if (!user_id || !item_name || !restaurant_name || !quantity || !size) {
            return response.error(res, "Missing required fields", 400);
        }

        const result = await cartModel.addToCart(
            user_id, 
            item_name, 
            restaurant_name, 
            quantity, 
            size
        );

        return response.success(res, { message: result[0]?.message || "Updated" });

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// GET CART CONTENT
// ============================================
exports.getCartItems = async (req, res) => {
    try {
        const userId = req.params.userId;

        const data = await cartModel.getCartItems(userId);

        return response.success(res, data);

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// INCREMENT ITEM'S QUANTITY
// ============================================
exports.incrementItem = async (req, res) => {
    try {
        const { user_id, item_name, restaurant_name, size } = req.body;

        const result = await cartModel.updateQuantity(
            user_id,
            item_name,
            restaurant_name,
            size,
            +1
        );

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
        const { user_id, item_name, restaurant_name, size } = req.body;

        const result = await cartModel.updateQuantity(
            user_id,
            item_name,
            restaurant_name,
            size,
            -1
        );

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
        const { user_id, item_name, restaurant_name, size } = req.body;

        const result = await cartModel.removeItem(user_id, item_name, restaurant_name, size);

        return response.success(res, result);
    } catch (err) {
        return response.error(res, err.message);
    }
};
