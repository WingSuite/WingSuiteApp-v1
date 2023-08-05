// React Icons
import { VscError } from "react-icons/vsc";
import { IconContext } from "react-icons";

export function Nothing({
  mainText,
  subText,
  icon = <VscError />,
  marginFlag = true,
}) {
  // Return component content
  return (
    <div
      className="flex h-full w-full flex-col items-center justify-center
      rounded-lg border-2 border-dashed text-deepOcean p-3"
    >
      <IconContext.Provider
        value={{ size: "5em", className: `${marginFlag ? `mb-3` : ``}` }}
      >
        {icon}
      </IconContext.Provider>
      <div className="text-xl">{mainText}</div>
      <div className="text-md flex items-center justify-center">{subText}</div>
    </div>
  );
}
