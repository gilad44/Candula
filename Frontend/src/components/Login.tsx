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
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { config } from "../config/config";
import { googleAuthService } from "../services/googleAuthService";
import { cartActions } from "../slices/cartSlice";
import { userActions } from "../slices/userSlice";
import type { GoogleCredentialResponse } from "../types/GoogleAuthTypes";
import type { LoginData } from "../types/LoginData";
import loginSchema from "../validation/loginSchema";

const Login = ({ onSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const initialFormData: LoginData = {
    email: "",
    password: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginData>({
    defaultValues: initialFormData,
    mode: "all",
    resolver: joiResolver(loginSchema),
  });
  const submitForm = async (form: LoginData) => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      const data = await res.json();

      // Store token separately and in user data for compatibility
      localStorage.setItem("token", data.token);

      // Update user data to include token for orderService compatibility
      const userWithToken = {
        ...data.user,
        token: data.token,
      };
      localStorage.setItem("user", JSON.stringify(userWithToken));

      dispatch(userActions.login(userWithToken));
      dispatch(cartActions.setUserId(data.user._id));
      toast.success("התחברת בהצלחה!");
      if (onSuccess) onSuccess();
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("שגיאה בהתחברות - בדוק את הפרטים ונסה שוב");
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

      // Update Redux state
      dispatch(userActions.login(userWithToken));
      dispatch(cartActions.setUserId(result.user._id));

      // Show appropriate message
      if (result.isNewUser) {
        toast.success("נרשמת בהצלחה באמצעות Google!");
      } else {
        toast.success("התחברת בהצלחה באמצעות Google!");
      }

      if (onSuccess) onSuccess();
      navigate("/");
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error("שגיאה בהתחברות עם Google");
    }
  };

  // Custom Google button handler
  const handleCustomGoogleLogin = () => {
    // Find and click the hidden Google button
    const googleButton = document.querySelector(
      '[role="button"][aria-labelledby]'
    );
    if (googleButton) {
      (googleButton as HTMLElement).click();
    }
  };

  const handleGoogleError = () => {
    console.error("Google Login Error - Check:");
    console.error("1. Google Client ID is set:", !!config.GOOGLE_CLIENT_ID);
    console.error(
      "2. Authorized origins in Google Console:",
      window.location.origin
    );
    toast.error("שגיאה בהתחברות עם Google");
  };
  return (
    <Box
      component="form"
      onSubmit={handleSubmit(submitForm)}
      sx={{
        maxWidth: 400,
        mt: "-4rem",
        mb: "2rem",
        p: 3,
        // boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <Typography
        variant="h5"
        mb={2}
        color="black"
        align="center"
        sx={{ direction: "rtl" }}
      >
        🙂 כבר רשומים? התחברו
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="אימייל"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          required
          fullWidth
          sx={{ textAlign: "right" }}
        />
        <TextField
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!isValid}
        >
          התחברות
        </Button>
      </Stack>

      {/* Custom Hebrew Google Button */}
      <Button
        variant="outlined"
        fullWidth
        onClick={handleCustomGoogleLogin}
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
        התחבר עם Google
      </Button>

      {/* Hidden original Google button */}
      <div style={{ display: "none" }}>
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          text="signin_with"
          locale="he"
          theme="outline"
          size="large"
        />
      </div>
    </Box>
  );
};

export default Login;
