// Custom Imports
import PageTitle from '@/components/pagetitle';
import Sidebar from '@/components/sidebar';

// Home page definitions
export default function Home() {

  // Render components
  return (
    <div className="relative flex flex-row h-screen">
      <Sidebar/>
      <div className="flex flex-col w-full m-10">
        <PageTitle className="flex-none"/>
      </div>
    </div>
  )
}