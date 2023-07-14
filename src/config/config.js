// React Icons imports
import {
  VscHome,
  VscComment,
  VscBell,
  VscBrowser,
  VscGraph,
  VscWarning,
  VscMegaphone,
  VscCalendar,
  VscFolderLibrary,
} from "react-icons/vsc";
import { BsPerson } from "react-icons/bs";
import { BiNews } from "react-icons/bi";

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
  notificationPreviewTrimLength: 200
};

// Main Sidebar config
export const regularSidebarContents = [
  {
    title: "Home Page",
    link: "/dashboard/homepage",
    icon: <VscHome />,
  },
  {
    title: "Notifications",
    link: "/dashboard/notifications",
    icon: <VscBell />,
  },
  {
    title: "Events",
    link: "/dashboard/events",
    icon: <VscCalendar />,
  },
  {
    title: "Feedback",
    link: "/dashboard/feedback",
    icon: <VscComment />,
  },
  {
    title: "Metrics",
    link: "/dashboard/metrics",
    icon: <VscGraph />,
  },
];

// Unit sidebar config
export const unitSidebarConfig = [
  {
    title: "Front Page",
    link: "/frontpage",
    icon: <BiNews />,
  },
  {
    title: "Members",
    link: "/members",
    icon: <BsPerson />,
  },
  {
    title: "Communications",
    link: "/communications",
    icon: <VscMegaphone />,
  },
  {
    title: "Metrics",
    link: "/metrics",
    icon: <VscGraph />,
  },
  {
    title: "Resources",
    link: "/resources",
    icon: <VscFolderLibrary />,
  },
  {
    title: "Emergency",
    link: "/emergency",
    icon: <VscWarning />,
  },
];

// Permissions config
export const permissionsList = {
  notifications: {
    toolbar: [
      "notification.create_notification",
      "notification.update_notification",
      "notification.delete_notification",
    ],
  },
  events: {
    toolbar: ["event.create_event", "event.update_event", "event.delete_event"],
  },
  feedback: {
    toolbar: [
      "statistic.feedback.create_feedback",
      "statistic.feedback.update_feedback",
      "statistic.feedback.delete_feedback",
    ],
  },
};
