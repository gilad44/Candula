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
import styles from "../../Styles/pages/admin/AdminOrders.module.css";

const AdminOrdersWithCSSModules = () => {
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
      <Box className={styles.loadingContainer}>
        <Typography variant="h6" className={styles.loadingText}>
          טוען הזמנות...
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      <Box className={styles.header}>
        <Typography variant="h4" className={styles.title}>
          ניהול הזמנות - אדמין
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

      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table className={styles.table}>
          <TableHead className={styles.tableHead}>
            <TableRow>
              <TableCell className={styles.tableHeadCell}>מספר הזמנה</TableCell>
              <TableCell className={styles.tableHeadCell}>לקוח</TableCell>
              <TableCell className={styles.tableHeadCell}>תאריך</TableCell>
              <TableCell className={styles.tableHeadCell}>סכום</TableCell>
              <TableCell className={styles.tableHeadCell}>סטטוס</TableCell>
              <TableCell className={styles.tableHeadCell}>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id} className={styles.tableRow}>
                <TableCell className={styles.tableCell}>{order._id}</TableCell>
                <TableCell className={styles.tableCell}>
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  {formatDate(order.createdAt)}
                </TableCell>
                <TableCell className={styles.tableCell}>
                  ₪{order.totalAmount.toFixed(2)}
                </TableCell>
                <TableCell className={styles.tableCell}>
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
                <TableCell className={styles.tableCell}>
                  <Box className={styles.actionsCell}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => {
                        setSelectedOrder(order);
                        setNewStatus(order.status);
                        setStatusDialogOpen(true);
                      }}
                      className={styles.updateButton}
                    >
                      עדכון סטטוס
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteOrder(order._id)}
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

      {/* Status Update Dialog */}
      <Dialog
        open={statusDialogOpen}
        onClose={() => setStatusDialogOpen(false)}
        className={styles.dialog}
      >
        <DialogTitle className={styles.dialogTitle}>
          עדכון סטטוס הזמנה
        </DialogTitle>
        <DialogContent className={styles.dialogContent}>
          <FormControl className={styles.formControl}>
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
        <DialogActions className={styles.dialogActions}>
          <Button
            onClick={() => setStatusDialogOpen(false)}
            className={styles.cancelButton}
          >
            ביטול
          </Button>
          <Button
            onClick={handleStatusUpdate}
            variant="contained"
            className={styles.confirmButton}
          >
            עדכן
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminOrdersWithCSSModules;
