import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Checkout.css";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function Checkout() {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", address: "", city: "", zip: "",
    cardName: "", cardNum: "", expiry: "", cvv: "",
  });

  const shipping = total >= 10000 ? 0 : 199;
  const tax = +(total * 0.18).toFixed(2);
  const grandTotal = (total + shipping + tax).toFixed(0);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    dispatch({ type: "CLEAR" });
  }

  if (submitted) {
    return (
      <main className="checkout-page">
        <div className="success-box">
          <div className="success-icon">✓</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We'll send a confirmation to <strong>{form.email}</strong>.</p>
          <p className="order-num">Order #ACL-{Math.floor(100000 + Math.random() * 900000)}</p>
          <button className="btn-primary" onClick={() => navigate("/products")}>
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <h1>Checkout</h1>
        <div className="checkout-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <section className="form-section">
              <h3>Shipping Information</h3>
              <div className="form-row">
                <div className="field">
                  <label>Full Name</label>
                  <input name="name" required value={form.name} onChange={handleChange} placeholder="Your full name" />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input name="email" type="email" required value={form.email} onChange={handleChange} placeholder="email@example.com" />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Phone</label>
                  <input name="phone" required value={form.phone} onChange={handleChange} placeholder="+91 00000-00000" />
                </div>
                <div className="field">
                  <label>City</label>
                  <input name="city" required value={form.city} onChange={handleChange} placeholder="Prantij" />
                </div>
              </div>
              <div className="field">
                <label>Address</label>
                <input name="address" required value={form.address} onChange={handleChange} placeholder="House no., Street, Area..." />
              </div>
            </section>

            <section className="form-section">
              <h3>Payment Details</h3>
              <div className="field">
                <label>Name on Card</label>
                <input name="cardName" required value={form.cardName} onChange={handleChange} placeholder="Your name" />
              </div>
              <div className="field">
                <label>Card Number</label>
                <input
                  name="cardNum"
                  required
                  maxLength={19}
                  value={form.cardNum}
                  onChange={(e) => setForm((f) => ({ ...f, cardNum: e.target.value.replace(/\D/g,"").replace(/(.{4})/g,"$1 ").trim() }))}
                  placeholder="0000 0000 0000 0000"
                />
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Expiry</label>
                  <input name="expiry" required value={form.expiry} onChange={handleChange} placeholder="MM/YY" maxLength={5} />
                </div>
                <div className="field">
                  <label>CVV</label>
                  <input name="cvv" required value={form.cvv} onChange={handleChange} placeholder="123" maxLength={4} type="password" />
                </div>
              </div>
              <p className="secure-note">🔒 Your payment info is encrypted and secure.</p>
            </section>

            <button type="submit" className="place-order-btn">
              Place Order — {inr(grandTotal)}
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {items.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} />
                  <div>
                    <p className="oi-name">{item.name}</p>
                    <p className="oi-qty">Qty: {item.qty}</p>
                  </div>
                  <span>{inr(item.price * item.qty)}</span>
                </div>
              ))}
            </div>
            <div className="order-totals">
              <div><span>Subtotal</span><span>{inr(total)}</span></div>
              <div><span>Shipping</span><span>{shipping === 0 ? "Free" : inr(shipping)}</span></div>
              <div><span>GST (18%)</span><span>{inr(tax)}</span></div>
            </div>
            <div className="order-grand">
              <span>Total</span><span>{inr(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
