import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

export default function Navbar() {
  const { count } = useCart();
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  function handleSearch(e) {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setMenuOpen(false);
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">&#128187;</span>
          <span className="logo-text">Aman Computer<br /><small>and Laptop</small></span>
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search laptops, desktops, accessories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">&#128269;</button>
        </form>

        <div className={`nav-links ${menuOpen ? "open" : ""}`}>
          <form className="mobile-search" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">&#128269;</button>
          </form>

          <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link to="/products?category=laptops" onClick={() => setMenuOpen(false)}>Laptops</Link>
          <Link to="/products?category=desktops" onClick={() => setMenuOpen(false)}>Desktops</Link>
          <Link to="/products?category=imported" onClick={() => setMenuOpen(false)}>Imported</Link>

          <button className="theme-toggle" onClick={toggle} title="Toggle theme">
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          <Link to="/cart" className="cart-link" onClick={() => setMenuOpen(false)}>
            &#128722;
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </div>

        <button className="theme-toggle mobile-theme" onClick={toggle} title="Toggle theme">
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        <Link to="/cart" className="cart-link mobile-cart" onClick={() => setMenuOpen(false)}>
          &#128722;
          {count > 0 && <span className="cart-badge">{count}</span>}
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
    </nav>
  );
}
