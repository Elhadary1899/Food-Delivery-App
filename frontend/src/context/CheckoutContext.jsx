import { createContext, useContext, useState } from "react";
import { getCheckoutSummaryAPI } from "../services/checkout.Api";

const CheckoutContext = createContext();

export function CheckoutProvider({ children }) {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function loadCheckoutSummary() {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("User is not authenticated");
      }

      const res = await getCheckoutSummaryAPI();

      if (res.data.success) {
        setCheckoutData(res.data.data);
      }
    } catch (err) {
      console.error("Checkout load error:", err);
      setCheckoutData(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CheckoutContext.Provider
      value={{ checkoutData, loading, loadCheckoutSummary }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  return useContext(CheckoutContext);
}
