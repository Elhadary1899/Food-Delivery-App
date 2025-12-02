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