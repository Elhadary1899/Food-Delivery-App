const jwt = require('jsonwebtoken');
const response = require('../utils/response');

// ============================================
// VERIFY JWT TOKEN
// ============================================
exports.protect = async (req, res, next) => {
    try {
        let token;

        // Check if token exists in headers
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Make sure token exists
        if (!token) {
            return response.error(res, 'Not authorized to access this route', 401);
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Add user info to request (match your token structure)
            req.user = {
                userId: decoded.userId,      // ← Your token uses userId
                username: decoded.username,
                email: decoded.email,
                role: decoded.role
            };

            next();
        } catch (err) {
            return response.error(res, 'Not authorized to access this route', 401);
        }
    } catch (err) {
        return response.error(res, err.message);
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