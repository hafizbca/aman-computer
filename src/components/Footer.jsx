import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <span className="footer-logo">&#128187; Aman Computer and Laptop</span>
          <p>Your trusted source for computers, laptops, and imported tech devices in Prantij, Gujarat.</p>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          <Link to="/products?category=laptops">Laptops</Link>
          <Link to="/products?category=desktops">Desktops</Link>
          <Link to="/products?category=accessories">Accessories</Link>
          <Link to="/products?category=imported">Imported Devices</Link>
        </div>
        <div className="footer-col">
          <h4>Support</h4>
          <a href="#">Warranty Policy</a>
          <a href="#">Shipping Info</a>
          <a href="#">Returns</a>
          <a href="#">Contact Us</a>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>&#128205; Prantij, Gujarat, India 383205</p>
          <p>&#128222; +91 00000-00000</p>
          <p>&#128231; info@amancomputer.in</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Aman Computer and Laptop, Prantij, Gujarat 383205. All rights reserved.</p>
      </div>
    </footer>
  );
}
