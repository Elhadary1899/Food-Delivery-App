import axios from "axios"; 
const API = "http://localhost:4000/api"; 

// body = { address, postal_code, city, country }
export function postaddress(body, token) {
  return axios.post(`${API}/profile/addresses`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
