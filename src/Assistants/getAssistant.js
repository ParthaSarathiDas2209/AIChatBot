// Import assistant classes from different AI provider modules
import { Assistant as GoogleAssistant } from "./googleai";
import { Assistant as OpenAIAssistant } from "./openai";
import { Assistant as OpenRouterAssistant } from "./openrouter";

// Factory function to return an Assistant instance based on selected provider and model
export function getAssistant(provider, model) {
  switch (
    provider.toLowerCase() // Convert provider name to lowercase to handle case-insensitive input
  ) {
    case "google":
      return new GoogleAssistant(); // Return Google Assistant instance

    case "openai":
      return new OpenAIAssistant(); // Return OpenAI Assistant instance

    case "openrouter":
      return new OpenRouterAssistant(model); // Return OpenRouter Assistant with selected model

    default:
      // Throw an error if the provider is not recognized
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
