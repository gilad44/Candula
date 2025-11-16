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
import { userActions, type TUser } from "../slices/userSlice";
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
  const submitForm = (form: LoginData) => {
    try {
      // For login, we create a TUser with default values for missing fields
      const user: TUser = {
        ...form,
        firstName: "",
        lastName: "",
        phone: "",
        city: "",
        street: "",
        houseNumber: 0,
        zip: 0,
      };
      dispatch(userActions.login(user));
      toast.success("התחברת בהצלחה!");
      if (onSuccess) onSuccess();
      navigate("/");
    } catch {
      toast.error("התחברות נכשלה");
    }
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

      <GoogleLogin
        onSuccess={() => {
          // You get a credentialResponse. You can decode the JWT for user info.
          // Save user info to Redux/localStorage as needed.
          if (onSuccess) onSuccess();
        }}
        onError={() => {
          // Handle error
        }}
      />
    </Box>
  );
};

export default Login;
