import {
  Assessment,
  People,
  ShoppingCart,
  TrendingUp,
} from "@mui/icons-material";
import { Box, Card, CardContent, Chip, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { config } from "../../config/config";

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    popularProducts: [],
    recentActivity: [],
    salesByMonth: [],
  });
  const [loading, setLoading] = useState(true);

  // Load analytics data on component mount
  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch data from multiple endpoints
      const [usersResponse, productsResponse, ordersResponse] =
        await Promise.all([
          fetch(`${config.API_BASE_URL}/users`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${config.API_BASE_URL}/products`),
          fetch(`${config.API_BASE_URL}/orders`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

      const users = await usersResponse.json();
      const products = await productsResponse.json();
      const orders = await ordersResponse.json();

      // Calculate analytics
      const totalRevenue = orders.reduce(
        (sum: number, order: any) => sum + order.totalAmount,
        0
      );
      const pendingOrders = orders.filter(
        (order: any) => order.status === "pending"
      ).length;
      const completedOrders = orders.filter(
        (order: any) => order.status === "delivered"
      ).length;

      // Get popular products (by likes)
      const popularProducts = products
        .sort((a: any, b: any) => b.likes.length - a.likes.length)
        .slice(0, 5)
        .map((product: any) => ({
          name: product.title,
          likes: product.likes.length,
        }));

      // Get recent activity (last 10 orders)
      const recentActivity = orders
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 10)
        .map((order: any) => ({
          id: order.id,
          customer: `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`,
          amount: order.totalAmount,
          status: order.status,
          date: order.createdAt,
        }));

      // Calculate sales by month (last 6 months)
      const salesByMonth = calculateSalesByMonth(orders);

      setAnalytics({
        totalUsers: users.length,
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        pendingOrders,
        completedOrders,
        popularProducts,
        recentActivity,
        salesByMonth,
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("שגיאה בטעינת הנתונים האנליטיים");
    } finally {
      setLoading(false);
    }
  };

  const calculateSalesByMonth = (orders: any[]) => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("he-IL", {
        month: "long",
        year: "numeric",
      });

      const monthOrders = orders.filter((order) => {
        const orderDate = new Date(order.createdAt);
        return (
          orderDate.getMonth() === date.getMonth() &&
          orderDate.getFullYear() === date.getFullYear()
        );
      });

      const monthRevenue = monthOrders.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );

      months.push({
        month: monthName,
        orders: monthOrders.length,
        revenue: monthRevenue,
      });
    }

    return months;
  };

  const formatCurrency = (amount: number) => {
    return `₪${amount.toFixed(2)}`;
  };

  const formatDate = (date: string) => {
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
        <Typography variant="h6">טוען נתונים אנליטיים...</Typography>
      </Box>
    );
  }

  return (
    <Box dir="rtl" sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        דוחות ואנליטיקה - אדמין
      </Typography>

      {/* Key Metrics Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: "250px" }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <People sx={{ fontSize: 40, color: "primary.main" }} />
                <Box>
                  <Typography variant="h4">{analytics.totalUsers}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    סה"כ משתמשים
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: "250px" }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <ShoppingCart sx={{ fontSize: 40, color: "success.main" }} />
                <Box>
                  <Typography variant="h4">
                    {analytics.totalProducts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    סה"כ מוצרים
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: "250px" }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Assessment sx={{ fontSize: 40, color: "info.main" }} />
                <Box>
                  <Typography variant="h4">{analytics.totalOrders}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    סה"כ הזמנות
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 calc(25% - 24px)", minWidth: "250px" }}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <TrendingUp sx={{ fontSize: 40, color: "warning.main" }} />
                <Box>
                  <Typography variant="h4">
                    {formatCurrency(analytics.totalRevenue)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    סה"כ הכנסות
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Orders Status */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "300px" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                סטטוס הזמנות
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>הזמנות ממתינות</Typography>
                  <Chip
                    label={analytics.pendingOrders}
                    color="warning"
                    variant="outlined"
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>הזמנות שהושלמו</Typography>
                  <Chip
                    label={analytics.completedOrders}
                    color="success"
                    variant="outlined"
                  />
                </Box>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>אחוז השלמה</Typography>
                  <Typography variant="h6" color="primary">
                    {analytics.totalOrders > 0
                      ? Math.round(
                          (analytics.completedOrders / analytics.totalOrders) *
                            100
                        )
                      : 0}
                    %
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: "1 1 calc(50% - 12px)", minWidth: "300px" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                מוצרים פופולריים
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {analytics.popularProducts.map((product: any, index) => (
                  <Box
                    key={index}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2">
                      {index + 1}. {product.name}
                    </Typography>
                    <Chip
                      label={`${product.likes} לייקים`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Sales by Month */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mb: 4 }}>
        <Box sx={{ flex: "1 1 100%" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                מכירות לפי חודש (6 חודשים אחרונים)
              </Typography>
              <Box display="flex" flexDirection="column" gap={2}>
                {analytics.salesByMonth.map((month: any, index) => (
                  <Paper key={index} sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body1" fontWeight="bold">
                        {month.month}
                      </Typography>
                      <Box display="flex" gap={3}>
                        <Chip
                          label={`${month.orders} הזמנות`}
                          color="info"
                          variant="outlined"
                        />
                        <Chip
                          label={formatCurrency(month.revenue)}
                          color="success"
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Recent Activity */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Box sx={{ flex: "1 1 100%" }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                פעילות אחרונה (10 הזמנות אחרונות)
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                {analytics.recentActivity.map((activity: any, index) => (
                  <Paper key={index} sx={{ p: 2 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          הזמנה #{activity.id}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.customer} • {formatDate(activity.date)}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={2} alignItems="center">
                        <Typography variant="body2" fontWeight="bold">
                          {formatCurrency(activity.amount)}
                        </Typography>
                        <Chip
                          label={getStatusText(activity.status)}
                          color={getStatusColor(activity.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

const getStatusColor = (
  status: string
):
  | "warning"
  | "info"
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "default" => {
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

export default AdminAnalytics;
