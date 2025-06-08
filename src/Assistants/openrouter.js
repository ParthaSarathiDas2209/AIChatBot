// Retrieve the OpenRouter API key from environment variables
const openrouterApiKey = import.meta.env.VITE_OPENROUTER_AI_API_KEY;

export class Assistant {
  constructor(model = "gryphe/mythomax-l2-13b") {
    // Initialize with a default model if none is specified
    this.model = model;
    this.apiKey = openrouterApiKey; // Assign the API key
    // Optional debug logging:
    // console.log("Using OpenRouter model:", this.model);
  }

  async chat(content, history) {
    // Sends a complete message with history to the OpenRouter API and returns the assistant's reply

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`, // Auth header with bearer token
          // Optional headers for attribution and compliance:
          // "HTTP-Referer": "http://localhost:5173",
          // "X-Title": "ReactAIChatbot",
        },
        body: JSON.stringify({
          model: this.model, // Specify the model to use
          messages: [...history, { role: "user", content }], // Include conversation history + current message
        }),
      }
    );

    // Handle non-successful responses
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorText}`
      );
    }

    // Parse and return the response content
    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content || "No response from OpenRouter."
    );
  }

  async *chatStream(content, history) {
    // As of now, OpenRouter doesn't support streaming responses.
    // So, we yield the full result as a single streamed message for compatibility with stream-based UIs.
    const fullResponse = await this.chat(content, history);
    yield fullResponse;
  }
}
