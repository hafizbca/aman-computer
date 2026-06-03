import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AdminLogin.css";

export default function AdminLogin() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (isAdmin) {
    navigate("/admin/dashboard");
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = login(id, password);
      if (ok) {
        navigate("/admin/dashboard");
      } else {
        setError("Invalid ID or password. Please try again.");
      }
      setLoading(false);
    }, 600);
  }

  return (
    <main className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <span>&#128187;</span>
          <h1>Aman Computer and Laptop</h1>
          <p>Admin Panel</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label>Admin ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter admin ID"
              autoComplete="username"
              required
            />
          </div>

          <div className="login-field">
            <label>Password</label>
            <div className="pass-wrap">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
              />
              <button type="button" className="eye-btn" onClick={() => setShowPass((s) => !s)}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {error && <p className="login-error">⚠️ {error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <a href="/" className="back-to-store">← Back to Store</a>
      </div>
    </main>
  );
}
