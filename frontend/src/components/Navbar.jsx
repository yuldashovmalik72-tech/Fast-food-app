import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Heart, Menu, X, LogOut, LayoutDashboard, Flame } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar({ onCartOpen }) {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl text-brand-600">
          <Flame className="fill-brand-500 text-brand-500" size={28} />
          FastBite
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-dark-800">
          <Link to="/" className="hover:text-brand-500 transition">Bosh sahifa</Link>
          <Link to="/menu" className="hover:text-brand-500 transition">Menyu</Link>
          <Link to="/combos" className="hover:text-brand-500 transition">Combolar</Link>
          {user && <Link to="/favorites" className="hover:text-brand-500 transition">Sevimlilar</Link>}
          {user && <Link to="/profile" className="hover:text-brand-500 transition">Profil</Link>}
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1 hover:text-brand-500 transition">
              <LayoutDashboard size={16} /> Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <Link to="/favorites" className="p-2 rounded-full hover:bg-orange-100 transition hidden sm:block">
              <Heart size={22} />
            </Link>
          )}

          <button onClick={onCartOpen} className="relative p-2 rounded-full hover:bg-orange-100 transition">
            <ShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-bounce-in">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <button onClick={logout} className="hidden sm:flex items-center gap-1 btn-outline !py-1.5 !px-3 text-sm">
              <LogOut size={16} /> Chiqish
            </button>
          ) : (
            <button onClick={() => navigate("/login")} className="hidden sm:flex items-center gap-1 btn-primary !py-1.5 !px-4 text-sm">
              <User size={16} /> Kirish
            </button>
          )}

          <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t px-4 py-4 flex flex-col gap-3 animate-slide-up">
          <Link to="/" onClick={() => setMenuOpen(false)}>Bosh sahifa</Link>
          <Link to="/menu" onClick={() => setMenuOpen(false)}>Menyu</Link>
          <Link to="/combos" onClick={() => setMenuOpen(false)}>Combolar</Link>
          {user && <Link to="/favorites" onClick={() => setMenuOpen(false)}>Sevimlilar</Link>}
          {user && <Link to="/profile" onClick={() => setMenuOpen(false)}>Profil</Link>}
          {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {user ? (
            <button onClick={() => { logout(); setMenuOpen(false); }} className="btn-outline w-full">Chiqish</button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-primary text-center w-full">Kirish</Link>
          )}
        </div>
      )}
    </nav>
  );
}
