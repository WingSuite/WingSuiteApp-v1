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

// Key Value Card definition
export function StatCard({ keyContent, valueContent }) {
  // Render component
  return (
    <div
      className="rounded-lg border-2 px-4 py-5 text-left shadow-md"
      key={keyContent}
    >
      <div className="text-xl">{keyContent}</div>
      <div className="mt-3 text-5xl text-darkbermuda">{valueContent}</div>
    </div>
  );
}

// Button Card definition
export function ButtonCard({ text, size, setSelected, subtext = null }) {
  // Render component
  return (
    <button
      className="mb-3 rounded-lg border-2 p-1.5 text-left shadow-md"
      key={text}
      onClick={() => setSelected(text)}
    >
      <div className={`text-${size}`}>{text}</div>
      <div>{subtext}</div>
    </button>
  );
}
