import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { products as defaultProducts } from "../data/products";

const ProductContext = createContext();

// Map Supabase snake_case row → camelCase JS object
function fromDB(row) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    price: Number(row.price),
    originalPrice: Number(row.original_price ?? row.price),
    image: row.image || "",
    badge: row.badge || null,
    stock: Number(row.stock),
    description: row.description || "",
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    specs: row.specs || {},
  };
}

// Map camelCase JS object → Supabase snake_case columns (no id, no created_at)
function toDB(product) {
  return {
    name: product.name,
    brand: product.brand,
    category: product.category,
    price: Number(product.price),
    original_price: Number(product.originalPrice || product.price),
    image: product.image,
    badge: product.badge || null,
    stock: Number(product.stock),
    description: product.description,
    rating: Number(product.rating || 5),
    reviews: Number(product.reviews || 0),
    specs: product.specs || {},
  };
}

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setDbError(null);
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setDbError(error.message);
      setLoading(false);
      return;
    }
    setProducts(data.map(fromDB));
    setLoading(false);
  }

  async function addProduct(product) {
    const { data, error } = await supabase
      .from("products")
      .insert(toDB(product))
      .select()
      .single();
    if (error) throw new Error(error.message);
    const newProduct = fromDB(data);
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  }

  async function removeProduct(id) {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw new Error(error.message);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  async function updateProduct(id, updates) {
    const { data, error } = await supabase
      .from("products")
      .update(toDB(updates))
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    const updated = fromDB(data);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  }

  async function resetToDefaults() {
    // Remove all existing, then insert the 12 default products
    const { error: delErr } = await supabase.from("products").delete().gte("id", 0);
    if (delErr) throw new Error(delErr.message);

    const rows = defaultProducts.map(toDB);
    const { data, error: insErr } = await supabase
      .from("products")
      .insert(rows)
      .select();
    if (insErr) throw new Error(insErr.message);
    setProducts(data.map(fromDB));
  }

  return (
    <ProductContext.Provider
      value={{ products, loading, dbError, addProduct, removeProduct, updateProduct, resetToDefaults, refetch: fetchProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
