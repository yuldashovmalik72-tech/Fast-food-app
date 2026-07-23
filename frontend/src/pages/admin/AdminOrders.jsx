import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";

const statuses = ["PENDING", "PREPARING", "DELIVERING", "COMPLETED", "CANCELLED"];
const statusLabels = {
  PENDING: "Kutilmoqda",
  PREPARING: "Tayyorlanmoqda",
  DELIVERING: "Yetkazilmoqda",
  COMPLETED: "Yakunlandi",
  CANCELLED: "Bekor qilindi",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");

  function load() {
    api.get(`/orders${filter ? `?status=${filter}` : ""}`).then((res) => setOrders(res.data));
  }

  useEffect(() => {
    load();
  }, [filter]);

  async function updateStatus(id, status) {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      toast.success("Status yangilandi!");
      load();
    } catch {
      toast.error("Statusni yangilashda xatolik.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">📦 Buyurtmalar</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded-full px-4 py-2 text-sm">
          <option value="">Barchasi</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{statusLabels[s]}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="card p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <p className="font-semibold">{order.user.name} — {order.user.phone || order.phone}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString("uz-UZ")}</p>
                <p className="text-xs text-gray-500 mt-1">📍 {order.address}</p>
              </div>
              <select
                value={order.status}
                onChange={(e) => updateStatus(order.id, e.target.value)}
                className="border rounded-full px-4 py-2 text-sm font-medium"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </select>
            </div>
            <div className="text-sm text-gray-600 space-y-1 border-t pt-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.quantity}x {item.product.name}</span>
                  <span>{(item.price * item.quantity).toLocaleString()} so'm</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold mt-2 pt-2 border-t">
              <span>Jami:</span>
              <span className="text-brand-600">{order.totalPrice.toLocaleString()} so'm</span>
            </div>
          </div>
        ))}
        {orders.length === 0 && <p className="text-gray-400 text-center py-10">Buyurtmalar topilmadi.</p>}
      </div>
    </div>
  );
}
