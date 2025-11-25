import React from "react";
import ReactCanvas from "../coreComponents/ReactCanvas";
import { scope } from "../scopes/Scope";
import { Helmet } from "react-helmet";

export const SReactCanvas: React.FC = () => {
    return (
        <div>
            <Helmet>
                <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            </Helmet>
            <ReactCanvas
                scope={scope}
                code={""}
                showEditor={true}
                showError={true}
            />
        </div>

    );
};
