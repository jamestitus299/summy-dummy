import parser from "@babel/parser";
import traverse from "@babel/traverse";
import generator from "@babel/generator";
import * as t from "@babel/types";

/**
 * Transforms JSX text elements (e.g., <p>, <h1>) into <EditableText> components.
 * 
 * @param {string} code - The original JSX/React code as a string
 * @returns {string} - JSX code with EditableText components in place of text tags
 */
export function transformJSXTextToEditableText(code) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  const targetTags = ["p", "h1", "h2", "h3"];

  traverse.default(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement;
      if (t.isJSXIdentifier(opening.name)) {
        const tagName = opening.name.name;

        if (targetTags.includes(tagName)) {
          const textNode = path.node.children.find((child) =>
            t.isJSXText(child)
          );

          if (textNode && textNode.value.trim()) {
            const textValue = textNode.value.trim();

            // Replace with <EditableText> component
            const newElement = t.jsxElement(
              t.jsxOpeningElement(
                t.jsxIdentifier("EditableText"),
                [
                  t.jsxAttribute(
                    t.jsxIdentifier("textContent"),
                    t.stringLiteral(textValue)
                  ),
                  t.jsxAttribute(
                    t.jsxIdentifier("elementType"),
                    t.stringLiteral(tagName)
                  ),
                ],
                true
              ),
              null,
              []
            );

            path.replaceWith(newElement);
          }
        }
      }
    },
  });

  const { code: transformedCode } = generator.default(ast);
  return transformedCode;
}
