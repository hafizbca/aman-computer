import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import "./ProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const { products } = useProducts();
  const navigate = useNavigate();
  const { dispatch, items } = useCart();
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.id === Number(id));
  if (!product) {
    return (
      <div className="not-found">
        <h2>Product not found</h2>
        <Link to="/products">← Back to Products</Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const inCart = items.some((i) => i.id === product.id);

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) {
      dispatch({ type: "ADD_ITEM", payload: product });
    }
  }

  function handleBuyNow() {
    handleAddToCart();
    navigate("/cart");
  }

  return (
    <main className="detail-page">
      <div className="detail-container">
        <Link to="/products" className="back-link">← Back to Products</Link>

        <div className="detail-grid">
          {/* Image */}
          <div className="detail-image-wrap">
            <img src={product.image} alt={product.name} />
            {product.badge && <span className="detail-badge">{product.badge}</span>}
          </div>

          {/* Info */}
          <div className="detail-info">
            <span className="detail-brand">{product.brand}</span>
            <h1>{product.name}</h1>

            <div className="detail-rating">
              <span className="stars">{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</span>
              <span>{product.rating} ({product.reviews} reviews)</span>
            </div>

            <div className="detail-price-row">
              <span className="detail-price">₹{product.price.toLocaleString("en-IN")}</span>
              {discount > 0 && (
                <>
                  <span className="detail-original">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                  <span className="detail-discount">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="detail-desc">{product.description}</p>

            <div className="stock-info">
              {product.stock <= 5 ? (
                <span className="low-stock">⚠️ Only {product.stock} left!</span>
              ) : (
                <span className="in-stock">✓ In Stock</span>
              )}
            </div>

            <div className="qty-row">
              <label>Qty:</label>
              <div className="qty-control">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            <div className="detail-btns">
              <button
                className={`btn-cart ${inCart ? "added" : ""}`}
                onClick={handleAddToCart}
              >
                {inCart ? "✓ Added to Cart" : "Add to Cart"}
              </button>
              <button className="btn-buy" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

            <div className="detail-perks">
              <div><span>🚚</span> Free delivery on this item</div>
              <div><span>🛡️</span> {product.category === "imported" ? "International" : "Official"} warranty</div>
              <div><span>↩️</span> 7-day return policy</div>
            </div>
          </div>
        </div>

        {/* Specs */}
        <div className="specs-section">
          <h2>Specifications</h2>
          <div className="specs-grid">
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="spec-row">
                <span className="spec-key">{key}</span>
                <span className="spec-val">{val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="related-section">
            <h2>Related Products</h2>
            <div className="related-grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
