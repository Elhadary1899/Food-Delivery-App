// services/accountApi.js
import axios from "axios"; 
const API = "http://localhost:4000/api"; 

export function getaccount(token) {
  return axios.get(`${API}/profile/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }); 
}
