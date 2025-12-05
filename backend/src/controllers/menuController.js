const menuModel = require("../models/menuModel");
const response = require("../utils/response");

exports.getRestaurants = async (req, res) => {
    try {
        const restaurants = await menuModel.getRestaurants();
        return response.success(res, { restaurants });
    } catch (err) {
        return response.error(res, err.message);
    }
};

exports.searchRestaurants = async (req, res) => {
    try {
        const keyword = req.query.q || "";
        const results = await menuModel.searchRestaurants(keyword);
        return response.success(res, { results });
    } catch (err) {
        return response.error(res, err.message);
    }
};

exports.getRestaurantMenu = async (req, res) => {
    try {
        const restaurantName = req.params.restaurantName;

        const menu = await menuModel.getRestaurantMenu(restaurantName);

        return response.success(res, menu);
    } catch (err) {
        return response.error(res, err.message);
    }
};

exports.searchRestaurantItems = async (req, res) => {
    try {
        const restaurantName = decodeURIComponent(req.params.restaurantName);
        const keyword = req.query.q || "";
        const results = await menuModel.searchRestaurantItems(restaurantName, keyword);
        return response.success(res, { results });
    } catch (err) {
        return response.error(res, err.message);
    }
};