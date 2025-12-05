const db = require("../utils/db");
const response = require("../utils/response");

// ===================================================
// ADMIN: GET ALL ORDERS
// ===================================================
exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT 
                o.OrderID,
                CONCAT('ORD-', LPAD(o.OrderID, 8, '0')) AS order_number,
                o.UserID,
                u.username,
                u.email,
                o.OrderStatus,
                o.OrderDate,
                o.TotalAccount,
                o.DeliveryFee,
                (o.TotalAccount + o.DeliveryFee) AS grand_total,
                COUNT(oi.OrderItemID) AS item_count
            FROM Orders o
            JOIN Users u ON o.UserID = u.UserID
            LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
            GROUP BY o.OrderID
            ORDER BY o.OrderDate DESC
        `);

        const shaped = orders.map(o => ({
            order_id: o.OrderID,
            order_number: o.order_number,
            user_id: o.UserID,
            username: o.username,
            email: o.email,
            order_status: o.OrderStatus,
            order_date: o.OrderDate,
            total_amount: parseFloat(o.TotalAccount),
            delivery_fee: parseFloat(o.DeliveryFee),
            grand_total: parseFloat(o.grand_total),
            item_count: o.item_count
        }));

        return response.success(res, { orders: shaped });
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// CANCEL ORDER
// ===================================================
exports.cancelOrder = async (req, res) => {
    try {
        let orderId = req.params.orderId;
        const userId = req.user.userId;

        // Convert order number → numeric ID
        if (orderId.startsWith("ORD-")) {
            orderId = parseInt(orderId.replace("ORD-", ""));
        }

        // Get order + owner
        const [[order]] = await db.query(
            `SELECT UserID, OrderStatus FROM Orders WHERE OrderID = ?`,
            [orderId]
        );

        if (!order) {
            return response.error(res, "Order not found", 404);
        }

        // User can only cancel HIS order (unless admin)
        if (order.UserID !== userId && req.user.role !== "Admin") {
            return response.error(res, "You are not allowed to cancel this order", 403);
        }

        if (!['Placed', 'Being Prepared'].includes(order.OrderStatus)) {
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

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// GET ORDER TRACKING
// ===================================================
exports.getOrderTracking = async (req, res) => {
    try {
        let orderId = req.params.orderId;
        const userId = req.user.userId;

        // Convert order number → numeric ID
        if (orderId.startsWith("ORD-")) {
            orderId = parseInt(orderId.replace("ORD-", ""));
        }

        const [[order]] = await db.query(`
            SELECT OrderID, UserID, OrderStatus, OrderDate
            FROM Orders
            WHERE OrderID = ?
        `, [orderId]);

        if (!order) {
            return response.error(res, "Order not found", 404);
        }

        if (order.UserID !== userId && req.user.role !== "Admin") {
            return response.error(res, "You can only view your own order tracking", 403);
        }

        const [history] = await db.query(`
            SELECT Status, Timestamp
            FROM OrderStatusHistory
            WHERE OrderID = ?
            ORDER BY Timestamp ASC
        `, [orderId]);

        return response.success(res, { order, history });

    } catch (err) {
        return response.error(res, err.message);
    }
};