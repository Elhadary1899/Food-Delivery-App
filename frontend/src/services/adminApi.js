// src/services/adminApi.js
import axios from "axios";

const API = "http://localhost:4000/api/auth/admin";

export const adminLogin = async (identifier, password) => {
  try {
    const res = await axios.post(`${API}/login`, { identifier, password });
    return res.data;
  } catch (error) {
    console.error("Admin login error:", error);
    throw error.response?.data || { message: "Login failed" };
  }
};