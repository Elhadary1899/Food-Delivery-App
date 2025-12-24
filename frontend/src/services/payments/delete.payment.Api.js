import axios from "axios";
const API = "http://localhost:4000/api";

export function deletepayment(paymentId, token) {
  return axios.delete(`${API}/profile/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}