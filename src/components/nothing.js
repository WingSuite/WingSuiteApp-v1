// React Icons
import { VscError } from "react-icons/vsc";
import { IconContext } from "react-icons";

export function Nothing({ mainText, subText, icon = <VscError /> }) {
  // Return component content
  return (
    <div
      className="text-deepOcean flex h-full w-full flex-col items-center
      justify-center rounded-lg"
    >
      <IconContext.Provider value={{ size: "5em", className: "mb-3" }}>
        {icon}
      </IconContext.Provider>
      <div className="text-xl">{mainText}</div>
      <div className="text-md flex items-center justify-center">{subText}</div>
    </div>
  );
}
