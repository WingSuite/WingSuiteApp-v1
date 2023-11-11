import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import QuillNoSSRWrapper from "@/components/editor";
import "quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

export default function Home() {
  const [imageSrc, setImageSrc] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      alert("ile size should not exceed 5 MB");
      return;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "none" }}
        id="fileInput"
      />
      <button onClick={() => document.getElementById("fileInput").click()}>
        Upload Image
      </button>
      {imageSrc && (
        <div
          className="flex h-64 w-64 items-center justify-center overflow-hidden
          rounded-full bg-sky"
          style={{
            backgroundImage: `url('${imageSrc}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      )}
    </div>
  );
}
