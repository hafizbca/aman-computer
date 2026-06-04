import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";
import { supabase } from "../lib/supabase";
import { categories } from "../data/products";
import "./AdminDashboard.css";

const EMPTY_FORM = {
  name: "", brand: "", category: "laptops", price: "", originalPrice: "",
  image: "", badge: "", stock: "", description: "", rating: "5", reviews: "0",
};

export default function AdminDashboard() {
  const { isAdmin, logout } = useAuth();
  const { products, addProduct, removeProduct, updateProduct, resetToDefaults } = useProducts();
  const navigate = useNavigate();

  // "list" | "add" | "edit"
  const [view, setView] = useState("list");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [toast, setToast] = useState(null);

  if (!isAdmin) {
    navigate("/admin");
    return null;
  }

  function showToast(msg, type = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setSpecs([{ key: "", value: "" }]);
    setEditId(null);
    setView("add");
  }

  function openEdit(product) {
    setForm({
      name: product.name, brand: product.brand, category: product.category,
      price: String(product.price), originalPrice: String(product.originalPrice),
      image: product.image, badge: product.badge || "", stock: String(product.stock),
      description: product.description, rating: String(product.rating),
      reviews: String(product.reviews),
    });
    const entries = Object.entries(product.specs || {}).map(([k, v]) => ({ key: k, value: v }));
    setSpecs(entries.length > 0 ? entries : [{ key: "", value: "" }]);
    setEditId(product.id);
    setView("edit");
  }

  function handleFormChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    const ext = file.name.split(".").pop();
    const fileName = `product-${performance.now().toString(36).replace(".", "")}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, file, { upsert: true });
    if (error) {
      setUploadError("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    setForm((f) => ({ ...f, image: data.publicUrl }));
    setUploading(false);
  }

  function handleSpecChange(idx, field, val) {
    setSpecs((prev) => prev.map((s, i) => (i === idx ? { ...s, [field]: val } : s)));
  }

  function buildSpecs() {
    const obj = {};
    specs.forEach(({ key, value }) => { if (key.trim()) obj[key.trim()] = value.trim(); });
    return obj;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.image) {
      showToast("Please upload a product image.", "error");
      return;
    }
    setSaving(true);
    const payload = { ...form, specs: buildSpecs() };
    try {
      if (view === "edit") {
        await updateProduct(editId, payload);
        showToast("Product updated successfully!");
      } else {
        await addProduct(payload);
        showToast("Product added successfully!");
      }
      setView("list");
      setEditId(null);
    } catch (err) {
      showToast(err.message || "Something went wrong.", "error");
    } finally {
      setSaving(false);
    }
  }

  function confirmDelete(p) { setDeleteTarget(p); }

  async function handleDelete() {
    setSaving(true);
    try {
      await removeProduct(deleteTarget.id);
      setDeleteTarget(null);
      showToast("Product deleted.", "error");
    } catch (err) {
      showToast(err.message || "Delete failed.", "error");
    } finally {
      setSaving(false);
    }
  }

  const filtered = products.filter((p) => {
    const matchCat = filterCat === "all" || p.category === filterCat;
    const q = search.toLowerCase();
    const matchSearch = !search || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const stats = {
    total: products.length,
    laptops: products.filter((p) => p.category === "laptops").length,
    desktops: products.filter((p) => p.category === "desktops").length,
    accessories: products.filter((p) => p.category === "accessories").length,
    imported: products.filter((p) => p.category === "imported").length,
    lowStock: products.filter((p) => p.stock <= 5).length,
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span>&#128187;</span>
          <div>
            <p className="brand-name">Aman Computer<br/>and Laptop</p>
            <p className="brand-role">Admin Panel</p>
          </div>
        </div>
        <nav className="admin-nav">
          <button className={view === "list" ? "active" : ""} onClick={() => { setView("list"); setEditId(null); }}>
            &#128230; Products
          </button>
          <button className={view === "add" ? "active" : ""} onClick={openAdd}>
            &#43;&#160; Add Product
          </button>
          <a href="/" target="_blank" rel="noreferrer" className="nav-ext">
            &#128279; View Store
          </a>
        </nav>
        <button className="admin-logout" onClick={() => { logout(); navigate("/admin"); }}>
          &#128274; Logout
        </button>
      </aside>

      {/* Main */}
      <main className="admin-main">
        {toast && (
          <div className={`admin-toast ${toast.type}`}>
            {toast.type === "success" ? "✓" : "✕"} {toast.msg}
          </div>
        )}

        {deleteTarget && (
          <div className="modal-overlay" onClick={() => setDeleteTarget(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Product?</h3>
              <p>Are you sure you want to delete <strong>{deleteTarget.name}</strong>? This action cannot be undone.</p>
              <div className="modal-btns">
                <button className="modal-cancel" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="modal-delete" onClick={handleDelete} disabled={saving}>{saving ? "Deleting..." : "Yes, Delete"}</button>
              </div>
            </div>
          </div>
        )}

        {/* ── LIST VIEW ── */}
        {view === "list" && (
          <>
            <h2 className="admin-page-title">Dashboard</h2>
            <div className="stats-grid">
              <div className="stat-card blue"><span>{stats.total}</span><p>Total Products</p></div>
              <div className="stat-card"><span>{stats.laptops}</span><p>Laptops</p></div>
              <div className="stat-card"><span>{stats.desktops}</span><p>Desktops</p></div>
              <div className="stat-card"><span>{stats.accessories}</span><p>Accessories</p></div>
              <div className="stat-card"><span>{stats.imported}</span><p>Imported</p></div>
              <div className={`stat-card ${stats.lowStock > 0 ? "red" : ""}`}>
                <span>{stats.lowStock}</span><p>Low Stock</p>
              </div>
            </div>

            <div className="admin-toolbar">
              <input
                className="admin-search"
                placeholder="🔍  Search by name or brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <select className="admin-filter" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <button className="btn-add" onClick={openAdd}>+ Add Product</button>
            </div>

            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <td data-label="Product">
                        <div className="table-product">
                          <img src={p.image} alt={p.name} />
                          <div>
                            <p className="tp-name">{p.name}</p>
                            <p className="tp-brand">{p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td data-label="Category"><span className="cat-pill">{p.category}</span></td>
                      <td data-label="Price">
                        <p className="tp-price">₹{p.price.toLocaleString("en-IN")}</p>
                        {p.originalPrice > p.price && (
                          <p className="tp-orig">₹{p.originalPrice.toLocaleString("en-IN")}</p>
                        )}
                      </td>
                      <td data-label="Stock">
                        <span className={p.stock <= 5 ? "stock-low" : "stock-ok"}>{p.stock}</span>
                      </td>
                      <td data-label="Rating"><span className="rating-cell">★ {p.rating}</span> <span className="reviews-cell">({p.reviews})</span></td>
                      <td data-label="Actions">
                        <div className="action-btns">
                          <button className="btn-edit" onClick={() => openEdit(p)}>✏️ Edit</button>
                          <button className="btn-del" onClick={() => confirmDelete(p)}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr><td colSpan={6} className="empty-row">No products match your search.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="reset-wrap">
              <button className="btn-reset" onClick={async () => { setSaving(true); try { await resetToDefaults(); showToast("Reset to default products."); } catch(e) { showToast(e.message,"error"); } finally { setSaving(false); } }}>
                ↺ Reset to Default Products
              </button>
            </div>
          </>
        )}

        {/* ── ADD / EDIT FORM VIEW ── */}
        {(view === "add" || view === "edit") && (
          <div className="product-form-wrap">
            <div className="form-header">
              <h2>{view === "edit" ? "✏️ Edit Product" : "➕ Add New Product"}</h2>
              <button className="form-back" onClick={() => { setView("list"); setEditId(null); }}>← Back to Products</button>
            </div>

            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-sections">
                {/* Basic Info */}
                <section className="form-section">
                  <h3>Basic Information</h3>
                  <div className="pf-row">
                    <div className="pf-field">
                      <label>Product Name *</label>
                      <input name="name" required value={form.name} onChange={handleFormChange} placeholder="e.g. MacBook Pro 16" />
                    </div>
                    <div className="pf-field">
                      <label>Brand *</label>
                      <input name="brand" required value={form.brand} onChange={handleFormChange} placeholder="e.g. Apple" />
                    </div>
                  </div>
                  <div className="pf-row">
                    <div className="pf-field">
                      <label>Category *</label>
                      <select name="category" value={form.category} onChange={handleFormChange}>
                        <option value="laptops">Laptops</option>
                        <option value="desktops">Desktops</option>
                        <option value="accessories">Accessories</option>
                        <option value="imported">Imported Devices</option>
                      </select>
                    </div>
                    <div className="pf-field">
                      <label>Badge (optional)</label>
                      <input name="badge" value={form.badge} onChange={handleFormChange} placeholder="e.g. New, Hot Deal, Imported" />
                    </div>
                  </div>
                  <div className="pf-field">
                    <label>Description *</label>
                    <textarea name="description" required rows={3} value={form.description} onChange={handleFormChange} placeholder="Describe the product..." />
                  </div>
                </section>

                {/* Pricing */}
                <section className="form-section">
                  <h3>Pricing & Stock</h3>
                  <div className="pf-row">
                    <div className="pf-field">
                      <label>Sale Price (₹ INR) *</label>
                      <input name="price" type="number" min="0" required value={form.price} onChange={handleFormChange} placeholder="1299" />
                    </div>
                    <div className="pf-field">
                      <label>Original Price (₹ INR)</label>
                      <input name="originalPrice" type="number" min="0" value={form.originalPrice} onChange={handleFormChange} placeholder="Leave blank if no discount" />
                    </div>
                  </div>
                  <div className="pf-row">
                    <div className="pf-field">
                      <label>Stock Quantity *</label>
                      <input name="stock" type="number" min="0" required value={form.stock} onChange={handleFormChange} placeholder="10" />
                    </div>
                    <div className="pf-field">
                      <label>Rating (0–5)</label>
                      <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleFormChange} />
                    </div>
                  </div>
                  <div className="pf-field half">
                    <label>Reviews Count</label>
                    <input name="reviews" type="number" min="0" value={form.reviews} onChange={handleFormChange} placeholder="0" />
                  </div>
                </section>

                {/* Image */}
                <section className="form-section">
                  <h3>Product Image</h3>
                  <div className="pf-field">
                    <label>Upload Image *</label>
                    <div className="img-upload-area">
                      <input
                        id="img-file-input"
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      <label htmlFor="img-file-input" className={`img-upload-btn${uploading ? " uploading" : ""}`}>
                        {uploading ? "⏳ Uploading..." : form.image ? "🔄 Change Image" : "📁 Choose Image"}
                      </label>
                      {uploadError && <p className="upload-error">⚠️ {uploadError}</p>}
                    </div>
                  </div>
                  {form.image && !uploading && (
                    <div className="img-preview">
                      <img src={form.image} alt="preview" onError={(e) => (e.target.style.display = "none")} />
                      <div>
                        <p style={{color:"var(--text-2)",fontWeight:600,fontSize:"0.85rem"}}>Image Preview</p>
                        <p style={{color:"var(--text-3)",fontSize:"0.78rem",marginTop:"4px"}}>Click "Change Image" to replace.</p>
                      </div>
                    </div>
                  )}
                </section>

                {/* Specs */}
                <section className="form-section">
                  <h3>Specifications</h3>
                  <div className="specs-builder">
                    {specs.map((spec, idx) => (
                      <div key={idx} className="spec-row-b">
                        <input
                          placeholder="Key (e.g. Processor)"
                          value={spec.key}
                          onChange={(e) => handleSpecChange(idx, "key", e.target.value)}
                        />
                        <span>:</span>
                        <input
                          placeholder="Value (e.g. Apple M3 Pro)"
                          value={spec.value}
                          onChange={(e) => handleSpecChange(idx, "value", e.target.value)}
                        />
                        <button type="button" className="spec-rm" onClick={() => setSpecs((p) => p.filter((_, i) => i !== idx))}>✕</button>
                      </div>
                    ))}
                    <button type="button" className="btn-add-spec" onClick={() => setSpecs((p) => [...p, { key: "", value: "" }])}>
                      + Add Specification
                    </button>
                  </div>
                </section>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel-form" onClick={() => { setView("list"); setEditId(null); }}>Cancel</button>
                <button type="submit" className="btn-submit-form" disabled={saving}>
                  {saving ? "Saving..." : view === "edit" ? "💾 Save Changes" : "➕ Add Product"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
