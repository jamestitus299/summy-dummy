import { useState, useRef, useEffect } from "react";

interface EditableTextProps {
  textContent?: string;
  elementType?: keyof JSX.IntrinsicElements;
  placeholder?: string;
  tailwindStyles?: string;
  onChange?: (newText: string) => void;
  multiline?: boolean; // Optional: toggle textarea vs input
}

export default function EditableText({
  textContent = "",
  elementType = "p",
  placeholder = "Click to edit...",
  tailwindStyles = "",
  onChange,
  multiline = false,
}: EditableTextProps) {
  const [text, setText] = useState<string>(textContent);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempText, setTempText] = useState<string>(textContent);
  const inputRef = useRef<HTMLTextAreaElement & HTMLInputElement>(null);

  // If textContent (prop) changes externally, sync with internal state
  useEffect(() => {
    setText(textContent);
  }, [textContent]);

  // Focus when entering editing mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setText(tempText);
    setIsEditing(false);
    if (onChange) onChange(tempText);
  };

  const handleCancel = () => {
    setTempText(text);
    setIsEditing(false);
  };

  const Tag: keyof JSX.IntrinsicElements = elementType;
  const displayText = text || placeholder;

  return (
    <>
      {isEditing ? (
        <div className="">
          {multiline ? (
            <textarea
              ref={inputRef}
              className={`${tailwindStyles} resize`}
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancel();
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
                }
              }}
              rows={4}
            />
          ) : (
            <input
              ref={inputRef}
              className={`${tailwindStyles}`}
              value={tempText}
              onChange={(e) => setTempText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => {
                if (e.key === "Escape") handleCancel();
                if (e.key === "Enter") handleSave();
              }}
            />
          )}
        </div>
      ) : (
        <Tag
          className={`${tailwindStyles}`}
          onClick={() => setIsEditing(true)}
        >
          {displayText}
        </Tag>
      )}
    </>
  );
}
