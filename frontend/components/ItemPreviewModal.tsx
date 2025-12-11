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
  const contactName = item.username || null;
  const contactEmail = item.email || null;
  const contactPhone = item.contact_number || null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-3 sm:px-4 py-4 sm:py-6">
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-2xl">
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
            className="mb-4 sm:mb-6 w-full max-h-[60vh] rounded-xl sm:rounded-2xl object-contain object-center bg-gray-100"
          />
        )}

        <div className="space-y-3 sm:space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-gray-400">
              {item.type === "lost" ? "Lost item" : "Found item"}
            </p>
            <h2 className="mt-2 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{item.name}</h2>
          </div>

          <p className="text-gray-700 leading-relaxed">{item.description}</p>
          <p className="text-sm text-gray-500">📍 {item.location}</p>
          {item.created_at && (
            <p className="text-sm text-gray-500">📅 {new Date(item.created_at).toLocaleDateString()}</p>
          )}

          <div className="rounded-xl sm:rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:p-5">
            <p className="text-xs uppercase tracking-widest text-gray-500">
              Contact Information
            </p>
            {contactName && (
              <p className="mt-2 text-sm sm:text-base font-semibold text-gray-900">
                {contactName}
              </p>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}`}
                className="mt-1 block text-xs sm:text-sm text-blue-600 hover:text-blue-800 underline break-all"
              >
                📧 {contactEmail}
              </a>
            )}
            {contactPhone && (
              <a
                href={`tel:${contactPhone.replace(/\s/g, '')}`}
                className="mt-1 block text-xs sm:text-sm text-green-600 hover:text-green-800"
              >
                📞 {contactPhone}
              </a>
            )}
            {!contactEmail && !contactPhone && (
              <p className="mt-1 text-xs text-gray-500">
                No direct contact info provided. Please check the profile page.
              </p>
            )}
          </div>

          {canDelete && (
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 mb-4">
              <p className="text-sm font-semibold text-amber-800 mb-2">
                ✅ This is your {item.type === "lost" ? "lost" : "found"} item
              </p>
              <p className="text-xs text-amber-700">
                {item.type === "lost" 
                  ? "Found your item? Mark it as returned to remove it from the list."
                  : "Item claimed? Mark it as returned to remove it from the list."}
              </p>
            </div>
          )}

          {canDelete && (
            <div className="flex justify-end gap-3">
              <button
                onClick={onDelete}
                disabled={deleting}
                className="rounded-2xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70 flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Marking as Returned...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mark as Returned
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

