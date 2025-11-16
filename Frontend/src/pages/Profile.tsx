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
import type { UserPreferences } from "../types/User";

const Profile = () => {
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
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
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
      // Update data structure for both local storage and backend
      const updateData = {
        ...formData,
        // Also update the nested name structure for compatibility
        name: {
          first: formData.firstName,
          last: formData.lastName,
        },
        preferences,
        // Preserve existing favorites
        favorites: user?.favorites || [],
      };

      // Try to send to backend first
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
            // Ensure favorites are preserved in backend response
            const userWithFavorites = {
              ...updatedUser,
              favorites: updatedUser.favorites || user?.favorites || [],
            };
            // Update Redux store with backend response
            dispatch(userActions.updateProfile(userWithFavorites));
          } else {
            // If backend fails, still update local storage
            dispatch(userActions.updateProfile(updateData));
          }
        } catch {
          // If API fails, still update local storage
          dispatch(userActions.updateProfile(updateData));
        }
      } else {
        // No token or user, just update local storage
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

  return (
    <Box
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 3,
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        הפרופיל שלי
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Personal Information */}
        <Box sx={{ flex: "1 1 100%" }}>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
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
                    InputLabelProps={{
                      style: {
                        textAlign: "right",
                        transformOrigin: "top right",
                        right: 14,
                        left: "auto",
                      },
                    }}
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
                    InputLabelProps={{
                      style: {
                        textAlign: "right",
                        transformOrigin: "top right",
                        right: 14,
                        left: "auto",
                      },
                    }}
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
                    InputLabelProps={{
                      style: {
                        textAlign: "right",
                        transformOrigin: "top right",
                        right: 14,
                        left: "auto",
                      },
                    }}
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
                    InputLabelProps={{
                      style: {
                        textAlign: "right",
                        transformOrigin: "top right",
                        right: 14,
                        left: "auto",
                      },
                    }}
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
                <Box sx={{ mt: 3, display: "flex", gap: 2, direction: "rtl" }}>
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
              <Typography variant="h6" sx={{ mb: 3 }}>
                העדפות
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box sx={{ flex: "1 1 100%" }}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    הודעות
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      direction: "rtl",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        direction: "rtl",
                      }}
                    >
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

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        direction: "rtl",
                      }}
                    >
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

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        direction: "rtl",
                      }}
                    >
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
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    שיווק
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      direction: "rtl",
                    }}
                  >
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

              <Box sx={{ mt: 3, direction: "rtl" }}>
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
              <Typography variant="h6" sx={{ mb: 3 }}>
                סטטיסטיקות החשבון
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "150px" }}>
                  <Box sx={{ textAlign: "center", direction: "rtl" }}>
                    <Typography variant="h4" color="primary.main">
                      {user.orders?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      הזמנות
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "150px" }}>
                  <Box sx={{ textAlign: "center", direction: "rtl" }}>
                    <Typography variant="h4" color="error.main">
                      {user.favorites?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      מועדפים
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "150px" }}>
                  <Box sx={{ textAlign: "center", direction: "rtl" }}>
                    <Typography variant="h4" color="success.main">
                      {user.orders?.filter(
                        (order) => order.status === "delivered"
                      ).length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      הזמנות שהגיעו
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: "1 1 calc(25% - 12px)", minWidth: "150px" }}>
                  <Box sx={{ textAlign: "center", direction: "rtl" }}>
                    <Typography variant="h4" color="info.main">
                      ₪
                      {user.orders
                        ?.reduce((sum, order) => sum + order.totalAmount, 0)
                        ?.toFixed(2) || "0.00"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
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

export default Profile;
