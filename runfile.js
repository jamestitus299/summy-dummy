import { transformJSXTextToEditableText, transformEditableTextToJSX } from "./src/coreComponents/core/custom-transformer.js"

const originalCode = `

`;

console.log(originalCode)

const editTransformedCode = transformJSXTextToEditableText(originalCode);
console.log(editTransformedCode);

const transformedlCode = `

`;

const jsxcode = transformEditableTextToJSX(transformedlCode)
console.log(jsxcode)