// Custom component imports
import PageTitle from "@/components/pagetitle";
import Sidebar from "@/components/sidebar";

// Home page definitions
export default function FeedbackPage() {
  // Render content
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex max-h-full w-full flex-col">
        <PageTitle className="flex-none" />
      </div>
    </div>
  );
}
