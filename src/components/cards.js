// React Icons
import {
  VscChevronDown,
  VscChevronUp,
  VscEdit,
  VscTrash,
  VscCheck,
  VscChromeClose,
  VscPass,
  VscMail,
  VscPerson,
  VscCallIncoming,
  VscVerifiedFilled,
} from "react-icons/vsc";
import { MdLogout } from "react-icons/md";
import { IconContext } from "react-icons";

// Quill editor and HTML import
import QuillNoSSRWrapper from "./editor";
import "quill/dist/quill.snow.css";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import rehypeRaw from "rehype-raw";

// Config imports
import { quillConfigs } from "@/config/config";

// Inputs import
import TextareaAutosize from "react-textarea-autosize";
import AutosizeInput from "react-input-autosize";
import { BottomDropDown } from "./dropdown";

// React.js & Next.js libraries
import { useState } from "react";
import Image from "next/image";

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
  date = null,
  tag = null,
  title,
  titleAppendix = null,
  mainText,
  updateFunc = null,
  deleteFunc = null,
  startState = false,
  titleUpdateDisable = false,
  simpleEditor = false,
  tagList = null,
  icon = null,
  actionButton = null,
  footnote = null,
}) {
  // Define useState
  const [titleContent, setTitleContent] = useState(title);
  const [mainTextContent, setMainTextContent] = useState(mainText);
  const [tagContent, setTagContent] = useState(tag);
  const [collapsed, setCollapsed] = useState(startState);
  const [editMode, setEditMode] = useState(false);
  const [delMode, setDelMode] = useState(false);

  // Sanitize mainText
  const sanitizedHTML = DOMPurify.sanitize(mainTextContent);

  // Tag section definition
  const tagSection = (
    <div>
      {tagContent && !editMode && (
        <div
          className={`rounded-lg px-2 py-1 text-center text-sm`}
          style={{ backgroundColor: tagList[tagContent] }}
        >
          {tagContent}
        </div>
      )}
      {tagList && editMode && (
        <div className="text-sm">
          <BottomDropDown
            listOfItems={Object.keys(tagList)}
            setSelected={setTagContent}
            defaultValue={tagContent}
            editColor={true}
          />
        </div>
      )}
    </div>
  );

  // Editing controls section definition
  const editingControls = (
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
          <IconContext.Provider value={{ size: "1.5em", className: "ml-2" }}>
            {<VscTrash />}
          </IconContext.Provider>
        </button>
      )}
      {actionButton != null && !editMode && !delMode && actionButton}
      {editMode && (
        <button
          onClick={() => {
            setEditMode(false);
            setTagContent(tag);
            setTitleContent(title);
            setMainTextContent(mainText);
          }}
        >
          <IconContext.Provider value={{ size: "1.5em", className: "ml-2" }}>
            {<VscChromeClose />}
          </IconContext.Provider>
        </button>
      )}
      {editMode && (
        <button
          onClick={() => {
            updateFunc(id, titleContent, mainTextContent, tagContent);
            setEditMode(false);
          }}
        >
          <IconContext.Provider value={{ size: "1.5em", className: "ml-2" }}>
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
          <IconContext.Provider value={{ size: "1.5em", className: "ml-2" }}>
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
          <IconContext.Provider value={{ size: "1.5em", className: "ml-2" }}>
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
  );

  // Main text render when editing mode is off
  const mainTextNoEdit = (
    <ReactMarkdown
      className="custom-prose prose max-w-full"
      rehypePlugins={[rehypeRaw]}
    >
      {sanitizedHTML}
    </ReactMarkdown>
  );

  // Main text render when editing mode is enabled
  const mainTextEdit = (
    <div className="flex-1">
      <QuillNoSSRWrapper
        value={mainTextContent}
        modules={quillConfigs.modules}
        formats={quillConfigs.formats}
        theme="snow"
        onChange={(e) => setMainTextContent(DOMPurify.sanitize(e))}
      />
    </div>
  );

  // Render component
  return (
    <div
      className={`flex w-full flex-col gap-2 rounded-md border
      border-silver p-2 ${delMode && `border-scarlet text-scarlet`}`}
    >
      <div className="flex max-w-full flex-row items-center gap-2">
        {icon && <div className="">{icon}</div>}
        {date && <div className="flex-none truncate text-base">{date}</div>}
        <div className="flex-none">{tagSection}</div>
        {titleContent && (
          <div className="max-w-[50em] truncate items-center flex">
            <AutosizeInput
              className={`truncate ${
                !titleUpdateDisable && editMode && `text-sky`
              }`}
              inputStyle={{ background: "transparent", maxWidth: "100%" }}
              value={titleContent}
              disabled={titleUpdateDisable || !editMode}
              onChange={(e) => setTitleContent(e.target.value)}
            />
          </div>
        )}
        {titleAppendix && (
          <div
            className={`flex w-fit flex-col text-left
                ${delMode ? `text-scarlet` : `text-darkSilver`}`}
          >
            {titleAppendix}
          </div>
        )}
        <div className="ml-auto">{editingControls}</div>
      </div>
      {!simpleEditor &&
        collapsed &&
        (!editMode ? mainTextNoEdit : mainTextEdit)}
      {simpleEditor && collapsed && (
        <TextareaAutosize
          className={`resize-none bg-transparent ${editMode && `text-sky`}`}
          value={mainTextContent}
          disabled={!editMode}
          onChange={(e) => setMainTextContent(e.target.value)}
        />
      )}
      {footnote && collapsed && !editMode && footnote}
    </div>
  );
}

// User Card definition
export function UserCard({
  id,
  name,
  rank,
  email,
  phone,
  deleteFunc = null,
  addFunc = null,
}) {
  // Define useStates
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [addConfirm, setAddConfirm] = useState(false);

  // Render card
  return (
    <div
      className="relative flex h-[320px] w-[290px] flex-col gap-5 rounded-lg
      border-2 border-silver bg-white px-4 pb-4 pt-4 shadow-md transition
      duration-200 ease-in hover:-translate-y-[0.1rem] hover:border-2
      hover:border-sky hover:shadow-sky"
    >
      <div className="relative h-[200px] w-full">
        <Image src="/logobw.png" objectFit="contain" alt="Logo" layout="fill" />
      </div>
      {(deleteFunc || addFunc) && (
        <div className="absolute right-0 top-0 flex flex-col gap-1 p-3">
          {!deleteConfirm && !addConfirm && deleteFunc && (
            <button
              className="transition duration-200 ease-in hover:text-scarlet"
              onClick={() => {
                setDeleteConfirm(true);
              }}
            >
              <IconContext.Provider value={{ size: "1.2em" }}>
                <MdLogout />
              </IconContext.Provider>
            </button>
          )}
          {!deleteConfirm && !addConfirm && addFunc && (
            <button
              className="mt-1 transition duration-200 ease-in
              hover:text-bermuda"
              onClick={() => {
                setAddConfirm(true);
              }}
            >
              <IconContext.Provider value={{ size: "1.2em" }}>
                <VscPass />
              </IconContext.Provider>
            </button>
          )}
          {deleteConfirm && (
            <button
              className="transition duration-200 ease-in hover:text-scarlet"
              onClick={() => {
                setDeleteConfirm(false);
              }}
            >
              <IconContext.Provider value={{ size: "1.2em" }}>
                <VscChromeClose />
              </IconContext.Provider>
            </button>
          )}
          {deleteConfirm && (
            <button
              className="transition duration-200 ease-in hover:text-scarlet"
              onClick={() => {
                deleteFunc(id, name);
              }}
            >
              <IconContext.Provider value={{ size: "1.2em" }}>
                <VscCheck />
              </IconContext.Provider>
            </button>
          )}
          {addConfirm && (
            <button
              className="transition duration-200 ease-in hover:text-bermuda"
              onClick={() => {
                addFunc(id, name);
              }}
            >
              <IconContext.Provider value={{ size: "1.2em" }}>
                <VscCheck />
              </IconContext.Provider>
            </button>
          )}
          {addConfirm && (
            <button
              className="transition duration-200 ease-in hover:text-bermuda"
              onClick={() => {
                setAddConfirm(false);
              }}
            >
              <IconContext.Provider value={{ size: "1.2em" }}>
                <VscChromeClose />
              </IconContext.Provider>
            </button>
          )}
        </div>
      )}
      <div className="w-full text-left text-xs">
        <div className="flex">
          <div className="mt-[3px] w-1/12">
            <IconContext.Provider value={{ size: "1.1em" }}>
              <VscPerson />
            </IconContext.Provider>
          </div>
          <div className="word-break w-11/12 break-all font-bold">{name}</div>
        </div>
        <div className="flex">
          <div className="mt-[3px] w-1/12">
            <IconContext.Provider value={{ size: "1.1em" }}>
              <VscVerifiedFilled />
            </IconContext.Provider>
          </div>
          <div className="word-break w-11/12 break-all">{rank}</div>
        </div>
        <div className="flex">
          <div className="mt-[3px] w-1/12">
            <IconContext.Provider value={{ size: "1.1em" }}>
              <VscMail />
            </IconContext.Provider>
          </div>

          <div className="word-break w-11/12 break-all">{email}</div>
        </div>
        <div className="flex">
          <div className="mt-[3px] w-1/12">
            <IconContext.Provider value={{ size: "1.1em" }}>
              <VscCallIncoming />
            </IconContext.Provider>
          </div>
          <div className="word-break w-11/12 break-all">{phone}</div>
        </div>
      </div>
    </div>
  );
}
