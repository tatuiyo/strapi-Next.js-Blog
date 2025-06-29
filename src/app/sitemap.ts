import { MetadataRoute } from 'next';
import { getBlogPosts, getCategories } from '@/lib/api';

/**
 * @file src/app/sitemap.ts
 * @description This file generates the XML sitemap for the Next.js application.
 * It includes static pages, dynamic blog posts, and dynamic category pages.
 * The sitemap is automatically exposed at /sitemap.xml by Next.js App Router.
 */

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL for the sitemap entries, derived from environment variable or fallback to localhost.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Fallback for development

  // Define static pages to be included in the sitemap.
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1, // Highest priority for the homepage
    },
  ];

  // Fetch all blog posts to generate dynamic URLs.
  // pageSize is set to a large number to ensure all posts are fetched. Adjust if needed for very large datasets.
  const { data: posts } = await getBlogPosts(1, 1000); 
  const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt), // Use updated date if available, otherwise created date
    changeFrequency: 'weekly',
    priority: 0.8, // High priority for blog posts
  }));

  // Fetch all categories to generate dynamic URLs.
  const categories = await getCategories();
  const categoryEntries: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(category.updatedAt || category.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7, // Medium priority for category pages
  }));

  // Combine all entries into a single sitemap.
  return [...staticPages, ...postEntries, ...categoryEntries];
}
