// src/profile.jsx
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import Address from "./components/address";
import Payment from "./components/payment";
import Accountsetting from "./components/accountsetting";

import { getaccount } from "../services/accountApi";
import { useOrderProfileService } from "../services/profileorder";
import { AuthContext } from "../context/AuthContext";

// Sidebar, OrderCard components stay same (paste your existing ones or keep below)
const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { icon: "📦", label: "My Orders", id: "orders" },
    { icon: "📍", label: "My Addresses", id: "addresses" },
    { icon: "💳", label: "My Payments", id: "payments" },
    { icon: "⚙️", label: "Account Settings", id: "accountSettings" },
  ];

  const [account, setAccount] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    let mounted = true;
    const fetchAcc = async () => {
      try {
        const res = await getaccount(token);
        if (mounted) setAccount(res.data.data.account);
      } catch (err) {
        console.log("Error fetching account:", err);
      }
    };
    fetchAcc();
    return () => {
      mounted = false;
    };
  }, [token]);

  if (!account) return <p>Loading...</p>;

  return (
    <div
      className="bg-white rounded shadow-sm p-4"
      style={{ position: "sticky", top: "20px" }}
    >
      <div className="text-center mb-4">
        <p
          className="fw-semibold"
          style={{ color: "#69a297", fontSize: "20px" }}
        >
          {account.username}
        </p>
      </div>

      <div className="d-flex flex-column gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`btn btn-light w-100 text-start d-flex align-items-center gap-3 ${
              activeTab === item.id
                ? "bg-success bg-opacity-10 text-success"
                : ""
            }`}
            style={{
              border: "none",
              padding: "12px 16px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            <span style={{ fontSize: "18px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const OrderCard = ({ order }) => {
  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1">Order #{order.order_number}</h5>
            <p className="mb-0 text-muted" style={{ fontSize: "13px" }}>
              {order.date}
            </p>
          </div>
          <span
            className={`fw-semibold ${
              order.status === "Delivered" ? "text-success" : "text-danger"
            }`}
          >
            {order.status}
          </span>
        </div>

        <div className="row mb-3">
          {order.itemsList && order.itemsList.length === 0 && (
            <div className="text-muted">No items in this order.</div>
          )}
          {order.itemsList &&
            order.itemsList.map((item, idx) => (
              <div key={idx} className="col-6 mb-3">
                <div className="border rounded p-2 h-100 d-flex flex-column align-items-center text-center">
                  <img
                    src={item.image_url || item.image || "/placeholder.jpg"}
                    alt={item.item_name || item.ItemName}
                    style={{
                      width: "150px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                  <p className="fw-semibold mb-1 mt-2">
                    {item.item_name || item.ItemName}
                  </p>
                  <p className="text-muted mb-1" style={{ fontSize: "13px" }}>
                    Qty: {item.quantity || item.Quantity}
                  </p>
                  <p className="fw-bold mb-0">${item.price || item.Price}</p>
                </div>
              </div>
            ))}
        </div>

        <div className="d-flex justify-content-end gap-3 border-top pt-2">
          <div>
            <span className="text-muted" style={{ fontSize: "13px" }}>
              Delivery Fee:
            </span>{" "}
            <span className="fw-semibold">${order.delivery_fee}</span>
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: "13px" }}>
              Grand Total:
            </span>{" "}
            <span className="fw-bold">${order.grand_total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { getOrderProfile } = useOrderProfileService();

  async function loadOrders() {
    setLoading(true);
    try {
      const res = await getOrderProfile();
      const arr = (res.data?.data?.orders || []).map((order) => ({
        order_id: order.order_id,
        order_number: order.order_number,
        date: order.order_date_formatted,
        status: order.order_status,
        itemsList: order.items || [],
        delivery_fee: order.delivery_fee,
        grand_total: order.grand_total,
      }));

      setOrders(arr);
    } catch (e) {
      console.log("Error fetching orders:", e);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  // retry helper used after placing order to ensure backend had time to persist
  async function reloadWithRetry(maxAttempts = 6, intervalMs = 1000) {
    const lastPlaced = localStorage.getItem("lastPlacedOrder");
    for (let i = 0; i < maxAttempts; i++) {
      await loadOrders();
      if (!lastPlaced) break; // nothing to wait for
      // check if lastPlaced exists in fetched orders
      if (orders.find((o) => o.order_number === lastPlaced)) {
        // done
        localStorage.removeItem("lastPlacedOrder");
        return;
      }
      // small delay
      await new Promise((r) => setTimeout(r, intervalMs));
    }
    // final attempt
    await loadOrders();
    localStorage.removeItem("lastPlacedOrder");
  }

  useEffect(() => {
    // initial load
    loadOrders();

    // event listeners
    function reload() {
      // when orderPlaced event arrives, try intelligent reload with retries
      reloadWithRetry();
    }

    window.addEventListener("orderPlaced", reload);
    window.addEventListener("orderCanceled", reload);

    return () => {
      window.removeEventListener("orderPlaced", reload);
      window.removeEventListener("orderCanceled", reload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <h2 className="fw-bold mb-4">My Orders</h2>
      {orders.map((order) => (
        <OrderCard key={order.order_id} order={order} />
      ))}
    </>
  );
};

export default function Profile() {
  const [activeTab, setActiveTab] = useState("orders");

  return (
    <div className="py-5 bg-light min-vh-100">
      <div
        className="container-lg py-3"
        style={{ marginTop: "100px", minHeight: "100vh" }}
      >
        <div className="row g-4 d-flex">
          <div className="col-lg-3 d-flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="col-lg-9">
            {activeTab === "orders" && <OrdersList />}
            {activeTab === "addresses" && <Address />}
            {activeTab === "payments" && <Payment />}
            {activeTab === "accountSettings" && <Accountsetting />}
          </div>
        </div>
      </div>
    </div>
  );
}
