// Import
import { Html, Head, Main, NextScript } from "next/document";
import { config } from "@/config/config";

// Page rendering
export default function Document() {
  return (
    <Html lang="en">
      <Head/>
      <body className="max-h-screen">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
