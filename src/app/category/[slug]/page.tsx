/**
 * @file src/app/category/[slug]/page.tsx
 * @description This page displays a paginated list of blog posts filtered by a specific category.
 */

import Link from "next/link";
import Image from "next/image";
import { getPostsByCategory } from "@/lib/api";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from 'next';

// The base URL for the API, used to construct absolute image URLs.
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

/**
 * Interface for the props of the CategoryPage component.
 * It includes the category slug from the route and optional page number from search params.
 */
interface CategoryPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

/**
 * Generates dynamic metadata for the category page.
 *
 * @param {CategoryPageProps} props The props containing the category slug.
 * @param {ResolvingMetadata} parent The metadata from the parent layout.
 * @returns {Promise<Metadata>} A promise that resolves to the metadata object.
 */
export async function generateMetadata(
  { params }: CategoryPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Capitalize the first letter of the slug for a cleaner title.
  const categoryName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return {
    title: `Category: ${categoryName}`,
    description: `Posts in the ${categoryName} category.`,
  };
}

/**
 * The main component for displaying posts within a specific category.
 * This is a Server Component that fetches and displays a paginated list of posts.
 *
 * @param {CategoryPageProps} props The props for the component.
 * @returns {Promise<JSX.Element>} A promise that resolves to the JSX for the page.
 */
export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  // Determine the current page from the search parameters, defaulting to 1.
  const page = searchParams?.page ? parseInt(searchParams.page as string, 10) : 1;
  const pageSize = 10; // Number of posts to display per page.

  // Fetch posts for the given category slug and page number.
  const { data: posts, meta } = await getPostsByCategory(params.slug, page, pageSize);

  // If no posts are found for the category, trigger a 404 Not Found page.
  if (!posts || posts.length === 0) {
    notFound();
  }

  // Extract pagination metadata and determine the category name from the first post.
  const { pageCount } = meta.pagination;
  const categoryName = posts[0].categories.find((cat: any) => cat.slug === params.slug)?.name || params.slug;

  return (
    <>
      <h1 className="text-4xl font-bold mb-2">Category: {categoryName}</h1>
      
      {/* Container for the list of blog posts. */}
      <div className="space-y-12">
        {posts.map((post: any) => {
          const { title, description, slug, cover, categories } = post;

          // Construct the full URL for the cover image if it exists.
          let imageUrl: string | undefined = undefined;
          if (cover?.url) {
            imageUrl = new URL(cover.url, baseUrl).toString();
          }

          return (
            <div key={post.id} className="group">
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
                      <Link href={`/category/${category.slug}`} key={category.id} className={`bg-sky-100 text-sky-800 text-xs font-medium px-2.5 py-0.5 rounded-full hover:bg-sky-200 transition-colors ${category.slug === params.slug ? 'ring-2 ring-sky-500' : ''}`}>
                        {category.name}
                      </Link>
                    ))}
                  </div>
                  {/* Post title, linking to the blog post. */}
                  <Link href={`/blog/${slug}`}>
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-sky-600 transition-colors">{title}</h2>
                  </Link>
                  {/* Post description with a line clamp to limit text length. */}
                  <p className="text-gray-600 line-clamp-3">{description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination controls. */}
      <div className="flex justify-center items-center gap-8 mt-12">
        {/* "Previous Page" link. */}
        {page > 1 && (
          <Link href={`/category/${params.slug}?page=${page - 1}`} className="text-sky-600 hover:underline">
            &larr; Previous Page
          </Link>
        )}
        {/* Current page and total page count. */}
        <span className="text-gray-500">
          Page {page} of {pageCount}
        </span>
        {/* "Next Page" link. */}
        {page < pageCount && (
          <Link href={`/category/${params.slug}?page=${page + 1}`} className="text-sky-600 hover:underline">
            Next Page &rarr;
          </Link>
        )}
      </div>
    </>
  );
}
