import { useEffect, useState } from "react";
import { User, Package, Clock, CheckCircle, Truck, ChefHat, XCircle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const statusConfig = {
  PENDING: { label: "Kutilmoqda", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  PREPARING: { label: "Tayyorlanmoqda", color: "bg-blue-100 text-blue-700", icon: ChefHat },
  DELIVERING: { label: "Yetkazilmoqda", color: "bg-purple-100 text-purple-700", icon: Truck },
  COMPLETED: { label: "Yakunlandi", color: "bg-green-100 text-green-700", icon: CheckCircle },
  CANCELLED: { label: "Bekor qilindi", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get("/orders/my").then((res) => setOrders(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="card p-6 flex items-center gap-4 mb-8 animate-slide-up">
        <div className="bg-brand-100 text-brand-600 p-4 rounded-full">
          <User size={32} />
        </div>
        <div>
          <h1 className="text-xl font-bold">{user?.name}</h1>
          <p className="text-gray-500 text-sm">{user?.email}</p>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Package size={20} className="text-brand-500" /> Buyurtmalar tarixi
      </h2>

      {orders.length === 0 ? (
        <p className="text-gray-400 text-center py-10">Hozircha buyurtmalar yo'q.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            return (
              <div key={order.id} className="card p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleString("uz-UZ")}
                  </span>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${status.color}`}>
                    <StatusIcon size={13} /> {status.label}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span>{(item.price * item.quantity).toLocaleString()} so'm</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold border-t pt-3">
                  <span>Jami:</span>
                  <span className="text-brand-600">{order.totalPrice.toLocaleString()} so'm</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
