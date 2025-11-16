// Candle detection constants and configurations
export const candleColors = {
  white: ["white", "cream", "ivory", "beige", "off-white", "vanilla", "pearl"],
  red: ["red", "crimson", "rose", "burgundy", "cherry", "scarlet"],
  blue: ["blue", "navy", "royal", "azure", "cobalt", "turquoise"],
  green: ["green", "mint", "sage", "emerald", "lime", "forest"],
  yellow: ["yellow", "gold", "amber", "honey", "lemon", "canary"],
  black: ["black", "dark", "charcoal", "ebony", "jet"],
  pink: ["pink", "blush", "rose", "magenta", "fuchsia"],
  purple: ["purple", "lavender", "violet", "plum", "lilac"],
  orange: ["orange", "peach", "coral", "tangerine", "apricot"],
  brown: ["brown", "chocolate", "coffee", "tan", "bronze"],
};

export const candleStyles = {
  scented: ["scented", "fragrant", "aromatic", "perfumed", "fragrance"],
  decorative: ["decorative", "ornamental", "fancy", "artistic", "beautiful"],
  rustic: ["rustic", "natural", "handmade", "craft", "artisan", "organic"],
  elegant: ["elegant", "luxury", "premium", "sophisticated", "classy"],
  seasonal: ["christmas", "holiday", "winter", "halloween", "valentine"],
};

// Hebrew translations for candle attributes
export const hebrewTranslations = {
  type: {
    jar: "נר בצנצנת",
    pillar: "נר עמוד",
    "tea light": "נר קטן",
    taper: "נר דק",
    votive: "נר קטן עגול",
    birthday: "נר יום הולדת",
    floating: "נר צף",
    novelty: "נר מעוצב",
  },
  color: {
    white: "לבן",
    red: "אדום",
    blue: "כחול",
    green: "ירוק",
    yellow: "צהוב",
    black: "שחור",
    pink: "ורוד",
    purple: "סגול",
    orange: "כתום",
    brown: "חום",
  },
  style: {
    decorative: "דקורטיבי",
    rustic: "כפרי",
    elegant: "אלגנטי",
    seasonal: "עונתי",
    scented: "ריחני",
    "special events": "אירועים מיוחדים",
    holidays: "חגים",
  },
};

// Candle detection keywords
export const candleKeywords = [
  "candle",
  "wax",
  "wick",
  "flame",
  "light",
  "lighting",
];

// Irrelevant keywords that confuse candle detection
export const irrelevantKeywords = [
  "lampshade",
  "porcelain",
  "ceramic",
  "plastic",
  "bottled",
  "jarred",
  "packaged goods",
  "tableware",
  "serveware",
  "dishware",
  "drinkware",
  "furniture",
  "lighting accessory",
  "home decor",
  "interior design",
];

// Set detection keywords
export const setKeywords = [
  "set of",
  "candle set",
  "collection",
  "pack of",
  "bundle",
  "multiple candles",
  "several candles",
  "group of",
  "pair of",
  "trio",
  "set",
];

export const numberWords = [
  "two candles",
  "three candles",
  "four candles",
  "five candles",
  "six candles",
  "dozen candles",
  "multiple",
  "several",
  "many candles",
];
