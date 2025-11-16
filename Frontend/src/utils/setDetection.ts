import { numberWords, setKeywords } from "../constants/candleConstants";

export interface VisionLabel {
  description: string;
  score: number;
}

export interface VisionObject {
  name: string;
  score: number;
}

/**
 * Detect if the image contains a candle set or single candle
 */
export const detectCandleSet = (
  labels: VisionLabel[],
  objects: VisionObject[],
  relevantText: string
): boolean => {
  const hasSetKeywords = setKeywords.some((keyword) =>
    relevantText.includes(keyword)
  );

  const hasNumberWords = numberWords.some((keyword) =>
    relevantText.includes(keyword)
  );

  const hasPluralCandles =
    relevantText.includes("candles") &&
    !relevantText.includes("single candle") &&
    !relevantText.includes("one candle");

  const candleRelatedObjects = objects.filter((obj) => {
    const name = obj.name.toLowerCase();
    return (
      name.includes("candle") ||
      name.includes("cylinder") ||
      name.includes("tube") ||
      name.includes("jar") ||
      name.includes("container")
    );
  });

  const quantityLabels = labels.filter((label) => {
    const desc = label.description.toLowerCase();
    return (
      setKeywords.some((keyword) => desc.includes(keyword)) ||
      numberWords.some((keyword) => desc.includes(keyword)) ||
      desc.includes("multiple") ||
      desc.includes("several") ||
      desc.includes("many") ||
      /\b(two|three|four|five|six|seven|eight|nine|ten)\b/.test(desc) ||
      /\b\d+\b/.test(desc)
    );
  });

  return (
    hasSetKeywords ||
    hasNumberWords ||
    candleRelatedObjects.length > 2 ||
    quantityLabels.length > 1 ||
    (hasPluralCandles && candleRelatedObjects.length > 1)
  );
};
