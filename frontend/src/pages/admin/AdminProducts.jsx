import { useEffect, useState } from "react";
import { Plus, Trash2, Edit, X } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const emptyForm = { name: "", description: "", price: "", image: "", categoryId: "", rating: "4.5" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  function loadProducts() {
    api.get("/products?limit=100").then((res) => setProducts(res.data.products));
  }

  useEffect(() => {
    loadProducts();
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      image: product.image || "",
      categoryId: product.categoryId,
      rating: product.rating,
    });
    setShowForm(true);
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        toast.success("Mahsulot yangilandi!");
      } else {
        await api.post("/products", form);
        toast.success("Mahsulot qo'shildi!");
      }
      resetForm();
      loadProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi.");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Mahsulotni o'chirishni tasdiqlaysizmi?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Mahsulot o'chirildi.");
      loadProducts();
    } catch {
      toast.error("O'chirishda xatolik.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">🍔 Mahsulotlar</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-1 !py-2">
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Bekor qilish" : "Yangi mahsulot"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
          <input name="name" required placeholder="Nomi" value={form.name} onChange={handleChange} className="border rounded-lg px-4 py-2" />
          <select name="categoryId" required value={form.categoryId} onChange={handleChange} className="border rounded-lg px-4 py-2">
            <option value="">Kategoriya tanlang</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input name="price" type="number" required placeholder="Narxi (so'm)" value={form.price} onChange={handleChange} className="border rounded-lg px-4 py-2" />
          <input name="rating" type="number" step="0.1" min="0" max="5" placeholder="Reyting" value={form.rating} onChange={handleChange} className="border rounded-lg px-4 py-2" />
          <input name="image" placeholder="Rasm URL" value={form.image} onChange={handleChange} className="border rounded-lg px-4 py-2 sm:col-span-2" />
          <textarea name="description" placeholder="Tavsif" value={form.description} onChange={handleChange} className="border rounded-lg px-4 py-2 sm:col-span-2" rows={2} />
          <button className="btn-primary sm:col-span-2">{editingId ? "Yangilash" : "Qo'shish"}</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((p) => (
          <div key={p.id} className="card p-4 flex gap-3">
            <img src={p.image} alt={p.name} className="w-16 h-16 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm line-clamp-1">{p.name}</p>
              <p className="text-xs text-gray-400">{p.category?.name}</p>
              <p className="text-brand-600 font-bold text-sm">{p.price.toLocaleString()} so'm</p>
            </div>
            <div className="flex flex-col gap-1">
              <button onClick={() => startEdit(p)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
