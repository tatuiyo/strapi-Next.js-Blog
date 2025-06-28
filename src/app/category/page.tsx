/**
 * @file src/app/category/page.tsx
 * @description This page displays a list of all available post categories.
 */

import Link from 'next/link';
import { getCategories } from '@/lib/api';

/**
 * The main component for the categories list page.
 * This is a Server Component that fetches and displays all categories.
 *
 * @returns {Promise<JSX.Element>} A promise that resolves to the JSX for the page.
 */
export default async function CategoriesPage() {
  // Fetch all categories from the API.
  const categories = await getCategories();

  return (
    <>
      <h1 className="text-4xl font-bold mb-8">All Categories</h1>
      {/* Grid layout for the category links. */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category: any) => (
          <Link 
            href={`/category/${category.slug}`}
            key={category.id} 
            // Styling for the category card.
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 transition-colors"
          >
            <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
          </Link>
        ))}
      </div>
    </>
  );
}
