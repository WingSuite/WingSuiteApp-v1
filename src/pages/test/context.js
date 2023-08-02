import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [variable, setVariable] = useState(0);

  useEffect(() => {
    var a = 0;
  }, []);

  const data = {
    items: [
      { id: 1, name: "Item 1" },
      { id: 2, name: "Item 2" },
      { id: 3, name: "Item 3" },
      { id: 4, name: "Item 4" },
      { id: 5, name: "Item 5" },
      { id: 6, name: "Item 6" },
      { id: 7, name: "Item 7" },
    ],
  };

  return (
    <AppContext.Provider
      value={{
        data,
        variable,
        setVariable
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
