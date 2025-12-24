import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  getCheckoutSummaryAPI,
  addAddressAPI,
  addPaymentAPI,
  placeOrderAPI,
} from "../services/checkout.Api";
import { getaddress } from "../services/Address/getaddressApi";
import { getpayments } from "../services/payments/getpaymentsApi";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaMapMarkerAlt, FaCreditCard, FaShoppingBag } from "react-icons/fa";
import { useCart } from "../context/CartContext"; // ✅ added import

export default function Checkout() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { clearCart } = useCart(); // ✅ use clearCart from context

  const [summary, setSummary] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [payments, setPayments] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  const [loading, setLoading] = useState(true);
  const [savingAddress, setSavingAddress] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [newAddress, setNewAddress] = useState({
    address_name: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
  });

  const [newPayment, setNewPayment] = useState({
    method: "MasterCard",
    cardholder: "",
    number: "",
    exp: "",
    cvc: "",
  });

  useEffect(() => {
    let mounted = true;

    async function loadAll() {
      try {
        setLoading(true);

        // summary
        const checkoutRes = await getCheckoutSummaryAPI();
        if (!mounted) return;
        setSummary(checkoutRes.data?.data || null);

        // addresses
        try {
          const addrRes = await getaddress(token);
          if (addrRes?.data?.success) {
            const list = addrRes.data.data.addresses || [];
            if (mounted) {
              setAddresses(list);
              if (list.length > 0 && !selectedAddress) {
                setSelectedAddress(list[0].address_id);
              }
            }
          }
        } catch (e) {
          console.warn("Failed to load addresses", e);
        }

        // payments
        try {
          const payRes = await getpayments(token);
          if (payRes?.data?.success) {
            const list = payRes.data.data.payments || [];
            if (mounted) {
              setPayments(list);
              if (list.length > 0 && !selectedPayment) {
                setSelectedPayment(list[0].payment_id);
              }
            }
          }
        } catch (e) {
          console.warn("Failed to load payments", e);
        }
      } catch (err) {
        console.error("Checkout load error:", err);
        setSummary(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAll();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (loading || !summary) {
    return (
      <div className="text-center py-5" style={{ marginTop: "120px" }}>
        Loading checkout...
      </div>
    );
  }

  // safe totals
  const items = summary.items || [];
  const itemsTotal = items
    .reduce((sum, item) => sum + parseFloat(item.subtotal || 0), 0)
    .toFixed(2);

  const deliveryFee = parseFloat(summary?.totals?.delivery_fee || 0).toFixed(2);

  const finalTotal = (parseFloat(itemsTotal) + parseFloat(deliveryFee)).toFixed(
    2
  );

  // ADD ADDRESS
  const handleAddAddress = async (e) => {
    e.preventDefault();
    setSavingAddress(true);
    try {
      const res = await addAddressAPI(newAddress);
      if (res?.data?.success) {
        const newAddr = res.data.data.address;
        setAddresses((prev) => [...prev, newAddr]);
        setSelectedAddress(newAddr.address_id);
        setNewAddress({
          address_name: "",
          address: "",
          city: "",
          country: "",
          postal_code: "",
        });
      } else {
        console.warn("Add address returned no success:", res);
      }
    } catch (err) {
      console.error("Add address error:", err.response?.data || err);
      alert(err?.response?.data?.message || "Failed to add address");
    } finally {
      setSavingAddress(false);
    }
  };

  // ADD PAYMENT
  const handleAddPayment = async (e) => {
    e.preventDefault();
    setSavingPayment(true);
    try {
      const body = (() => {
        const b = { method: newPayment.method };
        if (newPayment.method === "PayPal") {
          b.payment_name = "PayPal";
        } else {
          b.payment_name = "Credit Card";
          b.cardholder = newPayment.cardholder;
          b.number = newPayment.number;
          b.exp = newPayment.exp;
          b.cvc = newPayment.cvc;
        }
        return b;
      })();

      const res = await addPaymentAPI(body);

      if (res?.data?.success) {
        const newPay = res.data.data.payment;
        setPayments((prev) => [...prev, newPay]);
        setSelectedPayment(newPay.payment_id);
        setNewPayment({
          method: "MasterCard",
          cardholder: "",
          number: "",
          exp: "",
          cvc: "",
        });
      } else {
        console.warn("Add payment not success:", res);
      }
    } catch (err) {
      console.error("Payment Add Error:", err.response?.data || err);
      alert(err?.response?.data?.message || "Failed to add payment");
    } finally {
      setSavingPayment(false);
    }
  };

  // PLACE ORDER
  const placeOrder = async () => {
    if (!selectedAddress || !selectedPayment) {
      alert(
        "Please select an address and a payment method before placing the order."
      );
      return;
    }

    try {
      setPlacingOrder(true);
      const res = await placeOrderAPI({
        address_id: selectedAddress,
        payment_id: selectedPayment,
      });

      if (res?.data?.success) {
        const orderNum = res.data.data.order_number;

        // 🧹 Clear frontend cart immediately after successful order
        try {
          await clearCart();
        } catch (e) {
          console.warn("Could not clear cart after checkout:", e);
        }

        // Save last placed order so Profile can retry fetch quickly
        try {
          localStorage.setItem("lastPlacedOrder", orderNum);
        } catch (e) {
          /* ignore storage errors */
        }

        // notify other pages (My Orders etc.)
        window.dispatchEvent(
          new CustomEvent("orderPlaced", { detail: { orderNumber: orderNum } })
        );

        // navigate to order status
        navigate(`/orderStatus?order=${orderNum}`);
        return;
      }

      console.error("Place order response:", res);
      alert(res?.data?.message || "Failed to place order");
    } catch (err) {
      console.error("Order placement failed:", err.response?.data || err);
      alert(err?.response?.data?.message || "Order failed");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "120px" }}>
      <h2 className="fw-bold text-center mb-4" style={{ color: "#328286" }}>
        Checkout
      </h2>

      <div className="row">
        <div className="col-lg-5 mb-4">
          <div className="card shadow-sm mb-4" style={{ borderRadius: "18px" }}>
            <div
              className="card-header"
              style={{ background: "#81A4A6", color: "white" }}
            >
              <FaShoppingBag className="me-2" /> Your Items
            </div>

            <ul className="list-group list-group-flush">
              {items.map((item) => (
                <li
                  key={item.ItemID}
                  className="list-group-item d-flex justify-content-between"
                >
                  <div>
                    <strong>{item.ItemName}</strong>
                    <br />
                    <small className="text-muted">
                      {item.Quantity} × ${parseFloat(item.Price).toFixed(2)}
                    </small>
                  </div>
                  <strong className="text-success">
                    ${parseFloat(item.subtotal).toFixed(2)}
                  </strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="card shadow-sm" style={{ borderRadius: "18px" }}>
            <div
              className="card-header"
              style={{ background: "#81A4A6", color: "white" }}
            >
              Order Summary
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item d-flex justify-content-between">
                <span>Items Total</span>
                <strong>${parseFloat(itemsTotal).toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span>Delivery Fee</span>
                <strong>${parseFloat(deliveryFee).toFixed(2)}</strong>
              </li>
              <li className="list-group-item d-flex justify-content-between">
                <span className="fw-bold">Final Total</span>
                <strong className="text-success">
                  ${parseFloat(finalTotal).toFixed(2)}
                </strong>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-lg-7">
          {/* Address Section */}
          <div className="card shadow-sm mb-4" style={{ borderRadius: "18px" }}>
            <div
              className="card-header"
              style={{ background: "#81A4A6", color: "white" }}
            >
              <FaMapMarkerAlt className="me-2" /> Select Address
            </div>

            <ul className="list-group list-group-flush">
              {addresses.length === 0 && (
                <li className="list-group-item text-muted">
                  No addresses yet.
                </li>
              )}
              {addresses.map((addr) => (
                <li
                  key={addr.address_id}
                  className="list-group-item d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedAddress(addr.address_id)}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === addr.address_id}
                    readOnly
                    className="me-3"
                  />
                  <div>
                    <strong>{addr.address_name}</strong>
                    <br />
                    <small className="text-muted">
                      {addr.address}, {addr.city}, {addr.country}
                    </small>
                  </div>
                </li>
              ))}
            </ul>

            <form className="p-3" onSubmit={handleAddAddress}>
              <h6 className="fw-bold mb-3">Add New Address</h6>

              {[
                "address_name",
                "address",
                "city",
                "country",
                "postal_code",
              ].map((field, i) => (
                <input
                  key={i}
                  className="form-control mb-2"
                  placeholder={field.replace("_", " ").toUpperCase()}
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field]: e.target.value })
                  }
                  required
                />
              ))}

              <button
                className="btn btn-success w-100 mt-2"
                type="submit"
                disabled={savingAddress}
              >
                {savingAddress ? "Saving..." : "Save Address"}
              </button>
            </form>
          </div>

          {/* Payment Section */}
          <div className="card shadow-sm mb-4" style={{ borderRadius: "18px" }}>
            <div
              className="card-header"
              style={{ background: "#81A4A6", color: "white" }}
            >
              <FaCreditCard className="me-2" /> Select Payment Method
            </div>

            <ul className="list-group list-group-flush">
              {payments.length === 0 && (
                <li className="list-group-item text-muted">
                  No payment methods yet.
                </li>
              )}
              {payments.map((pay) => (
                <li
                  key={pay.payment_id}
                  className="list-group-item d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedPayment(pay.payment_id)}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={selectedPayment === pay.payment_id}
                    readOnly
                    className="me-3"
                  />
                  <div>
                    <strong>{pay.method}</strong> — ****{pay.last4}
                  </div>
                </li>
              ))}
            </ul>

            <form className="p-3" onSubmit={handleAddPayment}>
              <h6 className="fw-bold mb-3">Add New Payment</h6>

              <select
                className="form-control mb-2"
                value={newPayment.method}
                onChange={(e) =>
                  setNewPayment({ ...newPayment, method: e.target.value })
                }
              >
                <option value="MasterCard">MasterCard</option>
                <option value="PayPal">PayPal</option>
              </select>

              {newPayment.method !== "PayPal" && (
                <>
                  <input
                    className="form-control mb-2"
                    placeholder="Cardholder Name"
                    value={newPayment.cardholder}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        cardholder: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Card Number"
                    value={newPayment.number}
                    onChange={(e) =>
                      setNewPayment({
                        ...newPayment,
                        number: e.target.value,
                      })
                    }
                    required
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Expiry Date"
                    type="date"
                    value={newPayment.exp}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, exp: e.target.value })
                    }
                    required
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="CVC"
                    value={newPayment.cvc}
                    onChange={(e) =>
                      setNewPayment({ ...newPayment, cvc: e.target.value })
                    }
                    required
                  />
                </>
              )}

              <button
                className="btn btn-success w-100 mt-2"
                type="submit"
                disabled={savingPayment}
              >
                {savingPayment ? "Saving..." : "Save Payment"}
              </button>
            </form>
          </div>

          {/* Place Order Button */}
          <button
            className="btn w-100 py-3 mb-5"
            style={{
              background: "#328286",
              color: "white",
              fontSize: "1.2rem",
              borderRadius: "15px",
            }}
            onClick={placeOrder}
            disabled={placingOrder}
          >
            {placingOrder
              ? "Placing order..."
              : `Place Order ($${parseFloat(finalTotal).toFixed(2)})`}
          </button>
        </div>
      </div>
    </div>
  );
}