const menuModel = require("../models/menuModel");
const response = require("../utils/response");

exports.getRestaurants = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const offset = (page - 1) * limit;

        const restaurants = await menuModel.getRestaurants(offset, limit);

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
        const id = parseInt(req.params.id);

        const data = await menuModel.getRestaurantMenu(id);

        if (!data) {
            return response.error(res, "Restaurant not found", 404);
        }

        return response.success(res, data);
    } catch (err) {
        return response.error(res, err.message);
    }
};

exports.searchRestaurantItems = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const q = req.query.q || "";

        const results = await menuModel.searchRestaurantItems(id, q);

        return response.success(res, { results });
    } catch (err) {
        return response.error(res, err.message);
    }
};