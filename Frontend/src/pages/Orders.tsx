import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { productsData } from "../data/productsData";
import type { RootState } from "../store/store";
import type { Order } from "../types/User";

const Orders = () => {
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
          נדרש להתחבר
        </Typography>
        <Typography variant="body1" color="text.secondary">
          התחבר כדי לראות את ההזמנות שלך
        </Typography>
      </Box>
    );
  }

  if (orders.length === 0) {
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
          אין הזמנות
        </Typography>
        <Typography variant="body1" color="text.secondary">
          עדיין לא ביצעת הזמנות באתר שלנו
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        p: 3,
        direction: "rtl",
      }}
    >
      <Typography variant="h4" sx={{ mb: 4 }}>
        ההזמנות שלי
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {orders.map((order: Order) => (
          <Box sx={{ flex: "1 1 100%" }} key={order._id}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h6">הזמנה #{order._id}</Typography>
                    <Typography variant="body2" color="text.secondary">
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

                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    פריטים בהזמנה:
                  </Typography>
                  {order.items.map((item) => {
                    const product = productsData.find(
                      (p) => p.id === item.productId
                    );
                    return (
                      <Box
                        key={item.productId}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          py: 0.5,
                        }}
                      >
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

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderTop: 1,
                    borderColor: "divider",
                    pt: 2,
                  }}
                >
                  <Typography variant="body2">
                    כתובת משלוח: {order.shippingAddress.street},{" "}
                    {order.shippingAddress.city}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    סה"כ: ₪{order.totalAmount.toFixed(2)}
                  </Typography>
                </Box>

                {order.trackingNumber && (
                  <Box
                    sx={{ mt: 2, p: 2, bgcolor: "info.light", borderRadius: 1 }}
                  >
                    <Typography variant="body2">
                      <strong>מספר מעקב:</strong> {order.trackingNumber}
                    </Typography>
                  </Box>
                )}

                {order.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
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

export default Orders;
