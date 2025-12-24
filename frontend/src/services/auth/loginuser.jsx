// src/services/auth/login.js
import axios from "axios";

const API = "http://localhost:4000/api/auth/login";

export const loginUser = async (data) => {
  try {
    const response = await axios.post(API, data, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Login failed",
    };
  }
};
