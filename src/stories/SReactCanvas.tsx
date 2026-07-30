import React from "react";
import ReactCanvas from "../coreComponents/ReactCanvas";
import { scope } from "../scopes/Scope";
import { HelmetProvider } from 'react-helmet-async';

// Tailwind CDN loads globally via .storybook/preview-head.html, not per-story.
export const SReactCanvas: React.FC = () => {
    return (
        <HelmetProvider>
            <ReactCanvas
                scope={scope}
                code={""}
                showEditor={true}
                showError={true}
                persistKey="dev-canvas-299"
            />
        </HelmetProvider>

    );
};
