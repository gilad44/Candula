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
import styles from "../Styles/pages/Favorites.module.css";

const FavoritesWithCSSModules = () => {
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
      <Box className={styles.emptyState}>
        <Typography variant="h4" className={styles.emptyTitle}>
          אין לך עדיין מועדפים
        </Typography>
        <Typography variant="body1" className={styles.emptyMessage}>
          התחל לסמן נרות כמועדפים כדי לראות אותם כאן
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.pageTitle}>
        המועדפים שלי ({favoriteProducts.length})
      </Typography>

      {/* View Toggle */}
      <Box className={styles.viewToggleContainer}>
        <Box className={styles.viewToggleBox}>
          <Typography variant="subtitle2" className={styles.viewToggleLabel}>
            תצוגה:
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            size="small"
            sx={{
              direction: "ltr",
              "& .MuiToggleButton-root": {
                border: "1px solid rgba(0, 0, 0, 0.12)",
                "&.Mui-selected": {
                  bgcolor: "#7f6000",
                  color: "white",
                  "&:hover": {
                    bgcolor: "#5a4400",
                  },
                },
              },
            }}
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
        <Box className={styles.gridContainer}>
          {favoriteProducts.map((product) => (
            <Box
              key={product.id}
              className={`${styles.productCard} product-card fade-in-scale`}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <Box className={styles.imageContainer}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={`${styles.favoriteButton} ${
                    isFavorite(product.id) ? "favorite-icon" : ""
                  }`}
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
                  className={styles.cartButton}
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
                  className={styles.productImage}
                />
              </Box>

              <Box className={styles.productInfo}>
                <Typography variant="h6" className={styles.productTitle}>
                  {product.title}
                </Typography>
                <Typography
                  variant="body2"
                  className={styles.productDescription}
                >
                  {product.description}
                </Typography>
                <Typography variant="h6" className={styles.productPrice}>
                  ₪{product.price}
                </Typography>
                <Typography variant="caption" className={styles.productMeta}>
                  {product.type} • {product.color}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Box className={styles.listContainer}>
          {favoriteProducts.map((product) => (
            <Box
              key={product.id}
              className={`${styles.listCard} product-card fade-in-scale`}
              onClick={() => navigate(`/products/${product.id}`)}
            >
              <Box className={styles.listImageContainer}>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}
                  className={`${styles.listFavoriteButton} ${
                    isFavorite(product.id) ? "favorite-icon" : ""
                  }`}
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
                  className={styles.productImage}
                />
              </Box>

              <Box className={styles.listContent}>
                <Box>
                  <Typography variant="h6" className={styles.listTitle}>
                    {product.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    className={styles.listDescription}
                  >
                    {product.description}
                  </Typography>
                  <Typography variant="caption" className={styles.listMeta}>
                    {product.type} • {product.color}
                  </Typography>
                </Box>

                <Box className={styles.listActions}>
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
                    className={styles.listCartButton}
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

                  <Typography variant="h6" className={styles.listPrice}>
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

export default FavoritesWithCSSModules;
