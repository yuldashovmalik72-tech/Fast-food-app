import { useEffect, useState } from "react";
import { Plus, Trash2, X, Tag } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const emptyForm = { code: "", title: "", description: "", discountType: "PERCENT", discountValue: "", expiresAt: "" };

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);

  function load() {
    api.get("/promotions").then((res) => setPromotions(res.data));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await api.post("/promotions", form);
      toast.success("Aksiya yaratildi!");
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Xatolik yuz berdi.");
    }
  }

  async function toggleActive(promo) {
    await api.put(`/promotions/${promo.id}`, { isActive: !promo.isActive });
    load();
  }

  async function handleDelete(id) {
    if (!confirm("Aksiyani o'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`/promotions/${id}`);
    toast.success("Aksiya o'chirildi.");
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">🏷️ Aksiyalar & Promokodlar</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-1 !py-2">
          {showForm ? <X size={16} /> : <Plus size={16} />} {showForm ? "Bekor qilish" : "Yangi aksiya"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="card p-5 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up">
          <input required placeholder="Promokod (masalan: SUMMER20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="border rounded-lg px-4 py-2" />
          <input required placeholder="Aksiya nomi" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border rounded-lg px-4 py-2" />
          <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className="border rounded-lg px-4 py-2">
            <option value="PERCENT">Foizli chegirma (%)</option>
            <option value="FIXED">Belgilangan summa (so'm)</option>
          </select>
          <input required type="number" placeholder="Chegirma qiymati" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} className="border rounded-lg px-4 py-2" />
          <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="border rounded-lg px-4 py-2" />
          <textarea placeholder="Tavsif" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-4 py-2 sm:col-span-2" rows={2} />
          <button className="btn-primary sm:col-span-2">Yaratish</button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promo) => (
          <div key={promo.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <span className="flex items-center gap-1 font-mono font-bold text-brand-600 bg-brand-50 px-2 py-1 rounded-lg text-sm">
                <Tag size={14} /> {promo.code}
              </span>
              <button onClick={() => handleDelete(promo.id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
            <p className="font-semibold text-sm">{promo.title}</p>
            <p className="text-xs text-gray-500 mb-2">{promo.description}</p>
            <p className="text-sm font-bold">
              {promo.discountType === "PERCENT" ? `${promo.discountValue}%` : `${promo.discountValue.toLocaleString()} so'm`} chegirma
            </p>
            <button
              onClick={() => toggleActive(promo)}
              className={`mt-2 text-xs font-semibold px-3 py-1 rounded-full ${promo.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}
            >
              {promo.isActive ? "Faol" : "Nofaol"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
