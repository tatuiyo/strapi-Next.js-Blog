/**
 * @file src/app/components/header.tsx
 * @description This file defines the header for the application.
 * It demonstrates a powerful Next.js pattern: a Server Component (`HeaderData`)
 * fetching data and passing it to a Client Component (`Header`) that handles interactivity.
 */

'use client';

import Link from 'next/link';
import { useState } from 'react';

/**
 * The interactive part of the header.
 * This is a Client Component responsible for the UI and state management (e.g., mobile menu).
 *
 * @param {{ categories: any[] }} props The props for the component.
 * @param {any[]} props.categories The list of categories to display in the navigation.
 * @returns {JSX.Element} The rendered header element.
 */
export function Header({ categories }: { categories: any[] }) {
  // State to manage the visibility of the mobile menu.
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-sm relative">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Site title/logo linking to the homepage. */}
        <Link href="/" className="text-2xl font-bold text-gray-800 hover:text-sky-600 transition-colors">
          たついよサイクル
        </Link>

        {/* Hamburger Menu button for small screens. */}
        <div className="lg:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Regular Navigation for large screens. */}
        <nav className="hidden lg:block">
          <ul className="flex gap-6 items-center">
            {categories.map((category: any) => (
              <li key={category.id}>
                <Link 
                  href={`/category/${category.slug}`}
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Dropdown Menu for small screens, shown when isMenuOpen is true. */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white/90 backdrop-blur-sm">
          <ul className="flex flex-col items-center gap-4 py-4">
            {categories.map((category: any) => (
              <li key={category.id}>
                <Link 
                  href={`/category/${category.slug}`}
                  className="text-gray-600 hover:text-sky-600 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)} // Close menu on link click.
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

// This is the server component part that fetches data.
import { getCategories } from "@/lib/api";

/**
 * A Server Component responsible for fetching the category data.
 * It then renders the `Header` (Client Component), passing the fetched data as props.
 * This pattern is excellent for performance as data fetching remains on the server.
 *
 * @returns {Promise<JSX.Element>} A promise that resolves to the rendered Header component with category data.
 */
export default async function HeaderData() {
  const categories = await getCategories();
  return <Header categories={categories} />;
}

