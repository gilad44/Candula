import { Box, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { productsData } from "../data/productsData";
import type { RootState } from "../store/store";

const Favorites = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);
  const favorites = user?.favorites || [];
  const favoriteProducts = productsData.filter((product) =>
    favorites.includes(product.id)
  );
  return (
    <Box
      sx={{
        display: "grid",
        width: "100%",
        gridTemplateColumns: "repeat(auto-fill, 250px)",
        gap: 2,
        p: "1rem",
        justifyContent: "center",
      }}
    >
      {favoriteProducts.length > 0 ? (
        favoriteProducts.map((item) => (
          <Box
            key={item.id}
            width="100%"
            position="relative"
            gap="1"
            sx={{ aspectRatio: "1/1", overflow: "hidden" }}
          >
            <img
              src={`images/${item.filename}`}
              alt={item.title}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>
        ))
      ) : (
        <Box
          width="100%"
          height="70vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gridColumn="1/-1"
        >
          <Typography variant="h5" color="black">
            אין לך עדיין מועדפים
          </Typography>
        </Box>
      )}
    </Box>
  );
};
export default Favorites;
