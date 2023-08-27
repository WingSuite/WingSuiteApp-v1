import { ToggleSwitch } from "@/components/input";

const testData = [
  { id: 1, name: "John Doe", age: 28, occupation: "Engineer" },
  { id: 2, name: "Jane Smith", age: 24, occupation: "Designer" },
  { id: 3, name: "Bob Johnson", age: 30, occupation: "Manager" },
];

export default function TestTable () {
  return (
    <div className="mx-auto mt-8 w-4/5">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="bg-gray-200 border p-2">ID</th>
            <th className="bg-gray-200 border p-2">Name</th>
            <th className="bg-gray-200 border p-2">Age</th>
            <th className="bg-gray-200 border p-2">Occupation</th>
          </tr>
        </thead>
        <tbody>
          {testData.map((row) => (
            <tr key={row.id}>
              <td className="border p-2">{row.id}</td>
              <td className="border p-2">{row.name}</td>
              <td className="border p-2">{row.age}</td>
              <td className="border p-2">{row.occupation}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
