import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, Clock } from "lucide-react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products?limit=8&sort=rating").then((res) => setProducts(res.data.products));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-brand-500 to-brand-700 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1 animate-slide-up">
            <span className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-medium">🔥 30 daqiqada yetkazamiz</span>
            <h1 className="text-4xl sm:text-5xl font-extrabold mt-5 leading-tight">
              Mazali taomlar,<br /> tezkor yetkazib berish
            </h1>
            <p className="mt-4 text-white/90 max-w-md">
              Eng sara burgerlar, pitsalar va combolar — bir click uzoqlikda. Hoziroq buyurtma bering!
            </p>
            <Link to="/menu" className="inline-flex items-center gap-2 bg-white text-brand-600 font-bold px-6 py-3 rounded-full mt-6 hover:scale-105 transition shadow-xl">
              Menyuni ko'rish <ArrowRight size={18} />
            </Link>
          </div>
          <div className="flex-1 flex justify-center animate-bounce-in">
            <img
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600"
              alt="Burger"
              className="rounded-full w-72 h-72 sm:w-96 sm:h-96 object-cover shadow-2xl border-8 border-white/20"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { icon: Truck, title: "Tez yetkazish", desc: "30 daqiqa ichida eshigingiz oldida" },
          { icon: ShieldCheck, title: "Sifat kafolati", desc: "Faqat yangi va sifatli mahsulotlar" },
          { icon: Clock, title: "24/7 xizmat", desc: "Kecha-kunduz buyurtma qabul qilamiz" },
        ].map((f, i) => (
          <div key={i} className="card p-6 flex items-center gap-4 animate-fade-in">
            <div className="bg-brand-100 text-brand-600 p-3 rounded-full">
              <f.icon size={26} />
            </div>
            <div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Popular products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🔥 Mashhur taomlar</h2>
          <Link to="/menu" className="text-brand-600 font-medium flex items-center gap-1 hover:underline">
            Barchasi <ArrowRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
