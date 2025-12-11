"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import { api } from "@/lib/api";

export default function ReportPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "lost";

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("You must be logged in to report an item.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("location", location);
      formData.append("type", type);
      formData.append("user_id", userId);
      if (image) {
        formData.append("image", image);
      }

      // Use axios with FormData and timeout
      const response = await api.post("/items", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 15000, // 15 second timeout (reduced from 30)
      });

      // Check if response is successful
      if (response.status === 200 || response.data) {
        setSuccess(true);
        setError(null);
        // Redirect immediately after success
        setTimeout(() => {
          router.push(type === "lost" ? "/lost" : "/found");
        }, 500); // Reduced delay
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      const errorMsg = err?.response?.data?.message || 
                      err?.response?.data?.error ||
                      err?.message ||
                      "Failed to submit report. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const isLost = type === "lost";
  const bgColor = isLost ? "from-red-50 to-pink-50" : "from-green-50 to-emerald-50";
  const title = isLost ? "Report Lost Item" : "Report Found Item";
  const subtitle = isLost
    ? "Help others find your lost item"
    : "Help reunite someone with their item";

  return (
    <>
      <Header />
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
      <div className={`min-h-[calc(100vh-65px)] bg-gradient-to-br ${bgColor} py-8 sm:py-12 px-4 sm:px-6`}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8">
            <div className="mb-6 text-center relative">
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isLost ? "text-red-600" : "text-green-600"}`}>
                  {title}
                </h1>
                {/* Hover Tips Button */}
                <div className="relative group">
                  <button
                    type="button"
                    onClick={() => setShowTips(!showTips)}
                    className={`p-2 rounded-full transition-colors ${
                      isLost 
                        ? "text-red-500 hover:bg-red-100" 
                        : "text-green-500 hover:bg-green-100"
                    }`}
                    aria-label="Show tips"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  
                  {/* Hover Tooltip - Desktop Only */}
                  <div className={`hidden md:block absolute right-0 top-full mt-2 w-80 p-4 rounded-xl shadow-2xl z-50 ${
                    isLost 
                      ? "bg-red-50 border-2 border-red-200" 
                      : "bg-green-50 border-2 border-green-200"
                  } opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none`}>
                    <h3 className={`font-bold text-sm mb-3 ${isLost ? "text-red-700" : "text-green-700"}`}>
                      {isLost ? "📝 Quick Tips:" : "💡 Helpful Tips:"}
                    </h3>
                    {isLost ? (
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        <li>• Provide clear, detailed description</li>
                        <li>• Include exact location</li>
                        <li>• Upload photo if available</li>
                        <li>• Check Found Items regularly</li>
                        <li>• Mark as Returned when found</li>
                      </ul>
                    ) : (
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        <li>• Describe in detail (color, size, brand)</li>
                        <li>• Note exact location found</li>
                        <li>• Take clear photos</li>
                        <li>• Keep item safe until claimed</li>
                        <li>• Mark as Returned when claimed</li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mt-2">{subtitle}</p>
              
              {/* Collapsible Tips Section */}
              {showTips && (
                <div className={`mt-4 p-4 rounded-xl border-l-4 ${
                  isLost 
                    ? "bg-red-50 border-red-400" 
                    : "bg-green-50 border-green-400"
                } animate-fadeIn`}>
                  <div className="flex justify-between items-start mb-3">
                    <h3 className={`font-bold text-sm ${isLost ? "text-red-700" : "text-green-700"}`}>
                      {isLost ? "📝 Before You Report:" : "💡 Helpful Tips:"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowTips(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  {isLost ? (
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li className="flex items-start">
                        <span className="mr-2">1️⃣</span>
                        <span>Provide a clear, detailed description of your item</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">2️⃣</span>
                        <span>Include the exact location where you last saw it</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">3️⃣</span>
                        <span>Upload a photo if available - it helps others identify your item</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">4️⃣</span>
                        <span>Check the "Found Items" page regularly for matches</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">5️⃣</span>
                        <span>Mark as "Returned" once you find your item</span>
                      </li>
                    </ul>
                  ) : (
                    <ul className="space-y-1.5 text-xs text-gray-700">
                      <li className="flex items-start">
                        <span className="mr-2">1️⃣</span>
                        <span>Describe the item in detail - color, size, brand, unique features</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">2️⃣</span>
                        <span>Note the exact location where you found it</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">3️⃣</span>
                        <span>Take a clear photo - this helps owners identify their items</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">4️⃣</span>
                        <span>Keep the item safe until the owner claims it</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">5️⃣</span>
                        <span>Mark as "Returned" once the item is claimed</span>
                      </li>
                    </ul>
                  )}
                </div>
              )}
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                Report submitted successfully! Redirecting...
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-500">Form Progress</span>
                  <span className="text-xs text-gray-500">
                    {[name, description, location].filter(Boolean).length} of 3 required fields
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isLost ? "bg-red-600" : "bg-green-600"
                    }`}
                    style={{
                      width: `${([name, description, location].filter(Boolean).length / 3) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Item Name *
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    (e.g., "Black iPhone 13" or "Blue Backpack")
                  </span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Black iPhone 13"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Description *
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    (Include color, size, brand, unique features, condition)
                  </span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={isLost 
                    ? "Describe your lost item in detail. What color is it? Any unique features or marks? What brand/model?" 
                    : "Describe the found item in detail. What does it look like? Any identifying features or marks?"}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {description.length} characters {description.length < 50 && "(more details help!)"}
                </p>
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Location *
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    {isLost ? "(Where did you last see it?)" : "(Where did you find it?)"}
                  </span>
                </label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={isLost 
                    ? "e.g., Main Street, Building A, Room 101, or 'Near the cafeteria'" 
                    : "e.g., Main Street, Building A, Room 101, or 'Parking lot near entrance'"}
                />
              </div>

              <div>
                <label
                  htmlFor="image"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Image (Optional but Recommended)
                  <span className="ml-2 text-xs text-gray-500 font-normal">
                    📷 A clear photo helps others identify the item
                  </span>
                </label>
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-xs rounded-lg shadow-md border-2 border-gray-200"
                    />
                  </div>
                )}
                {!imagePreview && (
                  <p className="mt-2 text-xs text-gray-400 italic">
                    💡 Tip: Upload a clear photo from multiple angles if possible
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-6 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLost
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
