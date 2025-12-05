const cron = require("node-cron");
const db = require("../utils/db");

async function updateOrderStatuses() {
    try {
        const now = new Date();

        const [orders] = await db.query(`
            SELECT OrderID, OrderDate, OrderStatus
            FROM Orders
            WHERE OrderStatus IN ('Placed', 'Being Prepared', 'On The Way')
        `);

        for (const order of orders) {
            const createdAt = new Date(order.OrderDate);
            const diffSec = (now - createdAt) / 1000;

            let nextStatus = null;

            if (diffSec < 120) nextStatus = 'Placed';
            else if (diffSec < 240) nextStatus = 'Being Prepared';
            else if (diffSec < 360) nextStatus = 'On The Way';
            else nextStatus = 'Delivered';

            // Skip if no change
            if (nextStatus === order.OrderStatus) continue;

            // Update order
            await db.query(
                `UPDATE Orders SET OrderStatus = ? WHERE OrderID = ?`,
                [nextStatus, order.OrderID]
            );

            // Record history
            await db.query(
                `INSERT INTO OrderStatusHistory (OrderID, Status) VALUES (?, ?)`,
                [order.OrderID, nextStatus]
            );

            console.log(`Order ${order.OrderID} → ${nextStatus}`);
        }

    } catch (err) {
        console.error("Tracking job failed:", err);
    }
}

// Runs every 30 seconds
cron.schedule("*/30 * * * * *", updateOrderStatuses);

module.exports = updateOrderStatuses;