// components/DynamicQuill.js
import dynamic from "next/dynamic";

// Define the Quill editor
const QuillNoSSRWrapper = dynamic(
  () => import("react-quill"),
  {
    ssr: false,
    loading: () => <p>Loading ...</p>,
  }
);

// Export the Quill editor
export default QuillNoSSRWrapper;