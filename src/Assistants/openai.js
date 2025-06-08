import OpenAI from "openai";

// Initialize OpenAI client with API key from environment variables.
// `dangerouslyAllowBrowser: true` is necessary for browser environments but poses security risks; consider alternatives like server-side API calls for production.
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  dangerouslyAllowBrowser: true, // Use with caution in production!
});

export class Assistant {
  #client; // Private member variable for the OpenAI client.
  #model; // Private member variable for the model name.

  // Constructor initializes the client and model.  Defaults to gpt-4o-mini.
  constructor(model = "gpt-4o-mini", client = openai) {
    this.#client = client;
    this.#model = model;
  }

  // Asynchronous method for a single chat completion.
  async chat(content, history) {
    try {
      // Sends a chat completion request to the OpenAI API.
      const result = await this.#client.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }], // Combines history and current user message.
      });
      // Returns the content of the assistant's response.
      return result.choices[0].message.content;
    } catch (error) {
      // Re-throws any errors encountered during the API call.
      throw error;
    }
  }

  // Asynchronous generator for streaming chat completions.
  async *chatStream(content, history) {
    try {
      // Sends a streaming chat completion request to the OpenAI API.
      const result = await this.#client.chat.completions.create({
        model: this.#model,
        messages: [...history, { content, role: "user" }],
        stream: true, // Enables streaming responses.
      });

      // Iterates over the stream of chunks.
      for await (const chunk of result) {
        // Yields the content of each chunk; handles cases where delta.content might be undefined.
        yield chunk.choices[0]?.delta?.content || "";
      }
    } catch (error) {
      // Re-throws any errors encountered during the API call.
      throw error;
    }
  }
}
