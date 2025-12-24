import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import { CheckoutProvider } from "./context/CheckoutContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CheckoutProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CheckoutProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
