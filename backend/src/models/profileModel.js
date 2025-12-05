const db = require("../utils/db");

// Normalize CALL output
function normalize(result) {
    if (!Array.isArray(result)) return result;
    return Array.isArray(result[0]) ? result[0] : result;
}

// ===================================================
// GET USER ORDERS (DELIVERED AND CANCELLED)
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
            sa.Address,
            sa.City,
            sa.Country,
            p.PaymentMethod
        FROM Orders o
        LEFT JOIN ShippingAddress sa ON o.ShippingAddressID = sa.ShippingAddressID
        LEFT JOIN Payment p ON o.PaymentID = p.PaymentID
        WHERE o.UserID = ?
    `;

    const params = [userId];

    if (status) {
        query += ` AND o.OrderStatus = ?`;
        params.push(status);
    } else {
        // Only valid statuses in the new schema
        query += ` AND o.OrderStatus IN ('Delivered', 'Cancelled')`;
    }

    query += ` ORDER BY o.OrderDate DESC`;

    const [orders] = await db.query(query, params);

    // Fetch items per order
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

            const formattedDate = new Date(order.OrderDate).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true
            });

            return {
                order_id: order.OrderID,
                order_number: order.order_number,
                order_date: order.OrderDate,
                order_date_formatted: formattedDate,
                total_amount: parseFloat(order.TotalAccount),
                delivery_fee: parseFloat(order.DeliveryFee),
                grand_total: parseFloat(order.grand_total),
                order_status: order.OrderStatus,
                payment_method: order.PaymentMethod,
                item_count: items.length,
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
            AddressName,
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
        address_name: addr.AddressName,
        address: addr.Address,
        postal_code: addr.PostalCode,
        city: addr.City,
        country: addr.Country
    }));
};

// ===================================================
// ADD ADDRESS TO THE USER
// ===================================================
exports.addUserAddress = async (userId, data) => {
    const [result] = await db.query(
        `INSERT INTO ShippingAddress (UserID, AddressName, Address, PostalCode, City, Country)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, data.address_name, data.address, data.postal_code, data.city, data.country]
    );

    return {
        address_id: result.insertId,
        address_name: data.address_name,
        address: data.address,
        postal_code: data.postal_code,
        city: data.city,
        country: data.country
    };
};

// ===================================================
// UPDATE USER ADDRESS
// ===================================================
exports.updateUserAddress = async (userId, addressId, data) => {
    const fields = [];
    const params = [];

    if (data.address) {
        fields.push("Address = ?");
        params.push(data.address);
    }
    if (data.postal_code) {
        fields.push("PostalCode = ?");
        params.push(data.postal_code);
    }
    if (data.city) {
        fields.push("City = ?");
        params.push(data.city);
    }
    if (data.country) {
        fields.push("Country = ?");
        params.push(data.country);
    }

    params.push(addressId, userId);

    await db.query(
        `UPDATE ShippingAddress SET ${fields.join(", ")}
         WHERE ShippingAddressID = ? AND UserID = ?`,
        params
    );

    return { message: "Address updated successfully" };
};

// ===================================================
// DELETE USER ADDRESS
// ===================================================
exports.deleteUserAddress = async (userId, addressId) => {
    await db.query(
        `DELETE FROM ShippingAddress WHERE ShippingAddressID = ? AND UserID = ?`,
        [addressId, userId]
    );

    return { message: "Address deleted successfully" };
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
        title: `$${coupon.DiscountAmount} Off On Your Next Order`,
        discount_amount: parseFloat(coupon.DiscountAmount),
        discount_type: coupon.DiscountType,
        expiry_date: formatDate(coupon.ExpiryDate),
        is_used: coupon.IsUsed === 1,
        created_at: coupon.CreatedAt,
        icon: "icons/coupon.png"
    }));
};

function formatDate(date) {
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    return `${month}/${day}/${year}`;
}

// ===================================================
// GET USER PAYMENTS
// ===================================================
exports.getUserPayments = async (userId) => {

    const [rows] = await db.query(
        `SELECT PaymentID AS payment_id,
        PaymentName AS payment_name,
        PaymentMethod AS method,
        CardNumber,
        DATE_FORMAT(ExpirationDate, '%m/%Y') AS exp
        FROM Payment
        WHERE UserID = ?`,
        [userId]
    );

    return rows.map(p => ({
        payment_id: p.payment_id,
        payment_name: p.payment_name,
        method: p.method,
        last4: p.CardNumber ? p.CardNumber.slice(-4) : null,
        exp: p.exp,
        brand_icon: getBrandIcon(p.method)
    }));

};

function getBrandIcon(method) {
    if (!method) return null;
    return `icons/${method}.png`;  // dynamic icon path
}

// ===================================================
// ADD PAYMENT Method
// ===================================================
exports.addPaymentMethod = async (userId, data) => {
    const last4 = data.number ? data.number.slice(-4) : null;
    const paymentName = `${data.method} ${last4 || ""}`.trim();

    const [result] = await db.query(
        `INSERT INTO Payment (UserID, PaymentName, PaymentMethod, CardholderName, CardNumber, ExpirationDate, CVC)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            userId,
            paymentName,
            data.method,
            data.cardholder || null,
            data.number || null,
            data.exp || null,
            data.cvc || null
        ]
    );

    return {
        payment_id: result.insertId,
        payment_name: paymentName,
        method: data.method,
        last4,
        exp: data.exp,
        brand_icon: `icons/${data.method}.png`
    };
};

// ===================================================
// DELETE PAYMENT Method
// ===================================================
exports.deletePaymentMethod = async (userId, paymentId) => {
    await db.query(
        `DELETE FROM Payment WHERE PaymentID = ? AND UserID = ?`,
        [paymentId, userId]
    );
};