// Imports
import { usePathname } from "next/navigation";

// Page formatter function
const PageTitle = ({ customName = "" }) => {
  // Variable declaration
  const currentPath = customName === "" ? usePathname() : customName;

  // Return
  return (
    <div className="mb-16 text-5xl">
      {currentPath === "/"
        ? "Home"
        : customName === ""
        ? currentPath
            .split("/")
            .slice(2)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" / ")
        : currentPath}
    </div>
  );
};

// Export styling
export default PageTitle;
