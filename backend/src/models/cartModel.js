const db = require("../utils/db");

// Normalize result sets from CALL
function normalize(result) {
    if (!Array.isArray(result)) return result;
    return Array.isArray(result[0]) ? result[0] : result;
}

// ============================================
// ADD TO CART
// ============================================
exports.addToCart = async (userId, itemName, restaurantName, quantity, size) => {
    const [result] = await db.query(
        `CALL sp_AddToCart(?, ?, ?, ?, ?)`,
        [userId, itemName, restaurantName, quantity, size]
    );

    return normalize(result);
};

// ============================================
// GET CART ITEMS
// ============================================
exports.getCartItems = async (userId) => {

    // CALL returns 2 result sets:
    // [0] -> list of items
    // [1] -> total price
    const [results] = await db.query(
        `CALL sp_GetCartItems(?)`,
        [userId]
    );

    const items = normalize(results);
    const total = results[1] && results[1][0] ? results[1][0].cart_total : 0;

    return { items, total };
};