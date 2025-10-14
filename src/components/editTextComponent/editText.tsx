import React, { useState, useRef, useEffect } from "react";
import "./edittext.css";

type EditableTextPopupProps = {
  content?: string;
  element?: keyof JSX.IntrinsicElements; // h1, p, etc.
  placeholder?: string;
  styles?: string;
  onChange?: (newText: string) => void;
};

export default function EditableTextPopup({
  content = "",
  element = "p",
  placeholder = "Click to edit...",
  styles = "",
  onChange,
}: EditableTextPopupProps) {
  const [text, setText] = useState<string>(content);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [tempText, setTempText] = useState<string>(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setText(content);
  }, [content]);

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

  const Tag: keyof JSX.IntrinsicElements = element;
  const displayText = text || placeholder;

  return (
    <>
      {/* Display Text */}
      <Tag
        onClick={handleOpen}
        className={`editable-text-display ${styles ? styles : ""}`}
      >
        {displayText}
      </Tag>

      {/* Popup Modal */}
      {isEditing && (
        <div className="editable-popup-overlay">
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
