const db = require("../utils/db");

function normalize(result) {
    return Array.isArray(result[0]) ? result[0] : result;
}

// ===================================================
// GET ALL RESTAURANTS
// ===================================================
exports.getAllRestaurants = async () => {
    const [result] = await db.query(`CALL sp_GetAllRestaurants()`);

    const rows = normalize(result);

    return rows.map(r => ({
        restaurant_id: r.RestaurantID,
        restaurant_name: r.RestaurantName,
        rating: r.RestaurantRating,
        address: r.Address || null,
        image_url: r.imageURL || r.ImageURL || null
    }));
};

// ===================================================
// GET POPULAR DISHES
// ===================================================
exports.getPopularDishes = async () => {
    const [rows] = await db.query(
        `
        SELECT 
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
        GROUP BY f.ItemID
        HAVING avg_rating > 0
        ORDER BY avg_rating DESC, review_count DESC
        LIMIT 10
        `
    );

    return rows.map(d => ({
        item_id: d.ItemID,
        item_name: d.ItemName,
        description: d.ItemDescription,
        price: d.Price,
        image_url: d.ImageURL,
        category_name: d.CategoryName,
        restaurant_name: d.RestaurantName,
        avg_rating: d.avg_rating,
        review_count: d.review_count
    }));
};