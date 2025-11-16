import { Box, Container, Link, Typography } from "@mui/material";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        height: "60vh",
        background: "linear-gradient(135deg, #2c2c2cff 0%, #1a1a1a 100%)",
        py: 6,
        position: "relative",
        zIndex: 0,
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
              <Box
                sx={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  marginRight: "1rem",
                  boxShadow: "0 0 5px 3px #ffffe4ff",
                }}
              >
                <img
                  src="/images/WicknWaxLogo.png"
                  alt="לוגו פתיל ואש"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "scale(2)",
                  }}
                />
              </Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  fontFamily: "Arial, sans-serif",
                  background: "linear-gradient(45deg, #ffd700, #cd853f)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                פתיל ואש
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "#ccc",
                lineHeight: 1.6,
                fontFamily: "Arial, sans-serif",
              }}
            >
              נרות דקורטיביים ריחניים בעבודת יד. אנו מתמחים ביצירת אווירה חמה
              ומיוחדת לכל בית עם מוצרים איכותיים ועיצובים ייחודיים.
            </Typography>
          </Box>

          {/* Quick Links */}
          <Box sx={{ pl: 15 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#ffd700",
                fontWeight: "bold",
                fontFamily: "Arial, sans-serif",
              }}
            >
              קישורים מהירים
            </Typography>
            <Box
              className="quickLinks"
              sx={{ display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Link
                href="/"
                sx={{
                  color: "#ccc",
                  textDecoration: "none",
                  fontFamily: "Arial, sans-serif",
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
                  fontFamily: "Arial, sans-serif",
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
                  fontFamily: "Arial, sans-serif",
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
                  fontFamily: "Arial, sans-serif",
                  "&:hover": { color: "#ffd700" },
                }}
              >
                מועדפים
              </Link>
            </Box>
          </Box>

          {/* Contact Info Placeholder (removed button) */}
          <Box sx={{ pl: 15 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "#ffd700",
                fontWeight: "bold",
                fontFamily: "Arial, sans-serif",
              }}
            >
              יצירת קשר
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#ccc",
                fontFamily: "Arial, sans-serif",
              }}
            >
              info@candula.co.il
              <br />
              050-123-4567
            </Typography>
          </Box>
        </Box>
      </Container>

      {/* Copyright */}
      <Box
        sx={{
          borderTop: "1px solid #444",
          mt: 4,
          textAlign: "center",
          width: "100%",
          bgcolor: "black",
        }}
      >
        <Typography
          sx={{
            color: "#fffbd7ff",
            fontFamily: "Arial, sans-serif",
            fontSize: 10,
          }}
        >
          © {currentYear} גלעד לזובסקי בניית אתרים | כל הזכויות שמורות
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
