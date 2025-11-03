import React from "react";
import ButtonText from "../coreComponents/ButtonText";
import ReactCanvas from "../coreComponents/ReactCanvas";
import { scope } from "../scopes/Scope";

import { Helmet } from "react-helmet";

import EditableTextPopup from "../components/editTextComponent/editText";

export const Page: React.FC = () => {
  return (
    <div>
      <Helmet defer={false}>
        <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
        {/* <link
          rel="stylesheet"
          href="https://jamestitus299.github.io/css_server/jstyles.css"
        /> */}
      </Helmet>
      <section className="p-4">
        <h2 className="text-3xl font-bold text-center">
          Try the ReactCanvas here
        </h2>
        {/* <ButtonText /> */}
      </section>
      <div className="p-2">
        <ReactCanvas
          scope={scope}
          code={""}
          showEditor={true}
          showError={true}
        />
      </div>


      <div className="mt-10 space-y-4 max-w-3xl mx-auto">

        <EditableTextPopup
          textContent="Editable Heading"
          elementType="h1"
          tailwindStyles="text-4xl font-extrabold text-center p-3 rounded bg-gradient-to-r from-purple-500 to-indigo-600 text-white cursor-pointer"
        />

        <EditableTextPopup
          textContent="Editable Subheading"
          elementType="h2"
          tailwindStyles="text-xl font-semibold p-2 rounded bg-blue-100 text-blue-700 border border-blue-300 cursor-pointer"
        />

        <EditableTextPopup
          textContent="This is an editable paragraph. Click to edit this text. Use this for descriptions, instructions, documentation, etc."
          elementType="p"
          tailwindStyles="text-base leading-relaxed p-3 bg-gray-50 border rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer"
        />

        <EditableTextPopup
          textContent="Inline highlight text"
          elementType="span"
          tailwindStyles="text-sm px-2 py-1 bg-yellow-200 rounded shadow cursor-pointer inline-block"
        />

        <EditableTextPopup
          textContent="Callout / Info Box"
          elementType="div"
          tailwindStyles="p-4 rounded-lg border border-indigo-300 bg-indigo-50 text-indigo-800 shadow-md cursor-pointer"
        />

        <EditableTextPopup
          textContent="Quote text — something meaningful."
          elementType="blockquote"
          tailwindStyles="italic text-lg border-l-4 border-gray-400 pl-4 text-gray-600 cursor-pointer"
        />

        <EditableTextPopup
          textContent="Button-like label"
          elementType="button"
          tailwindStyles="px-4 py-2 rounded-full bg-green-600 text-white text-center shadow hover:bg-green-700 cursor-pointer"
        />

        <EditableTextPopup
          textContent="Tag / Badge"
          elementType="span"
          tailwindStyles="text-xs uppercase tracking-wide px-3 py-1 bg-pink-200 text-pink-800 rounded-full cursor-pointer inline-block"
        />

        <EditableTextPopup
          textContent="Test"
          // elementType=""
        />

      </div>

    </div>
  );
};
