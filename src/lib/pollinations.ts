import { Message } from "@/types/message";
import { DEFAULT_SYSTEM_PROMPT } from "./constants";

export const generateContent = async (
  messages: Message[],
  model: string = "openai",
) => {
  const response = await fetch("https://text.pollinations.ai/openai", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: DEFAULT_SYSTEM_PROMPT,
        },
        ...messages,
      ],
      private: true,
      seed: Math.floor(Math.random() * (1000 - 100 + 1)) + 100,
    }),
  });

  if (!response.ok) {
    throw new Error("An error occurred during content generation");
  }

  const data = await response.json();
  const content: string = data["choices"][0]["message"]["content"];

  return content;
};
