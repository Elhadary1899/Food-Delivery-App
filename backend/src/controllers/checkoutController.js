const orderModel = require("../models/checkoutModel");
const response = require("../utils/response");
const db = require("../utils/db");

// ============================================
// GET CHECKOUT SUMMARY
// ============================================
exports.getCheckoutSummary = async (req, res) => {
    try {
        const userId = req.user.userId;
        const username = req.user.username;

        const checkoutData = await orderModel.getCheckoutSummary(userId);

        if (!checkoutData.items || checkoutData.items.length === 0) {
            return response.error(res, "Cart is empty", 400);
        }

        checkoutData.current_user = {
            id: userId,
            username: username
        };

        return response.success(res, checkoutData, "Checkout data retrieved successfully");
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// PLACE ORDER (ID-based)
// ============================================
exports.placeOrder = async (req, res) => {
    try {
        const userId = req.user.userId;
        const username = req.user.username;

        const { address_id, payment_id } = req.body;

        if (!address_id || !payment_id) {
            return response.error(res, "address_id and payment_id are required", 400);
        }

        const result = await orderModel.placeOrder(userId, address_id, payment_id);

        if (!result.order_number) {
            return response.error(res, "Failed to place order", 500);
        }

        result.ordered_by = username;

        return response.success(res, result, `Order placed successfully by ${username}`);
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// GET ORDER FULL DETAILS BY ORDER NUMBER
// ============================================
exports.getOrderFullDetails = async (req, res) => {
    try {
        let orderNumber = req.params.orderNumber;

        if (orderNumber.startsWith("ORD-")) {
            orderNumber = parseInt(orderNumber.replace("ORD-", ""));
        }

        const [[order]] = await db.query(`
            SELECT 
                o.OrderID,
                CONCAT('ORD-', LPAD(o.OrderID, 8, '0')) AS order_number,
                o.OrderStatus,
                o.OrderDate,
                o.TotalAccount,
                o.DeliveryFee,
                sa.AddressName,
                sa.Address,
                sa.City,
                sa.Country,
                p.PaymentMethod,
                p.CardNumber
            FROM Orders o
            JOIN ShippingAddress sa ON o.ShippingAddressID = sa.ShippingAddressID
            JOIN Payment p ON o.PaymentID = p.PaymentID
            WHERE o.OrderID = ?
        `, [orderNumber]);

        if (!order) {
            return response.error(res, "Order not found", 404);
        }

        // ✅ Convert numbers properly
        const totalAmount = parseFloat(order.TotalAccount);
        const deliveryFee = parseFloat(order.DeliveryFee);
        const grandTotal = (totalAmount + deliveryFee).toFixed(2);

        // ITEMS
        const [items] = await db.query(`
            SELECT 
                f.ItemName,
                f.ItemDescription,
                f.ImageURL,
                oi.Quantity,
                oi.Price,
                (oi.Quantity * oi.Price) AS subtotal
            FROM OrderItems oi
            JOIN FoodItems f ON oi.ItemID = f.ItemID
            WHERE oi.OrderID = ?
        `, [orderNumber]);

        // HISTORY
        const [history] = await db.query(`
            SELECT Status, Timestamp
            FROM OrderStatusHistory
            WHERE OrderID = ?
            ORDER BY Timestamp ASC
        `, [orderNumber]);

        return response.success(res, {
            order: {
                order_number: order.order_number,
                order_status: order.OrderStatus,
                order_date: order.OrderDate,
                total_amount: totalAmount.toFixed(2),
                delivery_fee: deliveryFee.toFixed(2),
                grand_total: grandTotal,
                payment_method: order.PaymentMethod,
                masked_card: order.CardNumber ? "****" + order.CardNumber.slice(-4) : null,
                shipping_address: {
                    name: order.AddressName,
                    address: order.Address,
                    city: order.City,
                    country: order.Country
                }
            },
            items: items.map(i => ({
                ...i,
                price: parseFloat(i.Price),
                subtotal: parseFloat(i.subtotal)
            })),
            history
        });

    } catch (err) {
        return response.error(res, err.message);
    }
};