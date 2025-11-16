// Common style constants to reduce repetition throughout the app

export const COLORS = {
  primary: "#7f6000",
  primaryLight: "rgb(247, 239, 169)",
  primaryDark: "brown",
  background: "linear-gradient(to right, black, rgb(247, 239, 169))",
  gradientYellow: "linear-gradient(to right, rgb(255, 249, 193) 30%, rgb(242, 223, 59) 80%)",
  white: "#ffffff",
  black: "#000000",
  gray: "#666",
  lightGray: "#f5f5f5",
} as const;

export const BREAKPOINTS = {
  xs3: "3xs",
  xs2: "2xs", 
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  xl2: "2xl"
} as const;

export const COMMON_STYLES = {
  rtlDirection: {
    direction: "rtl" as const,
  },
  centerFlex: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  spaceBetweenFlex: {
    display: "flex",
    alignItems: "center", 
    justifyContent: "space-between",
  },
  columnFlex: {
    display: "flex",
    flexDirection: "column" as const,
  },
  gradientBackground: {
    background: COLORS.background,
  },
  formControl: {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: COLORS.primary,
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: COLORS.primary,
      borderWidth: "2px",
    },
  },
  inputLabel: {
    color: COLORS.primaryDark,
    "&.Mui-focused": {
      color: COLORS.primaryDark,
    },
  },
  hideScrollbar: {
    scrollbarWidth: "none",
    msOverflowStyle: "none", 
    "&::-webkit-scrollbar": { display: "none" },
  },
} as const;

export const RESPONSIVE_SIZES = {
  logo: {
    width: {
      [BREAKPOINTS.xs3]: "10vmax",
      [BREAKPOINTS.sm]: "8vmax", 
      [BREAKPOINTS.md]: "6vmax",
      [BREAKPOINTS.lg]: "5vmax",
      [BREAKPOINTS.xl]: "4vmax",
    },
    height: {
      [BREAKPOINTS.xs3]: "10vmax",
      [BREAKPOINTS.sm]: "8vmax",
      [BREAKPOINTS.md]: "6vmax", 
      [BREAKPOINTS.lg]: "5vmax",
      [BREAKPOINTS.xl]: "4vmax",
    },
  },
  titleFont: {
    fontSize: {
      [BREAKPOINTS.xs3]: "6vmax",
      [BREAKPOINTS.sm]: "4vmax",
      [BREAKPOINTS.md]: "3vmax",
      [BREAKPOINTS.lg]: "2.1vmax", 
      [BREAKPOINTS.xl]: "2vmax",
    },
  },
  subtitleFont: {
    fontSize: {
      [BREAKPOINTS.xs3]: "3vmax",
      [BREAKPOINTS.md]: "1.6vmax",
      [BREAKPOINTS.lg]: "1.4vmax",
    },
  },
} as const;
