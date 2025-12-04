const db = require("../utils/db");

function normalize(result) {
    return Array.isArray(result[0]) ? result[0] : result;
}

exports.getItemDetails = async (itemName, restaurantName) => {
    const [result] = await db.query(
        `CALL sp_GetItemDetails(?, ?)`,
        [itemName, restaurantName]
    );

    const rows = Array.isArray(result[0]) ? result[0] : result;
    return rows[0] || null;
};


exports.getItemReviews = async (itemName, restaurantName) => {
    const [rows] = await db.query(
        `
        SELECT 
            u.username,
            r.Rating,
            r.Review
        FROM Reviews r
        JOIN Users u ON r.UserID = u.UserID
        JOIN FoodItems f ON r.ItemID = f.ItemID
        JOIN Restaurant res ON f.RestaurantID = res.RestaurantID
        WHERE f.ItemName = ?
          AND res.RestaurantName = ?
        ORDER BY r.ReviewID DESC
        `,
        [itemName, restaurantName]
    );
    return rows;
};

// ===================================================
// GET RECOMMENDATIONS FROM THE SAME RESTAURANT
// ===================================================
exports.getRecommendedItems = async (itemName, restaurantName) => {
    const [callResult] = await db.query(
        `CALL sp_GetRecommendedItems(?, ?)`,
        [itemName, restaurantName]
    );

    const rows = Array.isArray(callResult[0]) ? callResult[0] : callResult;

    return rows.map(i => ({
        item_id: i.ItemID,
        item_name: i.ItemName,
        description: i.ItemDescription,
        price: i.Price,
        image_url: i.ImageURL,
        category_name: i.CategoryName,
        avg_rating: i.avg_rating,
        review_count: i.review_count
    }));
};