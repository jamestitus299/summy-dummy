import React, { useEffect, useMemo, useState, useCallback } from "react";

import { LiveProvider } from "./core/LiveProvider";
import { LiveEditor } from "./core/LiveEditor";
import { LiveError } from "./core/LiveError";
import { LivePreview } from "./core/LivePreview";
import { LiveLoadingOverlay } from "./core/LiveLoadingOverlay";

import { scope as defaultscope } from "../scopes/Scope";
import { readStored, writeStored } from "./core/storage";

import {
    transformJSXTextToEditableText,
    transformEditableTextToJSX,
    applyPatchesToAst,
} from "../coreComponents/core/custom-transformer";

export interface EditReactCanvasProps {
    code: string;
    scope?: Record<string, any>;
    showPreview?: boolean;
    showEditor?: boolean;
    showError?: boolean;

    // call parent when final JSX is saved - external callback
    onSaveFinalCode?: (jsxCode: string) => void;
    onError?: (error: string) => void;

    /** localStorage key to persist the final saved JSX across reloads; omit to disable */
    persistKey?: string;
    /** called whenever the final JSX changes (alongside onSaveFinalCode) */
    onCodeChange?: (jsxCode: string) => void;
    /** full-page overlay shown until the first successful render. Defaults to
     * `!showEditor` -- see the same note on ReactCanvasProps.showLoader. */
    showLoader?: boolean;
    /** replace the default spinner overlay with a custom node */
    loader?: React.ReactNode;
    /** replaces the built-in error toast. Pass a node, or a function receiving
     * the error message. Requires `showError`. */
    errorComponent?:
        | React.ReactNode
        | ((error: string, dismiss: () => void) => React.ReactNode);
    /** show a dismiss button on the built-in error toast; true by default */
    dismissibleError?: boolean;
}

export default function EditReactCanvas({
    code,
    scope,
    showPreview = true,
    showEditor = false,
    showError = false,
    onSaveFinalCode,
    onError,
    persistKey,
    onCodeChange,
    showLoader = !showEditor,
    loader,
    errorComponent,
    dismissibleError = true,
}: EditReactCanvasProps) {
    const [mode, setMode] = useState<"view" | "edit">("edit");
    const [editableCode, setEditableCode] = useState(code);
    const [ast, setAst] = useState<any>(null);
    const [patches, setPatches] = useState<Record<string, string>>({});

    // // patches debug
    // useEffect(() => {
    //     console.log("PATCHES UPDATED:", patches);
    // }, [patches]);

    // expose a callback for edittext patches
    // EditableText uses this to patch changes
    const registerPatch = useCallback((textNodeId: string, newText: string) => {
        setPatches((prev) => ({
            ...prev,
            [textNodeId]: newText,
        }));
    }, []);

    // save whenever patches change
    useEffect(() => {
        if (mode === "edit" && Object.keys(patches).length > 0) {
            saveChanges();
        }
    }, [patches]);

    const finalScope = useMemo(
        () => ({
            ...defaultscope,
            ...(scope ?? {}),
            __applyEditableTextPatch: registerPatch, // expose to EditableText, apply edit patches callback
        }),
        [scope, registerPatch]
    );

    // set up edit mode
    const startEditing = () => {
        // Restore a previously persisted final JSX if present, else use the prop.
        const sourceCode = readStored(persistKey) ?? code;
        //@ts-ignore
        const { transformedCode, ast, error } = transformJSXTextToEditableText(sourceCode);
        // if error - onError callback if exist, return
        if (error) {
            if (onError) {
                onError(error);
            }
            return
        }
        // console.log(transformedCode)
        // console.log(ast)

        setEditableCode(transformedCode);
        setAst(ast);
        setPatches({});
        setMode("edit");
    };

    // Start edit mode on mount - edit mode by default
    useEffect(() => {
        startEditing();
    }, []);


    // handle changes on save - apply patches
    const saveChanges = () => {
        if (!ast) return;

        // Apply patches to the stored AST
        //@ts-ignore
        var { transformedCode, error } = applyPatchesToAst(ast, patches);
        if (error) {
            if (onError) {
                // Check if it's an Error object, otherwise cast to string
                const errorMessage = error instanceof Error ? error.message : String(error);
                onError(errorMessage);
            }
            return
        }

        // Convert EditableText JSX back to plain JSX
        //@ts-ignore
        var { transformedCode, error } = transformEditableTextToJSX(transformedCode);
        if (error) {
            if (onError) {
                onError(error);
            }
            return
        }

        // persist the final JSX and notify listeners
        writeStored(persistKey, transformedCode);
        onCodeChange?.(transformedCode);

        // final code save callback - ext
        if (onSaveFinalCode) onSaveFinalCode(transformedCode);
    };

    const renderError = errorComponent
        ? (message: string, dismiss: () => void) =>
            typeof errorComponent === "function"
                ? errorComponent(message, dismiss)
                : errorComponent
        : undefined;

    return (
        // `relative` is kept so a caller overriding the toast via containerStyle to
        // position:absolute anchors it to the canvas rather than the page.
        <div style={{ position: "relative" }}>
            <LiveProvider
                code={editableCode}
                scope={finalScope}
                onError={onError}
                deferFirstRender={showLoader}
            >
                {showLoader && (
                    <LiveLoadingOverlay
                        id="react-code-loader"
                        render={loader ? () => loader : undefined}
                    />
                )}
                {showPreview && <LivePreview id="react-code-canas-edit-text" />}
                {showError && <LiveError id="react-code-error" render={renderError} dismissible={dismissibleError} />}
                {showEditor && <LiveEditor />}
            </LiveProvider>
        </div>
    );
}
