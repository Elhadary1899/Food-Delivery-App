const profileModel = require("../models/profileModel");
const response = require("../utils/response");

// ===================================================
// GET USER ORDERS (DELIVERED/COMPLETED AND CANCELLED)
// ===================================================
exports.getUserOrders = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const status = req.query.status; // Optional: 'Completed', 'Delivered', 'Cancelled'
        
        if (!userId || isNaN(userId)) {
            return response.error(res, "Invalid user ID", 400);
        }
        
        const orders = await profileModel.getUserOrders(userId, status);
        
        // Separate completed and cancelled orders
        const completedOrders = orders.filter(order => 
            order.order_status === 'Completed' || order.order_status === 'Delivered'
        );
        const cancelledOrders = orders.filter(order => 
            order.order_status === 'Cancelled'
        );
        
        return response.success(res, {
            completed_orders: completedOrders,
            cancelled_orders: cancelledOrders,
            all_orders: orders
        });
        
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// GET USER ADDRESSES
// ===================================================
exports.getUserAddresses = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        if (!userId || isNaN(userId)) {
            return response.error(res, "Invalid user ID", 400);
        }
        
        const addresses = await profileModel.getUserAddresses(userId);
        
        return response.success(res, { addresses });
        
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// GET USER ACCOUNT DETAILS
// ===================================================
exports.getUserAccountDetails = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        if (!userId || isNaN(userId)) {
            return response.error(res, "Invalid user ID", 400);
        }
        
        const accountDetails = await profileModel.getUserAccountDetails(userId);
        
        return response.success(res, { account: accountDetails });
        
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// UPDATE USER ACCOUNT DETAILS
// ===================================================
exports.updateUserAccountDetails = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        const { username, email, phone_number, address, marketing_opt } = req.body;
        
        if (!userId || isNaN(userId)) {
            return response.error(res, "Invalid user ID", 400);
        }
        
        // Validate that at least one field is provided
        if (!username && !email && phone_number === undefined && !address && marketing_opt === undefined) {
            return response.error(res, "At least one field must be provided for update", 400);
        }
        
        // Validate email format if provided
        if (email && !email.includes('@gmail.com')) {
            return response.error(res, "Email must be a Gmail address", 400);
        }
        
        // Validate address structure if provided
        if (address) {
            if (!address.address || !address.city || !address.country) {
                return response.error(res, "Address must include address, city, and country", 400);
            }
        }
        
        const updateData = {};
        if (username) updateData.username = username;
        if (email) updateData.email = email;
        if (phone_number !== undefined) updateData.phone_number = phone_number;
        if (address) updateData.address = address;
        if (marketing_opt !== undefined) updateData.marketing_opt = marketing_opt;
        
        const result = await profileModel.updateUserAccountDetails(userId, updateData);
        
        return response.success(res, result);
        
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// GET USER COUPONS
// ===================================================
exports.getUserCoupons = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        if (!userId || isNaN(userId)) {
            return response.error(res, "Invalid user ID", 400);
        }
        
        const coupons = await profileModel.getUserCoupons(userId);
        
        return response.success(res, { coupons });
        
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// GET USER PAYMENTS
// ===================================================
exports.getUserPayments = async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        
        if (!userId || isNaN(userId)) {
            return response.error(res, "Invalid user ID", 400);
        }
        
        const payments = await profileModel.getUserPayments(userId);
        
        return response.success(res, { payments });
        
    } catch (err) {
        return response.error(res, err.message);
    }
};

