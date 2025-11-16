import {
  Box,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import type { Control, FieldErrors, UseFormWatch } from "react-hook-form";
import { Controller } from "react-hook-form";
import type { NewProductProps } from "../hooks/useAIAnalysis";

// Define available options for dropdowns
const candleTypesList = [
  "נר בצנצנת", // jar candle
  "נר עמוד", // pillar candle
  "נר קטן", // tea light
  "נר דק", // taper candle
  "נר קטן עגול", // votive (small round candle)
  "נר יום הולדת", // birthday candle
  "נר צף", // floating candle
  "נר מעוצב", // novelty/decorative candle
];

const colorsList = [
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

const stylesList = ["ריחני", "דקורטיבי", "כפרי", "אלגנטי", "עונתי"];

interface CandleFormProps {
  control: Control<NewProductProps>;
  errors: FieldErrors<NewProductProps>;
  watch: UseFormWatch<NewProductProps>;
}

const CandleForm: React.FC<CandleFormProps> = ({ control, errors, watch }) => {
  const isSet = watch("isSet");

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ textAlign: "left", mb: 3 }}>
        פרטי המוצר
      </Typography>

      <Stack spacing={3}>
        {/* Product Title */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="שם המוצר"
              fullWidth
              error={!!errors.title}
              helperText={errors.title?.message}
              sx={{
                "& .MuiInputLabel-root": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                  textAlign: "right",
                },
                "& .MuiInputLabel-shrink": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                },
                "& .MuiInputBase-input": { textAlign: "right" },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  textAlign: "right",
                },
              }}
            />
          )}
        />

        {/* Type and Color Row */}
        <Stack direction="row" spacing={2}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.type}>
                <InputLabel
                  sx={{
                    right: 14,
                    left: "auto !important",
                    transformOrigin: "top right !important",
                    textAlign: "right",
                  }}
                >
                  סוג הנר *
                </InputLabel>
                <Select
                  {...field}
                  label="סוג הנר *"
                  sx={{
                    textAlign: "right",
                    "& .MuiSelect-select": { textAlign: "right" },
                    "& .MuiInputBase-input": { textAlign: "right" },
                    "& .MuiInputLabel-root": {
                      right: 14,
                      left: "auto !important",
                      transformOrigin: "top right !important",
                    },
                  }}
                >
                  <MenuItem
                    value=""
                    disabled
                    sx={{ textAlign: "right", justifyContent: "flex-end" }}
                  >
                    בחר סוג נר
                  </MenuItem>
                  {candleTypesList.map((type) => (
                    <MenuItem
                      key={type}
                      value={type}
                      sx={{ textAlign: "right", justifyContent: "flex-end" }}
                    >
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.type && (
                  <FormHelperText sx={{ textAlign: "right" }}>
                    {errors.type.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Controller
            name="color"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.color}>
                <InputLabel
                  sx={{
                    right: 14,
                    left: "auto !important",
                    transformOrigin: "top right !important",
                    textAlign: "right",
                  }}
                >
                  {isSet ? "צבעים" : "צבע"}
                </InputLabel>
                <Select
                  {...field}
                  multiple={isSet}
                  label={isSet ? "צבעים" : "צבע"}
                  value={
                    isSet
                      ? Array.isArray(field.value)
                        ? field.value
                        : [field.value].filter(Boolean)
                      : field.value
                  }
                  onChange={(e) => {
                    if (isSet) {
                      field.onChange(e.target.value);
                    } else {
                      field.onChange(e.target.value);
                    }
                  }}
                  renderValue={
                    isSet
                      ? (selected) => (
                          <Box
                            sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                          >
                            {Array.isArray(selected) &&
                              selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))}
                          </Box>
                        )
                      : undefined
                  }
                  sx={{
                    textAlign: "right",
                    "& .MuiSelect-select": { textAlign: "right" },
                    "& .MuiInputBase-input": { textAlign: "right" },
                    "& .MuiInputLabel-root": {
                      right: 14,
                      left: "auto !important",
                      transformOrigin: "top right !important",
                    },
                  }}
                >
                  {colorsList.map((color) => (
                    <MenuItem
                      key={color}
                      value={color}
                      sx={{ textAlign: "right", justifyContent: "flex-end" }}
                    >
                      {color}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />
        </Stack>

        {/* Style and Is Set Row */}
        <Stack direction="row" spacing={2} alignItems="center">
          <Controller
            name="style"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.style}>
                <InputLabel
                  sx={{
                    right: 14,
                    left: "auto !important",
                    transformOrigin: "top right !important",
                    textAlign: "right",
                  }}
                >
                  סגנון *
                </InputLabel>
                <Select
                  {...field}
                  label="סגנון *"
                  sx={{
                    textAlign: "right",
                    "& .MuiSelect-select": { textAlign: "right" },
                    "& .MuiInputBase-input": { textAlign: "right" },
                    "& .MuiInputLabel-root": {
                      right: 14,
                      left: "auto !important",
                      transformOrigin: "top right !important",
                    },
                  }}
                >
                  <MenuItem
                    value=""
                    disabled
                    sx={{ textAlign: "right", justifyContent: "flex-end" }}
                  >
                    בחר סגנון
                  </MenuItem>
                  {stylesList.map((style) => (
                    <MenuItem
                      key={style}
                      value={style}
                      sx={{ textAlign: "right", justifyContent: "flex-end" }}
                    >
                      {style}
                    </MenuItem>
                  ))}
                </Select>
                {errors.style && (
                  <FormHelperText sx={{ textAlign: "right" }}>
                    {errors.style.message}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          />

          <Box sx={{ display: "flex", alignItems: "center", minWidth: 200 }}>
            <Controller
              name="isSet"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={field.value}
                      onChange={field.onChange}
                      color="primary"
                    />
                  }
                  label="סט נרות"
                  labelPlacement="start"
                  sx={{
                    mr: 0,
                    "& .MuiFormControlLabel-label": {
                      fontFamily: "Dana",
                      fontSize: "1rem",
                    },
                  }}
                />
              )}
            />
            {isSet && (
              <Chip
                label="סט"
                color="primary"
                size="small"
                sx={{ mr: 1, fontFamily: "Dana" }}
              />
            )}
          </Box>
        </Stack>

        {/* Shape */}
        <Controller
          name="shape"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="צורה"
              fullWidth
              error={!!errors.shape}
              helperText={errors.shape?.message}
              sx={{
                "& .MuiInputLabel-root": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                  textAlign: "right",
                },
                "& .MuiInputLabel-shrink": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                },
                "& .MuiInputBase-input": { textAlign: "right" },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  textAlign: "right",
                },
              }}
            />
          )}
        />

        {/* Scent */}
        <Controller
          name="scent"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="ניחוח (אופציונלי)"
              fullWidth
              error={!!errors.scent}
              helperText={errors.scent?.message}
              sx={{
                "& .MuiInputLabel-root": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                  textAlign: "right",
                },
                "& .MuiInputLabel-shrink": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                },
                "& .MuiInputBase-input": { textAlign: "right" },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  textAlign: "right",
                },
              }}
            />
          )}
        />

        {/* Description */}
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="תיאור (אופציונלי)"
              multiline
              rows={3}
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{
                "& .MuiInputLabel-root": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                  textAlign: "right",
                },
                "& .MuiInputLabel-shrink": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                },
                "& .MuiInputBase-input": { textAlign: "right" },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  textAlign: "right",
                },
              }}
            />
          )}
        />

        {/* Tags */}
        <Controller
          name="tags"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="תגיות (מופרדות בפסיק)"
              fullWidth
              error={!!errors.tags}
              helperText={errors.tags?.message}
              value={Array.isArray(field.value) ? field.value.join(", ") : ""}
              onChange={(e) => {
                const tagsString = e.target.value;
                const tagsArray = tagsString
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0);
                field.onChange(tagsArray);
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                  textAlign: "right",
                },
                "& .MuiInputLabel-shrink": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                },
                "& .MuiInputBase-input": { textAlign: "right" },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  textAlign: "right",
                },
              }}
            />
          )}
        />

        {/* Price */}
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="מחיר (₪)"
              type="number"
              fullWidth
              error={!!errors.price}
              helperText={errors.price?.message}
              onChange={(e) => field.onChange(Number(e.target.value))}
              sx={{
                "& .MuiInputLabel-root": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                  textAlign: "right",
                },
                "& .MuiInputLabel-shrink": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                },
                "& .MuiInputBase-input": { textAlign: "right" },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  textAlign: "right",
                },
              }}
            />
          )}
        />

        {/* SKU */}
        <Controller
          name="sku"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="מק״ט (SKU)"
              fullWidth
              error={!!errors.sku}
              helperText={errors.sku?.message}
              sx={{
                "& .MuiInputLabel-root": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                  textAlign: "right",
                },
                "& .MuiInputLabel-shrink": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                },
                "& .MuiInputBase-input": { textAlign: "right" },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  textAlign: "right",
                },
              }}
            />
          )}
        />

        {/* Variants */}
        <Controller
          name="variants"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="וריאציות (אופציונלי)"
              fullWidth
              multiline
              rows={2}
              error={!!errors.variants}
              helperText={
                errors.variants?.message || "לדוגמה: גדול, בינוני, קטן"
              }
              value={
                Array.isArray(field.value)
                  ? field.value
                      .map((v) =>
                        typeof v === "object" ? JSON.stringify(v) : v
                      )
                      .join(", ")
                  : ""
              }
              onChange={(e) => {
                const value = e.target.value.trim();
                if (!value) {
                  field.onChange([]);
                  return;
                }

                // Try to parse as JSON array, otherwise split by comma
                try {
                  const parsed = JSON.parse(value);
                  field.onChange(Array.isArray(parsed) ? parsed : [parsed]);
                } catch {
                  // If not JSON, treat as comma-separated simple variants
                  const variants = value
                    .split(",")
                    .map((v) => ({ name: v.trim() }))
                    .filter((v) => v.name);
                  field.onChange(variants);
                }
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                  textAlign: "right",
                },
                "& .MuiInputLabel-shrink": {
                  right: 14,
                  left: "auto !important",
                  transformOrigin: "top right !important",
                },
                "& .MuiInputBase-input": { textAlign: "right" },
                "& .MuiOutlinedInput-notchedOutline legend": {
                  textAlign: "right",
                },
              }}
            />
          )}
        />

        {/* Image URL */}
      </Stack>
    </Box>
  );
};

export default CandleForm;
