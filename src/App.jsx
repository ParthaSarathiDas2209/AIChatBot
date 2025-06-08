import { useState, useEffect, useMemo } from "react";
import { getAssistant } from "./Assistants/getAssistant";
import styles from "./App.module.css";
import { Chat } from "./Components/Chat/Chat";
import { Controls } from "./Components/Controls/Controls";
import { Loader } from "./Components/Loader/Loader";
// import Select from "react-select";
// import { Assistant } from "./Assistants/googleai";
import { ProviderSelector } from "./Components/ProviderSelector/ProviderSelector";

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
    // model: anthropic / claude - 3.5 - sonnet,
  },
];

function App() {
  // const assistant = getAssistant("google");
  // assistant.chat("Hello").then((response) => {
  //   console.log(response);
  // });

  const [provider, setProvider] = useState(
    import.meta.env.VITE_AI_PROVIDERS || "google"
  );

  // const assistant = useMemo(() => getAssistant(provider), [provider]);

  const assistant = useMemo(() => {
    const model = PROVIDERS.find((p) => p.id === provider)?.model;
    return getAssistant(provider, model);
  }, [provider]);

  useEffect(() => {
    const testAssistant = async () => {
      try {
        const response = await assistant.chat("Hello", []);
        // assistant.chat("Hello").then((response) => {
        console.log(`Initial test message from ${provider}: `, response);
      } catch (err) {
        console.log(`Error testing ${provider}: `, err);
      }
    };
    testAssistant();
  }, [assistant, provider]);

  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);

  function updateLastMessageContent(content) {
    // 🔄 Updates the last assistant message by appending new content (for streaming)
    setMessages((prevMessages) =>
      prevMessages.map((message, index) =>
        index === prevMessages.length - 1
          ? { ...message, content: `${message.content}${content}` }
          : message
      )
    );
  }

  function addMessage(message) {
    // ➕ Adds a new message to the message array
    setMessages((prevMessages) => [...prevMessages, message]);
  }

  async function handleContentSend(content) {
    const history = messages.map(({ role, content }) => ({ role, content }));
    // 🚀 Triggered when the user sends a message
    addMessage({ content, role: "user" });
    setIsLoading(true);

    try {
      const result = await assistant.chatStream(content, history); // 🔸 Calls Gemini streaming API
      let isFirstChunk = false;
      for await (const chunk of result) {
        // ✅ Streaming each chunk as it's received
        if (!isFirstChunk) {
          isFirstChunk = true;
          addMessage({ content: "", role: "assistant" }); // Initial empty assistant message
          setIsLoading(false);
          setIsStreaming(true);
        }

        updateLastMessageContent(chunk); // 🧩 Append stream chunk to assistant response
      }

      setIsStreaming(false); // ✅ Done streaming
    } catch (error) {
      // ❌ This is where the generic error gets triggered
      console.error("Error during message send:", error); // 🔍 Print actual error in browser console

      addMessage({
        content:
          "Sorry, Unable to process your request. Please Try Again Later!!!", // 🚨 What you see in the chat UI
        role: "system",
      });

      setIsLoading(false); // 🧹 Cleanup loading state
      setIsStreaming(false);
    }
  }

  return (
    <div className={styles.App}>
      <header className={styles.Header}>
        <div className={styles.HeaderTop}>
          <div className={styles.ActiveProviderBox}>
            <img className={styles.Logo} src="/chat-bot.png" />
            <h2 className={styles.Title}>AI ChatBot</h2>
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

          {isLoading && (
            <div className={styles.LoaderUnderTitle}>
              <Loader />
              <span className={styles.ThinkingText}>Thinking...</span>
            </div>
          )}
        </div>

        <div className={styles.ProviderWrapper}>
          {/* Custom Provider selector with buttons + logos */}
          {/* {PROVIDERS.map((prov) => (
            <button
              key={prov.id}
              onClick={() => {
                if (prov.id !== provider) {
                  setProvider(prov.id);
                  addMessage({
                    role: "system",
                    content: `✅ You are now chatting with ${prov.name}.`,
                  });
                }
              }}
              // setProvider(prov.id)}
              // className={`${styles.ProviderButton} $ {provider === prov.id ? styles.Active : ''} $ {styles[prov.id]}`}
              className={`${styles.ProviderButton} ${
                provider === prov.id ? styles.Active : ""
              } ${styles[prov.id]}`}
            >
              {prov.name}
            </button>
          ))} */}
          <ProviderSelector
            providers={PROVIDERS}
            selectedProvider={provider}
            onChange={setProvider}
          />

          {/* <select
            className={styles.ProviderSelector}
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
          > */}
          {/* {PROVIDERS.map((prov) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))} */}
          {/* </select> */}
        </div>
      </header>
      <div className={styles.ChatContainer}>
        <Chat messages={messages} /> {/* 💬 Display messages */}
      </div>
      <Controls
        isDisabled={isLoading || isStreaming}
        onSend={handleContentSend} // 🧠 This is called when user presses Enter
      />
    </div>
  );
}

export default App;
