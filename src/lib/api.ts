import qs from "qs";

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

async function fetchData(url: URL) {
  const res = await fetch(url.toString());
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error: ${res.status} - ${errorText}`);
  }
  const data = await res.json();
  return data;
}

export async function getBlogPosts(page = 1, pageSize = 10) {
  const query = qs.stringify({
    populate: {
      cover: { fields: ["url", "alternativeText"] },
      categories: { fields: ["name", "slug"] },
    },
    pagination: {
      page,
      pageSize,
    },
    sort: ["createdAt:desc"],
  });
  const url = new URL("/api/blogs", baseUrl);
  url.search = query;
  return await fetchData(url);
}

export async function getPostBySlug(slug: string) {
  const query = qs.stringify({
    filters: { slug: { $eq: slug } },
    populate: {
      cover: { fields: ["url", "alternativeText"] },
      categories: { fields: ["name", "slug"] },
    },
  });
  const url = new URL("/api/blogs", baseUrl);
  url.search = query;
  const data = await fetchData(url);
  return data.data[0] ?? null;
}

export async function getCategories() {
  const url = new URL("/api/categories", baseUrl);
  const data = await fetchData(url);
  return data.data;
}

export async function getPostsByCategory(categorySlug: string, page = 1, pageSize = 10) {
  const query = qs.stringify({
    filters: {
      categories: {
        slug: { $eq: categorySlug },
      },
    },
    populate: {
      cover: { fields: ["url", "alternativeText"] },
      categories: { fields: ["name", "slug"] },
    },
    pagination: {
      page,
      pageSize,
    },
    sort: ["createdAt:desc"],
  });
  const url = new URL("/api/blogs", baseUrl);
  url.search = query;
  return await fetchData(url);
}
