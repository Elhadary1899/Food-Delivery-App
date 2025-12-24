// src/services/tracking.api.js
import axios from "axios";

const API = "http://localhost:4000/api/tracking";

// GET tracking status by orderId or orderNumber
export function getTrackingStatusAPI(orderId, token) {
  return axios.get(`${API}/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

// DELETE cancel order
export function cancelOrderAPI(orderId, token) {
  return axios.delete(`${API}/${orderId}/cancel`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
