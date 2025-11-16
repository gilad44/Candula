import { joiResolver } from "@hookform/resolvers/joi";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { config } from "../config/config";
import { googleAuthService } from "../services/googleAuthService";
import { cartActions } from "../slices/cartSlice";
import { userActions } from "../slices/userSlice";
import type { GoogleCredentialResponse } from "../types/GoogleAuthTypes";
import type { SignupData } from "../types/SignupData";
import signupSchema from "../validation/signupSchema";

const Signup = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const initialFormData: SignupData = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignupData>({
    defaultValues: initialFormData,
    mode: "all",
    resolver: joiResolver(signupSchema),
  });

  const submitForm = async (form: SignupData) => {
    try {
      const res = await axios.post(`${config.API_BASE_URL}/users/`, form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      axios.defaults.headers.common["x-auth-token"] = res.data.token;

      dispatch(userActions.login(res.data));
      dispatch(cartActions.setUserId(res.data.user._id));
      toast.success("התחברת בהצלחה!");
      if (onSuccess) onSuccess();
    } catch {
      toast.error("התחברות נכשלה");
    }
  };

  const handleGoogleSuccess = async (
    credentialResponse: GoogleCredentialResponse
  ) => {
    try {
      if (!credentialResponse.credential) {
        throw new Error("No credential received from Google");
      }

      const result = await googleAuthService.authenticateWithGoogle(
        credentialResponse.credential
      );

      // Store token and user data
      localStorage.setItem("token", result.token);
      const userWithToken = {
        ...result.user,
        token: result.token,
      };
      localStorage.setItem("user", JSON.stringify(userWithToken));

      // Set axios default header
      axios.defaults.headers.common["x-auth-token"] = result.token;

      // Update Redux state
      dispatch(
        userActions.login({
          user: result.user,
          token: result.token,
        })
      );
      dispatch(cartActions.setUserId(result.user._id));

      // Show appropriate message
      if (result.isNewUser) {
        toast.success("נרשמת בהצלחה באמצעות Google!");
      } else {
        toast.success("התחברת בהצלחה באמצעות Google!");
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error("שגיאה בהרשמה עם Google");
    }
  };

  const handleGoogleError = () => {
    console.error("Google Signup Error - Check:");
    console.error("1. Google Client ID is set:", !!config.GOOGLE_CLIENT_ID);
    console.error(
      "2. Authorized origins in Google Console:",
      window.location.origin
    );
    toast.error("שגיאה בהרשמה עם Google");
  };

  // Custom Google button handler
  const handleCustomGoogleSignup = () => {
    // Find and click the hidden Google button
    const googleButton = document.querySelector(
      '[role="button"][aria-labelledby]'
    );
    if (googleButton) {
      (googleButton as HTMLElement).click();
    }
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitForm)}
      sx={{
        maxWidth: 400,
        mt: "-1rem",
        mb: "2rem",
        p: 3,
      }}
    >
      <Typography
        variant="h5"
        mb={2}
        color="black"
        align="center"
        sx={{ direction: "rtl" }}
      >
        הרשמה
      </Typography>
      <Stack spacing={2}>
        <TextField
          sx={{
            textAlign: "right",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(148, 173, 207, 1)" },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(148, 173, 207, 1)", // Default label color
            },
          }}
          label="אימייל"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          required
          fullWidth
        />
        <TextField
          sx={{
            textAlign: "right",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(148, 173, 207, 1)" },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(148, 173, 207, 1)", // Default label color
            },
          }}
          label="סיסמה"
          type={showPassword ? "text" : "password"}
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          required
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
        <TextField
          sx={{
            textAlign: "right",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(148, 173, 207, 1)" },
            },
            "& .MuiInputLabel-root": {
              color: "rgba(148, 173, 207, 1)", // Default label color
            },
          }}
          label="אימות סיסמה"
          type="password"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          required
          fullWidth
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((show) => !show)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isValid}
        >
          הרשמה
        </Button>
      </Stack>

      {/* Custom Hebrew Google Button */}
      <Button
        variant="outlined"
        fullWidth
        onClick={handleCustomGoogleSignup}
        sx={{
          mt: 2,
          py: 1.5,
          borderColor: "#dadce0",
          color: "#3c4043",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
          textTransform: "none",
          fontSize: "14px",
          fontWeight: 500,
          "&:hover": {
            backgroundColor: "#f8f9fa",
            borderColor: "#dadce0",
          },
        }}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          style={{ width: 18, height: 18 }}
        />
        הירשם עם Google
      </Button>

      {/* Hidden original Google button */}
      <div style={{ display: "none" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="signup_with"
          locale="he"
          theme="outline"
          size="large"
        />
      </div>
    </Box>
  );
};

export default Signup;
