import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
        textAlign: "center",
        p: 4,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: "8rem",
          fontWeight: "bold",
          background: "linear-gradient(45deg, #7f6000, #cd853f, #ffd700)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          mb: 2,
        }}
      >
        404
      </Typography>

      <Typography
        variant="h4"
        sx={{
          color: "#7f6000",
          mb: 2,
          fontWeight: "600",
        }}
      >
        הדף לא נמצא
      </Typography>

      <Typography
        variant="body1"
        sx={{
          color: "#666",
          mb: 4,
          maxWidth: "500px",
          lineHeight: 1.6,
        }}
      >
        מצטערים, הדף שאתם מחפשים לא קיים. ייתכן שהקישור שגוי או שהדף הועבר
        למיקום אחר.
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Button
          component={Link}
          to="/"
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #7f6000, #cd853f)",
            "&:hover": {
              background: "linear-gradient(45deg, #654d00, #b8762f)",
            },
            px: 3,
            py: 1.5,
          }}
        >
          חזרה לדף הבית
        </Button>

        <Button
          component={Link}
          to="/products"
          variant="outlined"
          sx={{
            color: "#7f6000",
            borderColor: "#7f6000",
            "&:hover": {
              borderColor: "#654d00",
              color: "#654d00",
            },
            px: 3,
            py: 1.5,
          }}
        >
          צפייה בנרות
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
