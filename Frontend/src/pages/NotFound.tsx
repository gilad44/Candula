import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styles from "../Styles/pages/NotFound.module.css";

const NotFoundWithCSSModules = () => {
  return (
    <Box className={styles.container}>
      <Typography variant="h1" className={styles.errorNumber}>
        404
      </Typography>

      <Typography variant="h4" className={styles.errorTitle}>
        הדף לא נמצא
      </Typography>

      <Typography variant="body1" className={styles.errorMessage}>
        מצטערים, הדף שאתם מחפשים לא קיים. ייתכן שהקישור שגוי או שהדף הועבר
        למיקום אחר.
      </Typography>

      <Box className={styles.buttonsContainer}>
        <Button
          component={Link}
          to="/"
          variant="contained"
          className={styles.primaryButton}
        >
          חזרה לדף הבית
        </Button>

        <Button
          component={Link}
          to="/products"
          variant="outlined"
          className={styles.secondaryButton}
        >
          צפייה בנרות
        </Button>
      </Box>
    </Box>
  );
};

export default NotFoundWithCSSModules;
