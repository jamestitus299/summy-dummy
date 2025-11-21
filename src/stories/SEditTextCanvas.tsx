import React, { useState } from "react";
import { scope } from "../scopes/Scope";
import EditReactCanvas from "../coreComponents/EditReactCanvas";

const defaultCode = `
export default function SampleTextComponent() {
  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md space-y-4">
      <h1 className="text-3xl font-bold text-gray-900">
        Welcome to the Interactive Editor
      </h1>

      <p className="text-gray-700 leading-relaxed">
        This is an example paragraph filled with text. You can click on any of
        the text elements to edit them live. The system automatically transforms
        JSX text nodes into editable components, preserving both structure and
        styling.
      </p>

      <p className="text-gray-700 leading-relaxed">
        Try editing headings, paragraphs, inline elements, or nested components.
        The changes will be collected as patches and applied back to the
        original JSX source code when you click the save button.
      </p>

      <h2 className="text-xl font-semibold text-gray-800 mt-4">
        Features of This Editor
      </h2>

      <ul className="list-disc pl-6 text-gray-700 space-y-2">
        <li>You can edit text inline with full React rendering.</li>
        <li>Each text node is tracked and updated through a patch system.</li>
        <li>Nested text content is preserved and rehydrated correctly.</li>
        <li>The final code is reconstructed back to valid JSX.</li>
      </ul>

      <p className="text-gray-700 leading-relaxed mt-4">
        Feel free to modify any text you see here. This example is intentionally
        text-heavy so you have plenty to work with.
      </p>

      <small className="text-gray-600">
        Created for demonstration purposes.
      </small>
    </div>
  );
}
`;

export const SEditTextCanvas: React.FC = () => {
  const [code, setCode] = useState(defaultCode);
  const [inputValue, setInputValue] = useState(defaultCode);

  const applyCode = () => {
    setCode(inputValue);
  };

  return (
    <div className="space-y-6 p-4">
      {/* Input box */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">Set Component Code:</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm"
          rows={10}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button
          onClick={applyCode}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Set Code
        </button>
      </div>

      {/* The editor canvas */}
      <EditReactCanvas
        key={code}
        scope={scope}
        code={code}
        showEditor={true}
        showError={true}
      />
    </div>
  );
};
