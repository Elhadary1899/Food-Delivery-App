const itemModel = require("../models/itemModel");
const response = require("../utils/response");

exports.getItemDetails = async (req, res) => {
    try {
        const itemId = parseInt(req.params.id);

        // 1) Item details
        const item = await itemModel.getItemDetails(itemId);
        if (!item) return response.error(res, "Item not found", 404);

        // 2) Reviews
        const reviews = await itemModel.getItemReviews(itemId);

        // 3) Suggestions
        const suggestions = await itemModel.getPeopleAlsoOrder(item.restaurant_id, itemId);

        return response.success(res, {
            item,
            reviews,
            suggestions
        });
    } catch (err) {
        return response.error(res, err.message);
    }
};