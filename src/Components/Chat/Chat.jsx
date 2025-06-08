import React, { useState, useEffect, useMemo, useRef } from "react";
import styles from "./Chat.module.css";
import Markdown from "react-markdown";

// Simple error boundary for catching rendering issues in Markdown content
const MarkdownErrorBoundary = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => setHasError(true);

  if (hasError) {
    return <div>Error rendering message.</div>;
  }

  return <div onError={handleError}>{children}</div>; // React doesn’t catch errors via onError in most cases; try/catch fallback could be better
};

// Default assistant greeting to appear on every new chat session
const WELCOME_MESSAGE_GROUP = [
  {
    role: "assistant",
    content: "Hello! How can I assist you right now?",
  },
];

export function Chat({ messages }) {
  const messageEndRef = useRef(null); // Reference to scroll into view when new messages are added

  // Group messages by user turns: each user message starts a new group with its responses
  const messagesGroup = useMemo(() => {
    return messages.reduce((groups, message) => {
      if (message.role === "user") groups.push([]); // Start new group on user message
      groups[groups.length - 1]?.push(message); // Add message to latest group
      return groups;
    }, []);
  }, [messages]); // Only recompute when messages change

  useEffect(() => {
    // Scroll to the bottom after each user message is added
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "user") {
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className={styles.Chat}>
      {/* Combine welcome message group with all grouped user/assistant messages */}
      {[WELCOME_MESSAGE_GROUP, ...messagesGroup].map((group, groupIndex) => (
        <div key={groupIndex} className={styles.Group}>
          {group.map(({ role, content }, index) => (
            <div key={index} className={styles.Message} data-role={role}>
              <MarkdownErrorBoundary>
                {/* Render assistant/user message content with Markdown support */}
                <Markdown>{content || ""}</Markdown>
              </MarkdownErrorBoundary>
            </div>
          ))}
        </div>
      ))}

      {/* Dummy element to scroll into view on update */}
      <div ref={messageEndRef} />
    </div>
  );
}
