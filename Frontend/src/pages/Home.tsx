import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { productsData } from "../data/productsData";
import styles from "../Styles/pages/Home.module.css";

const HomeWithCSSModules = () => {
  const navigate = useNavigate();

  // Get first 4 products for homepage showcase
  const featuredProducts = productsData.slice(0, 4);

  return (
    <>
      <Box className={styles.container}>
        {/* Site Title */}
        <Box className={styles.heroLogo}>
          <img
            src="/images/WicknWaxLogo.png"
            alt="לוגו פתיל ואש"
            className={styles.logoImage}
          />
          <Box className={styles.titleOverlay}>
            <Typography variant="h1" className={styles.mainTitle}>
              פתיל ואש
              <br />
              <span className={styles.subtitle}>נרות בעבודת יד</span>
            </Typography>
          </Box>
        </Box>

        {/* Featured Products Section */}
        <Box className={styles.featuredSection}>
          <Box className={styles.productsGrid}>
            {featuredProducts.map((product) => (
              <Box
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                className={styles.productCard}
              >
                <Box className={styles.productImageContainer}>
                  <img
                    src={`/images/${product.filename}`}
                    alt={product.title}
                    className={styles.productImage}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* CTA Button */}
        <Box className={styles.ctaContainer}>
          <Box component="a" href="/products" className={styles.ctaButton}>
            <span className={styles.ctaText}>לחנות</span>
            <span className={`${styles.ctaArrow} arrow-bounce`}>&raquo;</span>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default HomeWithCSSModules;
