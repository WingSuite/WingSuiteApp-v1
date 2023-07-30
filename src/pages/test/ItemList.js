import { useContext } from "react";
import { AppContext } from "./context";

export function ItemList() {
  const { data, variable, setVariable } = useContext(AppContext);

  return (
    <div>
      Variable: {variable}
      <ul>
        {data.items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button onClick={() => setVariable(variable + 1)}>
        Increment Variable
      </button>
      <div>{((e) => {return "1: " + e} )("YT")}</div>
    </div>
  );
}
