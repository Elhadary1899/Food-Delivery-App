const authModel = require("../models/authModel");
const response = require("../utils/response");
const jwt = require('jsonwebtoken');

// ============================================
// CREATE TOKEN (Helper function)
// ============================================
function createToken(user) {
    const token = jwt.sign(
        {
            userId: user.UserID || user.user_id,
            username: user.username,
            email: user.email,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
    
    return token;
}

// ============================================
// REGISTER NEW USER
// ============================================
exports.register = async (req, res) => {
    try {
        const { username, email, password, marketing_opt, role } = req.body;

        if (!username || !email || !password) {
            return response.error(res, "Missing required fields", 400);
        }

        const result = await authModel.registerUser(
            username,
            email,
            password,
            marketing_opt !== undefined ? marketing_opt : true,
            role || 'User'
        );

        if (result.message && result.message.includes('Error')) {
            return response.error(res, result.message, 400);
        }

        // Generate token
        const token = createToken(result);

        return response.success(
            res,
            {
                user_id: result.user_id,
                username: result.username,
                email: result.email,
                role: result.role,
                token: token
            },
            "User registered successfully"
        );

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// USER LOGIN
// ============================================
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return response.error(res, "Missing required fields", 400);
        }

        let user = null;

        if (identifier.includes('@')) {
            user = await authModel.loginUserByEmail(identifier, password);
        } else {
            user = await authModel.loginUserByUsername(identifier, password);
        }

        if (!user) {
            return response.error(res, "Invalid credentials", 401);
        }

        // Generate token
        const token = createToken(user);

        return response.success(
            res,
            {
                UserID: user.UserID,
                username: user.username,
                email: user.email,
                role: user.role,
                token: token
            },
            "Login successful"
        );

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// ADMIN LOGIN
// ============================================
exports.adminLogin = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return response.error(res, "Missing required fields", 400);
        }

        let admin = null;

        if (identifier.includes('@')) {
            admin = await authModel.loginAdminByEmail(identifier, password);
        } else {
            admin = await authModel.loginAdminByUsername(identifier, password);
        }

        if (!admin) {
            return response.error(res, "Invalid admin credentials", 401);
        }

        // Check if user is actually an admin
        if (admin.role !== 'Admin') {
            return response.error(res, "Not authorized as admin", 403);
        }

        // Generate token
        const token = createToken(admin);

        return response.success(
            res,
            {
                UserID: admin.UserID,
                username: admin.username,
                email: admin.email,
                role: admin.role,
                token: token
            },
            "Admin login successful"
        );

    } catch (err) {
        return response.error(res, err.message);
    }
};

// ============================================
// GET ME - Get current logged in user
// ============================================
exports.getMe = async (req, res) => {
    try {
        return response.success(res, req.user, "User retrieved successfully");
    } catch (err) {
        return response.error(res, err.message);
    }
};