import { Close, CloudUpload } from "@mui/icons-material";
import {
  Box,
  Card,
  CardMedia,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import { createImagePreview, validateImageFile } from "../utils/imageUtils";

interface ImageUploadProps {
  imageFile: File | null;
  imagePreview: string | null;
  isAnalyzing: boolean;
  onImageChange: (file: File | null, preview: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  imageFile,
  imagePreview,
  isAnalyzing,
  onImageChange,
}) => {
  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await validateImageFile(file);
      const preview = await createImagePreview(file);
      onImageChange(file, preview);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to process image");
      event.target.value = "";
    }
  };

  const handleRemoveImage = () => {
    onImageChange(null, null);
  };

  const handleDrop = async (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    try {
      await validateImageFile(file);
      const preview = await createImagePreview(file);
      onImageChange(file, preview);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to process image");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ textAlign: "left" }}>
        תמונת המוצר
      </Typography>

      {!imagePreview ? (
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          sx={{
            border: "2px dashed #ccc",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
            cursor: "pointer",
            "&:hover": {
              borderColor: "#f4a261",
              backgroundColor: "#fff8f0",
            },
          }}
        >
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="image-upload-input"
            type="file"
            onChange={handleImageSelect}
          />
          <label htmlFor="image-upload-input">
            <CloudUpload sx={{ fontSize: 48, color: "#f4a261", mb: 2 }} />
            <Typography variant="body1" sx={{ mb: 1, fontFamily: "Dana" }}>
              לחץ כאן או גרור תמונה
            </Typography>
            <Typography variant="caption" color="textSecondary">
              JPG, PNG, WebP עד 5MB
            </Typography>
          </label>
        </Box>
      ) : (
        <Card sx={{ position: "relative", maxWidth: 400, mx: "auto" }}>
          <IconButton
            onClick={handleRemoveImage}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.7)",
              },
            }}
          >
            <Close />
          </IconButton>
          <CardMedia
            component="img"
            image={imagePreview}
            alt="Product preview"
            sx={{ height: 300, objectFit: "cover" }}
          />
        </Card>
      )}

      {imageFile && isAnalyzing && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            <CircularProgress size={20} sx={{ color: "#f4a261" }} />
            <Typography
              variant="body2"
              sx={{ fontFamily: "Dana", color: "#f4a261" }}
            >
              מנתח תמונה באמצעות AI...
            </Typography>
          </Box>
          <Typography
            variant="caption"
            display="block"
            sx={{ mt: 1, color: "#666" }}
          >
            האינטליגנציה המלאכותית מזהה אוטומטית את סוג הנר, צבע ועוד
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
