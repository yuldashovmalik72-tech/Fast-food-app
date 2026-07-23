import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  async function login(email, password) {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success(`Xush kelibsiz, ${data.user.name}!`);
      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Login xatosi yuz berdi.");
      throw err;
    }
  }

  async function register(name, email, password, phone) {
    try {
      const { data } = await api.post("/auth/register", { name, email, password, phone });
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setUser(data.user);
      toast.success("Ro'yxatdan muvaffaqiyatli o'tdingiz!");
      return data.user;
    } catch (err) {
      toast.error(err.response?.data?.message || "Ro'yxatdan o'tishda xatolik.");
      throw err;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Tizimdan chiqdingiz.");
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, isAdmin: user?.role === "ADMIN" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
