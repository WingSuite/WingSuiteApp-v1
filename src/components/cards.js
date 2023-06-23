// React Icons
import { VscChevronDown, VscChevronUp } from "react-icons/vsc";
import { IconContext } from "react-icons";

// React.js & Next.js libraries
import { useState, useEffect } from "react";

// Regular Card definition
export function Card({
  text,
  size,
  pad = 2,
  bg = "white",
  textColor = "black",
}) {
  // Render component
  return (
    <div
      className={`rounded-md border-2 text-left shadow-md
        border-${bg} bg-${bg} text-${textColor} px-${1 + pad} p-${pad}`}
      key={text}
    >
      <div className={`text-${size}`}>{text}</div>
    </div>
  );
}

// Stat Card definition
export function StatCard({ keyContent, valueContent }) {
  // Render component
  return (
    <div
      className="rounded-lg border border-silver px-2 py-2 text-left shadow-lg"
      key={keyContent}
    >
      <div className="text-2xl">{keyContent}</div>
      <div
        className="mt-1 bg-gradient-to-r from-deepOcean to-sky bg-clip-text
        text-3xl font-bold text-transparent"
      >
        {valueContent}
      </div>
    </div>
  );
}

// Button Card definition
export function ButtonCard({
  text,
  size,
  action = () => {},
  subtext = null,
  buttonInfo = null,
}) {
  // Render component
  return (
    <button
      className={`rounded-lg p-1.5 text-left shadow-md ${buttonInfo}`}
      key={text}
      onClick={action}
    >
      <div className={`text-${size}`}>{text}</div>
      <div className="text-sm">{subtext}</div>
    </button>
  );
}

// Collapsable Card definition
export function CollapsableCard({
  title,
  mainText,
  titleCSS,
  mainTextCSS,
  startState = false,
}) {
  // Define useState
  const [collapsed, setCollapsed] = useState(startState);

  // Render component
  return (
    <button
      className="flex flex-col gap-2 rounded-md border border-silver p-2"
      onClick={() => setCollapsed(!collapsed)}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="text-2xl">{title}</div>
        <div onClick={() => setCollapsed(!collapsed)}>
          <IconContext.Provider value={{ size: "2em" }}>
            {collapsed ? <VscChevronDown /> : <VscChevronUp />}
          </IconContext.Provider>
        </div>
      </div>
      {collapsed && <div className="text-xl text-left">{mainText}</div>}
    </button>
  );
}
