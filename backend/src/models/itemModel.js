const db = require("../utils/db");

// 1️⃣ Item details
exports.getItemDetails = async (itemId) => {
    const [result] = await db.query(`CALL sp_GetFoodItemById(?)`, [itemId]);

    // procedure returns 2 result sets; head is result[0]
    const details = result[0][0];
    if (!details) return null;

    return {
        item_id: details.ItemID,
        name: details.ItemName,
        description: details.ItemDescription,
        price: details.Price,
        category_id: details.CategoryID,
        category_name: details.CategoryName,
        image_url: details.ImageURL,
        avg_rating: details.avg_rating,
        review_count: details.review_count,
        restaurant_id: details.RestaurantID
    };
};

// 2️⃣ Item reviews
exports.getItemReviews = async (itemId) => {
    const [rows] = await db.query(`CALL sp_GetItemReviews(?)`, [itemId]);
    return rows[0];
};

// 3️⃣ People also order
exports.getPeopleAlsoOrder = async (restaurantId, itemId) => {
    const [rows] = await db.query(`
        SELECT 
            f.ItemID,
            f.ItemName,
            f.ItemDescription,
            f.Price,
            NULL AS image_url,
            COALESCE(AVG(r.Rating),0) AS avg_rating
        FROM FoodItems f
        LEFT JOIN Reviews r ON f.ItemID = r.ItemID
        WHERE f.RestaurantID = ? AND f.ItemID != ?
        GROUP BY f.ItemID
        ORDER BY avg_rating DESC
        LIMIT 6
    `, [restaurantId, itemId]);

    return rows;
};