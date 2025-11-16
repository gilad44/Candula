import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { contactSchema } from "../validation/schemas";

type ContactFormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type ContactFormProps = {
  onSuccess?: () => void;
};

const ContactForm = ({ onSuccess }: ContactFormProps) => {
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
      // In a real app, you would send this to your backend
      // console.log("Contact form submitted:", formData); // Remove for production

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

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
    } catch {
      toast.error("שגיאה בשליחת ההודעה. אנא נסה שוב.");
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
