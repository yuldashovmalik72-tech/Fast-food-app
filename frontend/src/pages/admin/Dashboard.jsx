import { useEffect, useState } from "react";
import { ShoppingBag, Users, UtensilsCrossed, Clock, DollarSign } from "lucide-react";
import api from "../../api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setStats(res.data));
  }, []);

  if (!stats) return <div className="text-gray-400">Yuklanmoqda...</div>;

  const cards = [
    { label: "Jami buyurtmalar", value: stats.totalOrders, icon: ShoppingBag, color: "bg-blue-100 text-blue-600" },
    { label: "Foydalanuvchilar", value: stats.totalUsers, icon: Users, color: "bg-purple-100 text-purple-600" },
    { label: "Mahsulotlar", value: stats.totalProducts, icon: UtensilsCrossed, color: "bg-orange-100 text-orange-600" },
    { label: "Kutilayotgan buyurtmalar", value: stats.pendingOrders, icon: Clock, color: "bg-yellow-100 text-yellow-600" },
    { label: "Umumiy tushum", value: `${stats.totalRevenue.toLocaleString()} so'm`, icon: DollarSign, color: "bg-green-100 text-green-600" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📊 Boshqaruv paneli</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((c, i) => (
          <div key={i} className="card p-6 flex items-center gap-4 animate-fade-in">
            <div className={`p-3 rounded-full ${c.color}`}>
              <c.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{c.label}</p>
              <p className="text-xl font-bold">{c.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
