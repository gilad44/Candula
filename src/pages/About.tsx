import { Box, Typography } from "@mui/material";

const About = () => {
  return (
    <Box
      sx={{
        maxWidth: "800px",
        mx: "auto",
        p: 4,
        textAlign: "center",
        direction: "rtl",
      }}
    >
      <Typography
        variant="h3"
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
        אודות קנדולה
      </Typography>

      <Box sx={{ mb: 4 }}>
        <img
          src="images/logo.jpg"
          alt="לוגו קנדולה"
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            boxShadow: "0 4px 20px rgba(127, 96, 0, 0.3)",
            marginBottom: "2rem",
          }}
        />
      </Box>

      <Typography
        variant="h5"
        sx={{ mb: 3, color: "#7f6000", fontWeight: "600" }}
      >
        ברוכים הבאים לעולם הנרות הריחניים של קנדולה
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 3,
          lineHeight: 1.8,
          fontSize: "1.1rem",
          color: "#333",
        }}
      >
        קנדולה היא מותג ייחודי המתמחה בייצור נרות דקורטיביים ריחניים בעבודת יד.
        אנו מאמינים שכל נר מספר סיפור, יוצר אווירה ומעניק חוויה חושית מיוחדת
        לבית שלכם.
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 3,
          lineHeight: 1.8,
          fontSize: "1.1rem",
          color: "#333",
        }}
      >
        המוצרים שלנו נוצרים בקפידה רבה מחומרי גלם איכותיים, כולל שעווה טבעית
        ושמנים ארומטיים מובחרים. כל נר מעוצב ביד עם תשומת לב לפרטים הקטנים, כדי
        להעניק לכם חוויה ויזואלית וחושית מושלמת.
      </Typography>

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
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#7f6000", fontWeight: "bold" }}
          >
            הייחודיות שלנו
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            • נרות בעבודת יד מחומרים טבעיים
            <br />
            • עיצובים אומנותיים וייחודיים
            <br />
            • ריחות עדינים ומרגיעים
            <br />• מתאים לכל אירוע ועונה
          </Typography>
        </Box>

        <Box
          sx={{
            p: 3,
            borderRadius: 3,
            background:
              "linear-gradient(135deg, rgba(255,253,231,0.8), rgba(247,239,169,0.6))",
            boxShadow: "0 4px 15px rgba(127, 96, 0, 0.1)",
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: "#7f6000", fontWeight: "bold" }}
          >
            המשימה שלנו
          </Typography>
          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
            להעניק לכל בית אווירה חמה ומיוחדת
            <br />
            ליצור מוצרים איכותיים ובר-קיימא
            <br />
            לספק שירות אישי ומקצועי
            <br />
            להפוך כל רגע לחגיגה קטנה
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="h5"
        sx={{ mt: 4, mb: 2, color: "#7f6000", fontWeight: "600" }}
      >
        הקולקציות שלנו
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          lineHeight: 1.8,
          fontSize: "1.1rem",
          color: "#333",
        }}
      >
        במבחר הנרות שלנו תמצאו נרות לכל אירוע: נרות רומנטיים לזוגות, נרות
        דקורטיביים למניעת אמביאנס, נרות לחגים ולאירועים מיוחדים, ועוד הרבה
        עיצובים מיוחדים שיתאימו בדיוק לטעם האישי שלכם.
      </Typography>

      <Typography
        variant="body1"
        sx={{
          fontStyle: "italic",
          color: "#7f6000",
          fontWeight: "500",
          fontSize: "1.2rem",
        }}
      >
        "כי כל בית זוכה לאור משלו"
      </Typography>
    </Box>
  );
};

export default About;
