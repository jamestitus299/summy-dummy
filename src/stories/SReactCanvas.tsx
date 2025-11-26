import React from "react";
import ReactCanvas from "../coreComponents/ReactCanvas";
import { scope } from "../scopes/Scope";
import { Helmet, HelmetProvider } from 'react-helmet-async';

export const SReactCanvas: React.FC = () => {
    return (
        <HelmetProvider>
            <Helmet>
                <script src="https://cdn.tailwindcss.com"></script>
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
