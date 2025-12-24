// src/services/checkout.Api.js
import axios from "axios";

const BASE = "http://localhost:4000/api";

const token = () => localStorage.getItem("token");

// GET SUMMARY
export function getCheckoutSummaryAPI() {
  return axios.get(`${BASE}/checkout`, {
    headers: { Authorization: `Bearer ${token()}` },
  });
}

// ADD ADDRESS
export function addAddressAPI(data) {
  return axios.post(`${BASE}/profile/addresses`, data, {
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
  });
}

// ADD PAYMENT
export function addPaymentAPI(data) {
  return axios.post(`${BASE}/profile/payments`, data, {
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
  });
}

// PLACE ORDER
export function placeOrderAPI(data) {
  return axios.post(`${BASE}/checkout`, data, {
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
  });
}
