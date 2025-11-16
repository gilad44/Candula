import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { productsData } from "../data/productsData";

const Home = () => {
  const navigate = useNavigate();

  // Get first 3-4 products for homepage showcase
  const featuredProducts = productsData.slice(0, 4);

  return (
    <>
      <Box
        width="100%"
        minHeight="100vh"
        position="relative"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pb: 8,
        }}
      >
        {/* Site Title */}
        <Box
          sx={{
            position: "relative",
            mt: 4,
            mb: 4,
            background:
              "radial-gradient(circle, orange 100%, #ff4000a9 40%, #d0c11bc8 60%)",
            borderRadius: "50%",
            boxShadow:
              "0 0 20px 5px #d8cc99, 0 0 40px 15px #d8cc99, 5px 5px 60px 30px #d8cc99, inset 0 0 60px #d8cc99",
            width: "300px",
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at center 75%, #ff7b00a6 5%,  #ded308ff 65%, #676314ce 90%)",
              zIndex: 1,
              pointerEvents: "none",
            },
          }}
        >
          <img
            src="/images/WicknWaxLogo.png"
            alt="לוגו פתיל ואש"
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: "scale(3)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              zIndex: 2,
              width: "400px",
              whiteSpace: "nowrap",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontFamily: "dorian",
                fontWeight: 600,
                fontSize: 70,
                letterSpacing: 0.7,
                background: "linear-gradient(90deg, orange, #c7c736ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0px 7px 8px rgba(0, 0, 0, 0.6)",
                WebkitTextStroke: "1px",
                lineHeight: 1.2,
              }}
            >
              פתיל ואש
              <br />
              <span style={{ fontSize: "40px" }}>נרות בעבודת יד</span>
            </Typography>
          </Box>
        </Box>

        {/* Featured Products Section */}
        <Box
          sx={{
            width: "70%",
            maxWidth: "1200px",
            zIndex: 50,
            pointerEvents: "none",
            mt: 5,
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 8,
            }}
          >
            {featuredProducts.map((product) => (
              <Box
                key={product.id}
                onClick={() => navigate(`/products/${product.id}`)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  border: " 4px ridge goldenrod",
                  borderRadius: "50%",
                  aspectRatio: "1/1",
                  boxShadow: "-4px -1px 20px rgba(0, 0, 0, 0.58)",
                  bgcolor: "rgba(58, 58, 58, 0.9)",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  pointerEvents: "auto",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "-4px -4px 20px rgba(255, 237, 132, 0.54)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    position: "relative",
                    borderRadius: "50%",
                  }}
                >
                  <img
                    src={`/images/${product.filename}`}
                    alt={product.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
        {/* CTA Button - On top of everything*/}
        <Box
          sx={{
            mt: 8,
            borderRadius: 10,
            pointerEvents: "none",
          }}
        >
          <Box
            component="a"
            href="/products"
            sx={{
              background:
                "radial-gradient(circle, #ff7b00a6 95%,  #ded308ff 35%, #676314ce 90%)",
              // boxShadow: "0 0 10px 5px #b8b26c",
              border: "3px ridge gold",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: { "3xs": "1.3rem", sm: "1.5rem", lg: "2rem" },
              fontFamily: "dorian",
              textDecoration: "none",
              transition: "background 0.2s",
              pointerEvents: "auto",
              gap: "0.2rem",
              position: "relative",
              zIndex: 3,
              overflow: "hidden",
              width: { "3xs": "28vmax", sm: "25vmax", md: "15vmax" },
              height: { "3xs": "7vmax", sm: "5vmax" },
            }}
          >
            <span
              style={{
                background: "orange",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0px 0px 4px rgba(103, 57, 10, 1)",
                WebkitTextStroke: "0.4px",
                display: "inline-block",
                marginRight: 20,
              }}
            >
              לחנות
            </span>
            <span style={{ fontSize: "2.5rem" }} className="arrow-bounce">
              &raquo;
            </span>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
