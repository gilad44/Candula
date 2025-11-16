import {
  Box,
  Button,
  Card,
  CardContent,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { config } from "../config/config";
import { userActions } from "../slices/userSlice";
import type { RootState } from "../store/store";
import styles from "../Styles/pages/Profile.module.css";
import type { UserPreferences } from "../types/User";

const ProfileWithCSSModules = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userSlice.user);

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      const newFormData = {
        firstName: user?.name?.first || user.firstName || "",
        lastName: user?.name?.last || user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      };
      setFormData(newFormData);
    }
  }, [user]);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.first || user?.firstName || "",
    lastName: user?.name?.last || user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  const [preferences, setPreferences] = useState<UserPreferences>(
    user?.preferences || {
      language: "he",
      currency: "ILS",
      notifications: {
        email: true,
        sms: false,
        push: true,
      },
      marketing: false,
    }
  );

  if (!user) {
    return (
      <Box className={styles.notLoggedIn}>
        <Typography variant="h4" className={styles.notLoggedInTitle}>
          נדרש להתחבר
        </Typography>
        <Typography variant="body1" color="text.secondary">
          התחבר כדי לראות את הפרופיל שלך
        </Typography>
      </Box>
    );
  }

  const handleSave = async () => {
    try {
      const updateData = {
        ...formData,
        name: {
          first: formData.firstName,
          last: formData.lastName,
        },
        preferences,
        favorites: user?.favorites || [],
      };

      const token = localStorage.getItem("token");
      if (token && user) {
        try {
          const response = await fetch(
            `${config.API_BASE_URL}/users/${user._id || user.id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
              },
              body: JSON.stringify(updateData),
            }
          );

          if (response.ok) {
            const updatedUser = await response.json();
            const userWithFavorites = {
              ...updatedUser,
              favorites: updatedUser.favorites || user?.favorites || [],
            };
            dispatch(userActions.updateProfile(userWithFavorites));
          } else {
            dispatch(userActions.updateProfile(updateData));
          }
        } catch {
          dispatch(userActions.updateProfile(updateData));
        }
      } else {
        dispatch(userActions.updateProfile(updateData));
      }

      setEditMode(false);
      toast.success("הפרופיל עודכן בהצלחה!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("שגיאה בשמירת הפרופיל");
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || user?.name?.first || "",
      lastName: user.lastName || user?.name?.last || "",
      email: user.email || "",
      phone: user.phone || "",
    });
    setEditMode(false);
  };

  const rtlLabelProps = {
    style: {
      textAlign: "right" as const,
      transformOrigin: "top right" as const,
      right: 14,
      left: "auto" as const,
    },
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.pageTitle}>
        הפרופיל שלי
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Personal Information */}
        <Box sx={{ flex: "1 1 100%" }}>
          <Card>
            <CardContent>
              <Box className={styles.headerBox}>
                <Typography variant="h6">פרטים אישיים</Typography>
                <Button
                  onClick={() => setEditMode(!editMode)}
                  variant={editMode ? "outlined" : "contained"}
                >
                  {editMode ? "ביטול" : "עריכה"}
                </Button>
              </Box>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
                  <TextField
                    fullWidth
                    label="שם פרטי"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    disabled={!editMode}
                    inputProps={{ dir: "rtl" }}
                    InputLabelProps={rtlLabelProps}
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "right",
                        direction: "rtl",
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
                  <TextField
                    fullWidth
                    label="שם משפחה"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={!editMode}
                    inputProps={{ dir: "rtl" }}
                    InputLabelProps={rtlLabelProps}
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "right",
                        direction: "rtl",
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
                  <TextField
                    fullWidth
                    label="אימייל"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!editMode}
                    inputProps={{ dir: "rtl" }}
                    InputLabelProps={rtlLabelProps}
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "right",
                        direction: "rtl",
                      },
                    }}
                  />
                </Box>
                <Box sx={{ flex: "1 1 calc(50% - 8px)", minWidth: "250px" }}>
                  <TextField
                    fullWidth
                    label="מספר טלפון"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!editMode}
                    inputProps={{ dir: "rtl" }}
                    InputLabelProps={rtlLabelProps}
                    sx={{
                      "& .MuiInputBase-input": {
                        textAlign: "right",
                        direction: "rtl",
                      },
                    }}
                  />
                </Box>
              </Box>

              {editMode && (
                <Box className={styles.actionButtons}>
                  <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={
                      !formData.firstName ||
                      !formData.lastName ||
                      !formData.email
                    }
                  >
                    שמירה
                  </Button>
                  <Button variant="outlined" onClick={handleCancel}>
                    ביטול
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>

        {/* Preferences */}
        <Box sx={{ flex: "1 1 100%" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" className={styles.sectionTitle}>
                העדפות
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ flex: "1 1 100%" }}>
                  <Typography
                    variant="subtitle1"
                    className={styles.preferencesSection}
                  >
                    הודעות
                  </Typography>

                  <Box className={styles.preferenceList}>
                    <Box className={styles.preferenceItem}>
                      <Typography variant="body2">הודעות אימייל</Typography>
                      <Switch
                        checked={preferences.notifications.email}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              email: e.target.checked,
                            },
                          })
                        }
                      />
                    </Box>

                    <Box className={styles.preferenceItem}>
                      <Typography variant="body2">הודעות SMS</Typography>
                      <Switch
                        checked={preferences.notifications.sms}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              sms: e.target.checked,
                            },
                          })
                        }
                      />
                    </Box>

                    <Box className={styles.preferenceItem}>
                      <Typography variant="body2">התראות אפליקציה</Typography>
                      <Switch
                        checked={preferences.notifications.push}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            notifications: {
                              ...preferences.notifications,
                              push: e.target.checked,
                            },
                          })
                        }
                      />
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flex: "1 1 100%" }}>
                  <Typography
                    variant="subtitle1"
                    className={styles.preferencesSection}
                  >
                    שיווק
                  </Typography>

                  <Box className={styles.preferenceItem}>
                    <Typography variant="body2">
                      קבלת חומרי שיווק ומבצעים
                    </Typography>
                    <Switch
                      checked={preferences.marketing}
                      onChange={(e) =>
                        setPreferences({
                          ...preferences,
                          marketing: e.target.checked,
                        })
                      }
                    />
                  </Box>
                </Box>
              </Box>

              <Box className={styles.preferenceSaveButton}>
                <Button
                  variant="contained"
                  onClick={() => {
                    dispatch(userActions.updatePreferences(preferences));
                    toast.success("העדפות נשמרו!");
                  }}
                >
                  שמור העדפות
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Account Statistics */}
        <Box sx={{ flex: "1 1 100%" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" className={styles.sectionTitle}>
                סטטיסטיקות החשבון
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "150px" }}>
                  <Box className={styles.statsBox}>
                    <Typography
                      variant="h4"
                      color="primary.main"
                      className={styles.statsNumber}
                    >
                      {user.orders?.length || 0}
                    </Typography>
                    <Typography variant="body2" className={styles.statsLabel}>
                      הזמנות
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "150px" }}>
                  <Box className={styles.statsBox}>
                    <Typography
                      variant="h4"
                      color="error.main"
                      className={styles.statsNumber}
                    >
                      {user.favorites?.length || 0}
                    </Typography>
                    <Typography variant="body2" className={styles.statsLabel}>
                      מועדפים
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "150px" }}>
                  <Box className={styles.statsBox}>
                    <Typography
                      variant="h4"
                      color="success.main"
                      className={styles.statsNumber}
                    >
                      {user.orders?.filter(
                        (order) => order.status === "delivered"
                      ).length || 0}
                    </Typography>
                    <Typography variant="body2" className={styles.statsLabel}>
                      הזמנות שהגיעו
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "150px" }}>
                  <Box className={styles.statsBox}>
                    <Typography
                      variant="h4"
                      color="info.main"
                      className={styles.statsNumber}
                    >
                      ₪
                      {user.orders
                        ?.reduce((sum, order) => sum + order.totalAmount, 0)
                        ?.toFixed(2) || "0.00"}
                    </Typography>
                    <Typography variant="body2" className={styles.statsLabel}>
                      סה"כ רכישות
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileWithCSSModules;
