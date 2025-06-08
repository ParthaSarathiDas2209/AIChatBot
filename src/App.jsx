import { useState, useEffect, useMemo } from "react";
import { getAssistant } from "./Assistants/getAssistant";
import styles from "./App.module.css";
import { Chat } from "./Components/Chat/Chat";
import { Controls } from "./Components/Controls/Controls";
import { Loader } from "./Components/Loader/Loader";
import { ProviderSelector } from "./Components/ProviderSelector/ProviderSelector";

// Define available AI providers
const PROVIDERS = [
  {
    id: "google",
    name: "Gemini(Google)",
    logo: "/googleai.png",
    model: "gemini-1.5-flash",
  },
  {
    id: "openai",
    name: "ChatGPT(OpenAI)",
    logo: "/openai.png",
    model: "gpt-4o-mini",
  },
  {
    id: "openrouter",
    name: "Mixtral (OpenRouter)",
    logo: "/openrouter.png",
    // model could be claude-3.5-sonnet, etc.
  },
];

function App() {
  // Load default provider (fallback to Google if env variable not set)
  const [provider, setProvider] = useState(
    import.meta.env.VITE_AI_PROVIDERS || "google"
  );

  // Load corresponding assistant for current provider using useMemo
  const assistant = useMemo(() => {
    const model = PROVIDERS.find((p) => p.id === provider)?.model;
    return getAssistant(provider, model);
  }, [provider]);

  // Test assistant connection once on mount or provider change
  useEffect(() => {
    const testAssistant = async () => {
      try {
        const response = await assistant.chat("Hello", []);
        console.log(`Initial test message from ${provider}: `, response);
      } catch (err) {
        console.log(`Error testing ${provider}: `, err);
      }
    };
    testAssistant();
  }, [assistant, provider]);

  const [messages, setMessages] = useState([]); // All chat messages
  const [isLoading, setIsLoading] = useState(false); // For loader UI
  const [isStreaming, setIsStreaming] = useState(false); // While receiving stream

  // Append new content to the last assistant message
  function updateLastMessageContent(content) {
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message
      )
    );
  }

  // Add a new message (user, assistant, or system)
  function addMessage(message) {
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  // When user sends a message
  async function handleContentSend(content) {
    const history = messages.map(({ role, content }) => ({ role, content }));
    addMessage({ content, role: "user" });
    setIsLoading(true);

    try {
      const result = await assistant.chatStream(content, history);
      let isFirstChunk = false;

      for await (const chunk of result) {
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: "", role: "assistant" }); // Start streaming
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(chunk); // Append response chunks
      }

      setIsStreaming(false); // Done
    } catch (error) {
      console.error("Error during message send:", error);

      addMessage({
        content:
          "Sorry, Unable to process your request. Please Try Again Later!!!",
        role: "system",
      });

      setIsLoading(false);
      setIsStreaming(false);
    }
  }

  return (
    <div className={styles.App}>
      {/* Header Section */}
      <header className={styles.Header}>
        <div className={styles.HeaderTop}>
          {/* Logo and Title */}
          <div className={styles.ActiveProviderBox}>
            <img className={styles.Logo} src="/chat-bot.png" />
            <h2 className={styles.Title}>AI ChatBot</h2>

            {/* Provider Info */}
            <div className={styles.ActiveProvider}>
              <img
                src={PROVIDERS.find((p) => p.id === provider).logo}
                alt={provider}
                className={styles.ProviderIcon}
              />
              <span className={styles.ProviderLabel}>
                Powered by {PROVIDERS.find((p) => p.id === provider).name}
              </span>
            </div>
          </div>

          {/* Loader while assistant responds */}
          {isLoading && (
            <div className={styles.LoaderUnderTitle}>
              <Loader />
              <span className={styles.ThinkingText}>Thinking...</span>
            </div>
          )}
        </div>

        {/* Provider Switcher */}
        <div className={styles.ProviderWrapper}>
          <ProviderSelector
            providers={PROVIDERS}
            selectedProvider={provider}
            onChange={setProvider}
          />
        </div>
      </header>

      {/* Chat Window */}
      <div className={styles.ChatContainer}>
        <Chat messages={messages} />
      </div>

      {/* Input Controls */}
      <Controls
        isDisabled={isLoading || isStreaming}
        onSend={handleContentSend}
      />
    </div>
  );
}

export default App;
