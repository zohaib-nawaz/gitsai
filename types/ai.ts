export type AiProvider = "openai" | "gemini";

export interface AiConfig {
  provider: AiProvider;
  apiKey: string;
  model: string;
}
