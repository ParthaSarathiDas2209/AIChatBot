import React, { useState } from "react";
import { useEffect, useMemo, useRef } from "react";
import styles from "./Chat.module.css";
import Markdown from "react-markdown";

// Simple Error Boundary - Catches errors during Markdown rendering
const MarkdownErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => setHasError(true);

  if (hasError) {
    return <div>Error rendering message.</div>;
  }

  return <div onError={handleError}>{children}</div>; // onError handles errors within the children
};

const WELCOME_MESSAGE_GROUP = [
  {
    role: "assistant",
    content: "Hello! How can I assist you right now?",
  },
];

export function Chat({ messages }) {
  const messageEndRef = useRef(null);

  // UseMemo to optimize the grouping of messages - avoids recalculation unless messages change
  const messagesGroup = useMemo(
    () =>
      messages.reduce((groups, message) => {
        if (message.role === "user") groups.push([]); // Start a new group for user messages
        groups[groups.length - 1].push(message); // Add message to the current group
        return groups;
      }, []), // Initialize with an empty array
    [messages] // Only recalculate if the messages array changes
  );

  useEffect(() => {
    // Scroll to the bottom after a user message is added
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Only run effect when messages change

  return (
    <div className={styles.Chat}>
      {/* Concatenate welcome message with user messages */}
      {[WELCOME_MESSAGE_GROUP, ...messagesGroup].map((messages, groupIndex) => (
        <div key={groupIndex} className={styles.Group}>
          {messages.map(({ role, content }, index) => (
            <div key={index} className={styles.Message} data-role={role}>
              {/* Wrap Markdown in Error Boundary */}
              <MarkdownErrorBoundary>
                <Markdown>{content || ""}</Markdown>{" "}
                {/* Render Markdown content, handle empty content */}
              </MarkdownErrorBoundary>
            </div>
          ))}
        </div>
      ))}
      {/* Ref for scrolling to the bottom */}
      <div ref={messageEndRef} />
    </div>
  );
}
