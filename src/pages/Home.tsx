import { Box } from "@mui/material";
import { Canvas } from "@react-three/fiber";
import "../styles/home.css";
import CandleSet from "../threeComps/Candle";
import LabBG from "../threeComps/LabBG";
// const imagesPath = [
//   "/images/Banner/cozy-composition-with-candles-knitted-element-garland.jpg",
//   "/images/Banner/decorative-candle-dried-orange-slices-pine-cones.jpg",
//   "/images/Banner/pexels-paul-wence-54184-1832562.jpg",
//   "/images/Banner/red-christmas-candles-with-fir-cones.jpg",
// ];

const Home = () => {
  return (
    <>
      <Box
        // display="flex"
        // // bgcolor="black"
        // alignItems="center"
        // justifyContent="center"
        width="100%"
        height="100vh"
        position="relative"
        sx={{
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            maxHeight: 700,
            display: "flex",
            overflow: "hidden",
            borderRadius: 0,
            zIndex: 0,
          }}
        >
          <img
            src="images/bgImage.png"
            alt=""
            style={{
              width: "100%",
              height: "100%",
              maxHeight: 500,
              objectFit: "cover",
              objectPosition: "center",
              transform: "scaleX(-1)",
              // filter: "blur(2px)",
            }}
          />
        </Box>
        {/* <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          speed={3000}
          loop={true}
          allowTouchMove={true}
          style={{
            position: "absolute", // ✅ Position absolutely
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1, // ✅ Behind canvas
            borderRadius: 0,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
            overflow: "hidden",
          }}
        >
          {imagesPath.map((src, idx) => (
            <SwiperSlide key={idx}>
              <Box
                sx={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  maxHeight: 700,
                  display: "flex",
                  overflow: "hidden",
                  borderRadius: 0,
                  zIndex: -1,
                }}
              >
                <img
                  src={src}
                  alt={`banner-${idx}`}
                  loading="eager"
                  style={{
                    width: "100%",
                    height: "100%",
                    maxHeight: 500,
                    objectFit: "cover",
                    objectPosition: "center",
                    background: "#f5f5f5",
                    display: "block",
                    filter: "blur(5px)",
                  }}
                />
              </Box>
            </SwiperSlide>
          ))}
        </Swiper>  */}
        <Canvas
          orthographic
          camera={{ position: [0, 0, 8], zoom: 30 }}
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            top: 0,
            right: 0,
            zIndex: 15,
            // marginBottom: "20vh",
          }}
        >
          <ambientLight intensity={0.3} color="#ffeaa7" />
          <directionalLight
            color="orange"
            intensity={0.7}
            position={[1, 2, 0]}
          />

          <CandleSet />
          <LabBG />
        </Canvas>
        {/* CTA Button - On top of everything*/}
        <Box
          sx={{
            position: "absolute", // ✅ Position absolutely over canvas
            bottom: { "3xs": "5vmax", sm: "10vmax", lg: "12vmax" },
            right: { "3xs": "5vmax" },
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            zIndex: 10,
            pointerEvents: "none",

            // Light hue
            // "&::after": {
            //   content: '""',
            //   position: "absolute",
            //   bottom: 75,
            //   left: 60,
            //   opacity: 0.5,
            //   color: "rgba(255, 254, 238, 1)",
            //   pointerEvents: "none",
            //   borderRadius: 50,
            //   border: "0.01px solid rgb(255, 253, 231)",
            //   boxShadow: "-0.5px -0.2px 20px 15px rgb(255, 253, 231)",
            //   zIndex: 4,
            // },
          }}
        >
          <Box
            component="a"
            href="/products"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              // backgroundImage: 'url("images/pexels-numangilgil-9299394.jpg")',
              // backgroundPosition: "center",
              // backgroundSize: "cover",
              // backgroundRepeat: "no-repeat",
              // pr: "4.5rem",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: { "3xs": "1rem", sm: "1.2rem", lg: "1.5rem" },
              fontFamily: "dorian",
              boxShadow: 3,
              textDecoration: "none",
              transition: "background 0.2s",
              pointerEvents: "auto",
              gap: "0.2rem",
              position: "relative",
              zIndex: 3,
              overflow: "hidden",
              width: { "3xs": "28vmax", sm: "25vmax", md: "10vmax" },
              height: { "3xs": "7vmax", sm: "5vmax" },
            }}
          >
            <span
              style={{
                // marginRight: "4.5rem",
                background: "linear-gradient(90deg, orange ,#ffffa9 )",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                display: "inline-block",
              }}
            >
              לקנייה
            </span>
            <span style={{ fontSize: "2rem" }} className="arrow-bounce">
              &raquo;
            </span>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          // position: "absolute",
          // left: 0,
          // top: "100vh",
          width: "100%",
          height: "20vh", // Adjust height as needed
          zIndex: 30,
          pointerEvents: "none",
          background:
            "linear-gradient(to bottom, rgba(17, 0, 0, 1) 0%, #2c2c2cff  100%)",
        }}
      />
    </>
  );
};

export default Home;
