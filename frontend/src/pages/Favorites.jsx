import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  function load() {
    api.get("/favorites").then((res) => setFavorites(res.data));
  }

  useEffect(() => {
    load();
  }, []);

  function handleToggle(productId, isFavorited) {
    if (!isFavorited) {
      setFavorites((prev) => prev.filter((f) => f.product.id !== productId));
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Heart className="text-red-500 fill-red-500" /> Sevimlilar
      </h1>

      {favorites.length === 0 ? (
        <p className="text-gray-400 text-center py-20">Sevimlilar ro'yxati bo'sh.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {favorites.map((f) => (
            <ProductCard key={f.id} product={f.product} isFavorited onFavoriteToggle={handleToggle} />
          ))}
        </div>
      )}
    </div>
  );
}
