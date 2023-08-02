// React Icons imports
import {
  VscHome,
  VscComment,
  VscBell,
  VscGraph,
  VscWarning,
  VscMegaphone,
  VscCalendar,
  VscFolderLibrary,
  VscPerson,
  VscListFlat,
  VscKey,
  VscOrganization,
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
  notificationPreviewTrimLength: 200,
  colorOrder: [
    "#54C0FF",
    "#0BB99A",
    "#FC3535",
    "#FFBC21",
    "#D414FF",
    "#FC056C",
    "#00CF07",
  ],
  phoneRegex: /^\(\d{3}\) \d{3}-\d{4}$/,
  passwordRegex:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
};

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
  admin: {
    register_list: {
      page: ["auth.authorize_user", "auth.reject_user"],
    },
    user_list: {
      page: ["*"],
    },
    perm_list: {
      page: ["user.add_permissions", "user.delete_permissions"],
    },
    unit_handling: {
      page: ["unit.create_unit", "unit.delete_unit"],
    },
  },
  unit: {
    frontpage: {
      change: ["unit.update_frontpage"],
    },
    members: {
      handle: [
        "unit.add_members",
        "unit.delete_members",
        "unit.add_officers",
        "unit.delete_officers",
      ],
    },
    metrics: {
      page: ["unit.get_all_pfa_data", "unit.get_all_warrior_data"],
      edit: [
        "statistic.pfa.update_pfa",
        "statistic.warrior.update_warrior",
        "statistic.pfa.delete_pfa",
        "statistic.warrior.delete_warrior",
      ],
      add: ["statistic.pfa.create_pfa", "statistic.warrior.create_warrior"],
    },
    // emergency: {
    //   page: [
    //     "unit.emergency"
    //   ]
    // }
  },
};

// Endpoints config
export const endPointsList = {
  user: {
    metrics: {
      data: ["/user/get_pfa_data/", "/user/get_warrior_data/"],
      format: [
        "/statistic/pfa/get_pfa_format_info/",
        "/statistic/warrior/get_warrior_format_info/",
      ],
    },
  },
  admin: {},
  unit: {
    metrics: {
      add: ["/statistic/pfa/create_pfa/", "/statistic/warrior/create_warrior/"],
      format: [
        "/statistic/pfa/get_pfa_format_info/",
        "/statistic/warrior/get_warrior_format_info/",
      ],
      data: ["/unit/get_all_pfa_data/", "/unit/get_all_warrior_data/"],
      testing: [
        "/statistic/pfa/get_test_pfa_score/",
        "/statistic/warrior/get_test_warrior_score/",
      ],
      edit: [
        "/statistic/pfa/update_pfa/",
        "/statistic/warrior/update_warrior/",
      ],
      delete: [
        "/statistic/pfa/delete_pfa/",
        "/statistic/warrior/delete_warrior/",
      ],
    },
  },
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

// Admin sidebar config
export const adminSidebarContext = [
  {
    id: "register_list",
    title: "Register List",
    link: "register_list",
    icon: <VscPerson />,
  },
  {
    id: "user_list",
    title: "Users List",
    link: "user_List",
    icon: <VscListFlat />,
  },
  {
    id: "perm_list",
    title: "Permissions Editing",
    link: "permissions_editing",
    icon: <VscKey />,
  },
  {
    id: "unit_handling",
    title: "Unit Handling",
    link: "unit_handling",
    icon: <VscOrganization />,
  },
];

// Unit sidebar config
export const unitSidebarConfig = [
  {
    id: "frontpage",
    title: "Front Page",
    link: "/frontpage",
    icon: <BiNews />,
  },
  {
    id: "members",
    title: "Members",
    link: "/members",
    icon: <BsPerson />,
  },
  {
    id: "communications",
    title: "Communications",
    link: "/communications",
    icon: <VscMegaphone />,
  },
  {
    id: "metrics",
    title: "Metrics",
    link: "/metrics",
    icon: <VscGraph />,
  },
  {
    id: "resources",
    title: "Resources",
    link: "/resources",
    icon: <VscFolderLibrary />,
  },
  {
    id: "emergency",
    title: "Emergency",
    link: "/emergency",
    icon: <VscWarning />,
  },
];
