const db = require("../utils/db");

function normalize(result) {
    return Array.isArray(result[0]) ? result[0] : result;
}

// Register new user
exports.registerUser = async (username, email, password, phone, marketingOpt, role) => {
    const [result] = await db.query(
        `CALL sp_RegisterUser(?, ?, ?, ?, ?, ?)`,
        [username, email, password, phone, marketingOpt, role]
    );

    const rows = normalize(result);
    const r = rows[0];

    return {
        message: r.message,
        user_id: r.user_id,
        username: r.username,
        email: r.email,
        role: r.role
    };
};

// User login by email
exports.loginUserByEmail = async (email, password) => {
    const [result] = await db.query(
        `CALL sp_UserSignIn(?, ?)`,
        [email, password]
    );

    const rows = normalize(result);
    return rows.length > 0 ? rows[0] : null;
};

// User login by username
exports.loginUserByUsername = async (username, password) => {
    const [result] = await db.query(
        `CALL sp_UserSignInByUsername(?, ?)`,
        [username, password]
    );

    const rows = normalize(result);
    return rows.length > 0 ? rows[0] : null;
};

// Admin login by email
exports.loginAdminByEmail = async (email, password) => {
    const [result] = await db.query(
        `CALL sp_AdminSignIn(?, ?)`,
        [email, password]
    );

    const rows = normalize(result);
    return rows.length > 0 ? rows[0] : null;
};

// Admin login by username
exports.loginAdminByUsername = async (username, password) => {
    const [result] = await db.query(
        `CALL sp_AdminSignInByUsername(?, ?)`,
        [username, password]
    );

    const rows = normalize(result);
    return rows.length > 0 ? rows[0] : null;
};