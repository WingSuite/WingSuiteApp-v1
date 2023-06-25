// React Icons imports
import { VscHome, VscComment, VscBell } from "react-icons/vsc";
import { BsPerson } from "react-icons/bs";

// Export config
export const config = {
  apiBase: "http://127.0.0.1:5000/",
  allAccessPermission: "*",
  daysOfTheWeek: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],
  quickLinks: [
    { name: "CIP", link: "https://sites.google.com/view/detachment025/" },
    { name: "Wings", link: "https://wings.holmcenter.com/" },
    { name: "ASU Canvas", link: "https://canvas.asu.edu/" },
    { name: "DoDMERB", link: "https://dodmerb.tricare.osd.mil/" },
  ],
  pageNoteFoundMessages: [
    "Huh, treasure's not here...",
    "Well this is awkward...",
    "Are you sure we're in the right place?",
    "You might want to check your map...",
    "Are we in Armageddon, New Mexico?",
    "Yeah we are fo sho lost, fr fr",
  ],
  notificationPreviewTrimLength: 200,
};

// Main Sidebar config
export const regularSidebarContents = [
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

// Unit sidebar config
export const unitSidebarConfig = [
  {
    title: "Members",
    link: "",
    icon: <BsPerson />,
  }
];

// Permissions config
export const permissionsList = {
  feedback: {
    toolbar: ["statistic.feedback.create_feedback"],
  },
  notifications: {
    toolbar: ["notification.create_notification"],
  },
};
