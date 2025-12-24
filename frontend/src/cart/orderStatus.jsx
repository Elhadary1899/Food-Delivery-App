import { useEffect, useState, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getTrackingStatusAPI, cancelOrderAPI } from "../services/tracking.api";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShoppingBag,
} from "react-icons/fa";

export default function OrderStatus() {
  const { token } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  async function loadOrder() {
    if (!orderNumber) return;
    try {
      const [trackRes, checkoutRes] = await Promise.all([
        getTrackingStatusAPI(orderNumber, token),
        axios.get(`http://localhost:4000/api/checkout/${orderNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const trackData = trackRes?.data?.data || {};
      const checkoutData = checkoutRes?.data?.data || {};

      // Merge order info from both APIs safely
      const merged = {
        ...trackData.order,
        ...(checkoutData.order || {}),
        shipping_address:
          checkoutData.shipping_address || checkoutData.shipping || null,
        payment_method:
          checkoutData.payment_method || checkoutData.payment || null,
        masked_card: checkoutData.masked_card || checkoutData.masked || null,
        grand_total:
          checkoutData.grand_total ?? checkoutData.totals?.subtotal ?? null,
        totals: checkoutData.totals || null,
      };

      // ✅ Only update state if data actually changed
      setOrder((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(merged)) return merged;
        return prev;
      });

      setItems((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(checkoutData.items || []))
          return checkoutData.items || [];
        return prev;
      });

      setHistory((prev) => {
        if (JSON.stringify(prev) !== JSON.stringify(trackData.history || []))
          return trackData.history || [];
        return prev;
      });
    } catch (err) {
      console.error("Order status load error:", err?.response?.data || err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrder();

    // Poll every 10 seconds, but only re-render if data changes
    const interval = setInterval(() => {
      loadOrder();
    }, 10000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderNumber, token]);

  async function handleCancel() {
    if (!orderNumber) return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      setCancelling(true);
      const res = await cancelOrderAPI(orderNumber, token);
      if (res?.data?.success) {
        // Update UI immediately
        setOrder((o) =>
          o ? { ...o, OrderStatus: "Cancelled", order_status: "Cancelled" } : o
        );
        setHistory((h) => [
          ...(h || []),
          { Status: "Cancelled", Timestamp: new Date().toISOString() },
        ]);
        window.dispatchEvent(
          new CustomEvent("orderCanceled", { detail: { orderNumber } })
        );
        alert(res.data.message || "Order cancelled");
      } else {
        alert(res?.data?.message || "Unable to cancel");
      }
    } catch (err) {
      console.error("Cancel error:", err?.response?.data || err);
      alert("Cancel failed");
    } finally {
      setCancelling(false);
      await loadOrder();
    }
  }

  if (loading || !order) {
    return (
      <div className="text-center py-5" style={{ marginTop: "120px" }}>
        Loading Order...
      </div>
    );
  }

  // Compute displayed total
  const computedItemsTotal = items.reduce(
    (s, it) => s + parseFloat(it.subtotal || it.sub_total || 0),
    0
  );

  const computedDelivery = parseFloat(
    order.delivery_fee || order.totals?.delivery_fee || 0
  );

  const displayedTotal = order.grand_total
    ? parseFloat(order.grand_total)
    : computedItemsTotal + computedDelivery;

  const statusValue = order.OrderStatus || order.order_status || "—";

  const allowedToCancel =
    statusValue === "Placed" || statusValue === "Being Prepared";

  const isCancelled = statusValue === "Cancelled";

  return (
    <div
      className="container"
      style={{ paddingTop: "120px", maxWidth: "900px" }}
    >
      <h2 className="fw-bold text-center mb-4" style={{ color: "#328286" }}>
        Order Status
      </h2>

      <div className="card shadow-sm mb-4" style={{ borderRadius: "18px" }}>
        <div
          className="card-header"
          style={{ background: "#81A4A6", color: "white" }}
        >
          Order #{orderNumber}
        </div>
        <div className="card-body">
          <p>
            <strong>Status:</strong> {statusValue}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {order.OrderDate
              ? new Date(order.OrderDate).toLocaleString()
              : order.order_date
              ? new Date(order.order_date).toLocaleString()
              : "—"}
          </p>
          <p>
            <strong>Total:</strong> $
            {isNaN(displayedTotal) ? "—" : displayedTotal.toFixed(2)}
          </p>

          <div className="mt-3">
            {isCancelled ? (
              <button className="btn btn-secondary" disabled>
                Order Cancelled
              </button>
            ) : allowedToCancel ? (
              <button
                className="btn btn-danger"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            ) : (
              <button className="btn btn-secondary" disabled>
                Cannot cancel at this stage
              </button>
            )}

            <button
              className="btn btn-outline-primary ms-2"
              onClick={() => navigate(`/profile`)}
            >
              My Orders
            </button>
          </div>
        </div>
      </div>

      {/* ITEMS */}
      <div className="card shadow-sm mb-4" style={{ borderRadius: "18px" }}>
        <div
          className="card-header"
          style={{ background: "#81A4A6", color: "white" }}
        >
          <FaShoppingBag className="me-2" /> Ordered Items
        </div>

        <ul className="list-group list-group-flush">
          {items.length === 0 && (
            <li className="list-group-item text-muted">No items found.</li>
          )}
          {items.map((i, idx) => (
            <li
              key={idx}
              className="list-group-item d-flex justify-content-between"
            >
              <div>
                <strong>{i.ItemName || i.item_name}</strong>
                <br />
                <small className="text-muted">
                  {(i.Quantity || i.quantity) ?? "—"} × $
                  {parseFloat(i.Price || i.price || 0).toFixed(2)}
                </small>
              </div>
              <strong className="text-success">
                ${parseFloat(i.subtotal || i.sub_total || 0).toFixed(2)}
              </strong>
            </li>
          ))}
        </ul>
      </div>

      {/* TIMELINE */}
      <div className="card shadow-sm mb-5" style={{ borderRadius: "18px" }}>
        <div
          className="card-header"
          style={{ background: "#81A4A6", color: "white" }}
        >
          Order Timeline
        </div>

        <div className="card-body">
          {history.length === 0 && (
            <div className="text-muted">No timeline available.</div>
          )}
          {history.map((step, i) => (
            <div key={i} className="d-flex align-items-start mb-3">
              <FaCheckCircle className="text-success me-3" />
              <div>
                <strong>{step.Status}</strong>
                <br />
                <small className="text-muted">
                  {new Date(step.Timestamp).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}