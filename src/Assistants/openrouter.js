const openrouterApiKey = import.meta.env.VITE_OPENROUTER_AI_API_KEY;

export class Assistant {
  constructor(model = "gryphe/mythomax-l2-13b") {
    this.model = model;
    this.apiKey = import.meta.env.VITE_OPENROUTER_AI_API_KEY;
    // console.log("Using OpenRouter model:", this.model);
  }

  async chat(content, history) {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
          // "HTTP-Referer": "http://localhost:5173",
          // "X-Title": "ReactAIChatbot",
        },
        body: JSON.stringify({
          model: this.model,
          messages: [...history, { role: "user", content }],
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `OpenRouter API error: ${response.status} - ${errorText}`
      );
    }

    const data = await response.json();
    return (
      data.choices?.[0]?.message?.content || "No response from OpenRouter."
    );
  }

  async *chatStream(content, history) {
    // OpenRouter doesn't support streaming (as of now), so we fallback to full response
    const fullResponse = await this.chat(content, history);
    yield fullResponse;
  }
}
