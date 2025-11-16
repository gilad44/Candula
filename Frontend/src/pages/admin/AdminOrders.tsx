import { ArrowBack } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { orderService } from "../../services/orderService";
import type { Order } from "../../types/User";

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const navigate = useNavigate();

  // Load orders on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await orderService.getAllOrders();
      setOrders(allOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      toast.error("שגיאה בטעינת ההזמנות");
    } finally {
      setLoading(false);
    }
  };

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
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "ממתין";
      case "confirmed":
        return "אושר";
      case "processing":
        return "בעיבוד";
      case "shipped":
        return "נשלח";
      case "delivered":
        return "נמסר";
      case "cancelled":
        return "בוטל";
      default:
        return status;
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    try {
      await orderService.updateOrderStatus(selectedOrder._id, newStatus);
      toast.success("סטטוס ההזמנה עודכן בהצלחה");
      setStatusDialogOpen(false);
      setSelectedOrder(null);
      setNewStatus("");
      loadOrders(); // Refresh orders
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("שגיאה בעדכון סטטוס ההזמנה");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm("האם אתה בטוח שברצונך למחוק הזמנה זו?")) return;

    try {
      await orderService.deleteOrder(orderId);
      toast.success("ההזמנה נמחקה בהצלחה");
      loadOrders(); // Refresh orders
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("שגיאה במחיקת ההזמנה");
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <Typography variant="h6">טוען הזמנות...</Typography>
      </Box>
    );
  }

  return (
    <Box dir="rtl" sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">ניהול הזמנות - אדמין</Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={() => navigate("/admin")}
        >
          חזרה לניהול מערכת
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>מספר הזמנה</TableCell>
              <TableCell>לקוח</TableCell>
              <TableCell>תאריך</TableCell>
              <TableCell>סכום</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell>{order._id}</TableCell>
                <TableCell>
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </TableCell>
                <TableCell>{formatDate(order.createdAt)}</TableCell>
                <TableCell>₪{order.totalAmount.toFixed(2)}</TableCell>
                <TableCell>
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
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewStatus(order.status);
                        setStatusDialogOpen(true);
                      }}
                    >
                      עדכון סטטוס
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteOrder(order._id)}
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

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
      >
        <DialogTitle>עדכון סטטוס הזמנה</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>סטטוס חדש</InputLabel>
            <Select
              value={newStatus}
              label="סטטוס חדש"
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">ממתין</MenuItem>
              <MenuItem value="confirmed">אושר</MenuItem>
              <MenuItem value="processing">בעיבוד</MenuItem>
              <MenuItem value="shipped">נשלח</MenuItem>
              <MenuItem value="delivered">נמסר</MenuItem>
              <MenuItem value="cancelled">בוטל</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialogOpen(false)}>ביטול</Button>
          <Button onClick={handleStatusUpdate} variant="contained">
            עדכן
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrders;
