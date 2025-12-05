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
// GET ITEM REVIEWS (name-based)
// ===================================================
exports.getItemReviews = async (itemName, restaurantName) => {
    const [result] = await db.query(
        `CALL sp_GetItemReviewsByName(?, ?)`,
        [itemName, restaurantName]
    );

    return normalize(result).map(r => ({
        username: r.username,
        rating: r.Rating,
        review: r.Review
    }));
};

// ===================================================
// UPDATE REVIEW
// ===================================================
exports.updateReview = async (userId, itemName, restaurantName, rating, reviewText) => {
    const [result] = await db.query(
        `CALL sp_UpdateReviewByUserAndItem(?, ?, ?, ?, ?)`,
        [userId, itemName, restaurantName, rating, reviewText]
    );

    return normalize(result)[0];
};

// ===================================================
// DELETE REVIEW
// ===================================================
exports.deleteReview = async (userId, itemName, restaurantName) => {
    const [result] = await db.query(
        `CALL sp_DeleteReviewByUserAndItem(?, ?, ?)`,
        [userId, itemName, restaurantName]
    );

    return normalize(result)[0];
};