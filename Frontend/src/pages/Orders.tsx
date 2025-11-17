import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { productsData } from "../data/productsData";
import type { RootState } from "../store/store";
import type { Order } from "../types/User";
import styles from "../Styles/pages/Orders.module.css";

const OrdersWithCSSModules = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);
  const orders = user?.orders || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "warning";
      case "confirmed":
        return "info";
      case "processing":
        return "primary";
      case "shipped":
        return "secondary";
      case "delivered":
        return "success";
      case "cancelled":
        return "error";
      case "refunded":
        return "default";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "ממתין לאישור";
      case "confirmed":
        return "אושר";
      case "processing":
        return "בהכנה";
      case "shipped":
        return "נשלח";
      case "delivered":
        return "הגיע ליעד";
      case "cancelled":
        return "בוטל";
      case "refunded":
        return "הוחזר";
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <Box className={styles.emptyState}>
        <Typography variant="h4" className={styles.emptyTitle}>
          נדרש להתחבר
        </Typography>
        <Typography variant="body1" className={styles.emptyMessage}>
          התחבר כדי לראות את ההזמנות שלך
        </Typography>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box className={styles.emptyState}>
        <Typography variant="h4" className={styles.emptyTitle}>
          אין הזמנות
        </Typography>
        <Typography variant="body1" className={styles.emptyMessage}>
          עדיין לא ביצעת הזמנות באתר שלנו
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Typography variant="h4" className={styles.pageTitle}>
        ההזמנות שלי
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {orders.map((order: Order) => (
          <Box key={order._id} className={styles.orderCardContainer}>
            <Card>
              <CardContent>
                <Box className={styles.orderHeader}>
                  <Box>
                    <Typography variant="h6">הזמנה #{order._id}</Typography>
                    <Typography variant="body2" className={styles.orderDate}>
                      {new Date(order.createdAt).toLocaleDateString("he-IL")}
                    </Typography>
                  </Box>
                  <Chip
                    label={getStatusText(order.status)}
                    color={
                      getStatusColor(order.status) as
                        | "warning"
                        | "info"
                        | "primary"
                        | "secondary"
                        | "success"
                        | "error"
                        | "default"
                    }
                    variant="outlined"
                  />
                </Box>

                <Box className={styles.orderItemsSection}>
                  <Typography
                    variant="subtitle2"
                    className={styles.orderItemsTitle}
                  >
                    פריטים בהזמנה:
                  </Typography>
                  {order.items.map((item) => {
                    const product = productsData.find(
                      (p) => p.id === item.productId
                    );
                    return (
                      <Box key={item.productId} className={styles.orderItem}>
                        <Typography variant="body2">
                          {product?.title || "מוצר לא נמצא"} x{item.quantity}
                        </Typography>
                        <Typography variant="body2">
                          ₪{(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    );
                  })}
                </Box>

                <Box className={styles.orderFooter}>
                  <Typography variant="body2">
                    כתובת משלוח: {order.shippingAddress.street},{" "}
                    {order.shippingAddress.city}
                  </Typography>
                  <Typography variant="h6" className={styles.orderTotal}>
                    סה"כ: ₪{order.totalAmount.toFixed(2)}
                  </Typography>
                </Box>

                {order.trackingNumber && (
                  <Box className={styles.trackingBox}>
                    <Typography variant="body2">
                      <strong>מספר מעקב:</strong> {order.trackingNumber}
                    </Typography>
                  </Box>
                )}

                {order.notes && (
                  <Box className={styles.notesBox}>
                    <Typography variant="body2" className={styles.notesText}>
                      <strong>הערות:</strong> {order.notes}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OrdersWithCSSModules;
