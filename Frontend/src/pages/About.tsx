import { Box, Typography } from "@mui/material";

const About = () => {
  return (
    <Box
      sx={{
        maxWidth: "800px",
        mx: "auto",
        p: 4,
        textAlign: "left",
        direction: "rtl",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          mb: 3,
          color: "#7f6000",
          fontWeight: "bold",
          background: "linear-gradient(45deg, #7f6000, #cd853f, #ffd700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        אודות פתיל ואש
      </Typography>
      <br />
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          color: "#7f6000",
          fontWeight: "600",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <span
          dir="rtl"
          style={{
            fontFamily: "Arial, sans-serif",
          }}
        >
          פרויקט סופי בפיתוח אתרים פולסטאק{" "}
        </span>
      </Typography>
      <Typography
        variant="h5"
        sx={{ mt: 6, mb: 1, color: "#7f6000", fontWeight: "600" }}
      >
        מטרת הפרויקט
      </Typography>
      <p
        style={{
          lineHeight: 1.8,
          fontSize: "1.1rem",
          color: "#333",
          direction: "rtl",
          fontFamily: "Arial, sans-serif",
        }}
      >
        פרויקט זה נבנה כחלק מקורס פיתוח אתרים פולסטאק, ומטרתו להדגים את היכולת
        לפתח אפליקציה מלאה מקצה לקצה. האתר כולל ממשק משתמש מתקדם, ניהול מצב
        גלובלי, תקשורת עם שרת, עבודה עם מסד נתונים, אימות והרשאות, וכל שאר
        הרכיבים הנדרשים לאפליקציית{" "}
        <span dir="ltr" style={{ display: "inline-block" }}>
          web
        </span>{" "}
        מודרנית ומקצועית.
      </p>

      <Typography
        variant="h5"
        sx={{ mt: 6, mb: 1, color: "#7f6000", fontWeight: "600" }}
      >
        סקירת הפרויקט
      </Typography>

      <p
        style={{
          fontFamily: "Arial, sans-serif",
          lineHeight: 1.8,
          fontSize: "1.1rem",
          color: "#333",
          direction: "rtl",
        }}
      >
        פתיל ואש היא אפליקציית אי-קומרס מלאה לחנות נרות דקורטיביים. <br /> האתר
        מדגים יכולות טכנולוגיות מתקדמות בפיתוח אפליקציות מודרניות, כולל ניהול
        משתמשים, עגלת קניות, מערכת הזמנות ועוד.
      </p>
      <p
        style={{
          lineHeight: 1.8,
          fontSize: "1.1rem",
          color: "#333",
          direction: "rtl",
          fontFamily: "Arial, sans-serif",
        }}
      >
        הפרויקט בנוי באמצעות טכנולוגיות מובילות בתעשייה, תוך שימוש ב-
        <span dir="ltr" style={{ display: "inline-block" }}>
          React
        </span>
        ,{" "}
        <span dir="ltr" style={{ display: "inline-block" }}>
          TypeScript
        </span>
        ,{" "}
        <span dir="ltr" style={{ display: "inline-block" }}>
          Node.js
        </span>
        ,{" "}
        <span dir="ltr" style={{ display: "inline-block" }}>
          MongoDB
        </span>{" "}
        ו-
        <span dir="ltr" style={{ display: "inline-block" }}>
          Material-UI
        </span>
        . העיצוב והפונקציונליות נבנו במטרה להדגים את היכולות הטכניות והבנה
        בסיסית של עקרונות{" "}
        <span dir="ltr" style={{ display: "inline-block" }}>
          UX/UI
        </span>{" "}
        בפיתוח אפליקציות{" "}
        <span dir="ltr" style={{ display: "inline-block" }}>
          web
        </span>{" "}
        מודרניות.
      </p>
      <br />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
          my: 5,
        }}
      >
        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(255,253,231,0.8), rgba(247,239,169,0.6))",
            boxShadow: "0 4px 15px rgba(127, 96, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#7f6000", fontWeight: "bold" }}
          >
            טכנולוגיות בשימוש
          </Typography>
          <Typography
            variant="body2"
            sx={{ lineHeight: 1.6, direction: "rtl" }}
          >
            <span dir="ltr" style={{ display: "inline-block" }}>
              React 19 + TypeScript
            </span>
            <br />
            <span dir="ltr" style={{ display: "inline-block" }}>
              Node.js + Express
            </span>
            <br />
            <span dir="ltr" style={{ display: "inline-block" }}>
              MongoDB + Mongoose
            </span>
            <br />
            <span dir="ltr" style={{ display: "inline-block" }}>
              Material-UI (MUI)
            </span>
            <br />
            <span dir="ltr" style={{ display: "inline-block" }}>
              Redux Toolkit
            </span>
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(255,253,231,0.8), rgba(247,239,169,0.6))",
            boxShadow: "0 4px 15px rgba(127, 96, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#7f6000", fontWeight: "bold" }}
          >
            תכונות עיקריות
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            מערכת אימות משתמשים מלאה
            <br />
            ניהול מוצרים ועגלת קניות
            <br />
            פאנל ניהול למנהלים
            <br />
            מערכת הזמנות ותשלומים
            <br />
            עיצוב רספונסיבי ונגיש
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default About;
