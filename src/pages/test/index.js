import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
import "quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function Home() {
  const [editorContent, setEditorContent] = useState("");
  const [sanitizedHTML, setSanitizedHTML] = useState("");

  useEffect(() => {
    setSanitizedHTML(DOMPurify.sanitize(editorContent));
  }, [editorContent]);

  const modules = {
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
  };

  const formats = [
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
  ];

  const handleEditorChange = (content, delta, source, editor) => {
    setEditorContent(editor.getHTML());
  };

  return (
    <div className="p-10">
      <div className="h-[50vh]">
        <QuillNoSSRWrapper
          modules={modules}
          formats={formats}
          theme="snow"
          onChange={handleEditorChange}
          style={{ height: "100%" }}
        />
      </div>
      <div className="mt-20">
        <ReactMarkdown
          className="custom-prose prose"
          rehypePlugins={[rehypeRaw]}
        >
          {sanitizedHTML}
        </ReactMarkdown>
      </div>
    </div>
  );
}
