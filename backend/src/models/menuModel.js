const db = require("../utils/db");

// Normalize CALL output
function normalize(result) {
    if (!Array.isArray(result)) return result;
    return Array.isArray(result[0]) ? result[0] : result;
}

// ===================================================
// GET ALL RESTAURANTS
// ===================================================
exports.getRestaurants = async () => {
    const [result] = await db.query(`CALL sp_GetAllRestaurants()`);

    return result[0].map(r => ({
        restaurant_name: r.RestaurantName,
        rating: r.RestaurantRating,
        image_url: r.ImageURL
    }));
};

// ===================================================
// SEARCH RESTAURANTS BY NAME
// ===================================================
exports.searchRestaurants = async (keyword) => {
    const [rows] = await db.query(
        `
        SELECT RestaurantName, RestaurantRating, imageURL AS ImageURL
        FROM Restaurant
        WHERE RestaurantName LIKE CONCAT('%', ?, '%')
        ORDER BY RestaurantName
        `,
        [keyword]
    );

    return rows.map(r => ({
        restaurant_name: r.RestaurantName,
        rating: r.RestaurantRating,
        image_url: r.ImageURL || null
    }));
};

// ===================================================
// GET MENU FOR A SPECIFIC RESTAURANT
// ===================================================
function normalize(result) {
    if (!Array.isArray(result)) return result;
    return Array.isArray(result[0]) ? result[0] : result;
}

exports.getRestaurantMenu = async (restaurantName) => {
    const decodedName = decodeURIComponent(restaurantName);

    // Fetch categories
    const [catResult] = await db.query(
        `CALL sp_GetCategoriesByRestaurant(?)`,
        [decodedName]
    );

    // Normalize CALL output
    const categoriesRaw =
        Array.isArray(catResult) && Array.isArray(catResult[0])
            ? catResult[0]
            : catResult;

    // Build category objects with empty items arrays
    const categories = categoriesRaw.map(c => ({
        category_name: c.CategoryName,
        image_url: c.ImageURL,
        items: []
    }));

    // Fetch items
    const [itemResult] = await db.query(
        `CALL sp_GetFoodItemsByRestaurant(?)`,
        [decodedName]
    );

    const itemsRaw =
        Array.isArray(itemResult) && Array.isArray(itemResult[0])
            ? itemResult[0]
            : itemResult;

    // Assign items to their categories
    itemsRaw.forEach(item => {
        const category = categories.find(c => c.category_name === item.CategoryName);
        if (category) {
            category.items.push({
                item_name: item.ItemName,
                description: item.ItemDescription,
                price: item.Price,
                image_url: item.ImageURL,
                avg_rating: item.avg_rating,
                review_count: item.review_count
            });
        }
    });

    return { categories };
};

// ===================================================
// SEARCH ITEMS INSIDE A RESTAURANT
// ===================================================
exports.searchRestaurantItems = async (restaurantName, keyword) => {
    const decodedName = decodeURIComponent(restaurantName);

    const [result] = await db.query(
        `CALL sp_SearchFoodInRestaurant(?, ?)`,
        [decodedName, keyword]
    );

    const rows = normalize(result);

    return rows.map(i => ({
        item_id: i.ItemID,
        item_name: i.ItemName,
        description: i.ItemDescription,
        price: i.Price,
        image_url: i.ImageURL,
        category_name: i.CategoryName,
        avg_rating: i.avg_rating,
        review_count: i.review_count
    }));
};