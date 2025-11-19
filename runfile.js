import {
    transformJSXTextToEditableText,
    transformEditableTextToJSX,
    applyPatchesToAst
} from "./src/coreComponents/core/custom-transformer.js"

const originalCode = `
<>
<h2>James</h2>
<h2>Titus</h2>
<h2>h</h2>
</>
`;

console.log("--- Original Code ---------------------------------------------------")
console.log(originalCode)

// Transform to EditableText
const { transformedCode, ast } = transformJSXTextToEditableText(originalCode);

console.log("--- Transformed Code (Client Side) ----------------------------------")
console.log(transformedCode);


// PATCH UPDATES
// Simulate the user editing the text on the frontend
const patches = {
    "text_node_1": "Jimmy",   // James -> Jimmy
    "text_node_2": "\"Oliver\"",  // Titus -> Oliver
    "text_node_3": "**ddf**" // h -> Hello World
};

// Apply changes to the AST.
// Third argument 'false' means "Keep it as <EditableText>" (useful for previewing updates)
const patchedEditableCode = applyPatchesToAst(ast, patches);

console.log("--- Patched code --------------------------------------------------")
console.log(patchedEditableCode);


console.log("--- Final Conversion (Back to Clean JSX) --------------------------")

// 3. Convert back to original HTML tags (h2, p, etc.)
// We can pass the patched string from step 2 into the reverse transformer
const finalCleanCode = transformEditableTextToJSX(patchedEditableCode);

console.log(finalCleanCode);