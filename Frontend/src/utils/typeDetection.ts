export interface VisionObject {
  name: string;
  score: number;
}

/**
 * Detect candle type from objects and text analysis
 */
export const findCandleTypeVisual = (
  objects: VisionObject[],
  relevantText: string
): string => {
  for (const obj of objects) {
    const name = obj.name.toLowerCase();

    if (
      name.includes("jar") ||
      name.includes("container") ||
      name.includes("vessel") ||
      name.includes("tumbler") ||
      name.includes("glass")
    ) {
      return "jar";
    }

    if (
      name.includes("cylinder") ||
      name.includes("tube") ||
      name.includes("column")
    ) {
      if (name.includes("thin") || name.includes("slim")) {
        return "taper";
      } else {
        return "pillar";
      }
    }
  }

  if (
    relevantText.includes("jar") ||
    relevantText.includes("container") ||
    relevantText.includes("vessel") ||
    relevantText.includes("tumbler") ||
    relevantText.includes("glass candle")
  ) {
    return "jar";
  }

  if (
    relevantText.includes("taper") ||
    relevantText.includes("thin") ||
    relevantText.includes("tall") ||
    relevantText.includes("stick") ||
    relevantText.includes("dinner candle") ||
    relevantText.includes("slim") ||
    relevantText.includes("long")
  ) {
    return "taper";
  }

  if (
    relevantText.includes("tea light") ||
    relevantText.includes("tealight") ||
    relevantText.includes("small") ||
    relevantText.includes("mini") ||
    relevantText.includes("tiny")
  ) {
    return "tea light";
  }

  if (
    relevantText.includes("votive") ||
    relevantText.includes("prayer candle")
  ) {
    return "votive";
  }

  if (
    relevantText.includes("pillar") ||
    relevantText.includes("thick") ||
    relevantText.includes("wide") ||
    relevantText.includes("chunky") ||
    relevantText.includes("round")
  ) {
    return "pillar";
  }

  if (relevantText.includes("birthday") || relevantText.includes("party")) {
    return "birthday";
  }

  if (relevantText.includes("floating") || relevantText.includes("water")) {
    return "floating";
  }

  if (
    relevantText.includes("shaped") ||
    relevantText.includes("figure") ||
    relevantText.includes("animal") ||
    relevantText.includes("flower") ||
    relevantText.includes("heart")
  ) {
    return "novelty";
  }

  if (objects.length > 1) {
    const hasSmallIndicators =
      relevantText.includes("small") || relevantText.includes("mini");
    const hasThinIndicators =
      relevantText.includes("thin") || relevantText.includes("tall");

    if (hasSmallIndicators) {
      return "tea light";
    } else if (hasThinIndicators) {
      return "taper";
    } else {
      return "pillar";
    }
  }

  if (
    relevantText.includes("decorative") ||
    relevantText.includes("luxury") ||
    relevantText.includes("home") ||
    relevantText.includes("elegant")
  ) {
    return "jar";
  }

  if (
    relevantText.includes("lighting") ||
    relevantText.includes("ambiance") ||
    relevantText.includes("mood")
  ) {
    return "pillar";
  }

  return "jar";
};
