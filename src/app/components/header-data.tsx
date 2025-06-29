/**
 * @file src/app/components/header-data.tsx
 * @description This file defines the Server Component responsible for fetching header data.
 * It fetches categories on the server and passes them as props to the `Header` Client Component.
 * This separation ensures data fetching happens on the server, avoiding client-side API calls
 * that could lead to issues like Mixed Content errors or exposure of internal API URLs.
 */

import { getCategories } from "@/lib/api";
import { Header } from "./header"; // Import the client component

/**
 * A Server Component responsible for fetching the category data.
 * It then renders the `Header` (Client Component), passing the fetched data as props.
 * This pattern is excellent for performance as data fetching remains on the server.
 *
 * @returns {Promise<JSX.Element>} A promise that resolves to the rendered Header component with category data.
 */
export default async function HeaderData() {
  const categories = await getCategories();

  // Sort categories by the number in their description field.
  // Assumes description contains a number that can be parsed.
  const sortedCategories = categories.sort((a: any, b: any) => {
    const numA = parseInt(a.description, 10);
    const numB = parseInt(b.description, 10);
    return numA - numB;
  });

  return <Header categories={sortedCategories} />;
}
