import { Assistant as GoogleAssistant } from "./googleai";
import { Assistant as OpenAIAssistant } from "./openai";
import { Assistant as OpenRouterAssistant } from "./openrouter";

export function getAssistant(provider, model) {
  switch (provider.toLowerCase()) {
    case "google":
      return new GoogleAssistant();
    case "openai":
      return new OpenAIAssistant();
    case "openrouter":
      return new OpenRouterAssistant(model);
    default:
      throw new Error(`Unknown AI provider: ${provider}`);
  }
}
