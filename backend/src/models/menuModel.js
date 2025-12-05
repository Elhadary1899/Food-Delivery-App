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
        image_url: r.imageURL || r.ImageURL || null,
        address: r.Address || null,
        restaurant_id: r.RestaurantID || null
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
// GET FULL MENU FOR A SPECIFIC RESTAURANT
// ===================================================
exports.getRestaurantMenu = async (restaurantName) => {
    const decodedName = decodeURIComponent(restaurantName);

    // -------------------------------
    // 1) Fetch Categories
    // -------------------------------
    const [catResult] = await db.query(
        `CALL sp_GetCategoriesByRestaurant(?)`,
        [decodedName]
    );

    const categoriesRaw = normalize(catResult);

    const categories = categoriesRaw.map(c => ({
        category_id: c.CategoryID,
        category_name: c.CategoryName,
        image_url: c.ImageURL,
        items: []
    }));

    // -------------------------------
    // 2) Fetch Items
    // -------------------------------
    const [itemResult] = await db.query(
        `CALL sp_GetFoodItemsByRestaurant(?)`,
        [decodedName]
    );

    const itemsRaw = normalize(itemResult);

    itemsRaw.forEach(item => {
        const category = categories.find(
            c => c.category_name === item.CategoryName
        );

        if (category) {
            category.items.push({
                item_id: item.ItemID || null,
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