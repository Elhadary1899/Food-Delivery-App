const profileModel = require("../models/profileModel");
const response = require("../utils/response");

// ===================================================
// GET USER ORDERS (DELIVERED/COMPLETED AND CANCELLED)
// ===================================================
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const status = req.query.status || null;

        const orders = await profileModel.getUserOrders(userId, status);

        return response.success(res, { orders });
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// GET USER ADDRESSES
// ===================================================
exports.getUserAddresses = async (req, res) => {
    try {
        const userId = req.user.userId;

        const addresses = await profileModel.getUserAddresses(userId);

        return response.success(res, { addresses });
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// ADD ADDRESS TO THE USER
// ===================================================
exports.addUserAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { address_name, address, postal_code, city, country } = req.body;

        if (!address_name || !address || !city || !country) {
            return response.error(res, "Address name, address, city and country are required", 400);
        }

        const newAddress = await profileModel.addUserAddress(userId, {
            address_name,
            address,
            postal_code,
            city,
            country
        });

        return response.success(res, { address: newAddress });

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// UPDATE USER ADDRESS
// ===================================================
exports.updateUserAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addressId = parseInt(req.params.addressId);
        const { address, postal_code, city, country } = req.body;

        if (!address && !postal_code && !city && !country) {
            return response.error(res, "No fields provided for update", 400);
        }

        const updated = await profileModel.updateUserAddress(userId, addressId, {
            address, postal_code, city, country
        });

        return response.success(res, { updated });

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// DELETE USER ADDRESS
// ===================================================
exports.deleteUserAddress = async (req, res) => {
    try {
        const userId = req.user.userId;
        const addressId = parseInt(req.params.addressId);

        const result = await profileModel.deleteUserAddress(userId, addressId);

        return response.success(res, result);
    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// GET USER ACCOUNT DETAILS
// ===================================================
exports.getUserAccountDetails = async (req, res) => {
    try {
        const userId = req.user.userId;

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
        const userId = req.user.userId;
        const { full_name, username, email, phone_number, address, marketing_opt } = req.body;

        if (!full_name && !username && !email && phone_number === undefined && !address && marketing_opt === undefined) {
            return response.error(res, "At least one field must be provided for update", 400);
        }

        if (email && !email.includes('@gmail.com')) {
            return response.error(res, "Email must be a Gmail address", 400);
        }

        const updateData = {};

        if (full_name) updateData.username = full_name;
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
       const userId = req.user.userId;
        
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
        const userId = req.user.userId;

        const payments = await profileModel.getUserPayments(userId);

        return response.success(res, { payments });

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// ADD PAYMENT Method
// ===================================================
exports.addPaymentMethod = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { payment_name, method, cardholder, number, exp, cvc } = req.body;

        if (!payment_name || !method) {
            return response.error(res, "Payment name and method are required", 400);
        }

        const payment = await profileModel.addPaymentMethod(userId, {
            payment_name,
            method,
            cardholder,
            number,
            exp,
            cvc
        });

        return response.success(res, { payment });

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ===================================================
// DELETE PAYMENT Method
// ===================================================
exports.deletePaymentMethod = async (req, res) => {
    try {
        const userId = req.user.userId;
        const paymentId = parseInt(req.params.paymentId);

        await profileModel.deletePaymentMethod(userId, paymentId);

        return response.success(res, { message: "Payment deleted" });

    } catch (err) {
        return response.error(res, err.message);
    }
};
