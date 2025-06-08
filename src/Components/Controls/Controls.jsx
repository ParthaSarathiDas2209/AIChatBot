import { useEffect, useRef, useState } from "react";
import styles from "./Controls.module.css";
import TextareaAutoSize from "react-textarea-autosize";

export function Controls({ isDisabled = false, onSend }) {
  // useRef to access the textarea DOM element directly
  const textareaRef = useRef(null);
  // useState to manage the content of the textarea
  const [content, setContent] = useState("");

  useEffect(() => {
    // Focus the textarea when isDisabled is false.  This happens on mount and when isDisabled changes.
    if (!isDisabled) {
      textareaRef.current.focus();
    }
  }, [isDisabled]);

  function handleContentChange(event) {
    // Update the content state whenever the textarea value changes
    setContent(event.target.value);
  }

  function handleContentSend() {
    // Send the content if it's not empty
    if (content.length > 0) {
      onSend(content); // Call the provided onSend callback
      setContent(""); // Clear the textarea after sending
    }
  }

  function handleEnterPress(event) {
    // Send the message on Enter key press (unless Shift is held)
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent a newline from being added
      handleContentSend();
    }
  }

  return (
    <div className={styles.Controls}>
      <div className={styles.TextAreaContainer}>
        {/* Auto-resizing textarea */}
        <TextareaAutoSize
          ref={textareaRef} // Assign the ref for focusing
          className={styles.TextArea}
          placeholder="Message AI Chatbot"
          value={content} // Bind the value to the state
          minRows={1}
          maxRows={4}
          onChange={handleContentChange} // Update state on change
          onKeyDown={handleEnterPress} // Handle Enter key press
        />
      </div>
      {/* Send button, disabled when isDisabled is true */}
      <button
        className={styles.Button}
        disabled={isDisabled}
        onClick={handleContentSend}
      >
        <SendIcon />
      </button>
    </div>
  );
}

// Simple SVG icon for the send button
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
