// React Icons imports
import { VscHome, VscComment, VscBell } from "react-icons/vsc";

// Export config
export const config = {
  apiBase: "http://127.0.0.1:5000/",
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
  ]
};

export const testData = {
  weekView: {
    Monday: [
      {
        name: "Physical Training",
        datetime: "0600",
      },
    ],
    Tuesday: [
      {
        name: "GMCOT",
        datetime: "0800",
      },
    ],
    Wednesday: [
      {
        name: "Physical Training",
        datetime: "0600",
      },
    ],
    Thursday: [
      {
        name: "LLAB",
        datetime: "0600",
      },
      {
        name: "AES 101",
        datetime: "0900",
      },
    ],
    Friday: [
      {
        name: "Physical Training",
        datetime: "0600",
      },
    ],
    Saturday: [],
    Sunday: [],
  },
};

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
