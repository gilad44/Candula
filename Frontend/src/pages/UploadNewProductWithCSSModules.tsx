import { joiResolver } from "@hookform/resolvers/joi";
import { CheckCircle, Save } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import axios from "axios";
import Joi from "joi";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CandleForm from "../components/CandleFormSimple";
import ImageUpload from "../components/ImageUpload";
import { config } from "../config/config";
import type { NewProductProps } from "../hooks/useAIAnalysis";
import { useAIAnalysis } from "../hooks/useAIAnalysis";
import styles from "../Styles/pages/UploadNewProduct.module.css";
import { convertImageToBase64 } from "../utils/imageUtils";

const UploadNewProductWithCSSModules: React.FC = () => {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);

  // Validation schema
  const validationSchema = Joi.object({
    filename: Joi.string()
      .allow("")
      .optional()
      .messages({ "string.empty": "שם קובץ נדרש" }),
    type: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (value === "" || value === null || value === undefined) {
          return helpers.error("any.invalid");
        }
        if (value.length < 1) {
          return helpers.error("string.min");
        }
        return value;
      })
      .messages({
        "string.empty": "סוג נר נדרש",
        "string.min": "סוג נר נדרש",
        "any.invalid": "סוג נר נדרש",
        "any.required": "סוג נר נדרש",
      }),
    title: Joi.string().min(1).required().invalid("", null).messages({
      "string.empty": "כותרת נדרשת",
      "string.min": "כותרת נדרשת",
      "any.invalid": "כותרת נדרשת",
      "any.required": "כותרת נדרשת",
    }),
    description: Joi.string().min(1).required().invalid("", null).messages({
      "string.empty": "תיאור נדרש",
      "string.min": "תיאור נדרש",
      "any.invalid": "תיאור נדרש",
      "any.required": "תיאור נדרש",
    }),
    color: Joi.alternatives()
      .try(
        Joi.string().min(1).required().invalid("", null),
        Joi.array().items(Joi.string().min(1)).min(1).required()
      )
      .required()
      .messages({
        "string.empty": "צבע נדרש",
        "string.min": "צבע נדרש",
        "array.min": "צבע נדרש",
        "any.invalid": "צבע נדרש",
        "any.required": "צבע נדרש",
      }),
    shape: Joi.string().min(1).required().invalid("", null).messages({
      "string.empty": "צורה נדרשת",
      "string.min": "צורה נדרשת",
      "any.invalid": "צורה נדרשת",
      "any.required": "צורה נדרשת",
    }),
    isSet: Joi.boolean().optional(),
    price: Joi.number().min(0.01).required().messages({
      "number.base": "המחיר חייב להיות מספר",
      "number.min": "המחיר חייב להיות גדול מ-0",
    }),
    tags: Joi.array().items(Joi.string()).min(1).required().messages({
      "array.base": "תגיות נדרשות",
      "array.min": "נדרשת לפחות תגית אחת",
    }),
    variants: Joi.array().items(Joi.object()).optional(),
    scent: Joi.string().allow("").optional(),
    sku: Joi.string().min(1).required().messages({
      "string.empty": 'מק"ט נדרש',
      "string.min": 'מק"ט נדרש',
    }),
    style: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (value === "" || value === null || value === undefined) {
          return helpers.error("any.invalid");
        }
        if (value.length < 1) {
          return helpers.error("string.min");
        }
        return value;
      })
      .messages({
        "string.empty": "סגנון נדרש",
        "string.min": "סגנון נדרש",
        "any.invalid": "סגנון נדרש",
        "any.required": "סגנון נדרש",
      }),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    trigger,
    watch,
  } = useForm<NewProductProps>({
    resolver: joiResolver(validationSchema),
    mode: "all", // Validate on change, blur, and submit
    reValidateMode: "onChange",
    criteriaMode: "all", // Show all validation errors
    shouldFocusError: true,
    defaultValues: {
      filename: "",
      type: "", // Empty string to force user selection
      title: "",
      description: "",
      color: "",
      shape: "",
      isSet: false,
      price: 0,
      tags: [],
      variants: [],
      scent: "",
      sku: "",
      style: "", // Empty string to force user selection
    },
  });

  // Initialize AI Analysis hook after form setup
  const aiHook = useAIAnalysis(setValue, trigger);
  const { isAnalyzing, analyzeImage } = aiHook;

  // Force validation on component mount to ensure form starts invalid
  useEffect(() => {
    trigger();
  }, [trigger]);

  // Additional validation trigger for type and style fields specifically
  useEffect(() => {
    const typeValue = watch("type");
    const styleValue = watch("style");

    // Force validation of these specific fields
    if (typeValue === "" || styleValue === "") {
      trigger(["type", "style"]);
    }
  }, [watch, trigger]);

  const handleImageChange = async (
    file: File | null,
    preview: string | null
  ) => {
    setImageFile(file);
    setImagePreview(preview);
    if (file) {
      // Set the filename field when an image is uploaded
      setValue("filename", file.name);
      setAiAnalysisComplete(false);

      // Automatically start AI analysis
      try {
        const base64Image = await convertImageToBase64(file);
        await analyzeImage(base64Image);
        setAiAnalysisComplete(true);
      } catch (error) {
        console.error("Analysis failed:", error);
      }
    } else {
      setValue("filename", "");
    }
  };
  const onSubmit = async (data: NewProductProps) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You need to log in to create a card");
        navigate("/login");
        return;
      }
      axios.defaults.headers.common["x-auth-token"] = token;

      // Clean the data - remove empty optional fields
      const cleanedData = {
        ...data,
        scent: data.scent?.trim() || undefined,
        sku: data.sku?.trim() || undefined,
        style: data.style?.trim() || undefined,
        filename: data.filename?.trim() || undefined,
      };

      // Remove undefined fields
      Object.keys(cleanedData).forEach((key) => {
        if (cleanedData[key] === undefined) {
          delete cleanedData[key];
        }
      });

      await axios.post(`${config.API_BASE_URL}/products`, cleanedData);
      toast.success("Product uploaded successfully!");

      // Reset form first
      reset();
      setImageFile(null);
      setImagePreview(null);
      setAiAnalysisComplete(false);

      // Scroll to top after reset (try multiple methods for better compatibility)
      setTimeout(() => {
        // Method 1: Smooth scroll
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Method 2: Fallback - instant scroll if smooth doesn't work
        setTimeout(() => {
          if (window.pageYOffset > 0) {
            window.scrollTo(0, 0);
          }
        }, 100);
      }, 100);
    } catch (error) {
      toast.error("Error saving product:", error);
      alert("שגיאה בשמירת המוצר. אנא נסה שוב.");
    }
  };

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Typography variant="h4" gutterBottom className={styles.title}>
          הוספת מוצר חדש
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Image Upload Section */}
          <ImageUpload
            imageFile={imageFile}
            imagePreview={imagePreview}
            isAnalyzing={isAnalyzing}
            onImageChange={handleImageChange}
          />

          {/* AI Analysis Success Alert */}
          {aiAnalysisComplete && (
            <Alert
              severity="success"
              className={styles.aiSuccessAlert}
              icon={<CheckCircle />}
            >
              ✅ ניתוח AI הושלם בהצלחה! הפרטים מולאו אוטומטית
            </Alert>
          )}

          <Divider className={styles.divider} />

          {/* Product Form */}
          <CandleForm control={control} errors={errors} watch={watch} />

          {/* Submit Button */}
          <Box className={styles.submitButtonContainer}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<Save />}
              disabled={!isValid || !imageFile}
              className={styles.submitButton}
            >
              שמור מוצר
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default UploadNewProductWithCSSModules;
