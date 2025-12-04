const db = require("../utils/db");

function normalize(result) {
    return Array.isArray(result[0]) ? result[0] : result;
}

// Get all food categories
exports.getAllCategories = async () => {
    const [rows] = await db.query(
        `SELECT CategoryID, CategoryName, ImageURL 
         FROM FoodCategory 
         ORDER BY CategoryName`
    );
    return rows;
};

// Get all restaurants
exports.getAllRestaurants = async () => {
    const [result] = await db.query(
        `CALL sp_GetAllRestaurants()`
    );
    return normalize(result);
};

// Get popular dishes (top rated items across all restaurants)
exports.getPopularDishes = async () => {
    const [rows] = await db.query(
        `SELECT 
            f.ItemID,
            f.ItemName,
            f.ItemDescription,
            f.Price,
            f.ImageURL,
            c.CategoryName,
            r.RestaurantName,
            COALESCE(AVG(rv.Rating), 0) AS avg_rating,
            COUNT(rv.ReviewID) AS review_count
         FROM FoodItems f
         LEFT JOIN FoodCategory c ON f.CategoryID = c.CategoryID
         LEFT JOIN Restaurant r ON f.RestaurantID = r.RestaurantID
         LEFT JOIN Reviews rv ON f.ItemID = rv.ItemID
         GROUP BY f.ItemID, f.ItemName, f.ItemDescription, f.Price, f.ImageURL, c.CategoryName, r.RestaurantName
         HAVING avg_rating > 0
         ORDER BY avg_rating DESC, review_count DESC
         LIMIT 10`
    );
    return rows;
};