import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

type SortState = {
  sortBy: string;
  order: string;
};
type SortProps = {
  onSortChange?: (sortData: SortState) => void;
};
const Sort = ({ onSortChange }: SortProps) => {
  const [sortBy, setSortBy] = useState<string>("");

  const sortOptions = [
    {
      value: "title-asc",
      label: "שם : א-ת",
      sortBy: "title",
      order: "asc",
    },
    {
      value: "title-desc",
      label: "שם : ת-א",
      sortBy: "title",
      order: "desc",
    },
    {
      value: "price-asc",
      label: "מחיר: נמוך לגבוה",
      sortBy: "price",
      order: "asc",
    },
    {
      value: "price-desc",
      label: "מחיר: גבוה לנמוך",
      sortBy: "price",
      order: "desc",
    },
    {
      value: "type-asc",
      label: "סוג נר: א-ת",
      sortBy: "type",
      order: "asc",
    },
    {
      value: "newest",
      label: "הכי חדש",
      sortBy: "id",
      order: "desc",
    },
  ];

  const handleResetSort = () => {
    setSortBy("");
    onSortChange?.({ sortBy: "", order: "" });
  };

  return (
    <>
      {/* Desktop Sort */}
      <Box sx={{ display: { "3xs": "none", md: "block", width: "100%" } }}>
        <Typography
          ml={3}
          width={"100%"}
          mt={2}
          sx={{ fontSize: { "2xs": "1rem", md: "1.5rem" } }}
        >
          מיון מוצרים
        </Typography>

        <Box
          //   display="flex"
          //   flexDirection="column"
          //   justifyContent="start"
          //   alignItems="space-around"
          width={"100%"}
          //   height={80}
          mt={1}
          ml={2}
        >
          <Box display="flex">
            <FormControl sx={{ minWidth: 200, width: "90%" }}>
              <InputLabel
                sx={{
                  mt: "-0.3rem",
                  fontSize: { "2xs": "0.6rem", md: "1.1rem" },
                  color: "brown",
                  "&.Mui-focused": {
                    color: "brown",
                  },
                }}
              >
                מיון לפי
              </InputLabel>
              <Select
                sx={{
                  width: { "2xs": "20vmax", md: "100%" },
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
                MenuProps={{
                  disableScrollLock: true,
                }}
                size="small"
                value={sortBy}
                label="מיון לפי"
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setSortBy(selectedValue);

                  if (!selectedValue) {
                    onSortChange?.({ sortBy: "", order: "" });
                    return;
                  }

                  const selectedOption = sortOptions.find(
                    (option) => option.value === selectedValue
                  );

                  if (selectedOption) {
                    onSortChange?.({
                      sortBy: selectedOption.sortBy,
                      order: selectedOption.order,
                    });
                  }
                }}
              >
                <MenuItem value="">
                  <em>ללא מיון</em>
                </MenuItem>
                {sortOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            onClick={handleResetSort}
            sx={{
              width: "9vmax",
              my: "1.6vmax",
              mx: "25%",
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
      </Box>

      {/* Mobile Sort */}
      <Box sx={{ display: { "2xs": "block", md: "none" } }}>
        <Typography
          sx={{
            fontSize: "1.2rem",
            fontWeight: "bold",
            textAlign: "center",
            mb: 2,
            color: "#7f6000",
          }}
        >
          מיון מוצרים
        </Typography>

        <Box sx={{ px: 2, mb: 2 }}>
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
              מיון לפי
            </InputLabel>
            <Select
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7f6000",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#7f6000",
                  borderWidth: "2px",
                },
              }}
              value={sortBy}
              label="מיון לפי"
              onChange={(e) => {
                const selectedValue = e.target.value;
                setSortBy(selectedValue);

                if (!selectedValue) {
                  onSortChange?.({ sortBy: "", order: "" });
                  return;
                }

                const selectedOption = sortOptions.find(
                  (option) => option.value === selectedValue
                );

                if (selectedOption) {
                  onSortChange?.({
                    sortBy: selectedOption.sortBy,
                    order: selectedOption.order,
                  });
                }
              }}
            >
              <MenuItem value="">
                <em>ללא מיון</em>
              </MenuItem>
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </Box>
    </>
  );
};

export default Sort;
