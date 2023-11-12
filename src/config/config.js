// React Icons imports
import {
  VscHome,
  VscComment,
  VscBell,
  VscGraph,
  VscCalendar,
  VscPerson,
  VscListFlat,
  VscKey,
  VscOrganization,
  VscChecklist,
  VscNotebook,
  VscTypeHierarchySub
} from "react-icons/vsc";
import { BsPerson } from "react-icons/bs";
import { BiNews } from "react-icons/bi";

// Export config
export const config = {
  orgName: "Detachment 025",
  apiBase:
    process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:5000/"
      : "https://api.det025.us/",
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
    { name: "DET 025 Page", link: "https://afrotc.asu.edu/" },
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
  emailRegex: /^[a-zA-Z0-9._%+-]+@(asu|my.gcu|maricopa)\.edu$/,
  rankList: [
    "C/4C",
    "C/3C",
    "C/2d Lt",
    "C/1st Lt",
    "C/Capt",
    "C/Maj",
    "C/Lt Col",
    "C/Col",
    "AB",
    "Amn",
    "A1C",
    "SrA",
    "SSgt",
    "TSgt",
    "MSgt",
    "SMSgt",
    "CMSgt",
    "CCM",
    "CMSAF",
    "2d Lt",
    "1st Lt",
    "Capt",
    "Maj",
    "Lt Col",
    "Col",
    "Brig Gen",
    "Maj Gen",
    "Lt Gen",
    "Gen",
  ],
};

// Quill editor configurations
export const quillConfigs = {
  modules: {
    toolbar: [
      [{ header: "1" }, { header: "2" }],
      [{ size: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  },
  formats: [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "video",
  ],
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
  tasks: {
    edit: [
      "statistic.task.create_task",
      "statistic.task.get_task_info",
      "statistic.task.update_task",
      "statistic.task.reject_completion",
      "statistic.task.change_status",
      "statistic.task.delete_task",
    ],
  },
  admin: {
    register_list: {
      page: [
        "auth.authorize_user",
        "auth.reject_user",
        "auth.get_register_requests",
      ],
    },
    user_list: {
      page: ["user.everyone.phone_number_view", "auth.kick_user"],
    },
    permissions_editing: {
      page: [
        "user.update_rank",
        "user.get_permissions_list",
        "user.everyone.permission_view",
        "user.update_permissions",
      ],
    },
    unit_handling: {
      page: ["unit.create_unit", "unit.delete_unit", "unit.update_unit"],
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
  unit: {
    metrics: {
      add: [
        "/statistic/five_point/create_five_point/",
        "/statistic/pfa/create_pfa/",
        "/statistic/warrior/create_warrior/",
      ],
      format: [
        "/statistic/five_point/get_five_point_format_info/",
        "/statistic/pfa/get_pfa_format_info/",
        "/statistic/warrior/get_warrior_format_info/",
      ],
      data: [
        "/unit/get_all_five_point_data/",
        "/unit/get_all_pfa_data/",
        "/unit/get_all_warrior_data/",
      ],
      testing: [
        "/statistic/five_point/get_test_five_point_score/",
        "/statistic/pfa/get_test_pfa_score/",
        "/statistic/warrior/get_test_warrior_score/",
      ],
      edit: [
        "/statistic/five_point/update_five_point/",
        "/statistic/pfa/update_pfa/",
        "/statistic/warrior/update_warrior/",
      ],
      delete: [
        "/statistic/five_point/delete_five_point/",
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
    title: "Tasks",
    link: "/dashboard/tasks",
    icon: <VscChecklist />,
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
  {
    title: "User Sheet",
    link: "/dashboard/user_sheet",
    icon: <VscNotebook />,
  },
  {
    title: "Organization Tree",
    link: "/dashboard/organization_tree",
    icon: <VscTypeHierarchySub />,
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
    title: "User List",
    link: "user_list",
    icon: <VscListFlat />,
  },
  {
    id: "permissions_editing",
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
  // {
  //   id: "communications",
  //   title: "Communications",
  //   link: "/communications",
  //   icon: <VscMegaphone />,
  // },
  {
    id: "metrics",
    title: "Metrics",
    link: "/metrics",
    all_perms: false,
    icon: <VscGraph />,
  },
  // {
  //   id: "resources",
  //   title: "Resources",
  //   link: "/resources",
  //   icon: <VscFolderLibrary />,
  // },
  // {
  //   id: "emergency",
  //   title: "Emergency",
  //   link: "/emergency",
  //   icon: <VscWarning />,
  // },
];
