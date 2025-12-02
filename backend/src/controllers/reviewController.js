const reviewModel = require("../models/reviewModel");
const response = require("../utils/response");

exports.addReview = async (req, res) => {
    try {
        const { user_id, item_id, rating, review } = req.body;

        if (!user_id || !item_id || !rating) {
            return response.error(res, "Missing required fields", 400);
        }

        const result = await reviewModel.addReview(user_id, item_id, rating, review);

        return response.success(res, result);
    } catch (err) {
        return response.error(res, err.message);
    }
};
