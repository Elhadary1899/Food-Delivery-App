import axios from "axios";

const API = "http://localhost:4000/api";

// Fetch all restaurants
export const getRestaurants = async () => {
  try {
    const response = await axios.get(`${API}/home/restaurants`);
    return response;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};


// ✅ Search restaurants by keyword
export const searchRestaurants = async (query) => {
  try {
    // ✅ FIXED: endpoint path matches API docs
    const response = await axios.get(`${API}/menu/search?q=${encodeURIComponent(query)}`);
    return response;
  } catch (error) {
    console.error("Error searching restaurants:", error);
    throw error;
  }
};
