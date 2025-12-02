const itemModel = require("../models/itemModel");
const reviewModel = require("../models/reviewModel");
const response = require("../utils/response");

exports.getItemPageData = async (req, res) => {
    try {
        const restaurantName = req.params.restaurantName;
        const itemName = req.params.itemName;

        const item = await itemModel.getItemDetails(itemName, restaurantName);
        const reviews = await itemModel.getItemReviews(itemName, restaurantName);
        const recommended = await itemModel.getRecommendedItems(itemName, restaurantName);

        return response.success(res, {
            item,
            reviews,
            recommended
        });
    } catch (err) {
        return response.error(res, err.message);
    }
};

exports.getRecommendations = async (req, res) => {
    try {
        const itemName = decodeURIComponent(req.params.itemName);
        const restaurantName = decodeURIComponent(req.params.restaurantName);

        const reviews = await reviewModel.getItemReviews(itemName, restaurantName);
        const recommended = await itemModel.getRecommendedItems(itemName, restaurantName);

        return response.success(res, {
            reviews,
            recommended
        });

    } catch (err) {
        return response.error(res, err.message);
    }
};
