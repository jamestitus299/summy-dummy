import React from "react";
import ReactCanvas from "../coreComponents/ReactCanvas";
import { scope } from "../scopes/Scope";

export const Page: React.FC = () => {
  return (
    <div>
      <div>
        <ReactCanvas
          scope={scope}
          code={""}
          showEditor={true}
          showError={true}
        />
      </div>
    </div>
  );
};
