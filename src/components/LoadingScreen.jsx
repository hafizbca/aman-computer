import "./LoadingScreen.css";

export default function LoadingScreen({ error }) {
  if (error) {
    return (
      <div className="loading-screen">
        <div className="loading-card error-card">
          <span className="ls-icon">⚠️</span>
          <h2>Database Not Connected</h2>
          <p>Could not connect to the database. Please check your Supabase credentials in <code>.env.local</code>.</p>
          <div className="error-detail">{error}</div>
          <p className="ls-hint">See the <strong>SETUP GUIDE</strong> below and make sure you have added the correct environment variables.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-screen">
      <div className="loading-card">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    </div>
  );
}
