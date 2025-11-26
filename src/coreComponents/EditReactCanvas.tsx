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
}

export default function EditReactCanvas({
    code,
    scope,
    showPreview = true,
    showEditor = false,
    showError = false,
    onSaveFinalCode,
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
        const { transformedCode, ast: parsedAst } =
            transformJSXTextToEditableText(code);

        // console.log(transformedCode)
        // console.log(ast)

        setEditableCode(transformedCode);
        setAst(parsedAst);
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
        const patchedCode = applyPatchesToAst(ast, patches);

        // Convert EditableText JSX back to plain JSX
        const cleanJsx = transformEditableTextToJSX(patchedCode);

        // final code save callback - ext
        if (onSaveFinalCode) onSaveFinalCode(cleanJsx);
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
