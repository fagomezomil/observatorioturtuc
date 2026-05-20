// The root "/" route is handled by this file.
// It imports the PublicLayout and home page content from the (public) route group
// to compose the home page with the public layout.
// Note: src/app/(public)/page.tsx also maps to "/" but this file takes precedence.
import PublicLayout from "./(public)/layout";
import HomePageContent from "./(public)/page";

export default function RootPage() {
  return (
    <PublicLayout>
      <HomePageContent />
    </PublicLayout>
  );
}