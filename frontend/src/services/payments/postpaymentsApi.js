import axios from "axios"; 
const API = "http://localhost:4000/api"; 

export function postpayments(body, token) {
  return axios.post(`${API}/profile/payments`, body, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
}
