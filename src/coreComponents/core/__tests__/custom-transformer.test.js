import { transformJSXTextToEditableText, transformEditableTextToJSX } from "../custom-transformer"

describe("JSX Transformer Logic", () => {
    // ----------------------------------------------------------------
    // 1. Test transformJSXTextToEditableText (Forward Transformation)
    // ----------------------------------------------------------------
    describe("transformJSXTextToEditableText", () => {
        it("should transform a simple h1 tag into an EditableText component", () => {
            const input = `<h1>Hello World</h1>`;
            const output = transformJSXTextToEditableText(input);

            // Expect self-closing because it has only 1 child (text)
            expect(output).toContain("EditableText");
            expect(output.replace(/\\/g, "")).toContain('textContent={"Hello World"}');
            expect(output).toContain('elementType="h1"');
        });

        it("should transform className attributes to tailwindStyles", () => {
            const input = `<p className="text-red-500 font-bold">Error</p>`;
            const output = transformJSXTextToEditableText(input);

            expect(output).toContain('tailwindStyles="text-red-500 font-bold"');
            expect(output).not.toContain("className=");
        });

        it("should preserve other attributes (e.g., id, data-*)", () => {
            const input = `<span id="unique-id" data-test="value">Content</span>`;
            const output = transformJSXTextToEditableText(input);

            expect(output).toContain('id="unique-id"');
            expect(output).toContain('data-test="value"');
        });

        it("should detect multiline text based on word count threshold", () => {
            // Default threshold is 8 words
            const longText = "one two three four five six seven eight nine";
            const input = `<p>${longText}</p>`;
            const output = transformJSXTextToEditableText(input);

            expect(output).toContain("multiline={true}");
        });

        it("should not mark short text as multiline", () => {
            const shortText = "one two three";
            const input = `<p>${shortText}</p>`;
            const output = transformJSXTextToEditableText(input);

            expect(output).not.toContain("multiline={true}");
        });

        it("should ignore non-target tags (e.g., div)", () => {
            // target tags can be found in the code - targetTags
            const input = `<div>Hello World</div>`;
            const output = transformJSXTextToEditableText(input);

            // Should remain a div, not become EditableText
            expect(output).not.toContain("EditableText");
            expect(output).toContain("<div>Hello World</div>");
        });

        it("should handle quoted text content", () => {
            const input = `<h1>"james - titus * james"</h1>`;
            const output = transformJSXTextToEditableText(input);

            expect(output).toContain("<EditableText");
            expect(output.replace(/\\/g, "")).toContain('textContent={"\"james - titus * james\""}');
        });

        it("should handle nested mixed content", () => {
            // <span> contains "Hello " (text) and <p> (element)
            const input = `<span>Hello <p>World</p></span>`;

            // The logic: wrapChildren=true && children > 1 -> wraps them
            const output = transformJSXTextToEditableText(input);

            expect(output).toContain("<EditableText");
            expect(output).toContain("</EditableText>");
            expect(output).toContain('textContent={"World"}');
            expect(output).toContain('textContent={"Hello"}');
        });
    });

    // ----------------------------------------------------------------
    // 2. Test transformEditableTextToJSX (Reverse Transformation)
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
    // 3. Round Trip Integration Test
    // ----------------------------------------------------------------
    describe("Round Trip (Integration)", () => {
        it("should result in the same structure after transforming and reverting", () => {
            const original = `<h2 className="heading">Title</h2>`;

            const transformed = transformJSXTextToEditableText(original);
            const reverted = transformEditableTextToJSX(transformed);

            // Clean up whitespace/semicolons for comparison
            const cleanOriginal = original.replace(/\s+/g, "");
            const cleanReverted = reverted.replace(/;\s*$/, "").replace(/\s+/g, "");

            expect(cleanReverted).toEqual(cleanOriginal);
        });

        it("should result in the same structure after transforming and reverting", () => {
            const original = `<span className="font-black">{index + 1}/{slides.length}</span>`;

            const transformed = transformJSXTextToEditableText(original);
            const reverted = transformEditableTextToJSX(transformed);

            // Clean up whitespace/semicolons for comparison
            const cleanOriginal = original.replace(/\s+/g, "");
            const cleanReverted = reverted.replace(/;\s*$/, "").replace(/\s+/g, "");

            expect(cleanReverted).toEqual(cleanOriginal);
        });
    });
});
