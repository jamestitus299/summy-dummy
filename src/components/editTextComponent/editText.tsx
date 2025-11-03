import React, { useState, useRef, useEffect } from "react";
import "./edittext.css";

// type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
// type TextElementTag =
//   | HeadingTag
//   | "p"
//   | "span"
//   | "strong"
//   | "em"
//   | "label"
//   | "blockquote";

type TextElementTag = keyof JSX.IntrinsicElements;


type EditableTextPopupProps = {
  textContent?: string;
  elementType?: TextElementTag,
  placeholder?: string;
  tailwindStyles?: string;
  onChange?: (newText: string) => void;
};

export default function EditableTextPopup({
  textContent = "",
  elementType = "p",
  placeholder = "Click to edit...",
  tailwindStyles = "",
  onChange,
}: EditableTextPopupProps) {
  const [text, setText] = useState<string>(textContent);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempText, setTempText] = useState<string>(textContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(textContent);
  }, [textContent]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleOpen = (): void => {
    setTempText(text);
    setIsEditing(true);
  };

  const handleSave = (): void => {
    setText(tempText);
    setIsEditing(false);
    if (onChange) onChange(tempText);
  };

  const handleCancel = (): void => {
    setTempText(text);
    setIsEditing(false);
  };

  const Tag: keyof JSX.IntrinsicElements = elementType;
  const displayText = text || placeholder;

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCancel();
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSave();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [tempText]);


  return (
    <>
      {/* Display Text */}
      <Tag
        onClick={handleOpen}
        className={`editable-text-display ${tailwindStyles ? tailwindStyles : ""}`}
      >
        {displayText}
      </Tag>

      {/* Popup Modal */}
      {isEditing && (
        <div className="editable-popup-overlay" role="dialog" aria-modal="true">
          <div className="editable-popup-card">
            <h3 className="editable-popup-header">Edit Text</h3>

            <textarea
              ref={textareaRef}
              value={tempText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setTempText(e.target.value)
              }
              rows={6}
              className="editable-popup-textarea"
            />

            <div className="editable-popup-buttons">
              <button onClick={handleCancel} className="editable-popup-cancel">
                Cancel
              </button>
              <button onClick={handleSave} className="editable-popup-save">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
