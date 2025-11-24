"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  profile_pic?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState<File | null>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Helper to safely get profile picture URL
  const getProfilePic = () => {
    if (!user?.profile_pic) return "/images/default-avatar.png";
    try {
      const url = new URL(user.profile_pic, window.location.origin);
      return url.toString();
    } catch {
      return "/images/default-avatar.png"; // fallback if URL is invalid
    }
  };

  // Fetch user info
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          let errorMsg = "Unknown error";
          try {
            const json = await res.json();
            errorMsg = json.error || errorMsg;
          } catch {
            errorMsg = await res.text();
          }
          throw new Error(errorMsg);
        }

        const data: User = await res.json();
        setUser(data);
        setUsername(data.username);
        setEmail(data.email);
      } catch (err: any) {
        console.error("Profile error:", err);
        setError(err.message || "Failed to fetch profile");
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

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (profilePic) {
      formData.append("profile_pic", profilePic);
    }

    try {
      const res = await fetch("http://localhost:3001/users/me", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Note: do NOT set Content-Type for FormData so that browser sets appropriate boundary
        },
        body: formData,
      });

      if (!res.ok) {
        let errorMsg = "Unknown error";
        try {
          const json = await res.json();
          errorMsg = json.error || errorMsg;
        } catch {
          errorMsg = await res.text();
        }
        throw new Error(errorMsg);
      }

      const updatedUser = await res.json();
      setUser(updatedUser);
      setUsername(updatedUser.username);
      setEmail(updatedUser.email);
      setProfilePic(null);
      setEditing(false);
      setError(null);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.message || "Failed to update profile");
    }
  };

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!user) return <div className="text-center p-10">Not logged in</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-8">
      <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-md text-center">
        {/* Profile Picture */}
        <img
          src={getProfilePic()}
          alt="Profile"
          className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-gray-300 shadow"
        />

        {/* Profile Form */}
        {editing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-inner"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-inner"
            />
            <input
              type="file"
              onChange={(e) => setProfilePic(e.target.files?.[0] || null)}
              className="w-full text-sm text-gray-600"
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setEditing(false)}
                className="px-6 py-2 rounded-lg bg-gray-400 text-white font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 rounded-lg bg-green-600 text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{user.username}</h1>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 rounded-lg bg-red-600 text-white font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
