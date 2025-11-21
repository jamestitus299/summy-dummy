import React from "react";
import { scope } from "../scopes/Scope";
import EditReactCanvas from "../coreComponents/EditReactCanvas"

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
`

export const SEditTextCanvas: React.FC = () => {
  return (
    <div>
      <EditReactCanvas
        scope={scope}
        code={defaultCode}
        showEditor={true}
        showError={true}
      />
    </div>
  );
};
