const db = require("../utils/db");

exports.addReview = async (userId, itemId, rating, reviewText) => {
    const [rows] = await db.query(
        `CALL sp_AddReview(?, ?, ?, ?)`,
        [userId, itemId, rating, reviewText]
    );

    // The procedure returns { review_id, message }
    return rows[0][0];
};
