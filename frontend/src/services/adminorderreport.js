import axios from "axios";

// ميثود لجلب كل الطلبات
export const getAllOrders = async () => {
  try {
    // 1️⃣ جلب التوكن من localStorage
    const token = localStorage.getItem("adminToken"); // افترض أن التوكن مخزن تحت المفتاح "token"

    if (!token) {
      throw new Error("Token not found in localStorage");
    }

    // 2️⃣ إرسال request للـ API
    const response = await axios.get("http://localhost:4000/api/tracking/admin/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // 3️⃣ إرجاع البيانات
    return response.data.data.orders; // هترجعلك مصفوفة الطلبات

  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};
