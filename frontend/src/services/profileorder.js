// src/services/profileorder.js
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const API = "http://localhost:4000/api";

export function useOrderProfileService() {
  const { token } = useContext(AuthContext);

  const getOrderProfile = () => {
    return axios.get(`${API}/profile/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  };

  return { getOrderProfile };
}
