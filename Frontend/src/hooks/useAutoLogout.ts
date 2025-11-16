import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { cartActions } from "../slices/cartSlice";
import { userActions } from "../slices/userSlice";

const INACTIVITY_TIME = 4 * 60 * 60 * 1000; // 4 hours
const WARNING_TIME = 10 * 60 * 1000; // Show warning 10 minutes before logout

interface User {
  id?: string;
  _id?: string;
  email?: string;
  token?: string;
  role?: string;
}

export const useAutoLogout = (user: User | null) => {
  const dispatch = useDispatch();
  const timeoutRef = useRef<number | null>(null);
  const warningTimeoutRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const logoutCalledRef = useRef<boolean>(false); // Prevent duplicate logout calls
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WARNING_TIME / 1000); // in seconds

  const logout = useCallback(() => {
    // Prevent duplicate logout calls
    if (logoutCalledRef.current) {
      return;
    }
    logoutCalledRef.current = true;

    dispatch(userActions.logout());
    dispatch(cartActions.setUserId(null));
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.info("התנתקת אוטומטית בעקבות חוסר פעילות");
    setShowWarningModal(false);

    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }

    // Reset the flag after a short delay to allow future logouts if needed
    setTimeout(() => {
      logoutCalledRef.current = false;
    }, 1000);
  }, [dispatch]);

  const showWarning = useCallback(() => {
    setShowWarningModal(true);
    setTimeLeft(WARNING_TIME / 1000); // Reset countdown to 10 minutes

    // Start countdown
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Store interval ref to clear it if needed
    countdownRef.current = countdownInterval;
  }, []);

  const resetTimer = useCallback(() => {
    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
    }

    // Only set new timers if user is logged in
    if (user) {
      // Set warning timer (3 hours 50 minutes)
      warningTimeoutRef.current = window.setTimeout(
        showWarning,
        INACTIVITY_TIME - WARNING_TIME
      );

      // Set logout timer (4 hours)
      timeoutRef.current = window.setTimeout(logout, INACTIVITY_TIME);
    }
  }, [user, logout, showWarning]);

  const extendSession = useCallback(() => {
    setShowWarningModal(false);
    // Clear countdown interval if it exists
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    resetTimer();
  }, [resetTimer]);

  const handleActivity = useCallback(() => {
    if (user && !showWarningModal) {
      resetTimer();
    }
  }, [user, showWarningModal, resetTimer]);

  useEffect(() => {
    // Only track activity if user is logged in
    if (!user) {
      // Clear timers if user logs out
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
      setShowWarningModal(false);
      return;
    }

    // Start the timer when user logs in
    resetTimer();

    // List of events to track for user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "focus",
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Cleanup function
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningTimeoutRef.current) {
        clearTimeout(warningTimeoutRef.current);
      }
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    };
  }, [user, handleActivity, resetTimer]);

  // Return values and functions needed by the component
  return {
    showWarningModal,
    extendSession,
    logout,
    resetTimer,
    timeLeft,
  };
};
