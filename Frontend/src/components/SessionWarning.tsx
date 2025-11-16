import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface SessionWarningProps {
  isOpen: boolean;
  onExtendSession: () => void;
  onLogout: () => void;
  timeLeft: number; // in seconds
}

const SessionWarning = ({
  isOpen,
  onExtendSession,
  onLogout,
  timeLeft: initialTimeLeft,
}: SessionWarningProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(initialTimeLeft);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, initialTimeLeft, onLogout]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const secondsStr =
      remainingSeconds < 10
        ? `0${remainingSeconds}`
        : remainingSeconds.toString();
    return `${minutes}:${secondsStr}`;
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onExtendSession}
      maxWidth="sm"
      fullWidth
      sx={{ direction: "rtl" }}
    >
      <DialogTitle sx={{ textAlign: "center", direction: "rtl" }}>
        ⚠️ התרעת התנתקות
      </DialogTitle>
      <DialogContent sx={{ direction: "rtl", textAlign: "center" }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          אתה עומד להתנתק בשל חוסר פעילות
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          התנתקות אוטומטית בעוד:
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: timeLeft <= 60 ? "error.main" : "warning.main",
            fontWeight: "bold",
            mb: 2,
          }}
        >
          {formatTime(timeLeft)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          לחץ על "הישאר מחובר" כדי להמשיך לעוד 4 שעות
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onExtendSession}
          size="large"
          sx={{ minWidth: 120 }}
        >
          הישאר מחובר
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={onLogout}
          size="large"
          sx={{ minWidth: 120 }}
        >
          התנתק כעת
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SessionWarning;
