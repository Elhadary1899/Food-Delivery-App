const db = require("../utils/db");

// Normalize CALL output
function normalize(result) {
    if (!Array.isArray(result)) return result;
    return Array.isArray(result[0]) ? result[0] : result;
}

// ===================================================
// GET USER ORDERS (DELIVERED/COMPLETED AND CANCELLED)
// ===================================================
exports.getUserOrders = async (userId, status = null) => {
    let query = `
        SELECT 
            o.OrderID,
            CONCAT('ORD-', LPAD(o.OrderID, 8, '0')) AS order_number,
            o.OrderDate,
            o.TotalAccount,
            o.DeliveryFee,
            (o.TotalAccount + o.DeliveryFee) AS grand_total,
            o.OrderStatus,
            COUNT(oi.OrderItemID) AS item_count,
            sa.Address,
            sa.City,
            sa.Country
        FROM Orders o
        LEFT JOIN OrderItems oi ON o.OrderID = oi.OrderID
        LEFT JOIN ShippingAddress sa ON o.ShippingAddressID = sa.ShippingAddressID
        WHERE o.UserID = ?
    `;
    
    const params = [userId];
    
    if (status) {
        query += ` AND o.OrderStatus = ?`;
        params.push(status);
    } else {
        query += ` AND o.OrderStatus IN ('Completed', 'Delivered', 'Cancelled')`;
    }
    
    query += ` GROUP BY o.OrderID ORDER BY o.OrderDate DESC`;
    
    const [orders] = await db.query(query, params);
    
    // Get order items for each order
    const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
            const [items] = await db.query(
                `SELECT 
                    f.ItemName,
                    f.ItemDescription,
                    f.ImageURL,
                    oi.Quantity,
                    oi.Price,
                    (oi.Quantity * oi.Price) AS subtotal
                FROM OrderItems oi
                JOIN FoodItems f ON oi.ItemID = f.ItemID
                WHERE oi.OrderID = ?`,
                [order.OrderID]
            );
            
            return {
                order_id: order.OrderID,
                order_number: order.order_number,
                order_date: order.OrderDate,
                total_amount: parseFloat(order.TotalAccount),
                delivery_fee: parseFloat(order.DeliveryFee),
                grand_total: parseFloat(order.grand_total),
                order_status: order.OrderStatus,
                item_count: order.item_count,
                shipping_address: {
                    address: order.Address,
                    city: order.City,
                    country: order.Country
                },
                items: items.map(item => ({
                    item_name: item.ItemName,
                    description: item.ItemDescription,
                    image_url: item.ImageURL,
                    quantity: item.Quantity,
                    price: parseFloat(item.Price),
                    subtotal: parseFloat(item.subtotal)
                }))
            };
        })
    );
    
    return ordersWithItems;
};

// ===================================================
// GET USER ADDRESSES
// ===================================================
exports.getUserAddresses = async (userId) => {
    const [addresses] = await db.query(
        `SELECT 
            ShippingAddressID,
            Address,
            PostalCode,
            City,
            Country
        FROM ShippingAddress
        WHERE UserID = ?
        ORDER BY ShippingAddressID DESC`,
        [userId]
    );
    
    return addresses.map(addr => ({
        address_id: addr.ShippingAddressID,
        address: addr.Address,
        postal_code: addr.PostalCode,
        city: addr.City,
        country: addr.Country
    }));
};

// ===================================================
// GET USER ACCOUNT DETAILS
// ===================================================
exports.getUserAccountDetails = async (userId) => {
    const [users] = await db.query(
        `SELECT 
            UserID,
            username,
            email,
            PhoneNumber,
            marketing_opt,
            role
        FROM Users
        WHERE UserID = ?`,
        [userId]
    );
    
    if (users.length === 0) {
        throw new Error("User not found");
    }
    
    const user = users[0];
    
    // Get default address if exists
    const [addresses] = await db.query(
        `SELECT Address, PostalCode, City, Country
        FROM ShippingAddress
        WHERE UserID = ?
        ORDER BY ShippingAddressID DESC
        LIMIT 1`,
        [userId]
    );
    
    return {
        user_id: user.UserID,
        username: user.username,
        email: user.email,
        phone_number: user.PhoneNumber || null,
        address: addresses.length > 0 ? {
            address: addresses[0].Address,
            postal_code: addresses[0].PostalCode,
            city: addresses[0].City,
            country: addresses[0].Country
        } : null,
        marketing_opt: user.marketing_opt === 1,
        role: user.role
    };
};

// ===================================================
// UPDATE USER ACCOUNT DETAILS
// ===================================================
exports.updateUserAccountDetails = async (userId, updateData) => {
    const updates = [];
    const params = [];
    
    if (updateData.username !== undefined) {
        updates.push("username = ?");
        params.push(updateData.username);
    }
    
    if (updateData.email !== undefined) {
        updates.push("email = ?");
        params.push(updateData.email);
    }
    
    if (updateData.phone_number !== undefined) {
        updates.push("PhoneNumber = ?");
        params.push(updateData.phone_number);
    }
    
    if (updateData.marketing_opt !== undefined) {
        updates.push("marketing_opt = ?");
        params.push(updateData.marketing_opt);
    }
    
    if (updates.length === 0) {
        throw new Error("No fields to update");
    }
    
    params.push(userId);
    
    const [result] = await db.query(
        `UPDATE Users SET ${updates.join(", ")} WHERE UserID = ?`,
        params
    );
    
    // Update address if provided
    if (updateData.address) {
        const addressData = updateData.address;
        
        // Check if user has an address
        const [existingAddresses] = await db.query(
            `SELECT ShippingAddressID FROM ShippingAddress WHERE UserID = ? LIMIT 1`,
            [userId]
        );
        
        if (existingAddresses.length > 0) {
            // Update existing address
            await db.query(
                `UPDATE ShippingAddress 
                SET Address = ?, PostalCode = ?, City = ?, Country = ?
                WHERE ShippingAddressID = ?`,
                [
                    addressData.address,
                    addressData.postal_code,
                    addressData.city,
                    addressData.country,
                    existingAddresses[0].ShippingAddressID
                ]
            );
        } else {
            // Create new address
            await db.query(
                `INSERT INTO ShippingAddress (UserID, Address, PostalCode, City, Country)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    userId,
                    addressData.address,
                    addressData.postal_code,
                    addressData.city,
                    addressData.country
                ]
            );
        }
    }
    
    return { message: "Account details updated successfully" };
};

// ===================================================
// GET USER COUPONS
// ===================================================
exports.getUserCoupons = async (userId) => {
    const [coupons] = await db.query(
        `SELECT 
            CouponID,
            CouponCode,
            DiscountAmount,
            DiscountType,
            ExpiryDate,
            IsUsed,
            CreatedAt
        FROM Coupons
        WHERE UserID = ?
        ORDER BY CreatedAt DESC`,
        [userId]
    );
    
    return coupons.map(coupon => ({
        coupon_id: coupon.CouponID,
        coupon_code: coupon.CouponCode,
        discount_amount: parseFloat(coupon.DiscountAmount),
        discount_type: coupon.DiscountType,
        expiry_date: coupon.ExpiryDate,
        is_used: coupon.IsUsed === 1,
        created_at: coupon.CreatedAt
    }));
};

// ===================================================
// GET USER PAYMENTS
// ===================================================
exports.getUserPayments = async (userId) => {
    const [payments] = await db.query(
        `SELECT 
            PaymentID,
            PaymentMethod,
            CardholderName,
            CASE 
                WHEN CardNumber IS NOT NULL THEN CONCAT('****', RIGHT(CardNumber, 4))
                ELSE NULL
            END AS masked_card_number,
            ExpirationDate
        FROM Payment
        WHERE UserID = ?
        ORDER BY PaymentID DESC`,
        [userId]
    );
    
    return payments.map(payment => ({
        payment_id: payment.PaymentID,
        payment_method: payment.PaymentMethod,
        cardholder_name: payment.CardholderName || null,
        masked_card_number: payment.masked_card_number,
        expiration_date: payment.ExpirationDate || null
    }));
};

