import { Add, Remove } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";

type QuantitySelectorProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  isOpen: boolean;
  position?: "absolute" | "relative";
  size?: "small" | "medium";
};

const QuantitySelector = ({
  quantity,
  onIncrement,
  onDecrement,
  isOpen,
  position = "absolute",
  size = "small",
}: QuantitySelectorProps) => {
  if (!isOpen) return null;

  const isSmall = size === "small";
  const containerStyles = {
    position,
    width: isSmall ? "6rem" : "8rem",
    height: isSmall ? "1.3rem" : "2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    ...(position === "absolute" && {
      top: "0.5rem",
      left: "3rem",
      zIndex: 1000,
      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
    }),
    bgcolor: "rgba(255,255,255,0.95)",
    border: "0.05rem solid brown",
    borderRadius: "0.5rem",
    px: isSmall ? "0.5vmax" : 0.5,
  };

  const buttonSize = isSmall ? "1.2rem" : "1.5rem";
  const iconSize = isSmall ? "0.8rem" : "1rem";
  const wheelHeight = isSmall ? "1rem" : "1.5rem";
  const fontSize = isSmall ? "0.7rem" : "0.9rem";
  const lineHeight = isSmall ? "1.2rem" : "1.5rem";
  const marginTop = isSmall ? "-0.55rem" : "-0.75rem";

  return (
    <Box sx={containerStyles}>
      {/* Minus Button */}
      <IconButton
        size="small"
        onClick={onDecrement}
        sx={{
          width: buttonSize,
          height: buttonSize,
          minWidth: "unset",
          color: "brown",
          p: 0,
        }}
      >
        <Remove sx={{ fontSize: iconSize }} />
      </IconButton>

      {/* Quantity Wheel Display */}
      <Box
        sx={{
          width: "2.5rem",
          height: wheelHeight,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: `translateY(${
              -(quantity - 1) * parseFloat(lineHeight)
            }rem)`,
            transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            top: "50%",
            marginTop,
          }}
        >
          {Array.from({ length: 100 }, (_, i) => i + 1).map((num) => (
            <Typography
              key={num}
              sx={{
                fontSize,
                fontWeight: "bold",
                color: num === quantity ? "brown" : "rgba(0,0,0,0.3)",
                lineHeight,
                textAlign: "center",
              }}
            >
              {num}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Plus Button */}
      <IconButton
        size="small"
        onClick={onIncrement}
        sx={{
          width: buttonSize,
          height: buttonSize,
          minWidth: "unset",
          color: "brown",
          p: 0,
        }}
      >
        <Add sx={{ fontSize: iconSize }} />
      </IconButton>
    </Box>
  );
};

export default QuantitySelector;
