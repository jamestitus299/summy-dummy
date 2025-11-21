import React from "react";
import ReactCanvas from "../coreComponents/ReactCanvas";
import { scope } from "../scopes/Scope";

export const SReactCanvas: React.FC = () => {
    return (
        <div>
            <ReactCanvas
                scope={scope}
                code={""}
                showEditor={true}
                showError={true}
            />
        </div>

    );
};
