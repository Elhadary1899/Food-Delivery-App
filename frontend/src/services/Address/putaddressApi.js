import axios from "axios";
const API = "http://localhost:4000/api";

// body = { address, postal_code, city, country }
export function putddress(addressId, body, token) {
  return axios.put(`${API}/profile/addresses/${addressId}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
