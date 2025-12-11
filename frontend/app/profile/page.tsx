"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Header from "@/components/Header";

interface User {
  id: number;
  username: string;
  email: string;
  profile_pic?: string | null;
  contact_number?: string | null;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Helper to safely get profile picture URL
  const getProfilePic = () => {
    if (!user?.profile_pic) {
      // Return a default avatar or placeholder
      return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e5e7eb'/%3E%3Ctext x='50' y='60' text-anchor='middle' font-size='40' fill='%239ca3af'%3E" + (user?.username?.[0]?.toUpperCase() || '?') + "%3C/text%3E%3C/svg%3E";
    }
    
    // If it's already a full URL, return it
    if (user.profile_pic.startsWith('http://') || user.profile_pic.startsWith('https://')) {
      return user.profile_pic;
    }
    
    // If it starts with /uploads, it's a backend path
    if (user.profile_pic.startsWith('/uploads/')) {
      return `http://localhost:3001${user.profile_pic}`;
    }
    
    // Otherwise, assume it's a relative path
    return `http://localhost:3001/uploads/${user.profile_pic}`;
  };

  // Fetch user info
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await api.get<User>("/users/me", {
          timeout: 10000, // 10 second timeout
        });
        
        if (response.data) {
          setUser(response.data);
          setUsername(response.data.username);
          setEmail(response.data.email);
          setContactNumber(response.data.contact_number || "");
          setError(null);
        } else {
          throw new Error("No user data received");
        }
      } catch (err: any) {
        console.error("Profile error:", err);
        const errorMsg = err?.response?.data?.error || err?.message || "Failed to fetch profile";
        setError(errorMsg);
        
        // If unauthorized, redirect to login
        if (err?.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login"; // redirect to login
  };

  // Handle edit save (connected to backend)
  const handleSave = async () => {
    if (!token) {
      setError("Not authenticated");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("contact_number", contactNumber);
      if (profilePic) {
        formData.append("profile_pic", profilePic);
      }

      const response = await api.put<User>("/users/me", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setUser(response.data);
      setUsername(response.data.username);
      setEmail(response.data.email);
      setContactNumber(response.data.contact_number || "");
      setProfilePic(null);
      setEditing(false);
      setError(null);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      const errorMsg = err?.response?.data?.error || err?.message || "Failed to update profile";
      setError(errorMsg);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-[calc(100vh-65px)] flex items-center justify-center">
          <div className="text-center p-10">Loading profile...</div>
        </div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-[calc(100vh-65px)] flex items-center justify-center">
          <div className="text-center p-10 text-red-500">
            <p className="text-xl font-semibold mb-2">Error loading profile</p>
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.href = "/login"}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }
  
  if (!user) {
    return (
      <>
        <Header />
        <div className="min-h-[calc(100vh-65px)] flex items-center justify-center">
          <div className="text-center p-10">
            <p>Not logged in</p>
            <button
              onClick={() => window.location.href = "/login"}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Go to Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="bg-white shadow-xl rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 w-full max-w-md text-center">
        {/* Profile Picture */}
        <img
          src={getProfilePic()}
          alt="Profile"
          className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 sm:mb-6 border-4 border-gray-300 shadow object-cover"
          onError={(e) => {
            // Fallback to default avatar if image fails to load
            e.currentTarget.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Ccircle cx='50' cy='50' r='50' fill='%23e5e7eb'/%3E%3Ctext x='50' y='60' text-anchor='middle' font-size='40' fill='%239ca3af'%3E${user?.username?.[0]?.toUpperCase() || '?'}%3C/text%3E%3C/svg%3E`;
          }}
        />

        {/* Profile Form */}
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-left text-sm font-semibold text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>
            <div>
              <label className="block text-left text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block text-left text-sm font-semibold text-gray-700 mb-1">
                Contact Number <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-inner focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., +1234567890"
              />
              <p className="text-xs text-gray-500 mt-1 text-left">Used for item recovery contact</p>
            </div>
            <div>
              <label className="block text-left text-sm font-semibold text-gray-700 mb-1">
                Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
                className="w-full p-2 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <button
                onClick={() => setEditing(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gray-400 hover:bg-gray-500 text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold">{user.username}</h1>
            <div className="space-y-1">
              <p className="text-gray-600 flex items-center justify-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {user.email}
              </p>
              {user.contact_number && (
                <p className="text-gray-600 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {user.contact_number}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
