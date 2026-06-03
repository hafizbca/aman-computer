import { Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import "./Home.css";

export default function Home() {
  const { products } = useProducts();
  const featured = products.filter((p) => p.badge).slice(0, 4);
  const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <main className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">Best Tech Deals 2026</span>
          <h1>Premium Laptops &amp; Computers</h1>
          <p>Discover the latest imported devices, gaming PCs, and accessories at unbeatable prices.</p>
          <div className="hero-btns">
            <Link to="/products" className="btn-primary">Shop Now</Link>
            <Link to="/products?category=imported" className="btn-outline">View Imported</Link>
          </div>
        </div>
        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80"
            alt="Premium Laptop"
          />
        </div>
      </section>

      {/* Category Pills */}
      <section className="categories-section">
        <div className="section-container">
          <h2 className="section-title">Shop by Category</h2>
          <div className="category-grid">
            {[
              { id: "laptops", icon: "💻", label: "Laptops", desc: "MacBook, Dell, ASUS & more" },
              { id: "desktops", icon: "🖥️", label: "Desktops", desc: "Gaming & workstation PCs" },
              { id: "accessories", icon: "🖱️", label: "Accessories", desc: "Monitors, keyboards, storage" },
              { id: "imported", icon: "✈️", label: "Imported", desc: "USA & Japan originals" },
            ].map((cat) => (
              <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-card">
                <span className="cat-icon">{cat.icon}</span>
                <h3>{cat.label}</h3>
                <p>{cat.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Featured Products</h2>
            <Link to="/products" className="see-all">See All →</Link>
          </div>
          <div className="products-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="promo-banner">
        <div className="banner-content">
          <h2>✈️ Original Imported Devices</h2>
          <p>Genuine products from USA, Japan & UK — with warranty & authenticity guarantee.</p>
          <Link to="/products?category=imported" className="btn-primary">Shop Imported</Link>
        </div>
      </section>

      {/* Top Rated */}
      <section className="products-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">Top Rated</h2>
            <Link to="/products" className="see-all">See All →</Link>
          </div>
          <div className="products-grid">
            {topRated.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-section">
        <div className="section-container">
          <div className="trust-grid">
            {[
              { icon: "🚚", title: "Free Delivery", desc: "On orders over ₹10,000" },
              { icon: "🛡️", title: "Warranty", desc: "Official manufacturer warranty" },
              { icon: "↩️", title: "Easy Returns", desc: "7-day return policy" },
              { icon: "💳", title: "Secure Payment", desc: "100% secure checkout" },
            ].map((t) => (
              <div key={t.title} className="trust-item">
                <span>{t.icon}</span>
                <h4>{t.title}</h4>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
