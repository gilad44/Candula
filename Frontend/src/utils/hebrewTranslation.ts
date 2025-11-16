import axios from "axios";
import { hebrewTranslations } from "../constants/candleConstants";

/**
 * Auto-translate text to Hebrew using OpenAI
 */
export const translateToHebrew = async (text: string): Promise<string> => {
  try {
    const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!openaiApiKey) return text;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `Translate this candle product text to Hebrew. Keep it natural and suitable for e-commerce:

"${text}"

Return only the Hebrew translation, nothing else.`,
          },
        ],
        max_tokens: 200,
      },
      {
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text
  }
};

/**
 * Translate color with multi-color support
 */
export const translateColor = (color: string): string => {
  if (color.includes("-")) {
    // Multi-color: translate each part
    return color
      .split("-")
      .map(
        (c) =>
          hebrewTranslations.color[
            c as keyof typeof hebrewTranslations.color
          ] || c
      )
      .join("-");
  }
  return (
    hebrewTranslations.color[color as keyof typeof hebrewTranslations.color] ||
    color
  );
};

/**
 * Translate candle type to Hebrew
 */
export const translateType = (type: string): string => {
  return (
    hebrewTranslations.type[type as keyof typeof hebrewTranslations.type] ||
    type
  );
};

/**
 * Translate candle style to Hebrew
 */
export const translateStyle = (style: string): string => {
  return (
    hebrewTranslations.style[style as keyof typeof hebrewTranslations.style] ||
    style
  );
};
