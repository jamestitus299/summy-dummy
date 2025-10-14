import { useState, useRef, useEffect } from "react";
import "./edittext.css";

export default function EditableTextPopup({
  content = "",
  element = "p",
  placeholder = "Click to edit...",
  onChange,
}) {
  const [text, setText] = useState(content);
  const [isEditing, setIsEditing] = useState(false);
  const [tempText, setTempText] = useState(content);
  const textareaRef = useRef(null);

  useEffect(() => {
    setText(content);
  }, [content]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditing]);

  const handleOpen = () => {
    setTempText(text);
    setIsEditing(true);
  };

  const handleSave = () => {
    setText(tempText);
    setIsEditing(false);
    if (onChange) onChange(tempText);
  };

  const handleCancel = () => {
    setTempText(text);
    setIsEditing(false);
  };

  const Tag = element;
  const displayText = text || placeholder;

  return (
    <>
      {/* Display Text */}
      <Tag onClick={handleOpen} className="editable-text-display">
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
              onChange={(e) => setTempText(e.target.value)}
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
