import React, { useEffect, useMemo, useState, useCallback } from "react";

import { LiveProvider } from "./core/LiveProvider";
import { LiveEditor } from "./core/LiveEditor";
import { LiveError } from "./core/LiveError";
import { LivePreview } from "./core/LivePreview";

import { scope as defaultscope } from "../scopes/Scope";

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
}

export default function EditReactCanvas({
    code,
    scope,
    showPreview = true,
    showEditor = false,
    showError = false,
    onSaveFinalCode,
    onError,
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
        // console.log(code)
        //@ts-ignore
        const { transformedCode, ast, error } = transformJSXTextToEditableText(code);
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

        // final code save callback - ext
        if (onSaveFinalCode) onSaveFinalCode(transformedCode);
    };

    return (
        <div>
            <LiveProvider code={editableCode} scope={finalScope}>
                {showPreview && <LivePreview id="react-code-canas-edit-text" />}
                {showError && <LiveError />}
                {showEditor && <LiveEditor />}
            </LiveProvider>
        </div>
    );
}
