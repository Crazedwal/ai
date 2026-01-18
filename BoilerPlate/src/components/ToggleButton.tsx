import React, { useState } from "react";

export default function ToggleButton() {
  const [on, setOn] = useState(false);

  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`px-4 py-2 rounded-md transition-colors ${
        on ? "bg-sky-600 text-white" : "bg-white border text-sky-700"
      }`}
    >
      {on ? "Toggled ON" : "Toggle me"}
    </button>
  );
}
