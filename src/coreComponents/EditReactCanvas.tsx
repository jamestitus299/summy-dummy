import React, { useEffect, useMemo, useState, useCallback } from "react";

import { install } from "@twind/core";
import presetTailwind from "@twind/preset-tailwind";

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

const TWIND_FLAG = "__TWIND_INIT__";

export interface ReactCanvasProps {
    code: string;
    scope?: Record<string, any>;
    showPreview?: boolean;
    showEditor?: boolean;
    showError?: boolean;

    // NEW: call parent when final JSX is saved
    onSaveFinalCode?: (jsxCode: string) => void;
}

export default function EditReactCanvas({
    code,
    scope,
    showPreview = true,
    showEditor = false,
    showError = false,
    onSaveFinalCode,
}: ReactCanvasProps) {
    // STATE
    const [mode, setMode] = useState<"view" | "edit">("view");
    const [editableCode, setEditableCode] = useState(code);
    const [ast, setAst] = useState<any>(null);
    const [patches, setPatches] = useState<Record<string, string>>({});

    // // patches debug
    // useEffect(() => {
    //     console.log("PATCHES UPDATED:", patches);
    // }, [patches]);

    // Tailwind css - twind
    useEffect(() => {
        if (typeof window === "undefined") return;
        if (!(window as any)[TWIND_FLAG]) {
            install({ presets: [presetTailwind()] }, true);
            (window as any)[TWIND_FLAG] = true;
        }
    }, []);

    // EXPOSE A HANDLER FOR EDITABLETEXT  PATCHES
    // EditableText uses this to report changes
    const registerPatch = useCallback((textNodeId: string, newText: string) => {
        setPatches((prev) => ({
            ...prev,
            [textNodeId]: newText,
        }));
    }, []);

    const finalScope = useMemo(
        () => ({
            ...defaultscope,
            ...scope,
            __applyEditableTextPatch: registerPatch, // expose to EditableText
        }),
        [scope, registerPatch]
    );

    // HANDLE EDIT MODE
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

    // ===== HANDLE SAVE MODE =====
    const saveChanges = () => {
        if (!ast) return;

        // Apply patches to the stored AST
        const patchedCode = applyPatchesToAst(ast, patches);

        // Convert EditableText JSX back to plain JSX
        const cleanJsx = transformEditableTextToJSX(patchedCode);

        // Update editor
        setEditableCode(cleanJsx);
        setMode("view");

        // final code save callback - ext
        if (onSaveFinalCode) onSaveFinalCode(cleanJsx);
    };

    return (
        <div className="border rounded-lg p-4 space-y-2">
            {/* === Buttons === */}
            <div className="flex gap-2 mb-2">
                {mode === "view" ? (
                    <button
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                        onClick={startEditing}
                    >
                        Edit
                    </button>
                ) : (
                    <button
                        className="px-3 py-1 bg-green-600 text-white rounded"
                        onClick={saveChanges}
                    >
                        Save
                    </button>
                )}
            </div>

            {/* === Live Preview Editor === */}
            <LiveProvider code={editableCode} scope={finalScope}>
                {showPreview && <LivePreview />}
                {showError && <LiveError />}
                {showEditor && <LiveEditor />}
            </LiveProvider>
        </div>
    );
}
