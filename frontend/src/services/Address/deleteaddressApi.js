import axios from "axios";
const API = "http://localhost:4000/api";

// body = { address, postal_code, city, country }
export function deleteaddress(addressId, token) {
  return axios.delete(`${API}/profile/addresses/${addressId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
