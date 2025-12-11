// app/page.tsx
"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ItemCard from "@/components/ItemCard";
import Header from "@/components/Header";
import { Item } from "@/types/Item";
import Link from "next/link"; 

function ImageCluster() {
  return (
    <div className="relative w-80 h-60 mt-10 ml-10">
      <img
        src="/person.jpg"
        alt="Person typing"
        className="absolute w-48 h-36 object-cover rounded-md shadow-xl border-4 border-white transform -rotate-6 z-10 top-0 left-0"
      />
      <img
        src="/key.jpg" 
        alt="Sign on tree"
        className="absolute w-48 h-36 object-cover rounded-md shadow-xl border-4 border-white transform rotate-3 z-20 top-12 left-20"
      />
      <img
        src="/wallet.webp"
        alt="Compass"
        className="absolute w-48 h-36 object-cover rounded-md shadow-xl border-4 border-white transform rotate-12 z-30 top-20 left-40"
      />
    </div>
  );
}


// --- Main HomePage Component ---
export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]); // You can remove this state if you only want the static homepage design.

  useEffect(() => {
    // If you want to keep fetching the items, keep this:
    // api.get("/items").then((res) => setItems(res.data));
  }, []);

  return (
    <div className="min-h-screen">
      <Header /> {/* Add the new Header here */}
      
      {/* Background Gradient matching the design */}
      <div className="bg-linear-to-br from-green-50 to-pink-50 min-h-[calc(100vh-65px)] flex items-center justify-center p-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          
          {/* LEFT SIDE: Title and Tagline */}
          <div className="flex flex-col justify-center">
            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight">
              Find & Recover
              <br />
              <span className="text-green-600">With Ease</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-md">
              Experience effortless recovery with our dedicated lost and found service.
            </p>
          </div>

          {/* RIGHT SIDE: Buttons and Image Cluster */}
          <div className="flex flex-col items-start lg:items-center">
            {/* Action Buttons */}
            <Link 
              href="/report?type=lost" 
              className="action-btn bg-red-600 hover:bg-red-700"
            >
              Lost 🎒
            </Link>
            <Link 
              href="/report?type=found" 
              className="action-btn bg-green-600 hover:bg-green-700 mt-6"
            >
              Found 🔍
            </Link>

            {/* Image Cluster */}
            <ImageCluster />
          </div>
        </div>
      </div>
      
      {/*
      // --- Items List Section (Below the Hero, if you want to keep it) ---
      <div className="p-6 bg-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {items.map((item) => (
           <ItemCard key={item.id} item={item} />
         ))}
      </div>
      */}

      {/* Tailwind Style for the Buttons */}
      <style jsx global>{`
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 300px; /* Uniform width */
          padding: 1rem 2rem;
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s;
        }
      `}</style>
    </div>
  );
}