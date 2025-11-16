import { Box, Typography } from "@mui/material";
import styles from "../Styles/pages/About.module.css";

export default function AboutWithCSSModules() {
  return (
    <Box className={styles.container}>
      <Typography variant="h2" className={styles.mainTitle}>
        אודות פתיל ואש
      </Typography>
      <Typography variant="h4" className={styles.subtitle}>
        <span dir="rtl" className={styles.subtitleSpan}>
          פרויקט סופי בפיתוח אתרים פולסטאק{" "}
        </span>
      </Typography>

      <Typography variant="h5" className={styles.sectionTitle}>
        מטרת הפרויקט
      </Typography>
      <p className={styles.paragraph}>
        פרויקט זה נבנה כחלק מקורס פיתוח אתרים פולסטאק, ומטרתו להדגים את היכולת
        לפתח אפליקציה מלאה מקצה לקצה. האתר כולל ממשק משתמש מתקדם, ניהול מצב
        גלובלי, תקשורת עם שרת, עבודה עם מסד נתונים, אימות והרשאות, וכל שאר
        הרכיבים הנדרשים לאפליקציית{" "}
        <span dir="ltr" className={styles.inlineEnglish}>
          web
        </span>{" "}
        מודרנית ומקצועית.
      </p>

      <Typography variant="h5" className={styles.sectionTitle}>
        סקירת הפרויקט
      </Typography>

      <p className={styles.paragraph}>
        פתיל ואש היא אפליקציית אי-קומרס מלאה לחנות נרות דקורטיביים. <br /> האתר
        מדגים יכולות טכנולוגיות מתקדמות בפיתוח אפליקציות מודרניות, כולל ניהול
        משתמשים, עגלת קניות, מערכת הזמנות ועוד.
      </p>
      <p className={styles.paragraph}>
        הפרויקט בנוי באמצעות טכנולוגיות מובילות בתעשייה, תוך שימוש ב-
        <span dir="ltr" className={styles.inlineEnglish}>
          React
        </span>
        ,{" "}
        <span dir="ltr" className={styles.inlineEnglish}>
          TypeScript
        </span>
        ,{" "}
        <span dir="ltr" className={styles.inlineEnglish}>
          Node.js
        </span>
        ,{" "}
        <span dir="ltr" className={styles.inlineEnglish}>
          MongoDB
        </span>{" "}
        ו-
        <span dir="ltr" className={styles.inlineEnglish}>
          Material-UI
        </span>
        . העיצוב והפונקציונליות נבנו במטרה להדגים את היכולות הטכניות והבנה
        בסיסית של עקרונות{" "}
        <span dir="ltr" className={styles.inlineEnglish}>
          UX/UI
        </span>{" "}
        בפיתוח אפליקציות{" "}
        <span dir="ltr" className={styles.inlineEnglish}>
          web
        </span>{" "}
        מודרניות.
      </p>
      <br />
      <Box className={styles.infoGrid}>
        <Box className={styles.infoBox}>
          <Typography variant="h6" className={styles.infoBoxTitle}>
            טכנולוגיות בשימוש
          </Typography>
          <Typography variant="body2" className={styles.infoBoxContent}>
            <span dir="ltr" className={styles.inlineEnglish}>
              React 19 + TypeScript
            </span>
            <br />
            <span dir="ltr" className={styles.inlineEnglish}>
              Node.js + Express
            </span>
            <br />
            <span dir="ltr" className={styles.inlineEnglish}>
              MongoDB + Mongoose
            </span>
            <br />
            <span dir="ltr" className={styles.inlineEnglish}>
              Material-UI (MUI)
            </span>
            <br />
            <span dir="ltr" className={styles.inlineEnglish}>
              Redux Toolkit
            </span>
          </Typography>
        </Box>

        <Box className={styles.infoBox}>
          <Typography variant="h6" className={styles.infoBoxTitle}>
            תכונות עיקריות
          </Typography>
          <Typography variant="body2" className={styles.infoBoxContent}>
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
}
