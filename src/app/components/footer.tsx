/**
 * @file src/app/components/footer.tsx
 * @description This file defines the Footer component for the application.
 * It's a simple, static component displaying copyright information.
 */

/**
 * The Footer component.
 * This is a simple Server Component that renders the application's footer.
 *
 * @returns {JSX.Element} The rendered footer element.
 */
export default function Footer() {
  return (
    <footer className="bg-white/50">
      <div className="container mx-auto flex justify-center items-center py-4">
        <div>&copy; {new Date().getFullYear()} Our Company Name</div>
      </div>
    </footer>
  );
}
