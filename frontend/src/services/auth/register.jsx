import axios from "axios";

// URL الأساسي للـ API
const API_URL = "http://localhost:4000/api/auth";

// دالة لتسجيل مستخدم جديد
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // بيانات الرد من السيرفر
  } catch (error) {
    // التعامل مع الأخطاء
    if (error.response) {
      // لو السيرفر رجع خطأ
      return { success: false, message: error.response.data.message };
    } else {
      return { success: false, message: error.message };
    }
  }
};
