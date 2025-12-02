const db = require("../utils/db");

function normalize(result) {
    return Array.isArray(result) && Array.isArray(result[0]) ? result[0] : result;
}

// ===================================================
// ADD REVIEW
// ===================================================
exports.addReview = async (userId, itemName, restaurantName, rating, reviewText) => {
    const [result] = await db.query(
        `CALL sp_AddReview(?, ?, ?, ?, ?)`,
        [userId, itemName, restaurantName, rating, reviewText]
    );

    return normalize(result)[0];
};

// ===================================================
// GET REVIEWS FOR ITEM IN SPECIFIC RESTAURANT
// ===================================================
exports.getItemReviews = async (itemName, restaurantName) => {
    const [rows] = await db.query(
        `CALL sp_GetItemReviewsByName(?, ?)`,
        [itemName, restaurantName]
    );
    return rows[0];
};

// ===================================================
// GET AVG RATING + COUNT
// ===================================================
exports.getItemRatingStats = async (itemName, restaurantName) => {
    const [rows] = await db.query(
        `CALL sp_GetAverageRatingByName(?, ?)`,
        [itemName, restaurantName]
    );
    return rows[0][0];
};