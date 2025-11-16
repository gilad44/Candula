import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { config } from "../../config/config";
import { productsData } from "../../data/productsData";

interface Product {
  _id: string;
  id?: string;
  filename: string;
  type: string;
  title: string;
  description: string;
  color: string | string[];
  shape: string;
  price: number;
  tags: string[];
  variants?: { pose?: string; sku?: string }[];
  scent?: string;
  sku?: string;
  style?: string;
  createdAt?: string;
  likes?: string[];
}

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      console.log("Loading products from:", `${config.API_BASE_URL}/products`); // Debug log

      const response = await fetch(`${config.API_BASE_URL}/products`);

      console.log("Products API response status:", response.status); // Debug log

      if (!response.ok) {
        console.warn("Backend API failed, using static data"); // Debug log
        // Fallback to static data
        const staticProducts = productsData.map((product, index) => ({
          _id: product.id || product.filename || `static-${index}`,
          ...product,
        }));
        setProducts(staticProducts);
        return;
      }

      const backendData = await response.json();
      console.log("Products API response:", backendData); // Debug log
      console.log("Is products data an array?", Array.isArray(backendData)); // Debug log

      // Ensure we always have an array
      const productsArray = Array.isArray(backendData) ? backendData : [];
      console.log("Setting products array with length:", productsArray.length); // Debug log
      setProducts(productsArray);
    } catch (error) {
      console.error("Error loading products:", error);
      console.log("Using static data as fallback"); // Debug log
      // Fallback to static data on any error
      const staticProducts = productsData.map((product, index) => ({
        _id: product.id || product.filename || `static-${index}`,
        ...product,
      }));
      setProducts(staticProducts);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק מוצר זה?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${config.API_BASE_URL}/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            "x-auth-token": token || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      toast.success("המוצר נמחק בהצלחה");
      loadProducts(); // Refresh products
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("שגיאה במחיקת המוצר");
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return `₪${price.toFixed(2)}`;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6">טוען מוצרים...</Typography>
      </Box>
    );
  }

  return (
    <Box dir="rtl" sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h4">ניהול מוצרים - אדמין</Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/admin")}
          >
            חזרה לניהול מערכת
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.open("/upload-product", "_blank")}
        >
          הוסף מוצר חדש
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>תמונה</TableCell>
              <TableCell>שם המוצר</TableCell>
              <TableCell>קטגוריה</TableCell>
              <TableCell>מחיר</TableCell>
              <TableCell>לייקים</TableCell>
              <TableCell>תאריך יצירה</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      borderRadius: 2,
                      overflow: "hidden",
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
                      onError={(e) => {
                        e.currentTarget.src = "/images/logo.jpg";
                        e.currentTarget.style.objectFit = "contain";
                        e.currentTarget.style.padding = "8px";
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight="bold">
                    {product.title}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {product.description?.substring(0, 50) + "..."}
                  </Typography>
                </TableCell>
                <TableCell>{product.type || "ללא קטגוריה"}</TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>{product.likes?.length || 0}</TableCell>
                <TableCell>
                  {product.createdAt
                    ? formatDate(product.createdAt)
                    : "לא זמין"}
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() =>
                        window.open(
                          `/product/${
                            product._id || product.id || product.filename
                          }`,
                          "_blank"
                        )
                      }
                    >
                      צפה
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() =>
                        handleDeleteProduct(
                          product._id || product.id || product.filename
                        )
                      }
                    >
                      מחק
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AdminProducts;
