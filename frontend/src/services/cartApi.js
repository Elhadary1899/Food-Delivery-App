import axios from "axios";

const BASE_URL = "http://localhost:4000/api/cart";

// Add an item to cart
export function addToCartAPI(payload, token) {
  return axios.post(`${BASE_URL}/add`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Get cart items for the authenticated user
export function getCartAPI(token) {
  return axios.get(`${BASE_URL}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Delete an item from the cart
export function removeFromCartAPI(payload, token) {
  return axios.delete(`${BASE_URL}/remove`, {
    data: payload,
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Increase quantity by 1
export function incrementCartItemAPI(payload, token) {
  return axios.put(`${BASE_URL}/increment`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Decrease quantity by 1
export function decrementCartItemAPI(payload, token) {
  return axios.put(`${BASE_URL}/decrement`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// Clear entire cart
export function clearCartAPI(token) {
  return axios.delete(`${BASE_URL}/clear`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}