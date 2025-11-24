// app/layout.tsx

import "./globals.css";
// import Sidebar from "@/components/Sidebar"; <--- DELETE THIS LINE!

export const metadata = {
  title: "Lost & Found",
  description: "Lost & Found project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Remove the old flex classes that were for the sidebar */}
      <body> 
        {/* <Sidebar active="all" /> <--- DELETE THIS LINE! */}
        
        {/* Remove the layout padding/flex sizing, let the page components handle layout */}
        <main>{children}</main> 
      </body>
    </html>
  );
}