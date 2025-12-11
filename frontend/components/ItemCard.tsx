import { Item } from "@/types/Item";

interface Props {
  item: Item;
  onSelect: (item: Item) => void;
}

// Helper function to resolve image URL
const resolveImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  // If already a full URL, return as is
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  // Otherwise, prepend backend URL
  const API_BASE_URL = "http://localhost:3001";
  return `${API_BASE_URL}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
};

export default function ItemCard({ item, onSelect }: Props) {
  const imageSrc = resolveImageUrl(item.image_url);
  
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
      onClick={() => onSelect(item)}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={item.name}
          className="w-full h-48 object-contain bg-gray-100"
          onError={(e) => {
            // Hide image if it fails to load
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
        <p className="text-gray-600 mb-2">{item.description}</p>
        <p className="text-gray-400 text-sm">📍 {item.location}</p>
        {item.created_at && (
          <p className="text-gray-400 text-sm">📅 {new Date(item.created_at).toLocaleDateString()}</p>
        )}
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
