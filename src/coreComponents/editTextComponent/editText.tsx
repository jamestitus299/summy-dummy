import React, { useEffect, useRef, useState } from "react";

interface EditableTextProps {
  textContent?: string; // fallback when no children present
  elementType?: keyof JSX.IntrinsicElements;
  placeholder?: string;
  tailwindStyles?: string;
  onChange?: (newText: string) => void;
  multiline?: boolean;
  children?: React.ReactNode;
}

/**
 * Node model for preserving structure:
 * - text nodes become { type: "text", value }
 * - element nodes become { type: "element", element, key }
 */
type RichNode =
  | { type: "text"; value: string }
  | { type: "element"; element: React.ReactElement; key: string };

/**
 * Walks React children and converts them into RichNode[] where text nodes are grouped
 * and elements are kept as separate element nodes.
 */
function buildNodesFromChildren(
  children: React.ReactNode,
  fallbackText: string
): RichNode[] {
  const arr = React.Children.toArray(children);

  // If there are no children and fallback text exists, return a single text node
  if (arr.length === 0) {
    if (fallbackText && fallbackText.length > 0) return [{ type: "text", value: fallbackText }];
    return [];
  }

  const nodes: RichNode[] = [];
  let buffer = "";

  // Helper to flush buffer as a text node
  const flushBuffer = () => {
    if (buffer.length > 0) {
      nodes.push({ type: "text", value: buffer });
      buffer = "";
    }
  };

  for (const c of arr) {
    if (typeof c === "string" || typeof c === "number") {
      buffer += String(c);
    } else if (React.isValidElement(c)) {
      // flush accumulated text before pushing element
      flushBuffer();

      // Generate a key and assign it
      const rawKey = c.key != null ? String(c.key) : null;
      const existingKey =
        rawKey && !rawKey.startsWith(".") ? rawKey : null;
      const key =
        existingKey ??
        `el-${Math.random().toString(36).slice(2, 9)}`;

      // console.log({ rawKey, existingKey, finalKey: key });
      nodes.push({ type: "element", element: c, key });
    }
  }
  flushBuffer();
  // console.log("nodes", nodes)
  return nodes;
}

/**
 * Get text of a particular RichNode.
 */
function getTextOfRichNode(node: RichNode) {
  return node.type === "text" ? node.value : "";
}


/**
 * Concatenates text nodes into a single string in order.
 */
function concatTextNodes(nodes: RichNode[]) {
  const textValue = nodes
    .filter((n) => n.type === "text")
    .map((t) => (t as { type: "text"; value: string }).value)
    .join("");
  console.log("concat", nodes, textValue)
  return textValue;
}

/**
 * Redistributes edited text back into the original text segments.
 * 
 * Adds the new edited text to the matching segment, while keeping
 * other segment texts unchanged.
 * 
 * @param newText - The user-edited combined text.
 * @param originalSegments - The original text segments.
 * @returns A new array of text segments with newText added to correspnding segments.
 */
export function distributeTextToSegments(newText: string, originalSegments: string[]) {
  const n = originalSegments.length;
  if (n === 0) return [];
  if (n === 1) return [newText];

  if (!newText) return []

  const result = new Array(n).fill("");

  // Find markers
  const indices = originalSegments.map(seg => newText.indexOf(seg));

  // If any marker is missing fall back
  if (indices.some(i => i === -1)) {
    result[0] = newText;
    for (let i = 1; i < n; i++) {
      result[i] = originalSegments[i];
    }
    return result;
  }

  // Segment 0: from start → before second segment
  result[0] = newText.slice(0, indices[1]);

  // Segments 1..N-2
  for (let i = 1; i < n - 1; i++) {
    const start = indices[i];
    const end = indices[i + 1];
    result[i] = newText.slice(start, end);
  }

  // Last segment: from last marker → end
  result[n - 1] = newText.slice(indices[n - 1]);

  return result;
}

/**
 * EditableText Component.
 */
export default function EditableText({
  textContent = "",
  elementType = "p",
  placeholder = "Click to edit...",
  tailwindStyles = "",
  onChange,
  multiline = false,
  children,
}: EditableTextProps) {
  const Tag = elementType as React.ElementType;

  const [nodes, setNodes] = useState<RichNode[]>(() =>
    buildNodesFromChildren(children, textContent)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState<string>(concatTextNodes(nodes));
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLElement>(null);
  const [editWidth, setEditWidth] = useState<number | undefined>();


  // rebuild nodes when children/textContent props change
  useEffect(() => {
    const next = buildNodesFromChildren(children, textContent);
    setNodes(next);
    // if not editing, keep tempText synced to concatenated text nodes
    if (!isEditing) setTempText(concatTextNodes(next));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, textContent]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // start editing parent: show only concatenated text nodes
  const handleStartEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempText(concatTextNodes(nodes));

    // Measure width BEFORE switching to edit mode
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setEditWidth(rect.width);
    }

    setIsEditing(true);
  };


  const handleCancel = () => {
    setTempText(concatTextNodes(nodes));
    setIsEditing(false);
  };

  const handleSave = () => {
    // distribute new text back into the original text nodes
    const originalTextSegments = nodes.filter(
      (n) => n.type === "text"
    ) as { type: "text"; value: string }[];

    if (originalTextSegments.length === 0) {
      // no text nodes originally: convert to a single leading text node
      const newNodes: RichNode[] = [{ type: "text", value: tempText }, ...nodes];
      setNodes(newNodes);
      if (onChange) onChange(tempText);
      setIsEditing(false);
      return;
    }

    const distributed = distributeTextToSegments(
      tempText,
      originalTextSegments.map((s) => s.value)
    );

    // rebuild nodes: replace each text segment in order with the new distributed ones
    const nextNodes: RichNode[] = [];
    let textIndex = 0;
    for (const n of nodes) {
      if (n.type === "element") {
        nextNodes.push(n);
      } else {
        // insert a text node with the corresponding distributed text
        nextNodes.push({ type: "text", value: distributed[textIndex] ?? "" });
        textIndex++;
      }
    }

    setNodes(nextNodes);
    if (onChange) onChange(concatTextNodes(nextNodes));
    setIsEditing(false);
  };

  // Render when editing: IN-PLACE TEXT EDITING
  if (isEditing) {
    return (
      <Tag
        className={tailwindStyles}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Input replaces ALL text nodes */}
        {multiline ? (
          <textarea
            ref={inputRef}
            className={`${tailwindStyles} inline-block align-middle resize overflow-auto block`}
            value={tempText}
            style={{ width: editWidth }}
            onChange={(e) => setTempText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
            // rows={Math.max(1, tempText.split("\n").length)}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef}
            className={`${tailwindStyles} inline-block align-middle`}
            value={tempText}
            style={{ width: editWidth }}
            onChange={(e) => setTempText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
              if (e.key === "Enter") handleSave();
            }}
          />
        )}

        {/* Render element children (nested EditableText components) */}
        {nodes
          .filter((n) => n.type === "element")
          .map((n) =>
            React.cloneElement(n.element, { key: n.key })
          )}
      </Tag>
    );
  }

  // Render when not editing: reconstruct the JSX using nodes (text nodes become raw text)
  return (
    <Tag
      className={`${tailwindStyles}`}
      onClick={handleStartEditing}
      ref={wrapperRef as any}
    >
      {nodes.length === 0 ? (
        <>{placeholder}</>
      ) : (
        nodes.map((n, i) =>
          n.type === "text" ? (
            <React.Fragment key={`text-${i}`}>{n.value}</React.Fragment>
          ) : (
            React.cloneElement(n.element, { key: n.key })
          )
        )
      )}
    </Tag>
  );
}
