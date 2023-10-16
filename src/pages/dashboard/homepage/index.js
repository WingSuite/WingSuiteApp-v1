// React Icons
import { VscBellSlash, VscCloseAll } from "react-icons/vsc";

// React.js & Next.js libraries
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";

// JS Cookies import
import Cookies from "js-cookie";

// Config imports
import { config } from "@/config/config";

// HTML formatting import
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

// Util imports
import { getTimeBounds, formatMilTime, getTodayDay } from "@/utils/time";
import { authCheck } from "@/utils/authCheck";
import { post } from "@/utils/call";

// Custom components imports
import { ButtonCard, StatCard } from "@/components/cards";
import { Nothing } from "@/components/nothing";
import PageTitle from "@/components/pageTitle";
import Sidebar from "@/components/sidebar";

// Home page definitions
export default function HomePage() {
  // Create useState for the last name of the user
  const [lastName, setLastName] = useState("");
  const [rank, setRank] = useState("");
  const [feedbackData, setFeedbackData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [lastWKScore, setLastWKScore] = useState("");
  const [lastPFAScore, setLastPFAScore] = useState("");
  const [weekViewData, setWeekViewData] = useState(
    config.daysOfTheWeek.reduce((obj, key) => {
      obj[key] = [];
      return obj;
    }, {})
  );

  // Get router
  const router = useRouter();

  // On mount of the Next.js page
  useEffect(() => {
    // Check for correct user auth
    if (!authCheck()) return;

    // Fetch the last name of the user from local storage
    const localData = JSON.parse(localStorage.getItem("whoami"));

    // Get the last name and rank of the user
    setLastName(localData["last_name"]);
    if ("rank" in localData) setRank(localData["rank"] + " ");

    // Process feedback information
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/user/get_feedbacks/",
        { page_size: 3, page_index: 0, sent: false },
        Cookies.get("access")
      );

      // If resulting API results in an error, return
      if (res.status === "error") return;

      // Iterate through each item of the response and store just the quotes
      let quotes = [];
      for (let item of res.message) {
        quotes.push([item.feedback, item.formatted_from_user]);
      }

      // Store the quotes to the useState
      setFeedbackData(quotes);
    })();

    // Process current week's events
    (async () => {
      // Initialize data for parsing
      let resultWeekData = {
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
      };

      // Get the start and end bounds
      const [start, end] = getTimeBounds();

      // Get the user's feedback information
      var res = await post(
        "/user/get_events/",
        { start_datetime: start, end_datetime: end },
        Cookies.get("access")
      );

      // Iterate through the list of raw data
      for (let item of res.message) {
        // Get datetime information
        const date = new Date(item.start_datetime * 1000);
        let dayOfWeek = date.getDay();

        // Change the day index
        if (dayOfWeek === 0) dayOfWeek = 6;
        else dayOfWeek -= 1;

        // Add new information to resultWeekData
        resultWeekData[config.daysOfTheWeek[dayOfWeek]].push({
          name: item.name,
          start: item.start_datetime,
          end: item.end_datetime,
        });
      }

      // Set week view data
      setWeekViewData(resultWeekData);
    })();

    // Process notification data
    (async () => {
      // Get notification trim length
      const trim = config.notificationPreviewTrimLength;

      // Get the start and end bounds
      const start = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
      const end = Math.floor(Date.now() / 1000);

      // Get the user's feedback information
      var res = await post(
        "/user/get_notifications/",
        { start_datetime: start, end_datetime: end },
        Cookies.get("access")
      );

      // Get every notification and store their name and message
      let notificationData = [];
      for (let item of res.message) {
        // Clip text if it is more than 200 characters long
        var text = item.notification;
        text = text.length > trim ? text.substring(0, trim) + "..." : text;

        // Append information
        notificationData.push([item.name, text]);
      }

      // Set the notification data
      setNotifications(notificationData);
    })();

    // Process stat data
    (async () => {
      // Call API to get the user's data
      var res = await post(
        "/user/get_pfa_data/",
        { page_size: 1, page_index: 0 },
        Cookies.get("access")
      );

      // Set lastPFAScore to "N/A" if there is no PFA data
      if (res.message.length == 0) setLastPFAScore("N/A");
      else setLastPFAScore(res.message[0].composite_score);

      // Call API to get the user's data
      res = await post(
        "/user/get_warrior_data/",
        { page_size: 1, page_index: 0 },
        Cookies.get("access")
      );

      // Set lastPFAScore to "N/A" if there is no WK data
      if (res.message.length == 0) setLastWKScore("N/A");
      else setLastWKScore(res.message[0].composite_score);
    })();

    // Process task data
    (async () => {
      // Get the user's feedback information
      var res = await post(
        "/user/get_tasks/",
        { page_size: 200, page_index: 0, get_completed: false },
        Cookies.get("access")
      );

      // If resulting API results in an error, return
      if (res.status === "error") return;

      // Save the data
      setTaskData(res.message);
    })();
  }, []);

  // Get the greeting information
  const date = new Date();
  const hours = date.getHours();
  let greeting;

  // Get the greeting
  if (hours < 12) greeting = `Good Morning ${rank}${lastName} 🌞`;
  else if (hours < 17) greeting = `Good Afternoon ${rank}${lastName} 🌇`;
  else greeting = `Good Evening ${rank}${lastName} 🌃`;

  // Week View definition
  const weekView = (
    <div className="flex flex-col gap-4">
      <div className="text-4xl">This Week's View</div>
      <div className="flex h-full flex-row justify-between px-1">
        {config.daysOfTheWeek.map((item, index) => (
          <div
            key={`weekView-${item}-${index}`}
            className={`flex h-56 w-[13.5%] flex-col gap-0.5 overflow-y-auto rounded-lg border
            py-2 pl-2 pr-1
            ${
              getTodayDay() == item
                ? "border-2 border-sky shadow-md shadow-sky"
                : "border-silver shadow-lg"
            }`}
          >
            <div className="text-lg">{item}</div>
            <div
              className="flex w-full flex-col gap-2 overflow-y-auto
              pr-1 pt-1.5"
            >
              {weekViewData[item].map((event, index) => (
                <ButtonCard
                  key={`weekViewEvent-${event.name}-${index}`}
                  size="lg"
                  text={event.name}
                  subtext={`${formatMilTime(event.start)}-${formatMilTime(
                    event.end
                  )}`}
                  buttonInfo={`transition duration-200 ease-in border
                  border-transparent hover:border hover:border-darkOcean
                  hover:border hover:-translate-y-[0.1rem] hover:shadow-xl
                  bg-gradient-to-tr from-deepOcean to-sky text-white`}
                  action={() => {router.push("/dashboard/events/")}}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Quick Links view definition
  const quickLinksView = (
    <div className="flex flex-col gap-4 overflow-y-auto">
      <div className="text-4xl">Quick Links</div>
      <div className="flex h-full flex-col gap-4 overflow-y-auto p-1 pb-4">
        {config.quickLinks.map((item, index) => (
          <ButtonCard
            key={`quickLink-${item.name}-${index}`}
            size="2xl"
            text={item.name}
            action={() => {
              router.push(item.link);
            }}
            buttonInfo="h-20 transition duration-200 ease-in border
            border-silver hover:-translate-y-[0.1rem] hover:shadow-lg
            hover:border-black px-2 py-1.5"
          />
        ))}
      </div>
    </div>
  );

  // Stats view definition
  const statsView = (
    <div className="flex h-full flex-1 flex-col gap-4">
      <div className="text-4xl">Stats</div>
      <div
        className="flex h-full flex-col gap-4 px-1
        pb-4"
      >
        <StatCard keyContent="Last PFA Score" valueContent={lastPFAScore} />
        <StatCard keyContent="Last WK Score" valueContent={lastWKScore} />
      </div>
    </div>
  );

  // Feedback view definition
  const feedbackView = (
    <div className="flex h-full w-1/4 flex-col gap-4 overflow-y-auto">
      <div className="text-4xl">Feedback</div>
      <div
        className="flex h-full flex-col gap-4 overflow-y-auto
        rounded-lg px-1 pb-4 pr-2"
      >
        {feedbackData.length === 0 ? (
          <Nothing
            icon={<VscCloseAll />}
            mainText="No Feedback Provided"
            subText="Keep Up the Good Work"
          />
        ) : (
          feedbackData.map((info, index) => (
            <div
              key={`feedbackView-${index}`}
              className="flex flex-col gap-1 rounded-lg bg-gradient-to-tr
              from-deepOcean to-sky px-2 py-1 shadow-lg"
            >
              <ReactMarkdown
                className="custom-prose max-w-full text-white"
                rehypePlugins={[rehypeRaw]}
              >
                {info[0]}
              </ReactMarkdown>
              <div className="font-bold text-white">- {info[1]}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Notifications view definition
  const notificationsView = (
    <div className="flex w-1/3 flex-col gap-4 overflow-y-auto">
      <div className="text-4xl">Notifications</div>
      <div
        className="flex h-full flex-col gap-4 overflow-y-auto rounded-lg
        px-1 pb-4 pr-2"
      >
        {notifications.length === 0 ? (
          <Nothing
            icon={<VscBellSlash />}
            mainText="No Notifications So Far"
            subText="Get Some Rest"
          />
        ) : (
          notifications.map((info, index) => (
            <div
              key={`feedbackView-${index}`}
              className="flex flex-col gap-1 rounded-lg bg-gradient-to-tr
              from-deepOcean to-sky px-2 py-1 shadow-lg"
            >
              <div className="text-2xl font-bold text-white">{info[0]}</div>
              <ReactMarkdown
                className="custom-prose max-w-full text-white"
                rehypePlugins={[rehypeRaw]}
              >
                {info[1]}
              </ReactMarkdown>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Task view definition
  const taskView = (
    <div className="flex h-full w-1/3 flex-1 flex-col gap-4 overflow-y-auto">
      <div className="text-4xl">⚠️ Tasks</div>
      <div
        className="flex h-full flex-col gap-4 overflow-y-auto
        px-1.5 pb-4 py-1"
      >
        {taskData.map((item, idx) => (
          <button
            className="rounded-lg border-2 border-sky p-2
            transition duration-200 ease-in hover:-translate-y-[0.1rem]
            hover:border-2 hover:border-darkOcean hover:shadow-xl truncate
            text-left"
            onClick={()=>{router.push('/dashboard/tasks/')}}
            key={item._id}
          >
            {(item.status == "incomplete") ? `❌` : `⏳`} {item.name}
          </button>
        ))}
      </div>
    </div>
  );

  // Render components
  return (
    <div className="relative flex h-screen flex-row overflow-y-auto">
      <Sidebar />
      <div
        className="m-10 flex max-h-screen w-full flex-col gap-14
        overflow-y-auto pr-4"
      >
        <div className="pt-2 text-7xl">{greeting}</div>
        {weekView}
        <div className="flex max-h-screen flex-row gap-14 overflow-y-auto">
          {taskData.length == 0 ? statsView : taskView}
          {feedbackView}
          {notificationsView}
          {quickLinksView}
        </div>
      </div>
    </div>
  );
}
