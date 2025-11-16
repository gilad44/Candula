import axios from "axios";
import { useState } from "react";
import type { UseFormSetValue, UseFormTrigger } from "react-hook-form";
import {
  candleKeywords,
  irrelevantKeywords,
} from "../constants/candleConstants";
import { findCandleColorVisual } from "../utils/colorDetection";
import {
  translateColor,
  translateStyle,
  translateToHebrew,
  translateType,
} from "../utils/hebrewTranslation";
import { detectCandleSet } from "../utils/setDetection";
import { findCandleStyleSmart } from "../utils/styleDetection";
import { findCandleTypeVisual } from "../utils/typeDetection";

export interface NewProductProps {
  filename: string;
  type: string;
  title: string;
  description: string;
  color: string | string[];
  shape: string;
  isSet: boolean;
  price: number;
  tags: string[];
  variants?: object[];
  scent?: string;
  sku?: string;
  style?: string;
}

interface VisionLabel {
  description: string;
  score: number;
}

interface VisionObject {
  name: string;
  score: number;
}

interface VisionColor {
  color: {
    red?: number;
    green?: number;
    blue?: number;
  };
  score: number;
}

interface OpenAIAnalysis {
  filename: string;
  type: string;
  title: string;
  description: string;
  color: string | string[];
  shape: string;
  isSet: boolean;
  price: number;
  tags: string[];
  variants?: object[];
  scent?: string;
  sku?: string;
  style?: string;
}

export const useAIAnalysis = (
  setValue: UseFormSetValue<NewProductProps>,
  trigger: UseFormTrigger<NewProductProps>
) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeImage = async (base64Image: string) => {
    setIsAnalyzing(true);
    try {
      console.log("🔍 Starting OpenAI Vision analysis...");

      const openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!openaiApiKey) {
        alert("❌ No OpenAI API key found. Please check your .env file.");
        return;
      }

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `Analyze this candle image and return a JSON object with these exact fields:
{
  "filename": "image filename (e.g. IMG-20250427-WA0000.jpg)",
  "type": "pillar|jar|taper|tea light|votive|birthday|floating|novelty",
  "title": "short descriptive product title (2-4 words)",
  "description": "detailed product description (20-50 words describing the candle's appearance, style, and features)",
  "color": "actual color name(s) like white, red, blue, green, etc. (string or array)",
  "shape": "shape name",
  "isSet": "true if multiple candles visible, false for single candle",
  "price": "number",
  "tags": ["tag1", "tag2", ...],
  "variants": [ { ... } ],
  "scent": "optional scent",
  "sku": "optional sku"
}

IMPORTANT INSTRUCTIONS:
- Type: jar (glass container), pillar (thick standalone), taper (thin tall), tea light (small round)
- Color: ALWAYS specify the actual color(s) you see (white, red, blue, green, yellow, black, pink, purple, orange, brown, cream, etc.). If multiple colors, use array or hyphens. NEVER write "single color" or "multi-color" - always name the actual colors.
- Shape: describe the shape (e.g. twisted_column, heart_cube, sphere, etc.)
- isSet: Set to true if you see multiple candles in the image (2 or more), false for single candle
- Title: short descriptive name (include "set" if multiple candles)
- Description: Write a detailed, appealing product description (minimum 15 words) describing the candle's appearance, texture, style, and any decorative features you can see
- Style: Use ONLY these options: decorative, rustic, elegant, seasonal, scented. Choose based on visual appearance, NOT scent.
- Scent: If the candle appears to be scented or you can see scent-related labeling, provide the actual scent name (e.g. "vanilla", "lavender", "rose"), otherwise leave empty
- Tags: array of relevant tags
- Variants: array of objects for product variants (if any)
- Be accurate about what you actually see, not assumptions
- For color, look carefully at the candle wax itself, not the background`,
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`,
                  },
                },
              ],
            },
          ],
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${openaiApiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📋 OpenAI Vision response:", response.data);

      const content = response.data.choices[0].message.content;
      console.log("📝 Raw content:", content);

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        console.log("🎯 Parsed analysis:", analysis);

        await fillFormFromOpenAI(analysis);
      } else {
        throw new Error("Could not parse JSON from OpenAI response");
      }
    } catch (error: unknown) {
      console.error("❌ Error analyzing image:", error);
      handleAnalysisError(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const fillFormFromOpenAI = async (analysis: OpenAIAnalysis) => {
    console.log("🤖 Filling form with OpenAI analysis:", analysis);
    console.log("🔄 Translating to Hebrew...");

    // Translate attributes to Hebrew
    const hebrewType = translateType(analysis.type);
    // Handle color as string or array
    const colorValue = Array.isArray(analysis.color)
      ? analysis.color.join("-")
      : analysis.color;
    const hebrewColor = translateColor(colorValue);
    // Translate title and description using AI
    console.log("🔄 About to translate:", {
      originalTitle: analysis.title,
      originalDescription: analysis.description,
    });

    const [hebrewTitle, hebrewDescription] = await Promise.all([
      translateToHebrew(analysis.title || "Candle"),
      translateToHebrew(analysis.description || "Beautiful decorative candle"),
    ]);

    console.log("🌍 Hebrew translations:", {
      type: hebrewType,
      color: hebrewColor,
      title: hebrewTitle,
      description: hebrewDescription,
      originalDescription: analysis.description,
      translatedDescription: hebrewDescription,
    });

    // Handle multi-color scenarios - select primary color from available options
    const availableColors = [
      "לבן",
      "אדום",
      "כחול",
      "ירוק",
      "צהוב",
      "שחור",
      "ורוד",
      "סגול",
      "כתום",
      "חום",
    ];

    let finalColor: string | string[] = hebrewColor;

    // Check if it's a set to determine if we should return array or single color
    const isSetValue = analysis.isSet || false;

    if (hebrewColor && hebrewColor.includes("-")) {
      const colorParts = hebrewColor.split(/[-,\s]+/).map((c) => c.trim());
      const validColors = colorParts.filter((color) =>
        availableColors.includes(color)
      );

      if (isSetValue && validColors.length > 1) {
        // For sets, return array of colors if multiple valid colors found
        finalColor = validColors;
      } else {
        // For single candles or sets with only one color, return first valid color
        finalColor = validColors[0] || availableColors[0];
      }
    } else if (hebrewColor && !availableColors.includes(hebrewColor)) {
      // If single color but not in available list, try to find closest match
      finalColor =
        availableColors.find((color) => hebrewColor.includes(color)) ||
        availableColors[0];
    }

    console.log("🎨 Color processing:", {
      original: hebrewColor,
      final: finalColor,
      isSet: isSetValue,
      available: availableColors,
    });

    setValue("type", hebrewType);
    setValue("color", finalColor);
    setValue("title", (hebrewTitle || "נר יפה").replace(/^["']|["']$/g, ""));
    setValue(
      "description",
      (hebrewDescription || "נר דקורטיבי יפה").replace(/^["']|["']$/g, "")
    );

    // Smart isSet detection: fallback logic if OpenAI doesn't detect it properly
    let smartIsSet = analysis.isSet || false;

    // Additional detection based on other indicators
    if (!smartIsSet) {
      const titleLower = (hebrewTitle || "").toLowerCase();
      const descLower = (hebrewDescription || "").toLowerCase();
      const hasSetKeywords =
        titleLower.includes("סט") ||
        titleLower.includes("set") ||
        descLower.includes("סט") ||
        descLower.includes("multiple") ||
        Array.isArray(finalColor);

      smartIsSet = hasSetKeywords;
    }

    setValue("isSet", smartIsSet);

    console.log("🔍 Set detection:", {
      originalIsSet: analysis.isSet,
      smartIsSet,
      finalColor: Array.isArray(finalColor)
        ? `Array(${finalColor.length})`
        : finalColor,
    });

    // Translate shape to Hebrew
    const hebrewShape = await translateToHebrew(analysis.shape || "round");
    setValue("shape", (hebrewShape || "עגול").replace(/^["']|["']$/g, ""));

    // Translate tags to Hebrew
    const hebrewTags =
      analysis.tags && analysis.tags.length > 0
        ? await Promise.all(analysis.tags.map((tag) => translateToHebrew(tag)))
        : ["נר", hebrewColor, hebrewType];
    setValue(
      "tags",
      hebrewTags.filter(Boolean).map((tag) => tag.replace(/^["']|["']$/g, ""))
    );

    // Set style if present (validate it's not a scent name)
    if (analysis.style) {
      // Check if the style looks like a scent name that was misplaced
      const scentWords = [
        "vanilla",
        "lavender",
        "rose",
        "jasmine",
        "sandalwood",
        "cedar",
        "citrus",
        "mint",
        "cinnamon",
        "scent",
        "fragrance",
      ];
      const isActuallyScent = scentWords.some((scent) =>
        analysis.style.toLowerCase().includes(scent.toLowerCase())
      );

      if (isActuallyScent) {
        console.log(
          "🔄 Detected scent in style field, moving to scent:",
          analysis.style
        );
        setValue("scent", analysis.style);
        setValue("style", "scented"); // Set style to scented since it has a scent
      } else {
        setValue("style", translateStyle(analysis.style));
      }
    } else {
      setValue("style", "");
    }

    // Set scent if present (translate to Hebrew)
    if (
      analysis.scent &&
      !analysis.style?.toLowerCase().includes(analysis.scent.toLowerCase())
    ) {
      const hebrewScent = await translateToHebrew(analysis.scent);
      setValue("scent", (hebrewScent || "").replace(/^["']|["']$/g, ""));
      console.log("🌸 Scent translation:", {
        original: analysis.scent,
        hebrew: hebrewScent,
      });
    } else if (!analysis.scent && !analysis.style) {
      setValue("scent", "");
    }

    // Generate SKU (keep in English for inventory)
    const sku = `CND-${analysis.type.toUpperCase()}-${colorValue
      .toString()
      .substring(0, 3)
      .toUpperCase()}-${Date.now().toString().slice(-4)}`;
    setValue("sku", sku);
    // Set pricing
    setValue("price", analysis.isSet ? 24.99 : 12.99);
    trigger();
    console.log("✅ Form filled successfully with Hebrew translations!");
  };

  const fillFormFromAnalysis = (
    labels: VisionLabel[],
    objects: VisionObject[],
    colors: VisionColor[]
  ) => {
    console.log("🧠 Processing AI analysis results...");

    // Filter out irrelevant labels
    const filteredLabels = labels.filter((label) => {
      const desc = label.description.toLowerCase();
      return !irrelevantKeywords.some((keyword) => desc.includes(keyword));
    });

    console.log(
      "🏷️ Original labels:",
      labels.map((l) => l.description)
    );
    console.log(
      "🔍 Filtered labels:",
      filteredLabels.map((l) => l.description)
    );

    // Focus on candle-relevant terms
    const relevantText = filteredLabels
      .map((l) => l.description.toLowerCase())
      .join(" ");

    console.log("🔤 Relevant text for analysis:", relevantText);
    console.log(
      "🎯 Objects detected:",
      objects.map((o) => o.name)
    );

    // Candle detection
    const isCandleDetected = candleKeywords.some(
      (keyword) =>
        relevantText.includes(keyword) ||
        objects.some((o) => o.name.toLowerCase().includes(keyword))
    );

    console.log("🕯️ Candle detected:", isCandleDetected);

    if (!isCandleDetected) {
      console.warn("⚠️ No candle-specific features detected");
      console.log("🔍 Attempting visual-based candle detection...");
    }

    // Enhanced detection
    const foundColor = findCandleColorVisual(colors, relevantText);
    const foundType = findCandleTypeVisual(objects, relevantText);
    const foundStyle = findCandleStyleSmart(filteredLabels);
    const isSet = detectCandleSet(labels, objects, relevantText);

    console.log("🎯 Final AI Matches:", {
      foundType,
      foundColor,
      foundStyle,
      isSet,
    });

    // Fill form fields
    setValue("type", foundType || "pillar");
    setValue("color", foundColor || "white");
    setValue("isSet", isSet);
    setValue("style", foundStyle || "");

    // Generate intelligent title
    const setPrefix = isSet ? "סט " : "";
    const titleParts = [
      setPrefix,
      foundColor,
      foundType,
      isSet ? "נרות" : "נר",
    ].filter(Boolean);
    const generatedTitle = titleParts.join(" ");
    setValue("title", generatedTitle);

    // Create description
    const candleRelevantLabels = filteredLabels
      .filter((label) => {
        const desc = label.description.toLowerCase();
        return (
          desc.includes("candle") ||
          desc.includes("wax") ||
          desc.includes("light") ||
          desc.includes("decorative") ||
          desc.includes("beautiful") ||
          desc.includes("elegant") ||
          desc.includes("white") ||
          desc.includes("colored") ||
          foundColor === desc ||
          desc.includes("fragrant") ||
          desc.includes("scented") ||
          desc.includes("aromatic")
        );
      })
      .slice(0, 3)
      .map((l) => l.description);

    const description =
      candleRelevantLabels.length > 0
        ? `נר יפה עם: ${candleRelevantLabels.join(", ")}`
        : `נר ${foundColor} ${foundType} מושלם ל${foundStyle} תאורה.`;

    setValue("description", description);

    // Generate SKU
    const sku = `CND-${(foundType || "GEN").toUpperCase()}-${(
      foundColor || "CLR"
    )
      .toString()
      .toUpperCase()}-${Date.now().toString().slice(-4)}`;
    setValue("sku", sku);

    // Set defaults
    setValue("price", 29.99);

    console.log("📝 Form filled with:", {
      title: generatedTitle,
      type: foundType,
      color: foundColor,
      isSet: isSet,
      sku,
      style: foundStyle,
    });

    trigger();
    console.log("✅ AI analysis complete!");
  };

  const handleAnalysisError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        alert(
          "⏰ Rate limit exceeded. Please wait 1-2 minutes and try again.\n\nTip: Free accounts have low rate limits. Consider upgrading if you need more usage."
        );
      } else if (error.response?.status === 401) {
        alert(
          "🔑 Invalid API key. Please check your OpenAI API key in the .env file."
        );
      } else if (error.response?.status === 403) {
        alert("⛔ Access denied. Please check your API key permissions.");
      } else if (error.response?.status === 400) {
        alert(
          "📝 Bad request. The image might be too large or in an unsupported format."
        );
      } else {
        const message = error.message || "Unknown error";
        alert(`❌ Failed to analyze image: ${message}\n\nPlease try again.`);
      }
    } else {
      const message = error instanceof Error ? error.message : "Unknown error";
      alert(`❌ Failed to analyze image: ${message}\n\nPlease try again.`);
    }
  };

  return {
    isAnalyzing,
    analyzeImage,
    fillFormFromAnalysis,
  };
};
