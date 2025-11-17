import { Box, Container, Link, Typography } from "@mui/material";
import styles from "../Styles/components/Footer.module.css";

const FooterWithCSSModules = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" className={styles.footer}>
      <Container maxWidth="lg">
        <Box className={styles.gridContainer}>
          {/* Logo and Description */}
          <Box>
            <Box className={styles.logoSection}>
              <Box className={styles.logoCircle}>
                <img
                  src="/images/WicknWaxLogo.png"
                  alt="לוגו פתיל ואש"
                  className={styles.logoImage}
                />
              </Box>
              <Typography variant="h5" className={styles.brandName}>
                פתיל ואש
              </Typography>
            </Box>
            <Typography variant="body2" className={styles.description}>
              נרות דקורטיביים ריחניים בעבודת יד. אנו מתמחים ביצירת אווירה חמה
              ומיוחדת לכל בית עם מוצרים איכותיים ועיצובים ייחודיים.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box className={styles.linksSection}>
            <Typography variant="h6" className={styles.sectionTitle}>
              קישורים מהירים
            </Typography>
            <Box className={styles.linksList}>
              <Link href="/" className={styles.link} underline="none">
                דף הבית
              </Link>
              <Link href="/about" className={styles.link} underline="none">
                אודות
              </Link>
              <Link href="/products" className={styles.link} underline="none">
                הנרות שלנו
              </Link>
              <Link href="/favorites" className={styles.link} underline="none">
                מועדפים
              </Link>
            </Box>
          </Box>

          {/* Contact Info */}
          <Box className={styles.contactSection}>
            <Typography variant="h6" className={styles.sectionTitle}>
              יצירת קשר
            </Typography>
            <Typography variant="body2" className={styles.contactInfo}>
              info@candula.co.il
              <br />
              050-123-4567
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Copyright */}
      <Box className={styles.copyright}>
        <Typography className={styles.copyrightText}>
          © {currentYear} גלעד לזובסקי בניית אתרים | כל הזכויות שמורות
        </Typography>
      </Box>
    </Box>
  );
};

export default FooterWithCSSModules;
