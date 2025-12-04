// const cron = require("node-cron");
// const db = require("../utils/db");

// async function updateOrderStatuses() {
//     const now = new Date();

//     // Active orders only
//     const [orders] = await db.query(`
//         SELECT OrderID, OrderDate, OrderStatus
//         FROM Orders
//         WHERE OrderStatus IN ('Pending', 'Being Prepared', 'On The Way')
//     `);

//     for (const order of orders) {
//         const createdAt = new Date(order.OrderDate);
//         const diffSec = (now - createdAt) / 1000;

//         let nextStatus = null;

//         if (diffSec >= 0 && diffSec < 30) nextStatus = 'Pending';
//         else if (diffSec >= 30 && diffSec < 60) nextStatus = 'Being Prepared';
//         else if (diffSec >= 60 && diffSec < 90) nextStatus = 'On The Way';
//         else if (diffSec >= 90) nextStatus = 'Delivered';

//         // Skip if no change needed
//         if (!nextStatus || nextStatus === order.OrderStatus) continue;

//         // Update database
//         await db.query(
//             `UPDATE Orders SET OrderStatus = ? WHERE OrderID = ?`,
//             [nextStatus, order.OrderID]
//         );

//         // Keep history if needed
//         await db.query(
//             `INSERT INTO OrderStatusHistory (OrderID, Status) VALUES (?, ?)`,
//             [order.OrderID, nextStatus]
//         );

//         console.log(`Order ${order.OrderID} updated → ${nextStatus}`);
//     }
// }

// // Run every 30 seconds
// cron.schedule("*/30 * * * * *", updateOrderStatuses);

// module.exports = updateOrderStatuses;


const cron = require("node-cron");
const db = require("../utils/db");

async function updateOrderStatuses() {
    const now = new Date();

    const [orders] = await db.query(`
        SELECT OrderID, OrderDate, OrderStatus
        FROM Orders
        WHERE OrderStatus IN ('Pending', 'Being Prepared', 'On The Way')
    `);

    for (const order of orders) {
        const createdAt = new Date(order.OrderDate);
        const diffSec = (now - createdAt) / 1000;

        let nextStatus = null;

        if (diffSec < 120) nextStatus = 'Pending';                       // 0–2 min
        else if (diffSec < 240) nextStatus = 'Being Prepared';           // 2–4 min
        else if (diffSec < 360) nextStatus = 'On The Way';               // 4–6 min
        else nextStatus = 'Delivered';                                   // 6+ min

        if (nextStatus === order.OrderStatus) continue;

        await db.query(
            `UPDATE Orders SET OrderStatus = ? WHERE OrderID = ?`,
            [nextStatus, order.OrderID]
        );

        await db.query(
            `INSERT INTO OrderStatusHistory (OrderID, Status) VALUES (?, ?)`,
            [order.OrderID, nextStatus]
        );

        console.log(`Order ${order.OrderID} updated → ${nextStatus}`);
    }
}

// run every **30 seconds** so it checks updates often
cron.schedule("*/30 * * * * *", updateOrderStatuses);

module.exports = updateOrderStatuses;