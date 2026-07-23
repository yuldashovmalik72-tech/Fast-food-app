import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User as UserIcon, Phone, Flame } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.phone);
      navigate("/");
    } catch {
      // xatolik toast orqali ko'rsatiladi
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-10">
      <div className="card w-full max-w-md p-8 animate-slide-up">
        <div className="text-center mb-6">
          <Flame className="mx-auto text-brand-500 fill-brand-500" size={40} />
          <h1 className="text-2xl font-bold mt-2">Ro'yxatdan o'tish</h1>
          <p className="text-gray-500 text-sm">Bizga qo'shiling va buyurtma bering!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input name="name" required placeholder="To'liq ism" value={form.name} onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input name="email" type="email" required placeholder="Email" value={form.email} onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input name="phone" placeholder="Telefon raqami" value={form.phone} onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input name="password" type="password" required placeholder="Parol" value={form.password} onChange={handleChange}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none" />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Yuklanmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Hisobingiz bormi?{" "}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
}
