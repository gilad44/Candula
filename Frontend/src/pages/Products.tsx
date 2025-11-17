import {
  AddShoppingCart,
  Favorite,
  GridView,
  ViewList,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  IconButton,
  InputBase,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Filter from "../components/Filter";
import QuantitySelector from "../components/QuantitySelector";
import Sort from "../components/Sort";
import { productsData } from "../data/productsData";
import { cartActions } from "../slices/cartSlice";
import { userActions } from "../slices/userSlice";
import type { RootState } from "../store/store";
import styles from "../Styles/pages/Products.module.css";

const ProductsWithCSSModules = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userSlice.user);
  const [searchParams] = useSearchParams();

  const isFavorite = (productId: string) => {
    return user?.favorites?.includes(productId) || false;
  };
  const [quantity, setQuantity] = useState(1);
  const [openQty, setOpenQty] = useState<string | null>(null);
  const [filters, setFilters] = useState(null);
  const [sortConfig, setSortConfig] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Get search query from URL params
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const filteredProducts = productsData.filter((product) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.type.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query)) ||
        (Array.isArray(product.color) ? product.color : [product.color]).some(
          (color) => color.toLowerCase().includes(query)
        );
      if (!matchesSearch) return false;
    }

    if (!filters) return true;
    if (
      filters.size &&
      !product.variants.some((variants) => variants.size === filters.size)
    ) {
      return false;
    }
    if (filters.color && !product.color.includes(filters.color)) {
      return false;
    }
    if (filters.scent && product.scent !== filters.scent) {
      return false;
    }
    if (filters.type && product.type !== filters.type) {
      return false;
    }
    if (
      filters.price &&
      (product.price < filters.price[0] || product.price > filters.price[1])
    ) {
      return false;
    }
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (!sortConfig?.sortBy) return 0;

    const { sortBy, order } = sortConfig;

    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (Array.isArray(aValue)) aValue = aValue[0];
    if (Array.isArray(bValue)) bValue = bValue[0];

    if (typeof aValue === "string") {
      const comparison = aValue.localeCompare(bValue, "he");
      return order === "asc" ? comparison : -comparison;
    }

    if (typeof aValue === "number") {
      return order === "asc" ? aValue - bValue : bValue - aValue;
    }
    return 0;
  });

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
    setOpenQty(null);
  };

  return (
    <>
      <Box className={styles.container}>
        {/* Search Bar */}
        <Box className={styles.searchBarContainer}>
          <Box className={styles.searchBox}>
            <SearchIcon className={styles.searchIcon} />
            <InputBase
              placeholder="חיפוש נרות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </Box>
        </Box>

        {/* View Toggle */}
        <Box className={styles.viewToggleContainer}>
          <Box className={styles.viewToggleBox}>
            <Typography variant="subtitle2" className={styles.viewLabel}>
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
                  border: "1px solid #7f6000",
                  color: "#7f6000",
                  "&.Mui-selected": {
                    bgcolor: "#7f6000",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#5a4400",
                    },
                  },
                  "&:hover": {
                    bgcolor: "rgba(127, 96, 0, 0.1)",
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

        <Box className={styles.mainContent}>
          <Box className={styles.sidebar}>
            <Sort onSortChange={(sortData) => setSortConfig(sortData)} />
            <Filter onFilterChange={(filterData) => setFilters(filterData)} />
          </Box>

          {/* Products Display - Grid or List View */}
          {viewMode === "grid" ? (
            <Box className={styles.gridContainer}>
              {sortedProducts.map((product) => (
                <Box
                  key={product.id}
                  className={`${styles.productCard} product-card fade-in-scale`}
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  <Box className={styles.productImageContainer}>
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
                    <Typography
                      variant="caption"
                      className={styles.productMeta}
                    >
                      {product.type} • {product.color}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          ) : (
            <Box className={styles.listContainer}>
              {sortedProducts.map((product) => (
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

                    <Box className={styles.listFooter}>
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
      </Box>
    </>
  );
};

export default ProductsWithCSSModules;
