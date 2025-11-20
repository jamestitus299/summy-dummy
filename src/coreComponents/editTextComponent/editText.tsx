import React, { useEffect, useRef, useState } from "react";

interface EditableTextProps {
  textContent?: string;
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
 * Walks React children and converts them into RichNode[]
 */
function buildNodesFromChildren(
  children: React.ReactNode,
  fallbackText: string
): RichNode[] {
  const arr = React.Children.toArray(children);

  // If there are no children and fallback text exists, return a single text node
  if (arr.length === 0) {
    if (fallbackText && fallbackText.length > 0)
      return [{ type: "text", value: fallbackText }];
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
      const existingKey = rawKey && !rawKey.startsWith(".") ? rawKey : null;
      const key = existingKey ?? `el-${Math.random().toString(36).slice(2, 9)}`;
      nodes.push({ type: "element", element: c, key });
    }
  }
  flushBuffer();
  return nodes;
}

/**
 * Concatenates text nodes into a single string.
 * (Note: This only gets text from immediate text nodes, not inside nested elements) TODO ?
 */
export function concatTextNodes(nodes: RichNode[]) {
  return nodes
    .filter((n) => n.type === "text")
    .map((t) => (t as { type: "text"; value: string }).value)
    .join("");
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
export function distributeTextToSegments(
  newText: string,
  originalSegments: string[]
) {
  const n = originalSegments.length;
  if (n === 0) return [];
  if (n === 1) return [newText];
  if (!newText) return [];

  const result = new Array(n).fill("");
  const indices = originalSegments.map((seg) => newText.indexOf(seg));

  if (indices.some((i) => i === -1)) {
    result[0] = newText;
    for (let i = 1; i < n; i++) {
      result[i] = originalSegments[i];
    }
    return result;
  }

  result[0] = newText.slice(0, indices[1]);
  for (let i = 1; i < n - 1; i++) {
    const start = indices[i];
    const end = indices[i + 1];
    result[i] = newText.slice(start, end);
  }
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

  // Rebuild nodes if props force a change, but be careful not to overwrite 
  // local edits if the parent is just re-rendering.
  useEffect(() => {
    // Only reset if not currently editing to prevent jumping cursor/state loss
    if (!isEditing) {
      const next = buildNodesFromChildren(children, textContent);
      setNodes(next);
      setTempText(concatTextNodes(next));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, textContent]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      // Optional: Select all text or place cursor at end
      // inputRef.current.select(); 
    }
  }, [isEditing]);

  // Handle updates from nested children
  const handleChildChange = (key: string, newChildValue: string) => {
    setNodes((prevNodes) =>
      prevNodes.map((n) => {
        if (n.type === "element" && n.key === key) {
          // Clone the element and FORCE the new textContent.
          // IMPORTANT: We set `children` to undefined to ensure the child component
          // uses `textContent` as the source of truth, effectively "saving" the state.
          const updatedElement = React.cloneElement(n.element, {
            textContent: newChildValue,
            children: undefined,
            // Also keep the original onChange in case the user passed one explicitly
            onChange: (val: string) => {
              handleChildChange(key, val);
              if (n.element.props.onChange) n.element.props.onChange(val);
            }
          } as any);

          return { ...n, element: updatedElement };
        }
        return n;
      })
    );
  };

  // Helper to render children with attached listeners
  const renderNode = (n: RichNode, i: number) => {
    if (n.type === "text") {
      return <React.Fragment key={`text-${i}`}>{n.value}</React.Fragment>;
    }

    // It's an element (Nested EditableText)
    return React.cloneElement(n.element, {
      key: n.key,
      // Intercept the onChange event from the child
      onChange: (newVal: string) => {
        handleChildChange(n.key, newVal);
        // Trigger original prop onChange if it exists
        if (n.element.props.onChange) {
          n.element.props.onChange(newVal);
        }
      }
    });
  };


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
    const originalTextSegments = nodes.filter(
      (n) => n.type === "text"
    ) as { type: "text"; value: string }[];

    if (originalTextSegments.length === 0) {
      // If no text nodes existed, prepend the new text
      const newNodes: RichNode[] = [
        { type: "text", value: tempText },
        ...nodes, // preserve element nodes
      ];
      setNodes(newNodes);
      if (onChange) onChange(tempText); // This might need to be smarter (combine all text?)
      setIsEditing(false);
      return;
    }

    const distributed = distributeTextToSegments(
      tempText,
      originalTextSegments.map((s) => s.value)
    );

    const nextNodes: RichNode[] = [];
    let textIndex = 0;
    for (const n of nodes) {
      if (n.type === "element") {
        nextNodes.push(n);
      } else {
        nextNodes.push({ type: "text", value: distributed[textIndex] ?? "" });
        textIndex++;
      }
    }

    setNodes(nextNodes);
    // Combine all text (including nested elements?) or just this level?
    // Usually just this level's text for the onChange callback:
    if (onChange) onChange(concatTextNodes(nextNodes));
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Tag
        className={tailwindStyles}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Input for this level's text */}
        {multiline ? (
          <textarea
            ref={inputRef}
            className={`${tailwindStyles} inline-block align-middle resize overflow-auto block bg-white text-black`}
            value={tempText}
            style={{ width: editWidth, minWidth: "50px" }}
            onChange={(e) => setTempText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSave();
              }
            }}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef}
            className={`${tailwindStyles} inline-block align-middle bg-white text-black`}
            value={tempText}
            style={{ width: editWidth, minWidth: "50px" }}
            onChange={(e) => setTempText(e.target.value)}
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
              if (e.key === "Enter") handleSave();
            }}
          />
        )}

        {/* Render nested Elements (View Mode) while Parent is editing */}
        {/* Note: We render them using the helper to ensure they keep listeners */}
        {nodes
          .filter((n) => n.type === "element")
          .map((n, i) => renderNode(n, i))}
      </Tag>
    );
  }

  // Render View Mode
  return (
    <Tag
      className={`${tailwindStyles}`}
      onClick={handleStartEditing}
      ref={wrapperRef as any}
    >
      {nodes.length === 0 ? (
        <>{placeholder}</>
      ) : (
        nodes.map((n, i) => renderNode(n, i))
      )}
    </Tag>
  );
}