/**
 * @file src/app/page.tsx
 * @description This is the homepage of the blog. It displays a paginated list of blog posts.
 */

import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/api";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'たついよサイクル',
  description: '自転車ブログ',
  openGraph: {
    title: 'たついよサイクル',
    description: '自転車ブログ',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || ''}/favicon.ico`, // Path to your site icon
        width: 32,
        height: 32,
        alt: 'My Blog Icon',
      },
    ],
  },
};

// The base URL for the API, used to construct absolute image URLs.
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Interface for the props of the BlogListPage component.
 * It includes searchParams which may contain the current page number.
 */
interface BlogListPageProps {
  searchParams?: {
    page?: string;
  };
}

/**
 * The main component for the blog list page (homepage).
 * This is a Server Component that fetches and displays a list of blog posts.
 *
 * @param {BlogListPageProps} props The props for the component.
 * @returns {Promise<JSX.Element>} A promise that resolves to the JSX for the page.
 */
export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  // Determine the current page from the search parameters, defaulting to 1.
  const page = searchParams?.page ? parseInt(searchParams.page, 10) : 1;
  const pageSize = 10; // Number of posts to display per page.

  // Fetch blog posts for the current page from the API.
  const { data: posts, meta } = await getBlogPosts(page, pageSize);

  // Extract pagination metadata.
  const { pageCount } = meta.pagination;

  return (
    <>
      {/* Container for the list of blog posts. */}
      <div className="divide-y divide-gray-200">
        {posts.map((post: any) => {
          const { title, description, slug, cover, categories } = post;

          // Construct the full URL for the cover image if it exists.
          let imageUrl: string | undefined = undefined;
          if (cover?.url) {
            imageUrl = new URL(cover.url, baseUrl).toString();
          }

          return (
            <div key={post.id} className="group py-12 first:pt-0 last:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Post cover image, linking to the blog post. */}
                <Link href={`/blog/${slug}`} className="md:col-span-1 aspect-[4/3] overflow-hidden rounded-lg block">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={cover.alternativeText || title}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    // Placeholder if no image is available.
                    <div className="w-full h-full bg-gray-200 rounded-lg" />
                  )}
                </Link>
                {/* Post details. */}
                <div className="md:col-span-2">
                  {/* List of categories associated with the post. */}
                  <div className="flex flex-wrap gap-2 mb-2">
                    {categories && categories.map((category: any) => (
                      <Link href={`/category/${category.slug}`} key={category.id} className="bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-sky-200 transition-colors">
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  {/* Post title, linking to the blog post. */}
                  <Link href={`/blog/${slug}`}>
                    <h2 className="text-xl font-bold mb-2 group-hover:text-sky-600 transition-colors md:text-2xl">{title}</h2>
                  </Link>
                  {/* Post description with a line clamp to limit text length. */}
                  <p className="text-gray-600 line-clamp-3">{description}</p>
                  {/* Post creation date. */}
                  <p className="text-gray-500 text-sm mt-2">{new Date(post.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination controls. */}
      <div className="flex justify-center items-center gap-8 mt-12">
        {/* "Previous Page" link, shown only if not on the first page. */}
        {page > 1 && (
          <Link href={`/?page=${page - 1}`} className="text-sky-600 hover:underline">
            &larr; Previous Page
          </Link>
        )}
        {/* Current page and total page count. */}
        <span className="text-gray-500">
          Page {page} of {pageCount}
        </span>
        {/* "Next Page" link, shown only if not on the last page. */}
        {page < pageCount && (
          <Link href={`/?page=${page + 1}`} className="text-sky-600 hover:underline">
            Next Page &rarr;
          </Link>
        )}
      </div>
    </>
  );
}

