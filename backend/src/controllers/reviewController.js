const db = require("../utils/db");
const reviewModel = require("../models/reviewModel");
const response = require("../utils/response");

// ADD REVIEW
exports.addReview = async (req, res) => {
    try {
        const { user_id, item_name, restaurant_name, rating, review } = req.body;

        const [result] = await db.query(
            `CALL sp_AddReview(?, ?, ?, ?, ?)`,
            [user_id, item_name, restaurant_name, rating, review]
        );

        return response.success(res, "Review added successfully");
    } catch (err) {
        return response.error(res, err.message);
    }
};

// GET reviews for item in restaurant
exports.getItemReviews = async (req, res) => {
    try {
        const itemName = decodeURIComponent(req.params.itemName);
        const restaurantName = decodeURIComponent(req.params.restaurantName);

        const reviews = await reviewModel.getItemReviews(itemName, restaurantName);
        const stats = await reviewModel.getItemRatingStats(itemName, restaurantName);

        return response.success(res, {
            item: itemName,
            restaurant: restaurantName,
            avg_rating: stats.avg_rating,
            review_count: stats.review_count,
            reviews
        });
    } catch (err) {
        return response.error(res, err.message);
    }
};