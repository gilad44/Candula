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
import styles from "../../Styles/pages/admin/AdminDashboard.module.css";

const AdminDashboardWithCSSModules = () => {
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
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.title} gutterBottom>
        לוח בקרה - מנהל
      </Typography>

      <Typography
        variant="body1"
        className={styles.welcomeMessage}
        gutterBottom
      >
        ברוך הבא, {user?.name?.first} {user?.name?.last}. בחר פעולה מהרשימה
        למטה:
      </Typography>

      <Box className={styles.actionsGrid}>
        {adminActions.map((action, index) => (
          <Box key={index} className={styles.actionBox}>
            <Card className={styles.actionCard}>
              <CardActionArea
                onClick={() => navigate(action.path)}
                sx={{ height: "100%", p: 2 }}
              >
                <CardContent className={styles.actionCardContent}>
                  <Box
                    className={styles.iconContainer}
                    sx={{ color: action.color }}
                  >
                    {action.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h2"
                    className={styles.actionTitle}
                    gutterBottom
                  >
                    {action.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    className={styles.actionDescription}
                  >
                    {action.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        ))}
      </Box>

      <Box className={styles.infoBox}>
        <Typography variant="h6" className={styles.infoTitle} gutterBottom>
          מידע חשוב
        </Typography>
        <Typography variant="body2" className={styles.infoText}>
          • כל הפעולות הנעשות במערכת מתועדות במטרות אבטחה ובקרה
          <br />
          • שינויים בהזמנות יעודכנו ללקוחות באופן אוטומטי
          <br />• במקרה של בעיה טכנית, פנה למנהל המערכת
        </Typography>
      </Box>
    </Box>
  );
};

export default AdminDashboardWithCSSModules;
