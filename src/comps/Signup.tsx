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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userActions, type TUser } from "../slices/userSlice";
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
  const submitForm = (form: SignupData) => {
    try {
      const { confirmPassword, ...userWithoutConfirm } = form;
      const user: TUser = userWithoutConfirm;
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(userActions.login(user));
      toast.success("התחברת בהצלחה!");
      if (onSuccess) onSuccess();
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

export default Signup;
