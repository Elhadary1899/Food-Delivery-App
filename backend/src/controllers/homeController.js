const homeModel = require("../models/homeModel");
const response = require("../utils/response");

// ============================================
// GET ALL CATEGORIES
// ============================================
exports.getCategories = async (req, res) => {
    try {
        // Get user info from token
        const userId = req.user.userId;
        const username = req.user.username;
        
        const categories = await homeModel.getAllCategories();

        return response.success(
            res, 
            { 
                categories,
                user: {
                    id: userId,
                    username: username
                }
            }
        );

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// GET ALL RESTAURANTS
// ============================================
exports.getRestaurants = async (req, res) => {
    try {
        // Get user info from token
        const userId = req.user.userId;
        const username = req.user.username;
        
        const restaurants = await homeModel.getAllRestaurants();

        return response.success(
            res, 
            { 
                restaurants,
                user: {
                    id: userId,
                    username: username
                }
            }
        );

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// GET POPULAR DISHES
// ============================================
exports.getPopularDishes = async (req, res) => {
    try {
        // Get user info from token
        const userId = req.user.userId;
        const username = req.user.username;
        const role = req.user.role;
        
        const dishes = await homeModel.getPopularDishes();

        return response.success(
            res, 
            { 
                popular_dishes: dishes,
                user: {
                    id: userId,
                    username: username,
                    role: role
                }
            }
        );

    } catch (err) {
        return response.error(res, err.message);
    }
};
