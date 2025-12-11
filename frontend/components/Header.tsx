// components/Header.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="flex items-center justify-between p-3 sm:p-4 bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      {/* Logo/Title Section */}
      <div className="flex items-center">
        <Link href="/" className="text-lg sm:text-xl font-extrabold text-gray-800 hover:text-gray-900">
          LOFO
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6 text-sm font-medium">
        <Link href="/" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
          Home
        </Link>
        <Link href="/lost" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
          Lost
        </Link>
        <Link href="/report?type=lost" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
          Report Lost
        </Link>
        <Link href="/found" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
          Found
        </Link>
        <Link href="/report?type=found" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
          Report Found
        </Link>
        <Link href="/profile" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
          Profile
        </Link>
        <button
          onClick={handleSignOut}
          className="px-3 xl:px-4 py-1.5 border border-gray-400 text-gray-700 rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap text-xs xl:text-sm"
        >
          Sign Out
        </button>
      </nav>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center gap-2">
        <Link href="/profile" className="p-2 text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg lg:hidden">
          <nav className="flex flex-col p-4 space-y-3">
            <Link href="/" className="text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/lost" className="text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileMenuOpen(false)}>
              Lost Items
            </Link>
            <Link href="/report?type=lost" className="text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileMenuOpen(false)}>
              Report Lost
            </Link>
            <Link href="/found" className="text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileMenuOpen(false)}>
              Found Items
            </Link>
            <Link href="/report?type=found" className="text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileMenuOpen(false)}>
              Report Found
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900 py-2" onClick={() => setMobileMenuOpen(false)}>
              Profile
            </Link>
            <button
              onClick={() => {
                handleSignOut();
                setMobileMenuOpen(false);
              }}
              className="text-left px-0 py-2 text-gray-600 hover:text-gray-900 border-t border-gray-200 pt-3 mt-2"
            >
              Sign Out
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}