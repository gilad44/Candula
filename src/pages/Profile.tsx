import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { userActions } from "../slices/userSlice";
import type { RootState } from "../store/store";
import type { UserPreferences } from "../types/User";

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.userSlice.user);

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
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

  const handleSave = () => {
    // In a real app, you would send this to your backend
    dispatch(
      userActions.updateProfile({
        ...formData,
        preferences,
      })
    );

    setEditMode(false);
    toast.success("הפרופיל עודכן בהצלחה!");
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
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
        direction: "rtl",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        הפרופיל שלי
      </Typography>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12}>
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

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="שם פרטי"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="שם משפחה"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="אימייל"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="מספר טלפון"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>

              {editMode && (
                <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                  <Button variant="contained" onClick={handleSave}>
                    שמירה
                  </Button>
                  <Button variant="outlined" onClick={handleCancel}>
                    ביטול
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                העדפות
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    הודעות
                  </Typography>

                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
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
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle1" sx={{ mb: 2 }}>
                    שיווק
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
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
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
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
        </Grid>

        {/* Account Statistics */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                סטטיסטיקות החשבון
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="primary.main">
                      {user.orders?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      הזמנות
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="error.main">
                      {user.favorites?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      מועדפים
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: "center" }}>
                    <Typography variant="h4" color="success.main">
                      {user.orders?.filter(
                        (order) => order.status === "delivered"
                      ).length || 0}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      הזמנות שהגיעו
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={6} sm={3}>
                  <Box sx={{ textAlign: "center" }}>
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
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
