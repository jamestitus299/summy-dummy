import React from "react";
import ReactCanvas from "../coreComponents/ReactCanvas";
import { scope } from "../scopes/Scope";
import { Helmet, HelmetProvider } from 'react-helmet-async';

export const SReactCanvas: React.FC = () => {
    return (
        <HelmetProvider>
            <Helmet>
                <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
            </Helmet>
            <ReactCanvas
                scope={scope}
                code={""}
                showEditor={true}
                showError={true}
            />
        </HelmetProvider>

    );
};
