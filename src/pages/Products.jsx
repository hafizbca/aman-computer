import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { categories } from "../data/products";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import "./Products.css";

const sortOptions = [
  { value: "default", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "newest", label: "Newest" },
];

export default function Products() {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("default");

  const activeCategory = searchParams.get("category") || "all";
  const searchQuery = searchParams.get("search") || "";

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc": return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "rating": return [...list].sort((a, b) => b.rating - a.rating);
      default: return list;
    }
  }, [activeCategory, searchQuery, sort]);

  function setCategory(cat) {
    const params = {};
    if (cat !== "all") params.category = cat;
    if (searchQuery) params.search = searchQuery;
    setSearchParams(params);
  }

  return (
    <main className="products-page">
      <div className="products-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Categories</h3>
          <ul className="cat-list">
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  className={activeCategory === c.id ? "active" : ""}
                  onClick={() => setCategory(c.id)}
                >
                  {c.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main */}
        <div className="products-main">
          <div className="products-toolbar">
            <div>
              <h1 className="page-title">
                {searchQuery
                  ? `Results for "${searchQuery}"`
                  : categories.find((c) => c.id === activeCategory)?.name || "All Products"}
              </h1>
              <p className="result-count">{filtered.length} products found</p>
            </div>
            <select
              className="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <span>🔍</span>
              <h3>No products found</h3>
              <p>Try a different category or search term.</p>
            </div>
          ) : (
            <div className="products-grid-page">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
