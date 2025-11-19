import { transformJSXTextToEditableText, transformEditableTextToJSX } from "./src/coreComponents/core/custom-transformer.js"

const originalCode = `

`;

console.log(originalCode)
console.log("o ---------------------------------------------------------------------")

const editTransformedCode = transformJSXTextToEditableText(originalCode);
console.log(editTransformedCode);
console.log("t ---------------------------------------------------------------------")

const transformedlCode = `

`;

const jsxcode = transformEditableTextToJSX(editTransformedCode)
console.log(jsxcode)

console.log("c ---------------------------------------------------------------------")
