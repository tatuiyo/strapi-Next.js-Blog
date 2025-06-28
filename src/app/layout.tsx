/**
 * @file src/app/layout.tsx
 * @description This is the root layout for the entire application.
 * It sets up the main HTML structure, imports global styles, and defines the overall page layout
 * including the header, sidebar, and footer.
 */

import type { Metadata } from "next";
import "./globals.css";

// Component imports for the main layout structure
import Footer from "@/app/components/footer";
import HeaderData from "@/app/components/header";
import Sidebar from "@/app/components/sidebar";

// Font imports from Geist, a modern font family.
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

/**
 * Metadata for the application.
 * This object is used by Next.js to set the <title> and <meta> tags in the document's <head>.
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */
export const metadata: Metadata = {
  title: "たついよサイクル",
  description: "たついよサイクル",
};

/**
 * The root layout component.
 * This server component wraps all pages in the application.
 *
 * @param {Readonly<{ children: React.ReactNode }>} props
 * @param {React.ReactNode} props.children - The content to be rendered within the layout. This will typically be the page component.
 * @returns {JSX.Element} The main HTML structure of the application.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        // Apply Geist font variables to the body for consistent typography.
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
        {/* Main container using a grid layout to position header, content, and footer. */}
        <div className="text-gray-900 min-h-screen grid grid-rows-[auto_1fr_auto]">
          {/* The HeaderData component fetches data on the server and renders the header. */}
          <HeaderData />
          
          {/* Main content area with a two-column layout on larger screens. */}
          <div className="container mx-auto flex flex-col lg:flex-row gap-8 py-7 px-8 m-6">
            {/* The main content, which will be the rendered page. */}
            <main className="flex-1 bg-white rounded-xl p-8 overflow-hidden">
              {children}
            </main>
            
            {/* The Sidebar component, which is also a server component fetching its own data. */}
            <Sidebar />
          </div>
          
          {/* The static Footer component. */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
