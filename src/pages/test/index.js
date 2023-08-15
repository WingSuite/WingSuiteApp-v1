import { ToggleSwitch } from "@/components/input";

export default function MyApp() {
  const handleToggle = (toggleState) => {
    console.log("Toggle is now:", toggleState ? "ON" : "OFF");
  }

  return (
    <div className="p-10">
      <ToggleSwitch onToggle={handleToggle} />
    </div>
  );
}