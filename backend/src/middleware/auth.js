const jwt = require('jsonwebtoken');
const response = require('../utils/response');
const db = require("../utils/db");

// ============================================
// VERIFY JWT TOKEN
// ============================================
exports.protect = async (req, res, next) => {
    try {
        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return response.error(res, "Not authorized", 401);
        }

        // 1. Check blacklist
        const [rows] = await db.query(
            "SELECT id FROM token_blacklist WHERE token = ?",
            [token]
        );

        if (rows.length > 0) {
            return response.error(res, "Token has been revoked. Please log in again.", 401);
        }

        // 2. Verify token validity
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user to request
        req.user = decoded;
        req.token = token;
        next();
    } catch (err) {
        return response.error(res, err.message, 401);
    }
};

// ============================================
// AUTHORIZE SPECIFIC ROLES
// ============================================
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return response.error(
                res,
                `User role ${req.user.role} is not authorized to access this route`,
                403
            );
        }
        next();
    };
};