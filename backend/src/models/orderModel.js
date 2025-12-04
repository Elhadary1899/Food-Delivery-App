const db = require("../utils/db");

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
    const [results] = await db.query(
        `CALL sp_GetCheckoutSummary(?)`,
        [userId]
    );

    // sp_GetCheckoutSummary returns 5 result sets
    return {
        items: results[0] || [],
        totals: results[1] ? results[1][0] : null,
        user: results[2] ? results[2][0] : null,
        addresses: results[3] || [],
        payments: results[4] || []
    };
};

// ============================================
// PLACE ORDER
// Uses OUT parameter to get order number
// ============================================
exports.placeOrder = async (userId, addressName, paymentName) => {
    const [results] = await db.query(
        `CALL sp_PlaceOrder(?, ?, ?, @order_number)`,
        [userId, addressName, paymentName]
    );

    // Get the OUT parameter value
    const [outParam] = await db.query(`SELECT @order_number AS order_number`);

    return {
        order_number: outParam[0].order_number,
        message: results[0] ? results[0][0]?.message : 'Order placed successfully'
    };
};

// ============================================
// GET ORDER BY ORDER NUMBER
// Returns order details and order items
// ============================================
exports.getOrderByNumber = async (orderNumber) => {
    const [results] = await db.query(
        `CALL sp_GetOrderByNumber(?)`,
        [orderNumber]
    );

    // sp_GetOrderByNumber returns 2 result sets:
    // 1. Order details
    // 2. Order items
    return {
        order: results[0] ? results[0][0] : null,
        items: results[1] || []
    };
};