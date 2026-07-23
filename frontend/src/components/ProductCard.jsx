import { Heart, Plus, Star } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useState } from "react";

export default function ProductCard({ product, isFavorited = false, onFavoriteToggle }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [favorited, setFavorited] = useState(isFavorited);
  const [loadingFav, setLoadingFav] = useState(false);

  async function handleFavorite(e) {
    e.stopPropagation();
    if (!user) {
      toast.error("Sevimlilarga qo'shish uchun tizimga kiring.");
      return;
    }
    setLoadingFav(true);
    try {
      const { data } = await api.post(`/favorites/${product.id}`);
      setFavorited(data.favorited);
      toast.success(data.message);
      onFavoriteToggle?.(product.id, data.favorited);
    } catch {
      toast.error("Xatolik yuz berdi.");
    } finally {
      setLoadingFav(false);
    }
  }

  return (
    <div className="card group overflow-hidden animate-fade-in">
      <div className="relative h-44 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button
          onClick={handleFavorite}
          disabled={loadingFav}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow hover:scale-110 transition"
        >
          <Heart size={18} className={favorited ? "fill-red-500 text-red-500" : "text-dark-800"} />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold">
          <Star size={12} className="fill-yellow-400 text-yellow-400" />
          {product.rating}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-dark-900 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2 h-10 mt-1">{product.description}</p>

        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-brand-600">{product.price.toLocaleString()} so'm</span>
          <button
            onClick={() => addToCart(product)}
            className="bg-brand-500 hover:bg-brand-600 text-white p-2 rounded-full transition active:scale-90 shadow"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
