
import axios from "axios"; 
const API = "http://localhost:4000/api"; 


export function getpayments(token) {
  return axios.get(`${API}/profile/payments`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}