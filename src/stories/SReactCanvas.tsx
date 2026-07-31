import React from "react";
import ReactCanvas from "../coreComponents/ReactCanvas";
import { HelmetProvider } from 'react-helmet-async';

function CanvasErrorBanner({ message, onDismiss }: { message: string; onDismiss?: () => void }) {
  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        top: 16,
        right: 16,
        zIndex: 1000,
        maxWidth: 420,
        padding: '12px 14px',
        borderRadius: 8,
        border: '1px solid #fca5a5',
        background: '#fef2f2',
        color: '#991b1b',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 4 }}>Could not render</strong>

      {/* Keep the message in #react-code-error if you scrape it — see the note below */}
      <pre
        id="react-code-error"
        style={{ margin: 0, fontSize: 12, whiteSpace: 'pre-wrap', background: 'none', border: 'none', padding: 0 }}
      >
        {message}
      </pre>

      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss error">
          Dismiss
        </button>
      )}
    </div>
  );
}

// Tailwind CDN loads globally via .storybook/preview-head.html, not per-story.
export const SReactCanvas: React.FC = () => {
    return (
        <HelmetProvider>
            <ReactCanvas
                code={""}
                showEditor={true}
                showError={true}
                persistKey="dev-canvas-299"
                errorComponent={(message, dismiss) => (
                    <CanvasErrorBanner message={message} onDismiss={dismiss} />
                )}
            />
        </HelmetProvider>

    );
};
