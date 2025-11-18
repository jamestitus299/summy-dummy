import { transformJSXTextToEditableText, transformEditableTextToJSX } from "./src/coreComponents/core/transformToEditableText.js"

const originalCode = `

`;

console.log(originalCode)

const editTransformedCode = transformJSXTextToEditableText(originalCode);
console.log(editTransformedCode);

const transformedlCode = `

`;

const jsxcode = transformEditableTextToJSX(transformedlCode)
console.log(jsxcode)