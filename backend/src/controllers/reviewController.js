const reviewModel = require("../models/reviewModel");
const response = require("../utils/response");

// ===================================================
// ADD REVIEW
// ===================================================
exports.addReview = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { item_name, restaurant_name, rating, review } = req.body;

        if (!item_name || !restaurant_name || !rating) {
            return response.error(res, "item_name, restaurant_name, and rating are required", 400);
        }

        const result = await reviewModel.addReview(
            userId,
            item_name,
            restaurant_name,
            rating,
            review || null
        );

        return response.success(res, {
            message: result?.message || "Review added successfully"
        });
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// GET ITEM REVIEWS
// ===================================================
exports.getItemReviews = async (req, res) => {
    try {
        const restaurantName = decodeURIComponent(req.params.restaurantName);
        const itemName = decodeURIComponent(req.params.itemName);

        const reviews = await reviewModel.getItemReviews(itemName, restaurantName);

        return response.success(res, { reviews });

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// UPDATE REVIEW 
// ===================================================
exports.updateReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { item_name, restaurant_name, rating, review } = req.body;

        if (!item_name || !restaurant_name || !rating) {
            return response.error(res, "item_name, restaurant_name, and rating are required", 400);
        }

        const result = await reviewModel.updateReview(
            userId,
            item_name,
            restaurant_name,
            rating,
            review || null
        );

        return response.success(res, {
            message: result?.message || "Review updated successfully"
        });

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// DELETE REVIEW
// ===================================================
exports.deleteReview = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { item_name, restaurant_name } = req.body;

        if (!item_name || !restaurant_name) {
            return response.error(res, "item_name and restaurant_name are required", 400);
        }

        const result = await reviewModel.deleteReview(
            userId,
            item_name,
            restaurant_name
        );

        return response.success(res, {
            message: result?.message || "Review deleted successfully"
        });

    } catch (err) {
        return response.error(res, err.message);
    }
};