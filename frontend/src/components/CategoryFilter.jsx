import * as Icons from "lucide-react";

export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
      <button
        onClick={() => onChange(null)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
          !active ? "bg-brand-500 text-white shadow-md" : "bg-white text-dark-800 hover:bg-orange-100"
        }`}
      >
        <Icons.LayoutGrid size={16} />
        Barchasi
      </button>

      {categories.map((cat) => {
        const Icon = Icons[cat.icon] || Icons.UtensilsCrossed;
        const isActive = active === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.slug)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              isActive ? "bg-brand-500 text-white shadow-md" : "bg-white text-dark-800 hover:bg-orange-100"
            }`}
          >
            <Icon size={16} />
            {cat.name}
          </button>
        );
      })}
    </div>
  );
}
