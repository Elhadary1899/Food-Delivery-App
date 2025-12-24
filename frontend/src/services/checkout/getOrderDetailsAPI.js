import axios from "axios";

export function getOrderDetailsAPI(orderNumber, token) {
  return axios.get(`http://localhost:4000/api/checkout/${orderNumber}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
