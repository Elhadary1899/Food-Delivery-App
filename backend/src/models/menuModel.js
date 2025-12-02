const db = require("../utils/db");

// ===================================================
// GET ALL RESTAURANTS (with pagination)
// ===================================================
exports.getRestaurants = async (offset, limit) => {
    const [rows] = await db.query(
        `
        SELECT 
            r.RestaurantID AS restaurant_id,
            r.Name,
            r.Address,
            r.imageURL AS image_url,
            COALESCE(AVG(rv.Rating), 0) AS rating
        FROM Restaurant r
        LEFT JOIN FoodItems fi ON fi.RestaurantID = r.RestaurantID
        LEFT JOIN Reviews rv ON rv.ItemID = fi.ItemID
        GROUP BY r.RestaurantID
        ORDER BY rating DESC, r.Name
        LIMIT ? OFFSET ?
        `,
        [limit, offset]
    );

    return rows;
};

// ===================================================
// SEARCH RESTAURANTS
// ===================================================
exports.searchRestaurants = async (keyword) => {
    const [rows] = await db.query(
        `
        SELECT 
            RestaurantID AS restaurant_id,
            Name,
            Address,
            imageURL AS image_url
        FROM Restaurant
        WHERE Name LIKE CONCAT('%', ?, '%')
        ORDER BY Name
        `,
        [keyword]
    );

    return rows;
};

// ===================================================
// GET MENU FOR A SPECIFIC RESTAURANT
// ===================================================
exports.getRestaurantMenu = async (restaurantId) => {

    // GET RESTAURANT BASIC INFO + RATING
    const [[restaurant]] = await db.query(
        `
        SELECT 
            r.RestaurantID AS id,
            r.Name,
            r.Address,
            r.imageURL AS image_url,
            COALESCE(AVG(rv.Rating), 0) AS rating
        FROM Restaurant r
        LEFT JOIN FoodItems fi ON fi.RestaurantID = r.RestaurantID
        LEFT JOIN Reviews rv ON rv.ItemID = fi.ItemID
        WHERE r.RestaurantID = ?
        GROUP BY r.RestaurantID
        `,
        [restaurantId]
    );

    if (!restaurant) {
        return null; // controller will handle this
    }

    // GET ONLY CATEGORIES THIS RESTAURANT USES
    const [categories] = await db.query(
        `
        SELECT DISTINCT
            c.CategoryID,
            c.CategoryName,
            c.ImageURL
        FROM FoodCategory c
        JOIN FoodItems f ON f.CategoryID = c.CategoryID
        WHERE f.RestaurantID = ?
        ORDER BY c.CategoryName
        `,
        [restaurantId]
    );

    // GET ALL ITEMS IN THIS RESTAURANT
    const [items] = await db.query(
        `
        SELECT 
            f.ItemID,
            f.ItemName,
            f.ItemDescription,
            f.Price,
            f.CategoryID,
            c.CategoryName,
            c.ImageURL,
            COALESCE(AVG(r.Rating), 0) AS avg_rating,
            COUNT(r.ReviewID) AS review_count
        FROM FoodItems f
        JOIN FoodCategory c ON c.CategoryID = f.CategoryID
        LEFT JOIN Reviews r ON r.ItemID = f.ItemID
        WHERE f.RestaurantID = ?
        GROUP BY f.ItemID
        ORDER BY f.ItemName
        `,
        [restaurantId]
    );

    return { restaurant, categories, items };
};

// ===================================================
// SEARCH Items within Restaurant
// ===================================================
exports.searchRestaurantItems = async (restaurantId, keyword) => {
    const [rows] = await db.query(
        `
        SELECT 
            f.ItemID,
            f.ItemName,
            f.ItemDescription,
            f.Price,
            f.CategoryID,
            c.CategoryName
        FROM FoodItems f
        JOIN FoodCategory c ON f.CategoryID = c.CategoryID
        WHERE f.RestaurantID = ?
          AND (f.ItemName LIKE CONCAT('%', ?, '%')
               OR f.ItemDescription LIKE CONCAT('%', ?, '%'))
        ORDER BY f.ItemName
        `,
        [restaurantId, keyword, keyword]
    );

    return rows;
};

