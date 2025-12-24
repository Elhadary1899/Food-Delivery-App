// src/api/foodApi.js

const BASE_URL = "http://localhost:4000/api";

export async function getPopularDishes() {
  try {
    const response = await fetch(`${BASE_URL}/home/popular-dishes`);
    const data = await response.json();

    if (data.success && Array.isArray(data.data.popular_dishes)) {
      // Format data to fit FoodCard structure
      return data.data.popular_dishes.map((dish) => ({
        id: dish.item_id,
        name: dish.item_name,
        image: dish.image_url,
        price: dish.price,
        rating: dish.avg_rating,
        restaurantName: dish.restaurant_name,
        restaurantId: dish.restaurant_id || "",
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching popular dishes:", error);
    return [];
  }
}

export async function getItemDetails(itemId) {
  try {
    const response = await fetch(`${BASE_URL}/menu/item/${itemId}`);
    const data = await response.json();

    if (data.success) {
      return data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching item details:", error);
    return null;
  }
}