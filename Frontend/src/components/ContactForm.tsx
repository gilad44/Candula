import { Box, Button, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useRateLimitedApi } from "../hooks/useRateLimitedApi";
import {
  contactService,
  type ContactFormData,
} from "../services/contactService";
import { contactSchema } from "../validation/schemas";

// ContactFormData type is now imported from the service

type ContactFormProps = {
  onSuccess?: () => void;
};

const ContactForm = ({ onSuccess }: ContactFormProps) => {
  // Rate limiting protection for contact form submissions
  const { createDebouncedCall } = useRateLimitedApi({
    debounceMs: 1000, // 1 second debounce for contact submissions
    maxRetries: 2,
    showRateLimitWarning: true,
  });

  // Create rate-limited contact submission function
  const debouncedSubmitContactForm = useMemo(
    () =>
      createDebouncedCall(
        contactService.submitContactForm.bind(contactService),
        1500
      ),
    [createDebouncedCall]
  );
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<ContactFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate form data
    const { error } = contactSchema.validate(formData, { abortEarly: false });

    if (error) {
      const newErrors: Partial<ContactFormData> = {};
      error.details.forEach((detail) => {
        const field = detail.path[0] as keyof ContactFormData;
        newErrors[field] = detail.message;
      });
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Send contact form to backend using the rate-limited service
      await debouncedSubmitContactForm(formData);

      toast.success("הודעתך נשלחה בהצלחה! נחזור אליך בהקדם.");

      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setErrors({});

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);

      // Handle rate limiting specifically
      if (error instanceof Error) {
        if (
          error.message.includes("Rate limited") ||
          error.message.includes("יותר מדי בקשות")
        ) {
          toast.warn("יותר מדי בקשות. אנא המתן מעט לפני ניסיון נוסף");
          return;
        }
        toast.error(error.message);
      } else {
        toast.error("שגיאה בשליחת ההודעה");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography
        variant="h5"
        sx={{ mb: 3, textAlign: "center", direction: "rtl" }}
      >
        צור קשר
      </Typography>

      <Box sx={{ direction: "rtl" }}>
        <Box
          sx={{
            display: "flex",
            gap: 3,
            mb: 3,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <TextField
            fullWidth
            label="שם מלא"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#7f6000" },
                "&:hover fieldset": { borderColor: "#7f6000" },
                "&.Mui-focused fieldset": { borderColor: "#7f6000" },
              },
              "& .MuiInputLabel-root": {
                color: "#7f6000",
                "&.Mui-focused": { color: "#7f6000" },
              },
            }}
          />

          <TextField
            fullWidth
            label="אימייל"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#7f6000" },
                "&:hover fieldset": { borderColor: "#7f6000" },
                "&.Mui-focused fieldset": { borderColor: "#7f6000" },
              },
              "& .MuiInputLabel-root": {
                color: "#7f6000",
                "&.Mui-focused": { color: "#7f6000" },
              },
            }}
          />
        </Box>

        <TextField
          fullWidth
          label="נושא"
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
          error={!!errors.subject}
          helperText={errors.subject}
          required
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#7f6000" },
              "&:hover fieldset": { borderColor: "#7f6000" },
              "&.Mui-focused fieldset": { borderColor: "#7f6000" },
            },
            "& .MuiInputLabel-root": {
              color: "#7f6000",
              "&.Mui-focused": { color: "#7f6000" },
            },
          }}
        />

        <TextField
          fullWidth
          label="הודעה"
          multiline
          rows={4}
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          error={!!errors.message}
          helperText={errors.message}
          required
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#7f6000" },
              "&:hover fieldset": { borderColor: "#7f6000" },
              "&.Mui-focused fieldset": { borderColor: "#7f6000" },
            },
            "& .MuiInputLabel-root": {
              color: "#7f6000",
              "&.Mui-focused": { color: "#7f6000" },
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isSubmitting}
          sx={{
            mt: 2,
            py: 1.5,
            background: "linear-gradient(to right, #7f6000, #cd853f)",
            color: "white",
            fontSize: "1.1rem",
            fontWeight: "bold",
            "&:hover": {
              background: "linear-gradient(to right, #654d00, #b8762f)",
            },
            "&:disabled": {
              background: "#ccc",
            },
          }}
        >
          {isSubmitting ? "שולח..." : "שלח הודעה"}
        </Button>
      </Box>
    </form>
  );
};

export default ContactForm;
