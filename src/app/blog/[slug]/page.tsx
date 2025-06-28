/**
 * @file src/app/blog/[slug]/page.tsx
 * @description This file defines the page for displaying a single blog post.
 * It uses a dynamic route to fetch and render content based on the post's slug.
 */

import { getPostBySlug } from "@/lib/api";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from 'next';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

/**
 * Type definition for the props received by the BlogPostPage component.
 * Includes route parameters (`params`) and search parameters (`searchParams`).
 */
type BlogPostPageProps = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

/**
 * Generates dynamic metadata for the page based on the blog post's data.
 * This is used by Next.js to set SEO-friendly <title> and <meta> tags.
 *
 * @param {BlogPostPageProps} props The props containing the slug of the post.
 * @param {ResolvingMetadata} parent The metadata from the parent layout.
 * @returns {Promise<Metadata>} A promise that resolves to the metadata object.
 */
export async function generateMetadata(
  { params }: BlogPostPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.title,
    description: post.description,
  };
}

/**
 * The main component for displaying a single blog post.
 * This is a Server Component that fetches the post data and renders it.
 *
 * @param {BlogPostPageProps} props The props containing the slug of the post to render.
 * @returns {Promise<JSX.Element>} A promise that resolves to the JSX for the page.
 */
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  // Fetch the specific blog post using the slug from the URL.
  const post = await getPostBySlug(params.slug);
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  // If the post is not found, display a 404 message.
  if (!post) {
    return <div>404 - Blog post not found</div>;
  }

  const { title, content, cover, createdAt } = post;

  // Format the creation date for display.
  const formattedDate = new Date(createdAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* Post Header */}
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-gray-500 text-sm mb-6">Published on {formattedDate}</p>
      
      {/* Post Cover Image, displayed if available */}
      {cover?.data?.attributes?.url && (
        <Image
          src={cover.data.attributes.url}
          alt={cover.data.attributes.alternativeText || title}
          width={800}
          height={400}
          className="rounded-lg mb-6"
        />
      )}
      
      {/* Post Content rendered from Markdown */}
      <article className="prose">
        <ReactMarkdown
          // Use rehype-raw to safely render HTML tags (like <br>) within the Markdown.
          rehypePlugins={[rehypeRaw]}
          components={{
            // Custom renderer for images to use the Next.js Image component.
            // This provides automatic image optimization.
            img: (props) => {
              const { node, ...rest } = props;

              // Type guard to ensure src is a string before processing.
              if (typeof rest.src !== 'string') {
                return null; // Or a placeholder component
              }

              // Construct the full image URL from the relative path provided by the CMS.
              const imageUrl = new URL(rest.src, baseUrl).toString();
              return (
                <span className="block my-6">
                  <Image 
                    src={imageUrl}
                    alt={rest.alt || ''}
                    width={800} 
                    height={400}
                    className="w-full h-auto rounded-lg max-w-xl"
                  />
                </span>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </>
  );
}