"use client";

import { Item } from "@/types/Item";

interface ItemPreviewModalProps {
  item: Item;
  canDelete?: boolean;
  onClose: () => void;
  onDelete?: () => void;
  deleting?: boolean;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:3001";

const resolveImageUrl = (imagePath?: string | null) => {
  if (!imagePath) return null;
  if (/^https?:\/\//i.test(imagePath)) return imagePath;
  return `${API_BASE_URL}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
};

export default function ItemPreviewModal({
  item,
  canDelete,
  onClose,
  onDelete,
  deleting,
}: ItemPreviewModalProps) {
  const imageSrc = resolveImageUrl(item.image_url);
  const contactName = item.username || item.owner_username;
  const contactEmail = item.email || item.owner_email;
  const contactPhone = item.phone || item.owner_phone;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <button
          type="button"
          className="absolute right-5 top-5 rounded-full bg-gray-100 p-2 text-gray-500 transition hover:bg-gray-200 hover:text-gray-700"
          aria-label="Close preview"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {imageSrc && (
          <img
            src={imageSrc}
            alt={item.name}
            className="mb-6 h-72 w-full rounded-2xl object-cover object-center"
          />
        )}

        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-400">
              {item.type === "lost" ? "Lost item" : "Found item"}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-gray-900">{item.name}</h2>
          </div>

          <p className="text-gray-700 leading-relaxed">{item.description}</p>
          <p className="text-sm text-gray-500">📍 {item.location}</p>
          {item.date_found && (
            <p className="text-sm text-gray-500">📅 {item.date_found}</p>
          )}

          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Contact
            </p>
            {contactName && (
              <p className="mt-2 text-base font-semibold text-gray-900">
                {contactName}
              </p>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="mt-1 block text-sm text-red-600 underline"
              >
                {contactEmail}
              </a>
            )}
            {contactPhone && (
              <a
                href={`tel:${contactPhone}`}
                className="mt-1 block text-sm text-gray-700 hover:text-gray-900"
              >
                {contactPhone}
              </a>
            )}
            {!contactEmail && !contactPhone && (
              <p className="mt-1 text-xs text-gray-500">
                No direct contact info provided. Try messaging through the platform.
              </p>
            )}
          </div>

          {canDelete && (
            <div className="flex justify-end">
              <button
                onClick={onDelete}
                disabled={deleting}
                className="rounded-2xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {deleting ? "Removing…" : "Mark as Returned"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

