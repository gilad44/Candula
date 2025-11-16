import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import {
  Box,
  Button,
  Collapse,
  createTheme,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
  ThemeProvider,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { productsData } from "../data/productsData";

type FilterState = {
  color: string;
  size: string;
  scent: string;
  type: string;
  price: number[];
};
type FilterProps = {
  onFilterChange?: (filters: FilterState) => void;
};
const Filter = ({ onFilterChange }: FilterProps) => {
  const [color, setColor] = useState<string>("");
  const [size, setSize] = useState<string>("");
  const [scent, setScent] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [price, setPrice] = useState<number[]>([0, 500]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Extract unique values from products data
  const colors = [
    ...new Set(
      productsData.flatMap((product) =>
        Array.isArray(product.color) ? product.color : [product.color]
      )
    ),
  ]
    .filter(Boolean)
    .sort();

  const scents = [
    ...new Set(
      productsData
        .filter((product) => product.scent)
        .map((product) => product.scent)
    ),
  ]
    .filter(Boolean)
    .sort();

  const types = [
    ...new Set(productsData.map((product) => product.type)),
  ].sort();

  // Extract sizes from variants and tags
  const sizes = [
    ...new Set([
      ...productsData.flatMap((product) =>
        product.variants
          ? product.variants.map((v) => v.size).filter(Boolean)
          : []
      ),
      "גדול",
      "בינוני",
      "קטן", // Keep common sizes
    ]),
  ]
    .filter(Boolean)
    .sort();

  const handleFilters = () => {
    const filters: FilterState = {
      color,
      size,
      scent,
      type,
      price,
    };
    onFilterChange?.(filters);
    setIsFilterOpen(false);
  };
  const handleResetFilters = () => {
    // Reset all state to initial values
    setColor("");
    setSize("");
    setScent("");
    setType("");
    setPrice([0, 500]);

    // Send cleared filters to parent
    const clearedFilters: FilterState = {
      color: "",
      size: "",
      scent: "",
      type: "",
      price: [0, 500],
    };
    onFilterChange?.(clearedFilters);
    setIsFilterOpen(false);
  };
  const theme = createTheme({
    direction: "rtl",
  });
  return (
    <>
      <Box sx={{ display: { "3xs": "none", md: "block" } }}>
        <Typography
          ml={3}
          width={"100%"}
          mt={2}
          sx={{ fontSize: { "3xs": "1rem", md: "1.5rem" } }}
        >
          סינון מוצרים
        </Typography>
        <Box
          display="flex"
          justifyContent="start"
          alignItems="space-around"
          width="100%"
          mt={1}
        >
          <Stack px={2} sx={{ gap: { "3xs": 2, md: 2 } }}>
            <Box display={"flex"} alignItems={"center"}>
              <FormControl>
                <InputLabel
                  sx={{
                    mt: "-0.7rem",
                    fontSize: { "3xs": "0.6rem", md: "1.1rem" },
                    color: "brown",
                    "&.Mui-focused": {
                      color: "brown",
                    },
                  }}
                >
                  צבע
                </InputLabel>
                <Select
                  sx={{
                    width: { "3xs": "20vmax", md: "19vmax" },
                    height: "3vmax",
                    color: "brown",

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                    },
                  }}
                  size="small"
                  value={color}
                  label="צבע"
                  onChange={(e) => setColor(e.target.value)}
                >
                  {colors.map((colorOption) => (
                    <MenuItem key={colorOption} value={colorOption}>
                      {colorOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <FormControl>
                <InputLabel
                  sx={{
                    mt: "-0.7rem",
                    fontSize: { "3xs": "0.6rem", md: "1.1rem" },
                    color: "brown",
                    "&.Mui-focused": {
                      color: "brown",
                    },
                  }}
                >
                  ניחוח
                </InputLabel>
                <Select
                  sx={{
                    width: "19vmax",
                    height: "3vmax",
                    color: "brown",

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                    },
                  }}
                  size="small"
                  value={scent}
                  label="ניחוח"
                  onChange={(e) => setScent(e.target.value)}
                >
                  {scents.map((scentOption) => (
                    <MenuItem key={scentOption} value={scentOption}>
                      {scentOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <FormControl>
                <InputLabel
                  sx={{
                    mt: "-0.7rem",
                    fontSize: { "3xs": "0.6rem", md: "1.1rem" },
                    color: "brown",
                    "&.Mui-focused": {
                      color: "brown",
                    },
                  }}
                >
                  סוג נר
                </InputLabel>
                <Select
                  sx={{
                    width: "19vmax",
                    height: "3vmax",
                    color: "brown",

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                    },
                  }}
                  size="small"
                  value={type}
                  label="סוג נר"
                  onChange={(e) => setType(e.target.value)}
                >
                  {types.map((typeOption) => (
                    <MenuItem key={typeOption} value={typeOption}>
                      {typeOption.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box display={"flex"} alignItems={"center"}>
              <FormControl>
                <InputLabel
                  sx={{
                    mt: "-0.7rem",
                    fontSize: { "3xs": "0.6rem", md: "1.1rem" },
                    color: "brown",
                    "&.Mui-focused": {
                      color: "brown",
                    },
                  }}
                >
                  גודל
                </InputLabel>
                <Select
                  sx={{
                    width: "19vmax",
                    height: "3vmax",
                    color: "black",

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                    },
                  }}
                  size="small"
                  value={size}
                  label="גודל"
                  onChange={(e) => setSize(e.target.value)}
                >
                  {sizes.map((sizeOption) => (
                    <MenuItem key={sizeOption} value={sizeOption}>
                      {sizeOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box
              textAlign={"center"}
              sx={{ mr: "7rem", mt: "1rem", width: "100%" }}
            >
              <Typography fontSize="0.9rem">
                מחיר: ₪{price[0]} - ₪{price[1]}
              </Typography>
              <ThemeProvider theme={theme}>
                <Slider
                  size="small"
                  sx={{
                    width: "90%",
                    "& .MuiSlider-track": {
                      background:
                        "linear-gradient(45deg, #8b4513, #cd853f, #ffd700)",
                      border: "none",
                    },
                    "& .MuiSlider-thumb": {
                      background:
                        "linear-gradient(45deg, #8b4513, #cd853f, #ffd700)",
                      "&:hover": {
                        boxShadow: "0px 0px 0px 8px rgba(127, 96, 0, 0.16)",
                      },
                    },
                    "& .MuiSlider-rail": {
                      background:
                        "linear-gradient(45deg, #8b4513, #cd853f, #ffd700)",
                    },
                  }}
                  value={price}
                  onChange={(_, newValue) => setPrice(newValue as number[])}
                  min={0}
                  max={500}
                  step={10}
                  valueLabelDisplay="auto"
                />
              </ThemeProvider>
            </Box>
            <Box display="flex" gap="1rem">
              <Button
                variant="contained"
                onClick={handleFilters}
                sx={{
                  width: "9vmax",
                  marginBottom: "1vmax",
                  alignSelf: "center",
                  background:
                    "linear-gradient(to right,rgb(255, 249, 193) 30%,rgb(242, 223, 59) 80%)",
                  color: "black",
                  fontWeight: 600,
                }}
              >
                החל מסננים
              </Button>
              <Button
                variant="contained"
                onClick={handleResetFilters}
                sx={{
                  width: "9vmax",
                  marginBottom: "1vmax",
                  alignSelf: "center",
                  background:
                    "linear-gradient(to right,rgb(255, 249, 193) 30%,rgb(242, 223, 59) 80%)",
                  color: "black",
                  fontWeight: 600,
                }}
              >
                איפוס מסננים
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* ✅ Mobile version - toggle menu */}
      <Box sx={{ display: { "3xs": "block", md: "none" } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 1,
            mx: 2,
            mt: 2,
            cursor: "pointer",
          }}
          onClick={() => setIsFilterOpen(!isFilterOpen)}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <FilterListIcon sx={{ color: "#7f6000" }} />
            <Typography variant="h6" sx={{ color: "#7f6000", fontWeight: 600 }}>
              סינון מוצרים
            </Typography>
          </Box>
          <IconButton size="small">
            {isFilterOpen ? (
              <ExpandLessIcon sx={{ color: "#7f6000" }} />
            ) : (
              <ExpandMoreIcon sx={{ color: "#7f6000" }} />
            )}
          </IconButton>
        </Box>
        {/* ✅ Collapsible filter content */}
        <Collapse in={isFilterOpen}>
          <Box
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.05)",
              borderRadius: 1,
              mx: 2,
              mt: 1,
              p: 2,
            }}
          >
            <Stack spacing={3}>
              {/* ✅ Mobile filter controls - stacked vertically */}
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    fontSize: "0.9rem",
                    color: "brown",
                    "&.Mui-focused": {
                      color: "brown",
                    },
                  }}
                >
                  צבע
                </InputLabel>
                <Select
                  sx={{
                    paddingBottom: "0.5rem",

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                    },
                  }}
                  size="small"
                  value={color}
                  label="צבע"
                  onChange={(e) => setColor(e.target.value)}
                >
                  {colors.map((colorOption) => (
                    <MenuItem key={colorOption} value={colorOption}>
                      {colorOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    fontSize: "0.9rem",
                    color: "brown",
                    "&.Mui-focused": {
                      color: "brown",
                    },
                  }}
                >
                  ניחוח
                </InputLabel>
                <Select
                  sx={{
                    paddingBottom: "0.5rem",

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                    },
                  }}
                  size="small"
                  value={scent}
                  label="ניחוח"
                  onChange={(e) => setScent(e.target.value)}
                >
                  {scents.map((scentOption) => (
                    <MenuItem key={scentOption} value={scentOption}>
                      {scentOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    fontSize: "0.9rem",
                    color: "brown",
                    "&.Mui-focused": {
                      color: "brown",
                    },
                  }}
                >
                  סוג נר
                </InputLabel>
                <Select
                  sx={{
                    paddingBottom: "0.5rem",

                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                    },
                  }}
                  size="small"
                  value={type}
                  label="סוג נר"
                  onChange={(e) => setType(e.target.value)}
                >
                  {types.map((typeOption) => (
                    <MenuItem key={typeOption} value={typeOption}>
                      {typeOption.replace(/_/g, " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel
                  sx={{
                    fontSize: "0.9rem",
                    color: "brown",
                    "&.Mui-focused": {
                      color: "brown",
                    },
                  }}
                >
                  גודל
                </InputLabel>
                <Select
                  sx={{
                    paddingBottom: "0.5rem",
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                      borderWidth: "2px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#7f6000",
                    },
                  }}
                  size="small"
                  value={size}
                  label="גודל"
                  onChange={(e) => setSize(e.target.value)}
                >
                  {sizes.map((sizeOption) => (
                    <MenuItem key={sizeOption} value={sizeOption}>
                      {sizeOption}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* ✅ Price slider */}
              <Box>
                <Typography
                  gutterBottom
                  sx={{ color: "#7f6000", fontWeight: 600 }}
                >
                  מחיר: ₪{price[0]} - ₪{price[1]}
                </Typography>
                <ThemeProvider theme={theme}>
                  <Slider
                    size="small"
                    sx={{
                      color: "#7f6000",
                      "& .MuiSlider-thumb": {
                        bgcolor: "#7f6000",
                      },
                      "& .MuiSlider-track": {
                        bgcolor: "#7f6000",
                      },
                    }}
                    value={price}
                    onChange={(_, newValue) => setPrice(newValue as number[])}
                    min={0}
                    max={500}
                    step={10}
                    valueLabelDisplay="auto"
                  />
                </ThemeProvider>
              </Box>
              {/* ✅ Apply button */}
              <Button
                variant="contained"
                onClick={handleFilters}
                fullWidth
                sx={{
                  background:
                    "linear-gradient(to right,rgb(255, 249, 193) 30%,rgb(242, 223, 59) 80%)",
                  color: "black",
                  fontWeight: 600,
                  py: 1.5,
                }}
              >
                החל מסננים
              </Button>
            </Stack>
          </Box>
        </Collapse>
      </Box>
    </>
  );
};

export default Filter;
