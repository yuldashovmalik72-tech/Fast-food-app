import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Phone, Tag, StickyNote } from "lucide-react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(null);
  const [loading, setLoading] = useState(false);

  async function applyPromo() {
    if (!promoCode) return;
    try {
      const { data } = await api.post("/promotions/validate", { code: promoCode });
      setDiscount(data);
      toast.success(`Promokod qo'llandi: ${data.title}`);
    } catch (err) {
      setDiscount(null);
      toast.error(err.response?.data?.message || "Promokod noto'g'ri.");
    }
  }

  const finalPrice = discount
    ? discount.discountType === "PERCENT"
      ? totalPrice - (totalPrice * discount.discountValue) / 100
      : Math.max(totalPrice - discount.discountValue, 0)
    : totalPrice;

  async function handleOrder() {
    if (!address || !phone) {
      toast.error("Manzil va telefon raqamini kiriting.");
      return;
    }
    setLoading(true);
    try {
      // combo-* IDlar realProduct emas, shuning uchun productId filterlaymiz;
      // haqiqiy loyihada combo uchun alohida endpoint chaqiriladi.
      const realItems = items.filter((i) => !String(i.id).startsWith("combo-"));
      await api.post("/orders", {
        items: realItems.map((i) => ({ productId: i.id, quantity: i.quantity })),
        address,
        phone,
        note,
        promoCode: discount ? promoCode : undefined,
      });
      toast.success("Buyurtmangiz qabul qilindi! 🎉");
      clearCart();
      navigate("/profile");
    } catch (err) {
      toast.error(err.response?.data?.message || "Buyurtma berishda xatolik.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return <div className="text-center py-24 text-gray-400">Savat bo'sh. Avval mahsulot tanlang.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold mb-6">Buyurtmani rasmiylashtirish</h1>

      <div className="card p-6 space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-center text-sm">
            <span>{item.quantity}x {item.name}</span>
            <span className="font-semibold">{(item.price * item.quantity).toLocaleString()} so'm</span>
          </div>
        ))}
      </div>

      <div className="card p-6 space-y-4">
        <div className="relative">
          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Yetkazish manzili"
            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 outline-none" />
        </div>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Telefon raqami"
            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 outline-none" />
        </div>
        <div className="relative">
          <StickyNote className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Izoh (ixtiyoriy)"
            className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 outline-none" />
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Promokod"
              className="w-full pl-11 pr-4 py-3 rounded-full border border-gray-200 focus:border-brand-500 outline-none" />
          </div>
          <button onClick={applyPromo} className="btn-outline">Qo'llash</button>
        </div>

        <div className="border-t pt-4 space-y-1">
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Mahsulotlar narxi:</span>
            <span>{totalPrice.toLocaleString()} so'm</span>
          </div>
          {discount && (
            <div className="flex justify-between text-green-600 text-sm">
              <span>Chegirma:</span>
              <span>-{(totalPrice - finalPrice).toLocaleString()} so'm</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Jami to'lov:</span>
            <span className="text-brand-600">{finalPrice.toLocaleString()} so'm</span>
          </div>
        </div>

        <button onClick={handleOrder} disabled={loading} className="btn-primary w-full mt-2">
          {loading ? "Yuborilmoqda..." : "Buyurtmani tasdiqlash"}
        </button>
      </div>
    </div>
  );
}
