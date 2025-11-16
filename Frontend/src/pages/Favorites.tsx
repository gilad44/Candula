import {
  AddShoppingCart,
  Favorite,
  GridView,
  ViewList,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import QuantitySelector from "../components/QuantitySelector";
import { productsData } from "../data/productsData";
import { cartActions } from "../slices/cartSlice";
import { userActions } from "../slices/userSlice";
import type { RootState } from "../store/store";

const Favorites = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userSlice.user);
  const [quantity, setQuantity] = useState(1);
  const [openQty, setOpenQty] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const favorites = user?.favorites || [];
  const favoriteProducts = productsData.filter((product) =>
    favorites.includes(product.id)
  );

  const isFavorite = (productId: string) => {
    return user?.favorites?.includes(productId) || false;
  };

  const toggleFavorite = (productId: string) => {
    const product = productsData.find((p) => p.id === productId);
    const isCurrentlyFavorite = isFavorite(productId);

    dispatch(userActions.toggleFavorite(productId));

    if (!user) {
      toast.info("התחבר כדי לשמור מועדפים");
      return;
    }

    if (isCurrentlyFavorite) {
      toast.success(`${product?.title || "המוצר"} הוסר מהמועדפים`);
    } else {
      toast.success(`${product?.title || "המוצר"} נוסף למועדפים ❤️`);
    }
  };

  const handleAddToCart = (productId: string, quantity: number = 1) => {
    const product = productsData.find((p) => p.id === productId);
    dispatch(cartActions.addToCart({ productId, quantity }));
    toast.success(`${product?.title || "המוצר"} נוסף לסל הקניות (${quantity})`);
  };

  const incrementQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 100));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  const addToCartWithQuantity = (productId: string) => {
    handleAddToCart(productId, quantity);
    setOpenQty(null); // Close the quantity selector
  };

  if (favoriteProducts.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          p: 3,
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, color: "#7f6000" }}>
          אין לך עדיין מועדפים
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          התחל לסמן נרות כמועדפים כדי לראות אותם כאן
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        sx={{ mb: 4, textAlign: "center", color: "#7f6000" }}
      >
        המועדפים שלי ({favoriteProducts.length})
      </Typography>

      {/* View Toggle */}
      <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
        <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 1, textAlign: "center" }}>
            תצוגה:
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
            sx={{ direction: "ltr" }}
          >
            <ToggleButton value="grid" aria-label="תצוגת כרטיסים">
              <GridView />
            </ToggleButton>
            <ToggleButton value="list" aria-label="תצוגת רשימה">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      {viewMode === "grid" ? (
        <Box
          sx={{
            display: "grid",
            width: "100%",
            gridTemplateColumns: "repeat(auto-fill, 250px)",
            gap: 2,
            justifyContent: "center",
          }}
        >
          {favoriteProducts.map((product) => (
            <Box
              key={product.id}
              className="product-card fade-in-scale"
              onClick={() => navigate(`/products/${product.id}`)}
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(127, 96, 0, 0.1)",
                bgcolor: "white",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 8px 25px rgba(127, 96, 0, 0.15)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  aspectRatio: "1/1",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={isFavorite(product.id) ? "favorite-icon" : ""}
                  sx={{
                    position: "absolute",
                    right: "0.3rem",
                    top: "0.3rem",
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
                    transition: "all 0.2s ease",
                  }}
                >
                  {isFavorite(product.id) ? (
                    <Favorite sx={{ color: "red" }} />
                  ) : (
                    <Favorite sx={{ color: "#ccc" }} />
                  )}
                </IconButton>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenQty((prev) => {
                      if (prev === product.id) {
                        addToCartWithQuantity(product.id);
                        return null;
                      } else {
                        setQuantity(1);
                        return product.id;
                      }
                    });
                  }}
                  size="small"
                  sx={{
                    position: "absolute",
                    left: "0.3rem",
                    top: "0.3rem",
                    bgcolor: "rgba(255,255,255,0.7)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                  }}
                >
                  <AddShoppingCart />
                </IconButton>
                <QuantitySelector
                  quantity={quantity}
                  onIncrement={incrementQuantity}
                  onDecrement={decrementQuantity}
                  isOpen={openQty === product.id}
                  position="absolute"
                  size="small"
                />
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

              <Box sx={{ p: 1, textAlign: "center" }}>
                <Typography
                  variant="h6"
                  sx={{ fontSize: "1rem", fontWeight: "bold", mb: 0.5 }}
                >
                  {product.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.8rem", color: "gray", mb: 1 }}
                >
                  {product.description}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                    color: "#7f6000",
                    mb: 0.5,
                  }}
                >
                  ₪{product.price}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "0.75rem", color: "#666" }}
                >
                  {product.type} • {product.color}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box sx={{ width: "100%" }}>
          {favoriteProducts.map((product) => (
            <Box
              key={product.id}
              className="product-card fade-in-scale"
              onClick={() => navigate(`/products/${product.id}`)}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                overflow: "hidden",
                borderRadius: 2,
                boxShadow: "0 4px 12px rgba(127, 96, 0, 0.1)",
                bgcolor: "white",
                cursor: "pointer",
                mb: 2,
                "&:hover": {
                  boxShadow: "0 8px 25px rgba(127, 96, 0, 0.15)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <Box
                sx={{
                  width: { xs: "100%", sm: "200px" },
                  height: { xs: "200px", sm: "150px" },
                  overflow: "hidden",
                  position: "relative",
                  flexShrink: 0,
                }}
              >
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={isFavorite(product.id) ? "favorite-icon" : ""}
                  sx={{
                    position: "absolute",
                    right: "0.3rem",
                    top: "0.3rem",
                    bgcolor: "rgba(255, 255, 255, 0.9)",
                    "&:hover": { bgcolor: "rgba(255, 255, 255, 1)" },
                    transition: "all 0.2s ease",
                    zIndex: 1,
                  }}
                >
                  {isFavorite(product.id) ? (
                    <Favorite sx={{ color: "red" }} />
                  ) : (
                    <Favorite sx={{ color: "#ccc" }} />
                  )}
                </IconButton>
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

              <Box
                sx={{
                  p: 2,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  direction: "rtl",
                  textAlign: "right",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 1 }}
                  >
                    {product.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.9rem",
                      color: "gray",
                      mb: 2,
                      lineHeight: 1.5,
                    }}
                  >
                    {product.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      fontSize: "0.8rem",
                      color: "#666",
                      display: "block",
                      mb: 1,
                    }}
                  >
                    {product.type} • {product.color}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mt: 2,
                  }}
                >
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenQty((prev) => {
                        if (prev === product.id) {
                          addToCartWithQuantity(product.id);
                          return null;
                        } else {
                          setQuantity(1);
                          return product.id;
                        }
                      });
                    }}
                    sx={{
                      bgcolor: "#7f6000",
                      color: "white",
                      "&:hover": { bgcolor: "#5a4400" },
                      transition: "all 0.2s ease",
                    }}
                  >
                    <AddShoppingCart />
                  </IconButton>

                  <QuantitySelector
                    quantity={quantity}
                    onIncrement={incrementQuantity}
                    onDecrement={decrementQuantity}
                    isOpen={openQty === product.id}
                    position="relative"
                    size="small"
                  />

                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: "1.3rem",
                      fontWeight: "bold",
                      color: "#7f6000",
                    }}
                  >
                    ₪{product.price}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
export default Favorites;
