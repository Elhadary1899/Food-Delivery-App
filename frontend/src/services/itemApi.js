// src/services/itemApi.js
import axios from "axios";
const API = "http://localhost:4000/api";

export const getItemDetails = async (restaurantName, itemName) => {
  try {
    const response = await axios.get(
      `${API}/items/${restaurantName}/${itemName}`
    );
    console.log(response.data);
    return response;
  } catch (err) {
    console.error("Error fetching item details:", err);
    throw err;
  }
};