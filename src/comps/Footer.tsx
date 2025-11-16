import { Box, Container, Link, Typography } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)",
        color: "white",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 4,
          }}
        >
          {/* Logo and Description */}
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <img
                src="images/logo.jpg"
                alt="לוגו קנדולה"
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  marginLeft: "1rem",
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #ffd700, #cd853f)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                קנדולה
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#ccc", lineHeight: 1.6 }}>
              נרות דקורטיביים ריחניים בעבודת יד. אנו מתמחים ביצירת אווירה חמה
              ומיוחדת לכל בית עם מוצרים איכותיים ועיצובים ייחודיים.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#ffd700", fontWeight: "bold" }}
            >
              קישורים מהירים
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link
                href="/"
                sx={{
                  color: "#ccc",
                  textDecoration: "none",
                  "&:hover": { color: "#ffd700" },
                }}
              >
                דף הבית
              </Link>
              <Link
                href="/about"
                sx={{
                  color: "#ccc",
                  textDecoration: "none",
                  "&:hover": { color: "#ffd700" },
                }}
              >
                אודות
              </Link>
              <Link
                href="/products"
                sx={{
                  color: "#ccc",
                  textDecoration: "none",
                  "&:hover": { color: "#ffd700" },
                }}
              >
                הנרות שלנו
              </Link>
              <Link
                href="/favorites"
                sx={{
                  color: "#ccc",
                  textDecoration: "none",
                  "&:hover": { color: "#ffd700" },
                }}
              >
                מועדפים
              </Link>
            </Box>
          </Box>

          {/* Contact Info Placeholder (removed button) */}
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#ffd700", fontWeight: "bold" }}
            >
              יצירת קשר
            </Typography>
            <Typography variant="body2" sx={{ color: "#ccc" }}>
              info@candula.co.il
              <br />
              050-123-4567
            </Typography>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: "1px solid #444",
            mt: 4,
            pt: 2,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#888" }}>
            © {currentYear} קנדולה. כל הזכויות שמורות. | נרות בעבודת יד עם אהבה
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
