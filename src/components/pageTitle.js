// Imports
import { usePathname } from "next/navigation";

// Page formatter function
const PageTitle = ({ customName = "" }) => {
  // Variable declaration
  const currentPath =
    customName === "" ? decodeURIComponent(usePathname()) : customName;

  // Format for the title
  var title = "";
  if (currentPath != undefined) {
    title =
      currentPath === "/"
        ? "Home"
        : customName === ""
        ? currentPath
            .split("/")
            .slice(2)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" / ")
        : currentPath;
  }

  // Return
  return (
    <div className="mb-8 text-5xl">{currentPath != undefined && title}</div>
  );
};

// Export styling
export default PageTitle;
