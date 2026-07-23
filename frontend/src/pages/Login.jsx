import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Flame } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch {
      // toast xatoligi allaqachon AuthContext ichida ko'rsatiladi
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-8 animate-slide-up">
        <div className="text-center mb-6">
          <Flame className="mx-auto text-brand-500 fill-brand-500" size={40} />
          <h1 className="text-2xl font-bold mt-2">Tizimga kirish</h1>
          <p className="text-gray-500 text-sm">Xush kelibsiz! Hisobingizga kiring.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              required
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 outline-none"
            />
          </div>
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Yuklanmoqda..." : "Kirish"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          Hisobingiz yo'qmi?{" "}
          <Link to="/register" className="text-brand-600 font-semibold hover:underline">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  );
}
