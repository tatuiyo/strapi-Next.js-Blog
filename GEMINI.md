# Gemini Project Documentation

## 1. Project Overview

This project is a blog application built with **Next.js** and **TypeScript**. It fetches content from a headless CMS (likely Strapi, given the API structure) and renders it as a static website. The styling is handled by **Tailwind CSS**.

The core architecture leverages Next.js's App Router, heavily utilizing **Server Components** for data fetching and rendering, which ensures fast page loads and good SEO. Client-side interactivity is used sparingly and intentionally, as seen in the header's mobile menu.

### Key Technologies
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with the `@tailwindcss/typography` plugin for Markdown content.
- **API Communication**: `fetch` API with `qs` for query string serialization.
- **Markdown Rendering**: `react-markdown` with `rehype-raw` to allow safe HTML rendering.

## 2. Design Philosophy & Architecture

The project follows a modern, server-centric approach, which is a core tenet of the Next.js App Router.

- **Server-First Data Fetching**: Most pages and components are **Server Components** (`async function` components). They fetch data directly on the server during the rendering process. This simplifies data fetching logic, reduces client-side JavaScript, and improves performance.
- **Component-Based Structure**: The UI is broken down into reusable components located in `src/app/components`.
- **Clear Separation of Concerns**:
    - **API Logic (`src/lib/api.ts`)**: All logic for communicating with the backend API is centralized in this file. This makes it easy to manage API endpoints and data transformation.
    - **UI Components (`src/app/components/`)**: Reusable UI elements like the header, footer, and sidebar are kept separate.
    - **Page Routes (`src/app/...`)**: Each route corresponds to a folder within the `src/app` directory, containing a `page.tsx` file that defines the page's content. Dynamic routes (e.g., `[slug]`) are used for blog posts and categories.
- **Hybrid Rendering Strategy**:
    - The `Header` component is a prime example of this. The main data-fetching part (`HeaderData`) is a Server Component. It then passes the data to a traditional React component (`Header`, marked with `'use client'`) which handles the client-side state for the mobile menu. This pattern optimizes for initial page load while still allowing for rich interactivity.
- **Styling**: Global styles and custom component styles are defined in `src/app/globals.css` using Tailwind's `@layer` directive. The `@tailwindcss/typography` plugin (`prose` class) is used to provide sensible default styling for Markdown-generated HTML, which is then customized.

## 3. File Breakdown

### `src/app/` (Routing & Pages)
- **`layout.tsx`**: The root layout for the entire application. It defines the main HTML structure, including the `Header`, `Sidebar`, and `Footer`, and wraps the main content area.
- **`page.tsx`**: The homepage of the blog, which displays a paginated list of all blog posts.
- **`globals.css`**: Global stylesheet, including Tailwind CSS setup, custom font definitions, and custom styles for HTML elements like headings.

#### `src/app/blog/[slug]/page.tsx`
- **Purpose**: Renders a single blog post.
- **Functionality**:
    1. It's a dynamic route that uses the `slug` from the URL.
    2. `generateMetadata` fetches post data to create dynamic page titles and descriptions for SEO.
    3. The main component fetches the full post content using `getPostBySlug`.
    4. It uses `ReactMarkdown` with `rehype-raw` to render the post's Markdown content, including custom handling for images to use the Next.js `Image` component for optimization.

#### `src/app/category/page.tsx`
- **Purpose**: Displays a list of all available categories.
- **Functionality**: Fetches all categories via `getCategories` and displays them as links pointing to the specific category page.

#### `src/app/category/[slug]/page.tsx`
- **Purpose**: Displays a paginated list of all blog posts belonging to a specific category.
- **Functionality**:
    1. A dynamic route that uses the category `slug` from the URL.
    2. Fetches posts for the given category using `getPostsByCategory`.
    3. Renders the list of posts and includes pagination controls.

### `src/app/components/` (Reusable UI Components)
- **`header.tsx`**:
    - Contains two components: `HeaderData` (Server Component) and `Header` (Client Component).
    - `HeaderData` fetches the category list on the server.
    - `Header` receives the categories as props and handles the UI, including the client-side logic for the mobile navigation menu.
- **`sidebar.tsx`**: A Server Component that fetches and displays a list of recent posts and all categories.
- **`footer.tsx`**: A simple static footer component.

### `src/lib/` (Core Logic)
- **`api.ts`**:
    - The single source of truth for all communication with the external headless CMS.
    - It defines a `baseUrl` from environment variables (`NEXT_PUBLIC_API_URL`).
    - Provides asynchronous functions (`getBlogPosts`, `getPostBySlug`, etc.) to fetch and return data.
    - Uses the `qs` library to build complex query strings for filtering, populating relations, and pagination, which is a common pattern when working with Strapi.

### Configuration Files
- **`next.config.js`**: Configures Next.js, specifically allowing images from a remote source (the CMS) to be optimized by the Next.js Image component.
- **`package.json`**: Defines project scripts (`dev`, `build`, etc.) and lists all dependencies.
- **`tsconfig.json`**: TypeScript configuration file.
- **`postcss.config.mjs` & `tailwind.config.ts` (Implicit)**: Configuration for PostCSS and Tailwind CSS, which are used for styling.
