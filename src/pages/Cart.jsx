import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

export default function Cart() {
  const { items, total, dispatch } = useCart();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <main className="cart-page">
        <div className="cart-empty">
          <span>🛒</span>
          <h2>Your cart is empty</h2>
          <p>Browse our products and find something you love.</p>
          <Link to="/products" className="btn-primary">Continue Shopping</Link>
        </div>
      </main>
    );
  }

  const shipping = total >= 10000 ? 0 : 199;
  const tax = +(total * 0.18).toFixed(2);
  const grandTotal = total + shipping + tax;

  return (
    <main className="cart-page">
      <div className="cart-container">
        <h1>Shopping Cart <span>({items.length} items)</span></h1>

        <div className="cart-layout">
          {/* Items */}
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <p className="item-brand">{item.brand}</p>
                  <Link to={`/product/${item.id}`} className="item-name">{item.name}</Link>
                  <p className="item-unit-price">{inr(item.price)} each</p>
                </div>
                <div className="item-qty">
                  <button onClick={() => {
                    if (item.qty === 1) dispatch({ type: "REMOVE_ITEM", payload: item.id });
                    else dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty - 1 } });
                  }}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() =>
                    dispatch({ type: "UPDATE_QTY", payload: { id: item.id, qty: item.qty + 1 } })
                  }>+</button>
                </div>
                <span className="item-total">{inr(item.price * item.qty)}</span>
                <button
                  className="item-remove"
                  onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                >✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-rows">
              <div><span>Subtotal</span><span>{inr(total)}</span></div>
              <div><span>Shipping</span><span>{shipping === 0 ? "Free" : inr(shipping)}</span></div>
              <div><span>GST (18%)</span><span>{inr(tax)}</span></div>
              {shipping === 0 && (
                <div className="free-ship-note">✓ Free shipping applied</div>
              )}
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{inr(grandTotal)}</span>
            </div>
            <button className="checkout-btn" onClick={() => navigate("/checkout")}>
              Proceed to Checkout →
            </button>
            <Link to="/products" className="continue-link">← Continue Shopping</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
