import { candleColors } from "../constants/candleConstants";

export interface VisionColor {
  color: {
    red?: number;
    green?: number;
    blue?: number;
  };
  score: number;
}

/**
 * Enhanced candle color detection that handles multiple colors and sets
 */
export const findCandleColorVisual = (
  colors: VisionColor[],
  relevantText: string
): string => {
  const detectedTextColors = [];
  for (const [colorName, keywords] of Object.entries(candleColors)) {
    if (keywords.some((keyword) => relevantText.includes(keyword))) {
      detectedTextColors.push(colorName);
    }
  }

  if (detectedTextColors.length > 0) {
    if (detectedTextColors.length > 1) {
      return detectedTextColors.slice(0, 3).join("-");
    }
    return detectedTextColors[0];
  }

  if (colors.length > 0) {
    const detectedVisualColors = [];
    const processedColors = new Set();

    for (let i = 0; i < Math.min(colors.length, 8); i++) {
      const colorSample = colors[i]?.color;
      if (!colorSample) continue;

      const { red = 0, green = 0, blue = 0 } = colorSample;
      const score = colors[i].score || 0;

      const brightness = (red + green + blue) / 3;
      const maxChannel = Math.max(red, green, blue);
      const minChannel = Math.min(red, green, blue);
      const saturation =
        maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0;

      if (brightness > 200 && saturation < 0.1) {
        continue;
      }

      if (brightness > 220) {
        continue;
      }

      let detectedColor = null;

      if (saturation > 0.15 || brightness < 150) {
        if (brightness < 60 && saturation < 0.3 && score > 0.1) {
          detectedColor = "black";
        } else if (saturation > 0.2) {
          const threshold = 20;

          if (
            red === maxChannel &&
            red > green + threshold &&
            red > blue + threshold &&
            red > 80
          ) {
            detectedColor = "red";
          } else if (
            blue === maxChannel &&
            blue > red + threshold &&
            blue > green + threshold &&
            blue > 80
          ) {
            detectedColor = "blue";
          } else if (
            green === maxChannel &&
            green > red + threshold &&
            green > blue + threshold &&
            green > 80
          ) {
            detectedColor = "green";
          } else if (
            red > 100 &&
            green > 100 &&
            blue < red - 25 &&
            blue < green - 25
          ) {
            detectedColor = "yellow";
          } else if (red > 120 && green > 70 && green < red - 15 && blue < 90) {
            detectedColor = "orange";
          } else if (
            red > 130 &&
            green > 90 &&
            blue > 90 &&
            red > green + 10 &&
            brightness < 200
          ) {
            detectedColor = "pink";
          } else if (
            red > 90 &&
            blue > 90 &&
            green < red - 15 &&
            green < blue - 15
          ) {
            detectedColor = "purple";
          } else if (
            red > 80 &&
            green > 50 &&
            green < red - 15 &&
            blue < 70 &&
            brightness < 130
          ) {
            detectedColor = "brown";
          }
        } else if (saturation < 0.2 && brightness > 120 && brightness < 200) {
          if (red > green && red > blue && red - blue > 15) {
            detectedColor = "white";
          }
        }
      }

      if (detectedColor && !processedColors.has(detectedColor)) {
        detectedVisualColors.push(detectedColor);
        processedColors.add(detectedColor);

        if (detectedVisualColors.length >= 3) break;
      }
    }

    if (detectedVisualColors.length > 1) {
      return detectedVisualColors.join("-");
    } else if (detectedVisualColors.length === 1) {
      return detectedVisualColors[0];
    }

    let bestColorSample = null;
    let bestSaturation = 0;

    for (let i = 0; i < Math.min(colors.length, 3); i++) {
      const colorSample = colors[i]?.color;
      if (!colorSample) continue;

      const { red = 0, green = 0, blue = 0 } = colorSample;
      const brightness = (red + green + blue) / 3;
      const maxChannel = Math.max(red, green, blue);
      const minChannel = Math.min(red, green, blue);
      const saturation =
        maxChannel > 0 ? (maxChannel - minChannel) / maxChannel : 0;

      if (
        saturation > bestSaturation &&
        brightness < 240 &&
        saturation > 0.05
      ) {
        bestSaturation = saturation;
        bestColorSample = { red, green, blue };
      }
    }

    if (bestColorSample && bestSaturation > 0.08) {
      const { red, green, blue } = bestColorSample;

      const maxChannel = Math.max(red, green, blue);
      if (red === maxChannel && red > green + 10 && red > blue + 10) {
        return "red";
      }
      if (blue === maxChannel && blue > red + 10 && blue > green + 10) {
        return "blue";
      }
      if (green === maxChannel && green > red + 10 && green > blue + 10) {
        return "green";
      }
    }
  }

  return "white";
};
