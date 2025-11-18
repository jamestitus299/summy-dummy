import {transformJSXTextToEditableText} from "./src/coreComponents/core/transformToEditableText.js"

const originalCode = `
<></>
`;

const transformed = transformJSXTextToEditableText(originalCode);
console.log(transformed);
