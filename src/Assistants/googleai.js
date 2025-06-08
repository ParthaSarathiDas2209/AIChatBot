import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the Google Generative AI SDK

// Initialize Google Generative AI client using API key from environment variables
const googleai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

// Export the Assistant class to handle chat functionality
export class Assistant {
  #chat; // Private property to store the chat session instance

  constructor(model = "gemini-1.5-flash") {
    // Constructor sets the model to use (default is Gemini 1.5 Flash)
    const gemini = googleai.getGenerativeModel({ model }); // Get the generative model
    this.#chat = gemini.startChat({ history: [] }); // Start a new chat session with empty history
  }

  async chat(content) {
    // Sends a message and returns a single response from the model
    try {
      const result = await this.#chat.sendMessage(content); // Send user message
      return result.response.text(); // Return the response as plain text
    } catch (error) {
      throw error; // Re-throw error for external handling
    }
  }

  async *chatStream(content) {
    // Sends a message and returns a streamed response using a generator
    try {
      const result = await this.#chat.sendMessageStream(content); // Send user message and receive streaming response
      for await (const chunk of result.stream) {
        // Iterate over streamed response chunks
        yield chunk.text(); // Yield each chunk's text
      }
    } catch (error) {
      throw error; // Re-throw error for external handling
    }
  }
}
