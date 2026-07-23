import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Package, Tag, ClipboardList, UtensilsCrossed } from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/orders", label: "Buyurtmalar", icon: ClipboardList },
  { to: "/admin/products", label: "Mahsulotlar", icon: UtensilsCrossed },
  { to: "/admin/combos", label: "Combolar", icon: Package },
  { to: "/admin/promotions", label: "Aksiyalar", icon: Tag },
];

export default function AdminLayout() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-6">
      <aside className="md:w-56 shrink-0">
        <div className="card p-3 flex md:flex-col gap-1 overflow-x-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                  isActive ? "bg-brand-500 text-white" : "hover:bg-orange-100 text-dark-800"
                }`
              }
            >
              <link.icon size={16} /> {link.label}
            </NavLink>
          ))}
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
    </div>
  );
}
