import { useEffect, useRef, useState } from "react";
import styles from "./Controls.module.css";
import TextareaAutoSize from "react-textarea-autosize";

// Main input controls for the chat interface
export function Controls({ isDisabled = false, onSend }) {
  const textareaRef = useRef(null); // Ref to control focus on the textarea
  const [content, setContent] = useState(""); // Local state to hold input content

  // Focus the textarea when it becomes enabled
  useEffect(() => {
    if (!isDisabled) {
      textareaRef.current?.focus();
    }
  }, [isDisabled]);

  // Update local state when user types
  function handleContentChange(event) {
    setContent(event.target.value);
  }

  // Trigger message sending
  function handleContentSend() {
    if (content.trim().length > 0) {
      onSend(content); // Send to parent
      setContent(""); // Clear the input
    }
  }

  // Handle Enter/Shift+Enter key behavior
  function handleEnterPress(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent newline
      handleContentSend(); // Send message
    }
  }

  return (
    <div className={styles.Controls}>
      {/* Chat input box (resizes between 1-4 rows) */}
      <div className={styles.TextAreaContainer}>
        <TextareaAutoSize
          ref={textareaRef}
          className={styles.TextArea}
          placeholder="Message AI Chatbot"
          value={content}
          minRows={1}
          maxRows={4}
          onChange={handleContentChange}
          onKeyDown={handleEnterPress}
          disabled={isDisabled}
        />
      </div>

      {/* Send button with icon */}
      <button
        className={styles.Button}
        disabled={isDisabled}
        onClick={handleContentSend}
        aria-label="Send message"
      >
        <SendIcon />
      </button>
    </div>
  );
}

// Send icon as inline SVG
function SendIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="#5f6368"
    >
      <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
    </svg>
  );
}
