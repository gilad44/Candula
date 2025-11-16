import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { productsData } from "../data/productsData";
import { cartActions } from "../slices/cartSlice";
import { userActions } from "../slices/userSlice";
import type { RootState } from "../store/store";
import type {
  Address,
  Order,
  PaymentMethod,
  ShippingMethod,
} from "../types/User";

const steps = ["פרטי משלוח", "אמצעי תשלום", "סיכום הזמנה"];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cartSlice.items);
  const user = useSelector((state: RootState) => state.userSlice.user);

  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState<Partial<Address>>({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    street: "",
    city: "",
    postalCode: "",
    country: "ישראל",
    phone: user?.phone || "",
  });
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("credit_card");
  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>("standard");
  const [orderNotes, setOrderNotes] = useState("");

  // Calculate totals
  const cartItems = cart.map((item) => {
    const product = productsData.find((p) => p.id === item.productId);
    return {
      ...item,
      product,
      subtotal: (product?.price || 0) * item.quantity,
    };
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  const shippingCost =
    shippingMethod === "express"
      ? 25
      : shippingMethod === "overnight"
      ? 50
      : 15;
  const tax = subtotal * 0.17; // 17% VAT in Israel
  const total = subtotal + shippingCost + tax;

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingAddress()) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const validateShippingAddress = () => {
    const required = [
      "firstName",
      "lastName",
      "street",
      "city",
      "postalCode",
      "phone",
    ];
    const missing = required.filter(
      (field) => !shippingAddress[field as keyof Address]
    );

    if (missing.length > 0) {
      toast.error("אנא מלא את כל השדות הנדרשים");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("נדרש להיכנס לחשבון כדי לבצע הזמנה");
      return;
    }

    try {
      // Create order object
      const order: Omit<Order, "id" | "createdAt" | "updatedAt"> = {
        userId: user.id,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price || 0,
          selectedVariant: item.selectedVariant,
        })),
        totalAmount: total,
        status: "pending",
        shippingAddress: shippingAddress as Address,
        paymentMethod,
        shippingMethod,
        notes: orderNotes,
        shippingCost,
        tax,
      };

      // In a real app, you would send this to your backend
      // console.log("Placing order:", order); // Remove for production

      // Simulate order creation
      const orderId = `ORD-${Date.now()}`;

      // Update user with order (in real app, this would be handled by backend)
      dispatch(
        userActions.addOrder({
          ...order,
          id: orderId,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      );

      // Clear cart
      dispatch(cartActions.clearCart());

      // Show success message
      toast.success(`הזמנה מספר ${orderId} בוצעה בהצלחה!`);

      // Navigate to order confirmation or orders page
      navigate("/orders", { state: { orderId } });
    } catch (error) {
      // console.error("Order placement failed:", error); // Remove for production
      toast.error("שגיאה בביצוע ההזמנה. אנא נסה שוב.");
    }
  };

  if (cart.length === 0) {
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
          העגלה ריקה
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
          אין פריטים בעגלת הקניות שלך
        </Typography>
        <Button variant="contained" onClick={() => navigate("/products")}>
          המשך קנייה
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3, direction: "rtl" }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: "center" }}>
        השלמת הזמנה
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  פרטי משלוח
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="שם פרטי"
                      value={shippingAddress.firstName}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          firstName: e.target.value,
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="שם משפחה"
                      value={shippingAddress.lastName}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          lastName: e.target.value,
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="כתובת"
                      value={shippingAddress.street}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          street: e.target.value,
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="עיר"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="מיקוד"
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          postalCode: e.target.value,
                        })
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="מספר טלפון"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          phone: e.target.value,
                        })
                      }
                      required
                    />
                  </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  אמצעי משלוח
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    value={shippingMethod}
                    onChange={(e) =>
                      setShippingMethod(e.target.value as ShippingMethod)
                    }
                  >
                    <FormControlLabel
                      value="standard"
                      control={<Radio />}
                      label="משלוח רגיל (3-5 ימי עסקים) - ₪15"
                    />
                    <FormControlLabel
                      value="express"
                      control={<Radio />}
                      label="משלוח מהיר (1-2 ימי עסקים) - ₪25"
                    />
                    <FormControlLabel
                      value="overnight"
                      control={<Radio />}
                      label="משלוח במהירות (תוך 24 שעות) - ₪50"
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            )}

            {activeStep === 1 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  אמצעי תשלום
                </Typography>
                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={(e) =>
                      setPaymentMethod(e.target.value as PaymentMethod)
                    }
                  >
                    <FormControlLabel
                      value="credit_card"
                      control={<Radio />}
                      label="כרטיס אשראי"
                    />
                    <FormControlLabel
                      value="paypal"
                      control={<Radio />}
                      label="PayPal"
                    />
                    <FormControlLabel
                      value="bank_transfer"
                      control={<Radio />}
                      label="העברה בנקאית"
                    />
                    <FormControlLabel
                      value="cash_on_delivery"
                      control={<Radio />}
                      label="תשלום במזומן בעת המסירה"
                    />
                  </RadioGroup>
                </FormControl>

                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="הערות להזמנה (אופציונלי)"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  sx={{ mt: 3 }}
                />
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  סיכום הזמנה
                </Typography>

                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      כתובת משלוח:
                    </Typography>
                    <Typography variant="body2">
                      {shippingAddress.firstName} {shippingAddress.lastName}
                      <br />
                      {shippingAddress.street}
                      <br />
                      {shippingAddress.city}, {shippingAddress.postalCode}
                      <br />
                      טלפון: {shippingAddress.phone}
                    </Typography>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ mb: 2 }}>
                      אמצעי תשלום:
                    </Typography>
                    <Typography variant="body2">
                      {paymentMethod === "credit_card" && "כרטיס אשראי"}
                      {paymentMethod === "paypal" && "PayPal"}
                      {paymentMethod === "bank_transfer" && "העברה בנקאית"}
                      {paymentMethod === "cash_on_delivery" &&
                        "תשלום במזומן בעת המסירה"}
                    </Typography>
                  </CardContent>
                </Card>
              </Box>
            )}

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}
            >
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                חזור
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handlePlaceOrder}
                  size="large"
                >
                  בצע הזמנה
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  המשך
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              סיכום הזמנה
            </Typography>

            {cartItems.map((item) => (
              <Box key={item.productId} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2">
                    {item.product?.title} x{item.quantity}
                  </Typography>
                  <Typography variant="body2">₪{item.subtotal}</Typography>
                </Box>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>סכום ביניים:</Typography>
              <Typography>₪{subtotal.toFixed(2)}</Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography>משלוח:</Typography>
              <Typography>₪{shippingCost}</Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography>מע"ם (17%):</Typography>
              <Typography>₪{tax.toFixed(2)}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}
            >
              <Typography variant="h6">סה"כ:</Typography>
              <Typography variant="h6">₪{total.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Checkout;
