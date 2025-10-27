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
        <ButtonText />
      </section>
      <div className="p-2">
        <ReactCanvas
          scope={scope}
          code={""}
          showEditor={true}
          showError={true}
        />
      </div>
      <EditableTextPopup
        content="title"
        element="h1"
        styles="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-96 text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent text-center"
      />
    </div>
  );
};
