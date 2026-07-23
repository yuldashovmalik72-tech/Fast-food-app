import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category) params.set("category", category);
      if (sort) params.set("sort", sort);
      params.set("limit", "24");

      api.get(`/products?${params.toString()}`).then((res) => {
        setProducts(res.data.products);
        setLoading(false);
      });
    }, 300); // debounce — real-time qidiruv

    return () => clearTimeout(timeout);
  }, [search, category, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-6">Bizning Menyu</h1>

      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Taom nomini qidiring..."
            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none transition"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="pl-11 pr-8 py-3 rounded-full border border-gray-200 outline-none appearance-none bg-white cursor-pointer"
          >
            <option value="">Saralash</option>
            <option value="price_asc">Narx: pastdan yuqoriga</option>
            <option value="price_desc">Narx: yuqoridan pastga</option>
            <option value="rating">Reyting bo'yicha</option>
          </select>
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-6">
        <CategoryFilter categories={categories} active={category} onChange={setCategory} />
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center text-gray-400 py-20">Hech narsa topilmadi 😔</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
