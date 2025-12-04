const db = require("../utils/db");
const response = require("../utils/response");

// ===================================================
// ORDER CANCELLATION
// ===================================================
exports.cancelOrder = async (req, res) => {
    const orderId = req.params.orderId;

    const [[order]] = await db.query(
        `SELECT OrderStatus FROM Orders WHERE OrderID = ?`,
        [orderId]
    );

    if (!order) {
        return response.error(res, "Order not found", 404);
    }

    if (!['Pending', 'Being Prepared'].includes(order.OrderStatus)) {
        return response.error(res, "You cannot cancel this order anymore", 400);
    }

    await db.query(
        `UPDATE Orders SET OrderStatus = 'Cancelled' WHERE OrderID = ?`,
        [orderId]
    );

    await db.query(
        `INSERT INTO OrderStatusHistory (OrderID, Status) VALUES (?, 'Cancelled')`,
        [orderId]
    );

    return response.success(res, { message: "Order cancelled successfully" });
};

// ===================================================
// GET ORDER TRACKING (UPDATED EVERY 30 SECONDS)
// ===================================================
exports.getOrderTracking = async (req, res) => {
    const orderId = req.params.orderId;

    const [[order]] = await db.query(`
        SELECT OrderID, OrderStatus, OrderDate
        FROM Orders WHERE OrderID = ?
    `, [orderId]);

    const [history] = await db.query(`
        SELECT Status, Timestamp
        FROM OrderStatusHistory
        WHERE OrderID = ?
        ORDER BY Timestamp ASC
    `, [orderId]);

    return response.success(res, { order, history });
};
