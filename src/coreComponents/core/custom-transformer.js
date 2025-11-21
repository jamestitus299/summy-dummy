import * as parser from "@babel/parser";
import _traverse from "@babel/traverse";
import _generator from "@babel/generator";
import * as t from "@babel/types";

// Handle ESM/CommonJS interop for traverse and generator
const traverse = _traverse.default || _traverse;
const generator = _generator.default || _generator;

/** Decode \uXXXX to unicode characters */
function decodeUnicodeEscape(text) {
  return text.replace(/\\u([\dA-Fa-f]{4})/g, (_, hex) =>
    String.fromCharCode(parseInt(hex, 16))
  );
}

/** Extract and clean text content from JSXText */
function extractTextClean(textNode) {
  let textValue = textNode.value.trim();

  const unsafeChars = {
    '"': "\\u0022",
    "'": "\\u0027",
    "\\": "\\u005C",
    "<": "\\u003C",
    ">": "\\u003E",
    "&": "\\u0026",
    "{": "\\u007B",
    "}": "\\u007D",
  };

  let escaped = "";
  for (const ch of textValue) {
    if (unsafeChars[ch]) {
      escaped += unsafeChars[ch];
    } else {
      escaped += ch;
    }
  }

  return escaped;
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
 * Transform JSX text elements to <EditableText>. Assigns `text_node_id` to textNodes.
 * @param {string} code - JSX or TSX code to be transformed.
 * @param {object} options - Optional config
 * @returns {object} - { transformedCode, ast }
 */
export function transformJSXTextToEditableText(code, options = {}) {
  const {
    targetTags = [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "label", "strong",
      "em", "small", "b", "i", "mark", "del", "ins", "li", "blockquote",
      "cite", "pre", "code", "summary", "figcaption", "a", "abbr", "time",
      "kbd", "var", "samp",
    ],
    multilineThreshold = 8,
  } = options;

  // node id
  let nextId = 1;

  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
    JSXElement(path) {
      const opening = path.node.openingElement;
      if (!t.isJSXIdentifier(opening.name)) return;

      const tagName = opening.name.name;
      if (!targetTags.includes(tagName)) return;

      const children = path.node.children;

      // Skip if ANY expression containers exist (dynamic content)
      if (children.some((c) => t.isJSXExpressionContainer(c))) return;

      // Find text children only
      const textNode = children.find((child) => t.isJSXText(child));
      if (!textNode || !textNode.value.trim()) return;

      const textValue = textNode.value.trim();

      const textIsMultiline = isMultilineText(textValue, multilineThreshold);

      let attributes = convertAttributes(opening.attributes);

      // Generate Node ID
      const textNodeId = "text_node_" + nextId++;

      // CRITICAL: Attach node_id to do the patch updates, attach the node_id to the textNode.extra
      if (!textNode.extra) textNode.extra = {};
      textNode.extra.textNodeId = textNodeId;

      // attach nodeId to node
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("nodeId"),
          t.stringLiteral(textNodeId)
        )
      );

      // attach custom patch dispatcher - implemented in the edit canvas state manager
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("__applyEditableTextPatch"),
          t.jsxExpressionContainer(t.identifier("__applyEditableTextPatch"))
        )
      );

      // Append new attributes
      attributes.push(
        t.jsxAttribute(
          t.jsxIdentifier("textContent"),
          t.jsxExpressionContainer(t.stringLiteral(textValue))
        ),
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

      // Create new EditableText element
      const newElement = t.jsxElement(
        t.jsxOpeningElement(t.jsxIdentifier("EditableText"), attributes, false),
        t.jsxClosingElement(t.jsxIdentifier("EditableText")),
        children
      )

      path.replaceWith(newElement);
    },
  });

  let { code: transformedCode } = generator(ast, {
    retainLines: true,
  });
  transformedCode = decodeUnicodeEscape(transformedCode) // decode unicode escape characters

  return { transformedCode, ast };
}

/**
 * Reverse transform <EditableText> into original JSX elements.
 * @param {string} code - JSX code containing <EditableText>.
 * @returns {string} - Reconstructed JSX.
 */
export function transformEditableTextToJSX(code) {
  const ast = parser.parse(code, {
    sourceType: "module",
    plugins: ["jsx", "typescript"],
  });

  traverse(ast, {
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

          // textContent="abc"
          if (t.isStringLiteral(attr.value)) {
            props[propName] = attr.value.value;
          }

          // textContent={"abc"}
          else if (
            t.isJSXExpressionContainer(attr.value) &&
            t.isStringLiteral(attr.value.expression)
          ) {
            props[propName] = attr.value.expression.value;
          }

          // boolean: multiline={true}
          else if (
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

  let { code: transformedCode } = generator(ast, {
    retainLines: true,
  });
  transformedCode = decodeUnicodeEscape(transformedCode) // decode unicode escape characters

  return transformedCode;
}

/**
 * Apply text patches to the AST based on Node IDs.
 * @param {object} originalAst - The AST returned from transformJSXTextToEditableText
 * @param {object} patches - Object mapping nodeIds to new text strings { "text_node_*id*": "New Text" }
 */
export function applyPatchesToAst(originalAst, patches) {
  if (!originalAst) return "";

  // 1. Apply Text Updates
  if (patches && Object.keys(patches).length > 0) {
    traverse(originalAst, {
      JSXText(path) {
        const id = path.node.extra?.textNodeId;
        if (id && patches[id] !== undefined) {
          // Update the value
          path.node.value = patches[id];

          // CRITICAL FIX: Delete the 'raw' source cache. 
          // If this exists, Babel generator will print the OLD text from the source code.
          // if (path.node.extra) {
          //   delete path.node.extra.raw;
          //   delete path.node.extra.rawValue;
          // }
        }
      }
    });
  }

  // 3. Generate Code
  let { code: transformedCode } = generator(originalAst, {
    retainLines: true,
  });

  return decodeUnicodeEscape(transformedCode);
}
