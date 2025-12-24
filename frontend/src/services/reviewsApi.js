import axios from "axios";

const BASE_URL = "http://localhost:4000/api";

// ⭐ Fetch reviews for specific item
export const fetchReviews = async (restaurantName, itemName) => {
  try {
    const encodedItem = encodeURIComponent(itemName);
    const url = `${BASE_URL}/reviews/${restaurantName}/${encodedItem}`;
    const res = await axios.get(url);
    return res.data.data;
  } catch (error) {
    console.error("Fetch reviews error:", error.response?.data || error.message);
    throw error;
  }
};

// ⭐ Add new review (requires authentication)
export const addReview = async (
  { user_id, restaurant_name, item_name, rating, review },
  token
) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/reviews/add`,
      {
        user_id,
        restaurant_name,
        item_name,
        rating,
        review,
      },
      {
        headers: { Authorization: `Bearer ${token}` }, // backend expects token too
      }
    );

    console.log("Add review response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Add review error:", error.response?.data || error.message);
    throw error;
  }
};