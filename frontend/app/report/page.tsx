// report/page.tsx
"use client";
// ... (imports remain the same)
import Header from "@/components/Header"; // <-- NEW IMPORT

export default function ReportPage() {
  // ... (component logic remains the same)

  return (
    <>
      <Header /> {/* <-- ADD HEADER */}
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
        {/* ... (rest of the form remains the same) */}
      </div>
    </>
  );
}