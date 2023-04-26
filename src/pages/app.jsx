export default function App() {
  return (
    <div className="w-full h-screen grid grid-cols-5 gap-2">
      {/* 1/5 of the screen */}
      <div className="col-span-1 h-full flex flex-col max-h-screen bg-slate-300 bg-opacity-20">
        <div className="flex-1 overflow-y-auto">
          {/* List of items */}
          {/* Replace this with your actual list */}
          <ul className="h-full overflow-y-auto ">
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
            <li className="p-4 border-b">Item 1</li>
          </ul>
        </div>
        <div className="p-4 bg-slate-500 ">
          {/* Small nav */}
          <ul className="grid gap-4">
            <li>Account</li>
            <li>Settings</li>
            <li>etc.</li>
          </ul>
        </div>
      </div>

      {/* 2/5 of the screen */}
      <div className="col-span-2 h-full grid grid-rows-2 gap-2">
        <div className="row-span-1 bg-green-500 bg-opacity-20 ">{/* Upper half */}</div>
        <div className="row-span-1 bg-blue-500 bg-opacity-20 ">{/* Lower half */}</div>
      </div>

      {/* 2/5 of the screen */}
      <div className="col-span-2 h-full grid grid-rows-2 gap-2">
        <div className="row-span-1 bg-yellow-500 bg-opacity-20 ">{/* Upper half */}</div>
        <div className="row-span-1 bg-red-500 bg-opacity-20 ">{/* Lower half */}</div>
      </div>
    </div>
  );
}
