import { useEffect, useState } from "react";
import { Package } from "lucide-react";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Combos() {
  const [combos, setCombos] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    api.get("/combos").then((res) => setCombos(res.data));
  }, []);

  function handleAdd(combo) {
    // Combo'ni ham savatga "mahsulot"dek qo'shamiz (id, name, price, image)
    addToCart({ id: `combo-${combo.id}`, name: combo.name, price: combo.price, image: combo.image });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <Package className="text-brand-500" /> Combolar
      </h1>
      <p className="text-gray-500 mb-6">Bir nechta taomlarni birlashtirib, tejamli narxda oling!</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {combos.map((combo) => (
          <div key={combo.id} className="card overflow-hidden animate-slide-up">
            <img src={combo.image} alt={combo.name} className="w-full h-48 object-cover" />
            <div className="p-5">
              <h3 className="font-bold text-lg">{combo.name}</h3>
              <p className="text-sm text-gray-500 mb-3">{combo.description}</p>
              <ul className="text-xs text-gray-400 mb-3 space-y-1">
                {combo.items.map((item) => (
                  <li key={item.id}>• {item.quantity}x {item.product.name}</li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <span className="font-bold text-brand-600 text-lg">{combo.price.toLocaleString()} so'm</span>
                <button onClick={() => handleAdd(combo)} className="btn-primary !py-2 !px-4 text-sm">
                  Savatga qo'shish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
