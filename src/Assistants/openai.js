import OpenAI from "openai"; // Import the OpenAI SDK

// Initialize OpenAI client using API key from environment variables.
// `dangerouslyAllowBrowser: true` allows usage in browser (not recommended for production apps).
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY, // Your OpenAI API key from .env
  dangerouslyAllowBrowser: true, // Exposes API key in client-side code. Avoid in production!
});

export class Assistant {
  #client; // Private variable to store the OpenAI client instance
  #model; // Private variable to store the selected model name

  constructor(model = "gpt-4o-mini", client = openai) {
    // Constructor accepts a model name and client instance; defaults to gpt-4o-mini
    this.#client = client;
    this.#model = model;
  }

  async chat(content, history) {
    // Sends a complete message (with history) to the OpenAI chat API and returns a single response
    try {
      const result = await this.#client.chat.completions.create({
        model: this.#model, // The model to use (e.g., gpt-4o, gpt-3.5-turbo)
        messages: [...history, { content, role: "user" }], // Include conversation history + latest user message
      });

      return result.choices[0].message.content; // Return the assistant's response
    } catch (error) {
      throw error; // Re-throw any error so the caller can handle it
    }
  }

  async *chatStream(content, history) {
    // Sends a message and yields chunks of a streaming response from the assistant
    try {
      const result = await this.#client.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        stream: true, // Enable streaming mode
      });

      for await (const chunk of result) {
        // Iterate over streaming chunks
        yield chunk.choices[0]?.delta?.content || ""; // Yield each partial response
      }
    } catch (error) {
      throw error; // Re-throw any error so the caller can handle it
    }
  }
}
