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
  Grid,
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
import QuantitySelector from "../comps/QuantitySelector";
import { productsData } from "../data/productsData";
import { cartActions } from "../slices/cartSlice";
import { userActions } from "../slices/userSlice";
import type { RootState } from "../store/store";
import type { ProductVariant } from "../types/Product";

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
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link component={RouterLink} to="/" underline="hover">
          דף הבית
        </Link>
        <Link component={RouterLink} to="/products" underline="hover">
          הנרות שלנו
        </Link>
        <Typography color="text.primary">{product.title}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
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

              {/* Action buttons overlay */}
              <Box
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
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

              {product.onSale && (
                <Chip
                  label="במבצע"
                  color="error"
                  sx={{
                    position: "absolute",
                    top: 16,
                    left: 16,
                  }}
                />
              )}
            </Box>
          </Card>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" sx={{ mb: 2 }}>
              {product.title}
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Rating value={product.rating || 4.5} readOnly size="small" />
              <Typography variant="body2" color="text.secondary">
                ({product.reviewCount || 23} ביקורות)
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              {product.onSale && product.originalPrice ? (
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
                    ₪{product.originalPrice}
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
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
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

                <Grid container spacing={2}>
                  {availableColors.length > 1 && (
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>צבע</InputLabel>
                        <Select
                          value={selectedVariant?.color || ""}
                          label="צבע"
                          onChange={(e) => {
                            const color = e.target.value;
                            const variant = product.variants?.find(
                              (v) => v.color === color
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
                    </Grid>
                  )}

                  {availableSizes.length > 0 && (
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>גודל</InputLabel>
                        <Select
                          value={selectedVariant?.size || ""}
                          label="גודל"
                          onChange={(e) => {
                            const size = e.target.value;
                            const variant = product.variants?.find(
                              (v) => v.size === size
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
                    </Grid>
                  )}

                  {availableScents.length > 1 && (
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <InputLabel>ריח</InputLabel>
                        <Select
                          value={selectedVariant?.scent || product.scent || ""}
                          label="ריח"
                          onChange={(e) => {
                            const scent = e.target.value;
                            const variant = product.variants?.find(
                              (v) => v.scent === scent
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
                    </Grid>
                  )}
                </Grid>
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
                startIcon={<AddShoppingCart />}
                onClick={handleAddToCart}
                sx={{ minWidth: 200 }}
              >
                הוסף לסל
              </Button>
            </Box>

            {/* Product Details Grid */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  סוג:
                </Typography>
                <Typography variant="body2">{product.type}</Typography>
              </Grid>

              {product.scent && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    ריח:
                  </Typography>
                  <Typography variant="body2">{product.scent}</Typography>
                </Grid>
              )}

              {product.material && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    חומר:
                  </Typography>
                  <Typography variant="body2">{product.material}</Typography>
                </Grid>
              )}

              {product.burnTime && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    זמן בעירה:
                  </Typography>
                  <Typography variant="body2">
                    {product.burnTime} שעות
                  </Typography>
                </Grid>
              )}

              {selectedVariant?.sku && (
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    מק"ט:
                  </Typography>
                  <Typography variant="body2">{selectedVariant.sku}</Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>

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
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              מאפיינים מיוחדים:
            </Typography>
            <ul>
              <li>עשוי משעוות איכותית</li>
              <li>בעבודת יד מקצועית</li>
              <li>בוער באופן אחיד ונקי</li>
              <li>מתאים לכל אירוע</li>
            </ul>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    מידות ומשקל
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {product.dimensions && (
                      <>
                        <Typography variant="body2">
                          גובה: {product.dimensions.height} ס"מ
                        </Typography>
                        <Typography variant="body2">
                          רוחב: {product.dimensions.width} ס"מ
                        </Typography>
                        <Typography variant="body2">
                          עומק: {product.dimensions.depth} ס"מ
                        </Typography>
                      </>
                    )}
                    {product.weight && (
                      <Typography variant="body2">
                        משקל: {product.weight} גרם
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    פרטים נוספים
                  </Typography>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    <Typography variant="body2">
                      צורה: {product.shape}
                    </Typography>
                    {product.burnTime && (
                      <Typography variant="body2">
                        זמן בעירה: {product.burnTime} שעות
                      </Typography>
                    )}
                    {product.material && (
                      <Typography variant="body2">
                        חומר: {product.material}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
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
