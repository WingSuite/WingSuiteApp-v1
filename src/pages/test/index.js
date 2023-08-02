import { useContext } from "react";
import { AppProvider, AppContext } from "./context";
import { ItemList } from "./ItemList";

export default function TestPage() {

  return (
    <AppProvider>
      <h1>Test Page</h1>
      <ItemList />
    </AppProvider>
  );
}