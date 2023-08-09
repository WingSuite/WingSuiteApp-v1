// Config import
import { config } from "@/config/config";

// React.js import
import { useState, useEffect } from "react";

// Home page definitions
export default function PageNotFoundPage() {
  // Set useState for subtext
  const [subText, setSubText] = useState("...");

  // Select a random subtext
  useEffect(() => {
    setSubText(config.pageNoteFoundMessages[
      Math.floor(Math.random() * config.pageNoteFoundMessages.length)
    ]);
  }, []);

  // Render content
  return (
    <div
      className="relative flex h-screen w-screen flex-col items-center
      justify-center gap-3"
    >
      <div
        className="bg-gradient-to-tr from-deepOcean to-sky bg-clip-text
        text-[500px] font-bold text-transparent"
      >
        404
      </div>
      <div className="text-5xl">Page Not Found</div>
      <div className="text-xl">{subText}</div>
    </div>
  );
}
