import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./Home/home";
import { useContext } from "react";
import Layout from "./layout";
import { Menu } from "./Menu/menu";
import Cart from "./cart/Cart.jsx";
import Login from "./auth/login/login.jsx";
import Register from "./auth/register/register.jsx";
import AdminLogin from "./auth/login/adminlogin/adminlogin.jsx";
import ProductDetails from "./Menu/productDetails.jsx";
import AboutUs from "./AboutUs/AboutUs.jsx";
import Profile from "./profilepage/profile.jsx";
import Restaurants from "./restaurants/restaurants.jsx";
import LayoutAdmin from "./AdminPanel/Layoutadmin.jsx";
import Dashboard from "./AdminPanel/componentadmin/Dashboard.jsx";
import OrderReport from "./AdminPanel/componentadmin/OrderReport.jsx";
import SalesReport from "./AdminPanel/componentadmin/SalesReport.jsx";
import Checkout from "./cart/checkout.jsx";
import OrderStatus from "./cart/orderStatus.jsx";
import { AuthContext } from "./context/AuthContext";


function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />

          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/menu/:restaurantName" element={<Menu />} />
          <Route path="/cart" element={<Cart />} />

          {/* Checkout Route محمي */}
          <Route
            path="/checkout"
            element={
              user ? (
                <Checkout />
              ) : (
                <Navigate to="/auth/login?redirect=/checkout" replace />
              )
            }
          />
          <Route path="/orderStatus" element={<OrderStatus />} />

          <Route path="/orderStatus" element={<OrderStatus />} />

          <Route
            path="/product/:restaurantName/:itemName"
            element={<ProductDetails />}
          />

          <Route path="/about" element={<AboutUs />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Auth */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/login/adminlogin" element={<AdminLogin />} />

        {/* Admin */}
        <Route path="/admin" element={<LayoutAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrderReport />} />
          <Route path="sales" element={<SalesReport />} />
        </Route>
      </Routes>

    
    </>
  );
}

export default App;
