// Custom Imports
import PageTitle from "@/components/pagetitle";
import Sidebar from "@/components/sidebar";

// Home page definitions
export default function Home() {
  // Render components
  return (
    <div className="relative flex h-screen flex-row">
      <Sidebar />
      <div className="m-10 flex w-full flex-col">
        <PageTitle className="flex-none" />
      </div>
    </div>
  );
}
