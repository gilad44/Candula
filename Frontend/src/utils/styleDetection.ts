import { candleStyles } from "../constants/candleConstants";

export interface VisionLabel {
  description: string;
  score: number;
}

/**
 * Find matching keywords in detected text
 */
export const findMatch = (
  detectedText: string,
  attributeObject: Record<string, string[]>
): string | null => {
  for (const [key, keywords] of Object.entries(attributeObject)) {
    if (keywords.some((keyword) => detectedText.includes(keyword))) {
      return key;
    }
  }
  return null;
};

/**
 * Detect candle style from filtered labels and context
 */
export const findCandleStyleSmart = (filteredLabels: VisionLabel[]): string => {
  const labelText = filteredLabels
    .map((l) => l.description.toLowerCase())
    .join(" ");

  const styleMatch = findMatch(labelText, candleStyles);
  if (styleMatch) {
    return styleMatch;
  }

  if (
    labelText.includes("luxury") ||
    labelText.includes("elegant") ||
    labelText.includes("sophisticated")
  ) {
    return "elegant";
  }

  if (
    labelText.includes("decoration") ||
    labelText.includes("ornament") ||
    labelText.includes("beautiful") ||
    labelText.includes("artistic")
  ) {
    return "decorative";
  }

  if (
    labelText.includes("natural") ||
    labelText.includes("organic") ||
    labelText.includes("handmade") ||
    labelText.includes("rustic")
  ) {
    return "rustic";
  }

  if (
    labelText.includes("scent") ||
    labelText.includes("fragrant") ||
    labelText.includes("aroma")
  ) {
    return "scented";
  }

  return "decorative";
};
