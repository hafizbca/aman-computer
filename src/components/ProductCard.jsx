import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

export default function ProductCard({ product }) {
  const { dispatch, items } = useCart();
  const inCart = items.some((i) => i.id === product.id);

  function handleAdd(e) {
    e.preventDefault();
    dispatch({ type: "ADD_ITEM", payload: product });
  }

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="card-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        {product.badge && <span className="card-badge">{product.badge}</span>}
        {discount > 0 && <span className="card-discount">-{discount}%</span>}
      </div>
      <div className="card-body">
        <p className="card-brand">{product.brand}</p>
        <h3 className="card-title">{product.name}</h3>
        <div className="card-rating">
          <span className="stars">{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</span>
          <span className="review-count">({product.reviews})</span>
        </div>
        <div className="card-price-row">
          <span className="card-price">₹{product.price.toLocaleString("en-IN")}</span>
          {product.originalPrice > product.price && (
            <span className="card-original">₹{product.originalPrice.toLocaleString("en-IN")}</span>
          )}
        </div>
        <button
          className={`card-btn ${inCart ? "in-cart" : ""}`}
          onClick={handleAdd}
        >
          {inCart ? "✓ Added to Cart" : "Add to Cart"}
        </button>
      </div>
    </Link>
  );
}
