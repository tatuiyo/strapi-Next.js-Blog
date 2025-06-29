import { MetadataRoute } from 'next';
import { getBlogPosts, getCategories } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'; // Fallback for development

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ];

  // Blog posts
  const { data: posts } = await getBlogPosts(1, 1000); // Fetch all posts (adjust pageSize if needed)
  const postEntries: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // Categories
  const categories = await getCategories();
  const categoryEntries: MetadataRoute.Sitemap = categories.map((category: any) => ({
    url: `${baseUrl}/category/${category.slug}`,
    lastModified: new Date(category.updatedAt || category.createdAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticPages, ...postEntries, ...categoryEntries];
}
