
import axios from "axios"; 
const API = "http://localhost:4000/api"; 

export function getaddress(token) {
  return axios.get(`${API}/profile/addresses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
