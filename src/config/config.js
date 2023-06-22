// React Icons imports
import { VscHome, VscComment, VscBell } from "react-icons/vsc";

// Export config
export const config = require("./config.json");

// Sidebar config
export const sidebarContents = [
  {
    title: "Homepage",
    link: "/dashboard/homepage",
    icon: <VscHome />,
  },
  {
    title: "Notifications",
    link: "/dashboard/notifications",
    icon: <VscBell />,
  },
  {
    title: "Feedback",
    link: "/dashboard/feedback",
    icon: <VscComment />,
  },
];
