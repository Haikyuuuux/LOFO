// components/Header.tsx
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      {/* Logo/Title Section */}
      <div className="flex items-center">
        {/* Replace with your specific logo image if you have one */}
        <span className="text-xl font-extrabold text-gray-800">
          LOFO
        </span>
      </div>

      {/* Navigation Links and Sign Out Button */}
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link href="/" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        {/* These links likely need filters on the homepage, but we link to the homepage for now */}
        <Link href="/?filter=lost" className="text-gray-600 hover:text-gray-900">
          Lost
        </Link>
        <Link href="/report" className="text-gray-600 hover:text-gray-900">
          Report Lost
        </Link>
        <Link href="/?filter=found" className="text-gray-600 hover:text-gray-900">
          Found
        </Link>
        <Link href="/report" className="text-gray-600 hover:text-gray-900">
          Report Found
        </Link>
        <Link href="/profile" className="text-gray-600 hover:text-gray-900">
          Profile
        </Link>
        <button
          onClick={handleSignOut}
          className="px-4 py-1.5 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          Sign Out
        </button>
      </nav>
    </header>
  );
}