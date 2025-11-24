import { Item } from "@/types/Item";

interface Props {
  item: Item;
}

export default function ItemCard({ item }: Props) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {item.image_url && (
        <img
          src={item.image_url}
          alt={item.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-2">{item.description}</p>
        <p className="text-gray-400 text-sm">📍 {item.location}</p>
        <p className="text-gray-400 text-sm">📅 {item.date_found}</p>
        <span
          className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
            item.type === "lost"
              ? "bg-red-200 text-red-800"
              : "bg-green-200 text-green-800"
          }`}
        >
          {item.type.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
