import { useEffect, useState } from "react";
import { Plus, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

export default function AdminCombos() {
  const [combos, setCombos] = useState([]);
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", image: "", price: "" });
  const [selectedProducts, setSelectedProducts] = useState([]); // [{productId, quantity}]

  function loadCombos() {
    api.get("/combos").then((res) => setCombos(res.data));
  }

  useEffect(() => {
    loadCombos();
    api.get("/products?limit=100").then((res) => setProducts(res.data.products));
  }, []);

  function toggleProduct(productId) {
    setSelectedProducts((prev) => {
      const exists = prev.find((p) => p.productId === productId);
      if (exists) return prev.filter((p) => p.productId !== productId);
      return [...prev, { productId, quantity: 1 }];
    });
  }

  function updateQty(productId, quantity) {
    setSelectedProducts((prev) => prev.map((p) => (p.productId === productId ? { ...p, quantity: Number(quantity) } : p)));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (selectedProducts.length < 2) {
      toast.error("Kamida 2 ta mahsulot tanlang.");
      return;
    }
    try {
      await api.post("/combos", { ...form, products: selectedProducts });
      toast.success("Combo yaratildi!");
      setForm({ name: "", description: "", image: "", price: "" });
      setSelectedProducts([]);
      setShowForm(false);
      loadCombos();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Comboni o'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/combos/${id}`);
    toast.success("Combo o'chirildi.");
    loadCombos();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">📦 Combolar</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-1 !py-2">
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Bekor qilish" : "Yangi combo"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 mb-6 space-y-4 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input required placeholder="Combo nomi" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border rounded-lg px-4 py-2" />
            <input required type="number" placeholder="Combo narxi (so'm)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded-lg px-4 py-2" />
            <input placeholder="Rasm URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="border rounded-lg px-4 py-2 sm:col-span-2" />
            <textarea placeholder="Tavsif" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-4 py-2 sm:col-span-2" rows={2} />
          </div>

          <div>
            <p className="font-semibold text-sm mb-2">Mahsulotlarni tanlang (kamida 2 ta):</p>
            <div className="max-h-64 overflow-y-auto border rounded-lg divide-y">
              {products.map((p) => {
                const selected = selectedProducts.find((sp) => sp.productId === p.id);
                return (
                  <div key={p.id} className="flex items-center justify-between px-3 py-2">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input type="checkbox" checked={!!selected} onChange={() => toggleProduct(p.id)} className="accent-brand-500" />
                      <span className="text-sm">{p.name} — {p.price.toLocaleString()} so'm</span>
                    </label>
                    {selected && (
                      <input
                        type="number"
                        min="1"
                        value={selected.quantity}
                        onChange={(e) => updateQty(p.id, e.target.value)}
                        className="w-16 border rounded px-2 py-1 text-sm"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <button className="btn-primary w-full flex items-center justify-center gap-1">
            <Check size={16} /> Comboni yaratish
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {combos.map((combo) => (
          <div key={combo.id} className="card p-4">
            <img src={combo.image} alt={combo.name} className="w-full h-32 object-cover rounded-lg mb-3" />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold">{combo.name}</p>
                <p className="text-brand-600 font-bold text-sm">{combo.price.toLocaleString()} so'm</p>
              </div>
              <button onClick={() => handleDelete(combo.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
            <ul className="text-xs text-gray-400 mt-2">
              {combo.items.map((item) => (
                <li key={item.id}>• {item.quantity}x {item.product.name}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
