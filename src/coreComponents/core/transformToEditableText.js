import parser from "@babel/parser";
import traverse from "@babel/traverse";
import generator from "@babel/generator";
import * as t from "@babel/types";

/** Decode \uXXXX to unicode characters */
function decodeUnicodeEscape(text) {
  return text.replace(/\\u([\dA-Fa-f]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

/** Extract and clean text content from JSXText */
function extractText(textNode) {
  let textValue = textNode.value.trim();
  if (
    (textValue.startsWith('"') && textValue.endsWith('"')) ||
    (textValue.startsWith("'") && textValue.endsWith("'"))
  ) {
    textValue = textValue.slice(1, -1); // Remove surrounding quotes
  }
  return textValue;
}

/** Check if text should use multiline input */
function isMultilineText(text, threshold = 10) {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return wordCount >= threshold;
}

/** Convert className to tailwindStyles and preserve other attributes */
function convertAttributes(originalAttributes) {
  return originalAttributes.map((attr) => {
    if (
      t.isJSXAttribute(attr) &&
      t.isJSXIdentifier(attr.name) &&
      attr.name.name === "className"
    ) {
      return t.jsxAttribute(t.jsxIdentifier("tailwindStyles"), attr.value);
    }
    return attr;
  });
}

/**
 * Transform JSX text elements to <EditableText>.
 * @param {string} code - JSX or TSX code to be transformed.
 * @param {object} options - Optional config
 * @returns {string} - Transformed JSX code.
 */
export function transformJSXTextToEditableText(code, options = {}) {
  const {
    targetTags = [
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "p",
      "span",
      "label",
      "strong",
      "em",
      "small",
      "b",
      "i",
      "mark",
      "del",
      "ins",
      "li",
      "blockquote",
      "cite",
      "pre",
      "code",
      "summary",
      "figcaption",
      "a",
      "abbr",
      "time",
      "kbd",
      "var",
      "samp",
    ],
    multilineThreshold = 8,
    wrapChildren = true, // If true, preserve nested JSX; otherwise only replace plain text nodes
  } = options;

  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  traverse.default(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement;
      if (!t.isJSXIdentifier(opening.name)) return;

      const tagName = opening.name.name;
      if (!targetTags.includes(tagName)) return;

      const children = path.node.children;
      const textNode = children.find((child) => t.isJSXText(child));

      if (!textNode || !textNode.value.trim()) return;

      const textValue = extractText(textNode);
      const textIsMultiline = isMultilineText(textValue, multilineThreshold);

      let attributes = convertAttributes(opening.attributes);

      // Append new attributes
      attributes.push(
        t.jsxAttribute(t.jsxIdentifier("textContent"), t.stringLiteral(textValue)),
        t.jsxAttribute(t.jsxIdentifier("elementType"), t.stringLiteral(tagName))
      );

      if (textIsMultiline) {
        attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("multiline"),
            t.jsxExpressionContainer(t.booleanLiteral(true))
          )
        );
      }

      // Wrap children or ignore nested JSX
      const newElement =
        wrapChildren && children.length > 1
          ? t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier("EditableText"), attributes, false),
            t.jsxClosingElement(t.jsxIdentifier("EditableText")),
            children
          )
          : t.jsxElement(
            t.jsxOpeningElement(t.jsxIdentifier("EditableText"), attributes, true),
            null,
            []
          );

      path.replaceWith(newElement);
    },
  });

  let { code: transformedCode } = generator.default(ast, {
    retainLines: true,
  });
  transformedCode = decodeUnicodeEscape(transformedCode) // decode unicode escape characters

  return transformedCode;
}

/**
 * Reverse transform <EditableText> into original JSX elements.
 * @param {string} code - JSX code containing <EditableText>.
 * @returns {string} - Reconstructed JSX.
 */
export function transformEditableTextToJSX(code) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx"],
  });

  traverse.default(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement;
      if (!t.isJSXIdentifier(opening.name)) return;

      const tagName = opening.name.name;
      if (tagName !== "EditableText") return;

      const attributes = opening.attributes;

      // Extract props
      const props = {};
      attributes.forEach((attr) => {
        if (t.isJSXAttribute(attr) && t.isJSXIdentifier(attr.name)) {
          const propName = attr.name.name;
          if (t.isStringLiteral(attr.value)) {
            props[propName] = attr.value.value;
          } else if (
            t.isJSXExpressionContainer(attr.value) &&
            t.isBooleanLiteral(attr.value.expression)
          ) {
            props[propName] = attr.value.expression.value;
          }
        }
      });

      const elementType = props.elementType || "span";
      const textContent = props.textContent || "";
      const tailwindStyles = props.tailwindStyles;
      const multiline = props.multiline;

      // Build new opening tag
      const newOpening = t.jsxOpeningElement(
        t.jsxIdentifier(elementType),
        [
          ...(tailwindStyles
            ? [
              t.jsxAttribute(
                t.jsxIdentifier("className"),
                t.stringLiteral(tailwindStyles)
              ),
            ]
            : []),
        ],
        false
      );

      // Determine children
      const children =
        path.node.children.length > 0
          ? path.node.children // preserve nested children
          : [t.jsxText(textContent)]; // or restore textContent as text

      // Closing tag
      const newClosing = t.jsxClosingElement(t.jsxIdentifier(elementType));

      // Construct new element
      const newElement = t.jsxElement(newOpening, newClosing, children);

      path.replaceWith(newElement);
    },
  });

  let { code: transformedCode } = generator.default(ast, {
    retainLines: true,
  });
  transformedCode = decodeUnicodeEscape(transformedCode) // decode unicode escape characters

  return transformedCode;
}
