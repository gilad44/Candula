import { AddShoppingCart, Favorite } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import { Box, IconButton, InputBase, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import Filter from "../comps/Filter";
import QuantitySelector from "../comps/QuantitySelector";
import Sort from "../comps/Sort";
import { productsData } from "../data/productsData";
import { cartActions } from "../slices/cartSlice";
import { userActions } from "../slices/userSlice";
import type { RootState } from "../store/store";

const Products = () => {
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

  // Get search query from URL params
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [searchParams]);

  const filteredProducts = productsData.filter((product) => {
    // First filter by search query
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

    // Then apply other filters
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
    // console.log("sortConfig:", sortConfig); // Remove for production

    if (!sortConfig?.sortBy) return 0;

    const { sortBy, order } = sortConfig;
    // console.log("Sorting by:", sortBy, "order:", order); // Remove for production

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
    // console.log("sortedProducts:", sortedProducts); // Remove for production
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
    setOpenQty(null); // Close the quantity selector
  };
  return (
    <>
      <Box display="flex" flexDirection="column">
        {/* Search Bar */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 2,
            bgcolor: "rgba(255, 246, 209, 0.3)",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: "rgba(255, 246, 209, 0.9)",
              borderRadius: 2,
              px: 2,
              py: 1,
              minWidth: "300px",
              maxWidth: "500px",
              width: "100%",
            }}
          >
            <SearchIcon sx={{ color: "#7f6000", mr: 1 }} />
            <InputBase
              placeholder="חיפוש נרות..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                fontSize: "1rem",
                "& input": {
                  textAlign: "right",
                },
              }}
            />
          </Box>
        </Box>

        <Box display="flex">
          <Box display="flex" flexDirection="column">
            <Sort onSortChange={(sortData) => setSortConfig(sortData)} />
            <Filter onFilterChange={(filterData) => setFilters(filterData)} />
          </Box>
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
            {sortedProducts.map((product) => (
              <Box
                key={product.id}
                className="product-card fade-in-scale"
                onClick={() => navigate(`/product/${product.id}`)}
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
                    src={`images/${product.filename}`}
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
        </Box>
      </Box>
    </>
  );
};

export default Products;
