const db = require("../utils/db");

// Normalize CALL output
function normalize(result) {
    return Array.isArray(result[0]) ? result[0] : result;
}

// ============================================
// GET CHECKOUT SUMMARY
// Returns 5 result sets:
// 1. Cart items
// 2. Cart totals (subtotal, delivery_fee, total)
// 3. User info
// 4. Shipping addresses
// 5. Payment methods
// ============================================
exports.getCheckoutSummary = async (userId) => {
    const [results] = await db.query(`CALL sp_GetCheckoutSummary(?)`, [userId]);

    // Procedure returns 5 result sets in exact order:
    return {
        items: results[0] || [],
        totals: results[1] ? results[1][0] : null,
        user: results[2] ? results[2][0] : null,
        addresses: results[3] || [],
        payments: results[4] || []
    };
};

// ============================================
// PLACE ORDER (ID-based)
// ============================================
exports.placeOrder = async (userId, addressId, paymentId) => {
    // Call the stored procedure with OUT param
    await db.query(
        `CALL sp_PlaceOrder(?, ?, ?, @order_number)`,
        [userId, addressId, paymentId]
    );

    // Retrieve OUT parameter
    const [outParam] = await db.query(`SELECT @order_number AS order_number`);

    const orderNumber = outParam[0].order_number;

    return {
        order_number: orderNumber,
        message: orderNumber ? "Order placed successfully" : "Order failed"
    };
};

// ============================================
// GET ORDER BY ORDER NUMBER
// ============================================
exports.getOrderByNumber = async (orderNumber) => {
    const [results] = await db.query(
        `CALL sp_GetOrderByNumber(?)`,
        [orderNumber]
    );

    return {
        order: results[0] ? results[0][0] : null,
        items: results[1] || []
    };
};