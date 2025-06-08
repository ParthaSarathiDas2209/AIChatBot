import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the Google Generative AI library

const googleai = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY); // Create a new Google Generative AI client, using the API key from environment variables

export class Assistant {
  // Export a class named Assistant to manage the conversation with the AI
  #chat; // Private property to store the active chat session

  constructor(model = "gemini-1.5-flash") {
    // Constructor, takes an optional model parameter, defaults to "gemini-1.5-flash"
    const gemini = googleai.getGenerativeModel({ model }); // Get the specified generative model from the Google AI client
    this.#chat = gemini.startChat({ history: [] }); // Start a new chat session with an empty history
  }

  async chat(content) {
    // Asynchronous method to send a message and get a single response
    try {
      const result = await this.#chat.sendMessage(content); // Send the message to the chat session
      return result.response.text(); // Return the text of the AI's response
    } catch (error) {
      // Catch any errors during the process
      throw error; // Re-throw the error to be handled by the caller
    }
  }

  async *chatStream(content) {
    // Asynchronous generator method to send a message and get a streamed response
    try {
      const result = await this.#chat.sendMessageStream(content); // Send the message to the chat session, requesting a stream
      for await (const chunk of result.stream) {
        // Iterate over the stream of response chunks
        yield chunk.text(); // Yield each chunk's text, allowing the caller to process the response incrementally
      }
    } catch (error) {
      // Catch any errors during the process
      throw error; // Re-throw the error to be handled by the caller
    }
  }
}
