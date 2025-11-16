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
import styles from "../../Styles/pages/admin/AdminProducts.module.css";

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

const AdminProductsWithCSSModules = () => {
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
      <Box className={styles.loadingContainer}>
        <Typography variant="h6" className={styles.loadingText}>
          טוען מוצרים...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Box className={styles.headerLeft}>
          <Typography variant="h4" className={styles.title}>
            ניהול מוצרים - אדמין
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate("/admin")}
            className={styles.backButton}
          >
            חזרה לניהול מערכת
          </Button>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.open("/upload-product", "_blank")}
          className={styles.addProductButton}
        >
          הוסף מוצר חדש
        </Button>
      </Box>

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell className={styles.tableHeadCell}>תמונה</TableCell>
              <TableCell className={styles.tableHeadCell}>שם המוצר</TableCell>
              <TableCell className={styles.tableHeadCell}>קטגוריה</TableCell>
              <TableCell className={styles.tableHeadCell}>מחיר</TableCell>
              <TableCell className={styles.tableHeadCell}>לייקים</TableCell>
              <TableCell className={styles.tableHeadCell}>
                תאריך יצירה
              </TableCell>
              <TableCell className={styles.tableHeadCell}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id} className={styles.tableRow}>
                <TableCell className={styles.tableCell}>
                  <Box className={styles.productImage}>
                    <img
                      src={`/images/${product.filename}`}
                      alt={product.title}
                      onError={(e) => {
                        e.currentTarget.src = "/images/logo.jpg";
                        e.currentTarget.style.objectFit = "contain";
                        e.currentTarget.style.padding = "8px";
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <Typography className={styles.productTitle}>
                    {product.title}
                  </Typography>
                  <Typography className={styles.productDescription}>
                    {product.description?.substring(0, 50) + "..."}
                  </Typography>
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {product.type || "ללא קטגוריה"}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {product.likes?.length || 0}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {product.createdAt
                    ? formatDate(product.createdAt)
                    : "לא זמין"}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  <Box className={styles.actionsCell}>
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
                      className={styles.viewButton}
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
                      className={styles.deleteButton}
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

export default AdminProductsWithCSSModules;
