/**
 * @file src/app/components/sidebar.tsx
 * @description This file defines the Sidebar component, which displays recent posts and a list of categories.
 */

import Link from "next/link";
import { getBlogPosts, getCategories } from "@/lib/api";

/**
 * The Sidebar component.
 * This is a Server Component that fetches its own data (recent posts and categories)
 * and displays them as navigation links.
 *
 * @returns {Promise<JSX.Element>} A promise that resolves to the rendered sidebar element.
 */
export default async function Sidebar() {
  // Fetch the 5 most recent blog posts.
  const { data: recentPosts } = await getBlogPosts(1, 5);
  // Fetch the full list of categories.
  const categories = await getCategories();

  return (
    <aside className="w-full lg:w-64 bg-white rounded-xl p-8 lg:sticky top-8 self-start">
      {/* Section for Recent Posts */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Posts</h2>
        <ul>
          {recentPosts.map((post: any) => (
            <li key={post.id} className="mb-2">
              <Link href={`/blog/${post.slug}`} className="hover:text-sky-600 transition-colors">
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Section for Categories */}
      <div>
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul>
          {categories.map((category: any) => (
            <li key={category.id} className="mb-2">
              <Link href={`/category/${category.slug}`} className="hover:text-sky-600 transition-colors">
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
