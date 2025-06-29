/**
 * @file src/app/components/sidebar.tsx
 * @description This file defines the Sidebar component, which displays recent posts and a list of categories.
 */

import Link from "next/link";
import Image from "next/image";
import { getBlogPosts, getCategories, getPostBySlug } from "@/lib/api";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

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

  // Sort categories by the number in their description field.
  // Assumes description contains a number that can be parsed.
  const sortedCategories = categories.sort((a: any, b: any) => {
    const numA = parseInt(a.description, 10);
    const numB = parseInt(b.description, 10);
    return numA - numB;
  });

  // --- Fixed Post Section ---
  // Define the slug of the post to be featured. This can be dynamically fetched or configured.
  const fixedPostSlug = "my_bike"; // Replace with the actual slug of your fixed post
  const fixedPost = await getPostBySlug(fixedPostSlug);

  // Construct the image URL for the featured post, if a cover image exists.
  let fixedPostImageUrl: string | undefined = undefined;
  if (fixedPost?.cover?.url) {
    fixedPostImageUrl = new URL(fixedPost.cover.url, baseUrl).toString();
  }
  // --- End Fixed Post Section ---

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

      {/* Section for Fixed Post */}
      {/* Conditionally renders the featured post section if a fixed post is found. */}
      {fixedPost && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Featured Post</h2>
          <Link href={`/blog/${fixedPost.slug}`}>
            {fixedPostImageUrl && (
              <Image
                src={fixedPostImageUrl}
                alt={fixedPost.cover?.alternativeText || fixedPost.title}
                width={300}
                height={200}
                className="rounded-lg mb-4 w-full h-auto object-cover"
              />
            )}
            <h3 className="text-base font-semibold hover:text-sky-600 transition-colors">{fixedPost.title}</h3>
          </Link>
        </div>
      )}

      {/* Section for Recommended Blog */}
      <div className="mt-8 p-6 bg-sky-50 rounded-xl border border-sky-200">
        <h2 className="text-xl font-bold mb-4 text-sky-800">おすすめブログ</h2>
        <Link href="https://tatuiyo.xyz" target="_blank" rel="noopener noreferrer" className="block no-underline">
          <div className="flex items-center mb-3">
            <Image
              src="/favicon.ico" // Placeholder image
              alt="たつろぐ"
              width={48}
              height={48}
              className="rounded-full mr-3"
            />
            <h3 className="text-lg font-semibold text-sky-700 hover:text-sky-900 transition-colors">たつろぐ</h3>
          </div>
          <p className="text-sm text-sky-600">自宅鯖　技術系ブログ</p>
        </Link>
      </div>
    </aside>
  );
}
