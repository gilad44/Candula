import {
  Assignment,
  ContactSupport,
  People,
  ShoppingCart,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userSlice.user);
  const adminActions = [
    {
      title: "ניהול הזמנות",
      description: "צפייה ועדכון סטטוס הזמנות",
      icon: <Assignment sx={{ fontSize: 40 }} />,
      path: "/admin/orders",
      color: "#1976d2",
    },
    {
      title: "ניהול לקוחות",
      description: "צפייה ברשימת לקוחות",
      icon: <People sx={{ fontSize: 40 }} />,
      path: "/admin/users",
      color: "#388e3c",
    },
    {
      title: "ניהול מוצרים",
      description: "הוספה, עריכה ומחיקת מוצרים",
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      path: "/admin/products",
      color: "#f57c00",
    },
    {
      title: "הודעות יצירת קשר",
      description: "צפייה וטיפול בהודעות לקוחות",
      icon: <ContactSupport sx={{ fontSize: 40 }} />,
      path: "/admin/contacts",
      color: "#7b1fa2",
    },
  ];

  return (
    <Box
      dir="rtl"
      sx={{
        p: 3,
        minHeight: "100vh",
        backgroundColor: "background.default",
      }}
    >
      <Typography variant="h4" gutterBottom>
        לוח בקרה - מנהל
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        gutterBottom
        sx={{ mb: 4 }}
      >
        ברוך הבא, {user?.name?.first} {user?.name?.last}. בחר פעולה מהרשימה
        למטה:
      </Typography>

      <Box display="flex" flexWrap="wrap" gap={3}>
        {adminActions.map((action, index) => (
          <Box key={index} sx={{ flex: "1 1 300px", minWidth: "300px" }}>
            <Card
              sx={{
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea
                onClick={() => navigate(action.path)}
                sx={{ height: "100%", p: 2 }}
              >
                <CardContent sx={{ textAlign: "center" }}>
                  <Box
                    sx={{
                      color: action.color,
                      mb: 2,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    {action.icon}
                  </Box>
                  <Typography variant="h6" component="h2" gutterBottom>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {action.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 4, p: 3, bgcolor: "background.paper", borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          מידע חשוב
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • כל הפעולות הנעשות במערכת מתועדות במטרות אבטחה ובקרה
          <br />
          • שינויים בהזמנות יעודכנו ללקוחות באופן אוטומטי
          <br />• במקרה של בעיה טכנית, פנה למנהל המערכת
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
