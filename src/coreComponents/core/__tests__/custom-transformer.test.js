// tests for transformer

import _traverse from "@babel/traverse";

import {
    transformJSXTextToEditableText,
    transformEditableTextToJSX,
    applyPatchesToAst
} from "../custom-transformer"

const traverse = _traverse.default || _traverse;

describe("JSX Transformer Logic", () => {
    // ----------------------------------------------------------------
    // Test transformJSXTextToEditableText (Forward Transformation)
    // ----------------------------------------------------------------
    describe("transformJSXTextToEditableText", () => {
        it("should transform a simple h1 tag into an EditableText component", () => {
            const input = `<h1>Hello World</h1>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            // Expect self-closing because it has only 1 child (text)
            expect(transformedCode).toContain("EditableText");
            expect(transformedCode.replace(/\\/g, "")).toContain('textContent={"Hello World"}');
            expect(transformedCode).toContain('elementType="h1"');
        });

        it("should transform className attributes to tailwindStyles", () => {
            const input = `<p className="text-red-500 font-bold">Error</p>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            expect(transformedCode).toContain('tailwindStyles="text-red-500 font-bold"');
            expect(transformedCode).not.toContain("className=");
        });

        it("should preserve other attributes (e.g., id, data-*)", () => {
            const input = `<span id="unique-id" data-test="value">Content</span>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            expect(transformedCode).toContain('id="unique-id"');
            expect(transformedCode).toContain('data-test="value"');
        });

        it("should detect multiline text based on word count threshold", () => {
            // Default threshold is 8 words
            const longText = "one two three four five six seven eight nine";
            const input = `<p>${longText}</p>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            expect(transformedCode).toContain("multiline={true}");
        });

        it("should not mark short text as multiline", () => {
            const shortText = "one two three";
            const input = `<p>${shortText}</p>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            expect(transformedCode).not.toContain("multiline={true}");
        });

        it("should ignore non-target tags (e.g., div)", () => {
            // target tags can be found in the code - targetTags
            const input = `<div>Hello World</div>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            // Should remain a div, not become EditableText
            expect(transformedCode).not.toContain("EditableText");
            expect(transformedCode).toContain("<div>Hello World</div>");
        });

        it("should handle quoted text content", () => {
            const input = `<h1>"james - titus * james"</h1>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            expect(transformedCode).toContain("<EditableText");
            expect(transformedCode.replace(/\\/g, "")).toContain('textContent={"\"james - titus * james\""}');
        });

        it("should handle nested mixed content", () => {
            // <span> contains "Hello " (text) and <p> (element)
            const input = `<span>Hello <p>World</p></span>`;

            // The logic: wrapChildren=true && children > 1 -> wraps them
            const { transformedCode } = transformJSXTextToEditableText(input);

            expect(transformedCode).toContain("<EditableText");
            expect(transformedCode).toContain("</EditableText>");
            expect(transformedCode).toContain('textContent={"World"}');
            expect(transformedCode).toContain('textContent={"Hello"}');
        });

        it("should handle proper text_node_id creation and assignment", () => {
            const input = `<>
                <h2>James</h2>
                <h2>Titus</h2>
                <h2>h</h2>
                </>
            `;

            const { ast } = transformJSXTextToEditableText(input);

            // Extract actual text_node_id values from AST
            const textNodeIds = [];

            traverse(ast, {
                JSXText(path) {
                    const id = path.node.extra?.textNodeId;
                    if (id) {
                        textNodeIds.push(id);
                    }
                }
            });

            // Ensure 3 distinct IDs were generated
            expect(textNodeIds.length).toBe(3);
            expect(textNodeIds).toContain("text_node_1");
            expect(textNodeIds).toContain("text_node_2");
            expect(textNodeIds).toContain("text_node_3");
            expect(textNodeIds).not.toContain("text_node_4");

            // Ensure uniqueness
            const unique = new Set(textNodeIds);
            expect(unique.size).toBe(3);
        });

        it("should attach nodeId and __applyEditableTextPatch props to EditableText", () => {
            const input = `<h1>Hello World</h1>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            // nodeId always = text_node_X
            expect(transformedCode).toMatch(/nodeId="text_node_\d+"/);

            // patch callback binding
            expect(transformedCode).toContain(
                `__applyEditableTextPatch={__applyEditableTextPatch}`
            );
        });

        it("should not swap arguments when binding __applyEditableTextPatch", () => {
            const input = `<h1>Hello Titus</h1>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            // we only verify JSX contains correct structure
            // EditableText receives nodeId and function separately
            expect(transformedCode).toContain(`nodeId="text_node_`);
            expect(transformedCode).toContain(
                `__applyEditableTextPatch={__applyEditableTextPatch}`
            );
        });

        it("should not inject __applyEditableTextPatch into non-target tags", () => {
            const input = `<div>Hello</div>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            expect(transformedCode).not.toContain("__applyEditableTextPatch");
        });

        it("should preserve __applyEditableTextPatch for nested EditableText components", () => {
            const input = `<span>Hello <p>World</p></span>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            const count = (transformedCode.match(/__applyEditableTextPatch/g) || []).length;

            // Expect 4: one for span, one for p - applied as __applyEditableTextPatch={__applyEditableTextPatch} 
            expect(count).toBe(4);
        });

        it("should preserve original attributes while adding nodeId and patch props", () => {
            const input = `<p id="xx" data-x="y" className="text-lg">Hi</p>`;
            const { transformedCode } = transformJSXTextToEditableText(input);

            expect(transformedCode).toContain('id="xx"');
            expect(transformedCode).toContain('data-x="y"');
            expect(transformedCode).toContain('tailwindStyles="text-lg"');
            expect(transformedCode).toMatch(/nodeId="text_node_\d+"/);
            expect(transformedCode).toContain("__applyEditableTextPatch={__applyEditableTextPatch}");
        });
    });

    // ----------------------------------------------------------------
    // Test transformEditableTextToJSX (Reverse Transformation)
    // ----------------------------------------------------------------
    describe("transformEditableTextToJSX", () => {
        it("should revert EditableText back to the original element type", () => {
            const input = `<EditableText elementType="h1" textContent={"Back to Normal"} />`;
            const output = transformEditableTextToJSX(input);

            expect(output).toContain("<h1>Back to Normal</h1>");
            expect(output).not.toContain("EditableText");
        });

        it("should revert tailwindStyles back to className", () => {
            const input = `<EditableText elementType="p" tailwindStyles="text-blue-500" textContent={"Styled"} />`;
            const output = transformEditableTextToJSX(input);

            expect(output).toContain('className="text-blue-500"');
            expect(output).toMatch(/className="text-blue-500"/);
        });

        it("should restore children if they exist in the EditableText wrapper", () => {
            const input = `
        <EditableText elementType="span" textContent={"Hello"}>
          Hello <b>World</b>
        </EditableText>
      `;
            const output = transformEditableTextToJSX(input);

            expect(output).toContain("<span>");
            expect(output).toContain("<b>World</b>");
        });

        it("should handle multiline prop (ignoring it in output)", () => {
            const input = `<EditableText elementType="p" textContent={"Long text"} multiline={true} />`;
            const output = transformEditableTextToJSX(input);

            expect(output).toContain("<p>Long text</p>");
            expect(output).not.toContain("multiline");
        });
    });

    // ----------------------------------------------------------------
    // Round Trip Integration Test
    // ----------------------------------------------------------------
    describe("Round Trip (Integration)", () => {
        it("should result in the same structure after transforming and reverting", () => {
            const original = `<h2 className="heading">Title</h2>`;

            const { transformedCode } = transformJSXTextToEditableText(original);
            const reverted = transformEditableTextToJSX(transformedCode);

            // Clean up whitespace/semicolons for comparison
            const cleanOriginal = original.replace(/\s+/g, "");
            const cleanReverted = reverted.replace(/;\s*$/, "").replace(/\s+/g, "");

            expect(cleanReverted).toEqual(cleanOriginal);
        });

        it("should result in the same structure after transforming and reverting", () => {
            const original = `<span className="font-black">{index + 1}/{slides.length}</span>`;

            const { transformedCode } = transformJSXTextToEditableText(original);
            const reverted = transformEditableTextToJSX(transformedCode);

            // Clean up whitespace/semicolons for comparison
            const cleanOriginal = original.replace(/\s+/g, "");
            const cleanReverted = reverted.replace(/;\s*$/, "").replace(/\s+/g, "");

            expect(cleanReverted).toEqual(cleanOriginal);
        });

        it("should handle multiple nested tailwind css styles after transforming and reverting", () => {
            const original = `<h2 className="text-red-400">James <h2 className="text-green-400" >Titus <h2 className="text-purple-400">h</h2></h2></h2>`;

            const { transformedCode } = transformJSXTextToEditableText(original);
            const reverted = transformEditableTextToJSX(transformedCode);

            // Clean up whitespace/semicolons for comparison
            const cleanOriginal = original.replace(/\s+/g, "");
            const cleanReverted = reverted.replace(/;\s*$/, "").replace(/\s+/g, "");

            expect(cleanReverted).toEqual(cleanOriginal);
        });
    });


    // ----------------------------------------------------------------
    // Apply Text Update Patch Test
    // ----------------------------------------------------------------
    describe("applyPatchesToAst", () => {
        it("should update a single text node when patch ID matches", () => {
            const input = `<h2>Hello</h2>`;
            const { ast } = transformJSXTextToEditableText(input);

            const patches = {
                "text_node_1": "Updated Text"
            };

            const patchedCode = applyPatchesToAst(ast, patches);
            expect(patchedCode).toContain("Updated Text");
        });

        it("should update multiple text nodes correctly", () => {
            const input = `
      <>
        <h2>James</h2>
        <h2>Titus</h2>
      </>
    `;

            const { ast } = transformJSXTextToEditableText(input);

            const patches = {
                "text_node_1": "Jimmy",
                "text_node_2": "Oliver",
            };

            const patchedCode = applyPatchesToAst(ast, patches);

            expect(patchedCode).toContain("Jimmy");
            expect(patchedCode).toContain("Oliver");
        });

        it("should ignore patches if no node IDs match", () => {
            const input = `<h2>Hello</h2>`;
            const { ast } = transformJSXTextToEditableText(input);

            const patches = {
                "text_node_1": "NoMatch",
            };

            const output = applyPatchesToAst(ast, patches);

            // original value should remain
            expect(output).toContain("Hello");
        });

        it("should return unchanged code if patches object is empty", () => {
            const input = `<h2>Hello World</h2>`;
            const { ast } = transformJSXTextToEditableText(input);

            const output = applyPatchesToAst(ast, {});

            expect(output).toContain("Hello World");
        });

        it("should preserve correct JSX structure after patch and reverse transform", () => {
            const input = `<h2 className="title">James</h2>`;
            const { ast } = transformJSXTextToEditableText(input);

            const patched = applyPatchesToAst(ast, { "text_node_1": "Updated!" });
            const reversed = transformEditableTextToJSX(patched);

            expect(reversed).toContain("<h2");
            expect(reversed).toContain("Updated!");
            expect(reversed).toContain('className="title"');
        });
    });

});


describe("End-to-End Patching Flow", () => {
    it("should apply patches and convert back to clean JSX", () => {
        const originalCode = `
      <>
        <h2>James</h2>
        <h2>Titus</h2>
        <h2>h</h2>
      </>
    `;

        // Step 1 — forward transform
        const { ast } = transformJSXTextToEditableText(originalCode);

        // Step 2 — patches
        const patches = {
            text_node_1: "Jimmy",
            text_node_2: "\"Oliver\"",
            text_node_3: "**ddf**"
        };

        const patchedEditableCode = applyPatchesToAst(ast, patches);

        // Expect patched code to contain new updated text
        expect(patchedEditableCode).toContain("Jimmy");
        expect(patchedEditableCode).toContain("Oliver");
        expect(patchedEditableCode).toContain("**ddf**");

        // Step 3 — reverse transform back to clean JSX
        const finalCleanCode = transformEditableTextToJSX(patchedEditableCode);

        // Validate output
        expect(finalCleanCode).toContain("<h2>Jimmy</h2>");
        expect(finalCleanCode.replace(/\\/g, "")).toContain("<h2>\"Oliver\"</h2>");
        expect(finalCleanCode).toContain("<h2>**ddf**</h2>");

        // Should not contain EditableText anymore
        expect(finalCleanCode).not.toContain("EditableText");
    });
});
