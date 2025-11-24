"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import ItemCard from "@/components/ItemCard";
import ItemPreviewModal from "@/components/ItemPreviewModal";
import { api } from "@/lib/api";
import { Item } from "@/types/Item";

export default function LostItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchLostItems = async () => {
      try {
        const response = await api.get<Item[]>("/items", {
          params: { type: "lost" },
        });

        if (isMounted) {
          setItems(response.data);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load lost items.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLostItems();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentUserId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const canDeleteSelected = useMemo(() => {
    if (!selectedItem || !currentUserId) return false;
    return String(selectedItem.user_id) === currentUserId;
  }, [selectedItem, currentUserId]);

  const handleDelete = async () => {
    if (!selectedItem) return;
    setDeleting(true);
    try {
      await api.delete(`/items/${selectedItem.id}`);
      setItems((prev) => prev.filter((item) => item.id !== selectedItem.id));
      setSelectedItem(null);
    } catch (err: any) {
      console.error("Failed to delete item:", err);
      alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to mark item as returned.",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <Header />
      <section className="min-h-[calc(100vh-65px)] bg-linear-to-b from-red-50 via-white to-gray-100 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
              Community board
            </p>
            <h1 className="mt-4 text-4xl font-bold text-gray-900">
              Recently Reported Lost Items
            </h1>
            <p className="mt-2 text-gray-600">
              Browse reports from our community. Spot something familiar? Use
              the contact info inside each listing to help reunite owners with
              their items.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white/80 p-10 text-center shadow">
              <p className="text-gray-500">Fetching lost items…</p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-10 text-center text-red-700 shadow">
              {error}
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white/70 p-10 text-center text-gray-500 shadow">
              No lost reports yet. Be the first to{" "}
              <a
                href="/report?type=lost"
                className="font-semibold text-red-500 underline"
              >
                create one
              </a>
              .
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ItemCard key={item.id} item={item} onSelect={setSelectedItem} />
              ))}
            </div>
          )}
        </div>
      </section>

      {selectedItem && (
        <ItemPreviewModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          canDelete={canDeleteSelected}
          onDelete={handleDelete}
          deleting={deleting}
        />
      )}
    </>
  );
}

