// React Icons
import {
  VscChevronDown,
  VscChevronUp,
  VscEdit,
  VscTrash,
  VscCheck,
  VscChromeClose,
} from "react-icons/vsc";
import { IconContext } from "react-icons";

// Autosize inputs import
import TextareaAutosize from "react-textarea-autosize";
import AutosizeInput from "react-input-autosize";

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
export function StatCard({ keyContent, valueContent, buttonInfo }) {
  // Render component
  return (
    <div
      className={`rounded-lg border border-silver p-3 text-left
      shadow-lg ${buttonInfo}`}
      key={keyContent}
    >
      <div className="text-2xl">{keyContent}</div>
      <div
        className="mt-1 bg-gradient-to-r from-deepOcean to-sky bg-clip-text
        text-5xl font-bold text-transparent"
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
export function CollapsableInfoCard({
  id,
  date,
  title,
  titleAppendix,
  mainText,
  updateFunc = null,
  deleteFunc = null,
  startState = false,
}) {
  // Define useState
  const [titleContent, setTitleContent] = useState(title);
  const [mainTextContent, setMainTextContent] = useState(mainText);
  const [collapsed, setCollapsed] = useState(startState);
  const [editMode, setEditMode] = useState(false);
  const [delMode, setDelMode] = useState(false);

  // Render component
  return (
    <div
      className={`flex w-full flex-col gap-2 rounded-md border
      border-silver p-2 ${delMode && `border-scarlet text-scarlet`}`}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div
          className="w-full text-2xl"
          onClick={() => setCollapsed(!collapsed)}
        >
          <div className="flex w-full flex-row items-center gap-2">
            <div className="mr-3 text-base">{date}</div>
            <AutosizeInput
              className={`${editMode && `text-sky`}`}
              inputStyle={{ background: "transparent" }}
              value={titleContent}
              disabled={!editMode}
              onChange={(e) => setTitleContent(e.target.value)}
            />
            <div
              className={`ml-2 flex flex-col text-left
              ${delMode ? `text-scarlet` : `text-darkSilver`}`}
            >
              {titleAppendix}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          {updateFunc != null && !editMode && !delMode && (
            <button
              onClick={() => {
                setEditMode(true);
                setCollapsed(true);
              }}
            >
              <IconContext.Provider value={{ size: "1.5em" }}>
                {<VscEdit />}
              </IconContext.Provider>
            </button>
          )}
          {deleteFunc != null && !editMode && !delMode && (
            <button
              onClick={() => {
                setDelMode(true);
              }}
            >
              <IconContext.Provider
                value={{ size: "1.5em", className: "ml-2" }}
              >
                {<VscTrash />}
              </IconContext.Provider>
            </button>
          )}
          {editMode && (
            <button
              onClick={() => {
                setEditMode(false);
                setTitleContent(title);
                setMainTextContent(mainText);
              }}
            >
              <IconContext.Provider
                value={{ size: "1.5em", className: "ml-2" }}
              >
                {<VscChromeClose />}
              </IconContext.Provider>
            </button>
          )}
          {editMode && (
            <button
              onClick={() => {
                updateFunc(id, titleContent, mainTextContent);
                setEditMode(false);
              }}
            >
              <IconContext.Provider
                value={{ size: "1.5em", className: "ml-2" }}
              >
                {<VscCheck />}
              </IconContext.Provider>
            </button>
          )}
          {delMode && (
            <button
              onClick={() => {
                deleteFunc(id);
                setEditMode(false);
              }}
            >
              <IconContext.Provider
                value={{ size: "1.5em", className: "ml-2" }}
              >
                {<VscCheck />}
              </IconContext.Provider>
            </button>
          )}
          {delMode && (
            <button
              onClick={() => {
                setDelMode(false);
              }}
            >
              <IconContext.Provider
                value={{ size: "1.5em", className: "ml-2" }}
              >
                {<VscChromeClose />}
              </IconContext.Provider>
            </button>
          )}
          <button
            onClick={() => {
              !editMode && setCollapsed(!collapsed);
            }}
          >
            <IconContext.Provider value={{ size: "2em" }}>
              {collapsed ? <VscChevronDown /> : <VscChevronUp />}
            </IconContext.Provider>
          </button>
        </div>
      </div>
      {collapsed && (
        <TextareaAutosize
          className={`bg-transparent ${editMode && `text-sky`}`}
          value={mainTextContent}
          disabled={!editMode}
          onChange={(e) => setMainTextContent(e.target.value)}
        />
      )}
    </div>
  );
}
