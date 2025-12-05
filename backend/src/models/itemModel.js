const db = require("../utils/db");

function normalize(result) {
    return Array.isArray(result[0]) ? result[0] : result;
}

// ===================================================
// GET ITEM DETAILS
// ===================================================
exports.getItemDetails = async (itemName, restaurantName) => {
    const [result] = await db.query(
        `CALL sp_GetItemDetails(?, ?)`,
        [itemName, restaurantName]
    );

    const rows = normalize(result);
    const d = rows[0];

    if (!d) return null;

    return {
        item_id: d.ItemID,
        item_name: d.ItemName,
        description: d.ItemDescription,
        price: d.Price,
        image_url: d.ImageURL,
        category_name: d.CategoryName,
        restaurant_name: d.RestaurantName,
        avg_rating: d.avg_rating,
        review_count: d.review_count
    };
};

// ===================================================
// GET ITEM REVIEWS
// ===================================================
exports.getItemReviews = async (itemName, restaurantName) => {
    const [rows] = await db.query(
        `CALL sp_GetItemReviewsByName(?, ?)`,
        [itemName, restaurantName]
    );

    return normalize(rows).map(r => ({
        username: r.username,
        rating: r.Rating,
        review: r.Review
    }));
};

// ===================================================
// GET RECOMMENDED ITEMS
// ===================================================
exports.getRecommendedItems = async (itemName, restaurantName) => {
    const [rows] = await db.query(
        `CALL sp_GetRecommendedItems(?, ?)`,
        [itemName, restaurantName]
    );

    return normalize(rows).map(i => ({
        item_id: i.ItemID,
        item_name: i.ItemName,
        description: i.ItemDescription,
        price: i.Price,
        image_url: i.ImageURL,
        category_id: i.CategoryID,
        category_name: i.CategoryName,
        avg_rating: i.avg_rating,
        review_count: i.review_count
    }));
};