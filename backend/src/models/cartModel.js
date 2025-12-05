const db = require("../utils/db");

// Normalize result sets from CALL
function normalize(result) {
    if (!Array.isArray(result)) return result;
    return Array.isArray(result[0]) ? result[0] : result;
}

// ============================================
// ADD TO CART
// ============================================
exports.addToCart = async (userId, itemId, quantity, size) => {
    const [result] = await db.query(
        `CALL sp_AddToCart(?, ?, ?, ?)`,
        [userId, itemId, quantity, size]
    );

    return normalize(result)[0];
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

// ============================================
// CHANGE ITEM'S QUANTITY
// ============================================
exports.updateQuantity = async (userId, itemId, size, change) => {
    const [result] = await db.query(
        `CALL sp_UpdateCartQuantity(?, ?, ?, ?)`,
        [userId, itemId, size, change]
    );

    return normalize(result)[0];
};

// ============================================
// REMOVE ITEM FROM CART
// ============================================
exports.removeItem = async (userId, itemId, size) => {
    const [result] = await db.query(
        `CALL sp_RemoveFromCart(?, ?, ?)`,
        [userId, itemId, size]
    );

    return normalize(result)[0];
};

// ============================================
// CLEAR CART
// ============================================
exports.clearCart = async (userId) => {
    await db.query(
        `DELETE ci FROM CartItems ci 
         JOIN Cart c ON ci.CartID = c.CartID 
         WHERE c.UserID = ?`,
        [userId]
    );
};