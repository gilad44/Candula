import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
} from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  Link,
  MenuItem,
  Rating,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import QuantitySelector from "../components/QuantitySelector";
import { productsData } from "../data/productsData";
import { cartActions } from "../slices/cartSlice";
import { userActions } from "../slices/userSlice";
import type { RootState } from "../store/store";
import type { Product, ProductVariant } from "../types/Product";

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.userSlice.user);

  const product = productsData.find((p) => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [tabValue, setTabValue] = useState(0);

  if (!product) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          textAlign: "center",
          direction: "rtl",
        }}
      >
        <Typography variant="h4" sx={{ mb: 2 }}>
          המוצר לא נמצא
        </Typography>
        <Button variant="contained" onClick={() => navigate("/products")}>
          חזור לקטלוג
        </Button>
      </Box>
    );
  }

  const isFavorite = user?.favorites?.includes(product.id) || false;

  const handleToggleFavorite = () => {
    if (!user) {
      toast.info("התחבר כדי לשמור מועדפים");
      return;
    }
    dispatch(userActions.toggleFavorite(product.id));
    toast.success(
      isFavorite
        ? `${product.title} הוסר מהמועדפים`
        : `${product.title} נוסף למועדפים ❤️`
    );
  };

  const handleAddToCart = () => {
    dispatch(
      cartActions.addToCart({
        productId: product.id,
        quantity,
        selectedVariant,
      })
    );
    toast.success(`${product.title} נוסף לסל הקניות (${quantity})`);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.title,
        text: product.description,
        url: typeof window !== "undefined" ? window.location.href : "",
      });
    } catch {
      // Fallback: copy to clipboard
      if (typeof window !== "undefined" && navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        toast.success("קישור הועתק ללוח");
      }
    }
  };

  const availableColors = product.variants
    ? [...new Set(product.variants.map((v) => v.color).filter(Boolean))]
    : Array.isArray(product.color)
    ? product.color
    : [product.color];

  const availableSizes = product.variants
    ? [...new Set(product.variants.map((v) => v.size).filter(Boolean))]
    : [];

  const availableScents = product.variants
    ? [...new Set(product.variants.map((v) => v.scent).filter(Boolean))]
    : product.scent
    ? [product.scent]
    : [];

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, direction: "rtl" }}>
      {/* Breadcrumbs */}
      <Breadcrumbs
        sx={{
          mb: 3,
          direction: "rtl",
          justifyContent: "flex-end",
          display: "flex",
        }}
      >
        <Link component={RouterLink} to="/" underline="hover">
          דף הבית
        </Link>
        <Link component={RouterLink} to="/products" underline="hover">
          הנרות שלנו
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row-reverse" },
          gap: 4,
          alignItems: "flex-start",
        }}
      >
        {/* Product Info - appears first on mobile, right on desktop for RTL */}
        <Box sx={{ flex: 1, order: { xs: 1, md: 0 } }}>
          <Typography variant="h4" sx={{ mb: 2 }}>
            {product.title}
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
              direction: "rtl",
              justifyContent: "flex-end",
            }}
          >
            <Rating
              value={(product as Product).rating ?? 4.5}
              readOnly
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              ({(product as Product).reviewCount ?? 23} ביקורות)
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              direction: "rtl",
              justifyContent: "flex-end",
            }}
          >
            {(product as Product).onSale === true &&
            (product as Product).originalPrice ? (
              <>
                <Typography
                  variant="h5"
                  sx={{ color: "error.main", fontWeight: "bold" }}
                >
                  ₪{product.price}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    textDecoration: "line-through",
                    color: "text.secondary",
                  }}
                >
                  ₪{(product as Product).originalPrice}
                </Typography>
              </>
            ) : (
              <Typography
                variant="h5"
                sx={{ color: "#7f6000", fontWeight: "bold" }}
              >
                ₪{product.price}
              </Typography>
            )}
          </Box>

          <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.7 }}>
            {product.description}
          </Typography>

          {/* Product Tags */}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              flexWrap: "wrap",
              mb: 3,
              direction: "rtl",
              justifyContent: "flex-end",
            }}
          >
            {product.tags.map((tag) => (
              <Chip key={tag} label={tag} variant="outlined" size="small" />
            ))}
          </Box>

          {/* Variant Selection */}
          {(availableColors.length > 1 ||
            availableSizes.length > 0 ||
            availableScents.length > 1) && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                בחירת אפשרויות
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  direction: "rtl",
                  alignItems: "flex-end",
                }}
              >
                {availableColors.length > 1 && (
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>צבע</InputLabel>
                    <Select
                      value={selectedVariant?.color || ""}
                      label="צבע"
                      onChange={(e) => {
                        const color = e.target.value;
                        const variant = product.variants?.find(
                          (v) => "color" in v && v.color === color
                        );
                        setSelectedVariant(variant || null);
                      }}
                    >
                      {availableColors.map((color) => (
                        <MenuItem key={color} value={color}>
                          {color}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {availableSizes.length > 0 && (
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>גודל</InputLabel>
                    <Select
                      value={selectedVariant?.size || ""}
                      label="גודל"
                      onChange={(e) => {
                        const size = e.target.value;
                        const variant = product.variants?.find(
                          (v) => "size" in v && v.size === size
                        );
                        setSelectedVariant(variant || null);
                      }}
                    >
                      {availableSizes.map((size) => (
                        <MenuItem key={size} value={size}>
                          {size}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}

                {availableScents.length > 1 && (
                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>ריח</InputLabel>
                    <Select
                      value={selectedVariant?.scent || product.scent || ""}
                      label="ריח"
                      onChange={(e) => {
                        const scent = e.target.value;
                        const variant = product.variants?.find(
                          (v) => "scent" in v && v.scent === scent
                        );
                        setSelectedVariant(variant || null);
                      }}
                    >
                      {availableScents.map((scent) => (
                        <MenuItem key={scent} value={scent}>
                          {scent}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </Box>
            </Box>
          )}

          {/* Quantity and Add to Cart */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 3,
              flexWrap: "wrap",
              direction: "rtl",
              justifyContent: "flex-end",
            }}
          >
            <QuantitySelector
              quantity={quantity}
              onIncrement={() => setQuantity(Math.min(quantity + 1, 100))}
              onDecrement={() => setQuantity(Math.max(quantity - 1, 1))}
              isOpen={true}
              size="medium"
            />

            <Button
              variant="contained"
              size="large"
              endIcon={<AddShoppingCart />}
              onClick={handleAddToCart}
              sx={{
                minWidth: 200,
                gap: 1,
                "& .MuiButton-endIcon": {
                  marginLeft: "8px",
                },
              }}
            >
              הוסף לסל
            </Button>
          </Box>

          {/* Product Details */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              direction: "rtl",
            }}
          >
            {product.scent && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  direction: "rtl",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  ריח:
                </Typography>
                <Typography variant="body2">{product.scent}</Typography>
              </Box>
            )}

            {(product as Product).material !== undefined && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  direction: "rtl",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  חומר:
                </Typography>
                <Typography variant="body2">
                  {(product as Product).material}
                </Typography>
              </Box>
            )}

            {(product as Product).burnTime !== undefined && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  direction: "rtl",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  זמן בעירה:
                </Typography>
                <Typography variant="body2">
                  {(product as Product).burnTime} שעות
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Product Image - appears second on mobile, left on desktop for RTL */}
        <Box
          sx={{ flex: 1, order: { xs: 2, md: 0 }, maxWidth: { md: "500px" } }}
        >
          <Card>
            <Box
              sx={{
                width: "100%",
                aspectRatio: "1/1",
                overflow: "hidden",
                position: "relative",
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

              {/* Action buttons overlay - positioned on left for RTL */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  left: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <IconButton
                  onClick={handleToggleFavorite}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                  }}
                >
                  {isFavorite ? (
                    <Favorite sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorder />
                  )}
                </IconButton>

                <IconButton
                  onClick={handleShare}
                  sx={{
                    bgcolor: "rgba(255,255,255,0.9)",
                    "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                  }}
                >
                  <Share />
                </IconButton>
              </Box>

              {(product as Product).onSale === true && (
                <Chip
                  label="במבצע"
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 16,
                    right: 16,
                  }}
                />
              )}
            </Box>
          </Card>
        </Box>
      </Box>

      {/* Product Tabs */}
      <Box sx={{ mt: 6 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
            aria-label="product information tabs"
          >
            <Tab label="תיאור מפורט" />
            <Tab label="מפרט טכני" />
            <Tab label="ביקורות" />
            <Tab label="שאלות ותשובות" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
            {product.description}
          </Typography>

          {/* Additional detailed description could go here */}
          <Box sx={{ mt: 3, direction: "rtl", textAlign: "right" }}>
            <Box
              sx={{
                width: "100%",
                textAlign: "right",
                direction: "rtl",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  textAlign: "right",
                }}
              >
                מאפיינים מיוחדים:
              </Typography>
            </Box>
            <ul
              style={{
                direction: "rtl",
                textAlign: "right",
                paddingRight: "20px",
                paddingLeft: "0",
              }}
            >
              <li>עשוי משעוות איכותית</li>
              <li>בעבודת יד מקצועית</li>
              <li>בוער באופן אחיד ונקי</li>
              <li>מתאים לכל אירוע</li>
            </ul>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ direction: "rtl" }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    width: "100%",
                    textAlign: "right",
                    direction: "rtl",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    פרטים נוספים
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    direction: "rtl",
                    alignItems: "flex-end",
                  }}
                >
                  <Typography variant="body2">סוג: {product.type}</Typography>
                  {selectedVariant?.sku && (
                    <Typography variant="body2">
                      מק"ט: {selectedVariant.sku}
                    </Typography>
                  )}
                  <Typography variant="body2">צורה: {product.shape}</Typography>
                  {(product as Product).burnTime !== undefined && (
                    <Typography variant="body2">
                      זמן בעירה: {(product as Product).burnTime} שעות
                    </Typography>
                  )}
                  {(product as Product).material !== undefined && (
                    <Typography variant="body2">
                      חומר: {(product as Product).material}
                    </Typography>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="body1" color="text.secondary">
            ביקורות יגיעו בגרסה עתידית של האתר
          </Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="body1" color="text.secondary">
            שאלות ותשובות יגיעו בגרסה עתידית של האתר
          </Typography>
        </TabPanel>
      </Box>
    </Box>
  );
};

export default ProductDetail;
