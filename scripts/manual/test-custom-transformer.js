import {
    transformJSXTextToEditableText,
    transformEditableTextToJSX,
    applyPatchesToAst
} from "../../src/coreComponents/core/custom-transformer.js"

const originalCode = `
<>
<h2>James</h2>
<h2>Titus</h2>
<h2>h</h2>
</>
`;

// Transform to EditableText
var { transformedCode, ast, error } = transformJSXTextToEditableText(originalCode);
if (error) {
    console.log("Error in transformJSXTextToEditableText: " + error)
} else {
    console.log("--- Original Code ---------------------------------------------------")
    console.log(originalCode)
    console.log("--- Transformed Code (Client Side) ----------------------------------")
    console.log(transformedCode);
}

// PATCH UPDATES
// Simulate the user editing the text on the frontend
const patches = {
    "text_node_1": "Jimmy",   // James -> Jimmy
    "text_node_2": "\"Oliver\"",  // Titus -> Oliver
    "text_node_3": "**ddf**" // h -> Hello World
};

// Apply changes to the AST.
var { transformedCode, error } = applyPatchesToAst(ast, patches);
if (error) {
    console.log("Error in apply patch: " + error)
}
else {
    console.log("--- Patched code --------------------------------------------------")
    console.log(transformedCode);
}


// Convert back to original HTML tags (h2, p, etc.)
var { transformedCode, error } = transformEditableTextToJSX(transformedCode);
if (error) {
    console.log("Error in transformEditableTextToJSX: " + error)
}
else {
    console.log("--- Final Conversion (Back to Clean JSX) --------------------------")
    console.log(transformedCode);
}
