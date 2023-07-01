import AutosizeInput from "react-input-autosize";
import { useState, useEffect } from "react";

export default function Home() {
  const [text, setText] = useState("Text");

  return (
    <div className="h-screen w-full">
      <AutosizeInput
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
}
