import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { productsData } from "../data/productsData";
import { orderService } from "../services/orderService";
import { cartActions } from "../slices/cartSlice";
import { userActions } from "../slices/userSlice";
import type { RootState } from "../store/store";
import type { Address, PaymentMethod, ShippingMethod } from "../types/User";
import { checkoutSchema } from "../validation/schemas";

const steps = ["פרטי משלוח", "אמצעי תשלום", "סיכום הזמנה"];

const Checkout = () => {
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cartSlice.items);
  const user = useSelector((state: RootState) => state.userSlice.user);

  // Add specific RTL styling for checkout form fields
  useEffect(() => {
    // Force RTL on entire page
    document.documentElement.dir = "rtl";
    document.body.style.direction = "rtl";

    const style = document.createElement("style");
    style.id = "checkout-rtl-fixes";
    style.textContent = `
      /* Force RTL for entire checkout page */
      .checkout-page {
        direction: rtl !important;
      }
      
      .checkout-page * {
        direction: rtl !important;
      }
      
      /* TextField input text alignment */
      .checkout-page .MuiTextField-root .MuiInputBase-input,
      .checkout-page .MuiTextField-root .MuiOutlinedInput-input {
        text-align: right !important;
        direction: rtl !important;
        padding-right: 14px !important;
        padding-left: 14px !important;
      }
      
      /* Label positioning for RTL */
      .checkout-page .MuiTextField-root .MuiInputLabel-root {
        right: 14px !important;
        left: auto !important;
        transform-origin: top right !important;
        text-align: right !important;
        direction: rtl !important;
      }
      
      /* Shrunk label positioning */
      .checkout-page .MuiTextField-root .MuiInputLabel-shrink {
        transform: translate(0, -9px) scale(0.75) !important;
        right: 14px !important;
        left: auto !important;
        transform-origin: top right !important;
      }
      
      /* Textarea alignment */
      .checkout-page .MuiTextField-root textarea {
        text-align: right !important;
        direction: rtl !important;
      }
      
      /* Helper text alignment */
      .checkout-page .MuiFormHelperText-root {
        text-align: right !important;
        margin-right: 14px !important;
        margin-left: 0 !important;
        direction: rtl !important;
      }
      
      /* Typography alignment */
      .checkout-page .MuiTypography-root {
        direction: rtl !important;
        text-align: right !important;
      }
      
      /* Ensure proper flex direction for main layout */
      .checkout-page > div {
        direction: rtl !important;
      }
      
      /* Force sticky positioning for order summary */
      @media (min-width: 900px) {
        .checkout-page .order-summary-card {
          position: -webkit-sticky !important;
          position: sticky !important;
          top: 2rem !important;
          align-self: flex-start !important;
          z-index: 10 !important;
          max-height: calc(100vh - 4rem) !important;
          overflow-y: auto !important;
          will-change: transform !important;
          /* Additional properties for better sticky behavior */
          transform: translateZ(0) !important;
          backface-visibility: hidden !important;
        }
        
        /* Ensure parent containers allow sticky */
        .checkout-page > div:nth-child(3) {
          overflow: visible !important;
        }
        
        .checkout-page > div:nth-child(3) > div:last-child {
          align-self: flex-start !important;
          height: auto !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById("checkout-rtl-fixes");
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);

  // Phone number formatter
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");

    // If it starts with 0, keep it as is (Israeli format)
    // If it doesn't start with 05, add 05 prefix for Israeli mobile
    if (digits.length === 0) return "";
    if (digits.startsWith("05")) {
      return digits.slice(0, 10); // Limit to 10 digits (05XXXXXXXX)
    }
    if (digits.startsWith("0")) {
      return digits.slice(0, 10); // Keep other Israeli formats
    }
    // If no leading 0, assume user wants mobile and add 05 prefix
    if (digits.length <= 8) {
      return "05" + digits;
    }
    return digits.slice(0, 10);
  };

  // Real-time validation function
  const validateField = (fieldName: string, value: string) => {
    // Clear any existing error first
    setFormErrors((prev) => ({
      ...prev,
      [fieldName]: "",
    }));

    // Don't validate empty values during typing (only on blur or form submission)
    if (!value.trim()) {
      return;
    }

    // Use the specific field's schema instead of the full schema
    let fieldSchema;

    switch (fieldName) {
      case "firstName":
        fieldSchema = checkoutSchema.extract("firstName");
        break;
      case "lastName":
        fieldSchema = checkoutSchema.extract("lastName");
        break;
      case "street":
        fieldSchema = checkoutSchema.extract("street");
        break;
      case "city":
        fieldSchema = checkoutSchema.extract("city");
        break;
      case "postalCode":
        fieldSchema = checkoutSchema.extract("postalCode");
        break;
      case "phone":
        fieldSchema = checkoutSchema.extract("phone");
        break;
      default:
        return;
    }

    const result = fieldSchema.validate(value);

    if (result.error) {
      setFormErrors((prev) => ({
        ...prev,
        [fieldName]: result.error.details[0].message,
      }));
    }
  };

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
    if (activeStep === 0) {
      // Create validation data with all required fields
      const validationData = {
        firstName: shippingAddress.firstName || "",
        lastName: shippingAddress.lastName || "",
        street: shippingAddress.street || "",
        city: shippingAddress.city || "",
        postalCode: shippingAddress.postalCode || "",
        phone: shippingAddress.phone || "",
        paymentMethod,
        shippingMethod,
        orderNotes: orderNotes || "",
      };

      const validationResult = checkoutSchema.validate(validationData, {
        abortEarly: false,
      });

      if (validationResult.error) {
        // Collect errors for each field
        const errors: { [key: string]: string } = {};
        validationResult.error.details.forEach((err) => {
          if (err.path && err.path.length > 0) {
            errors[err.path[0]] = err.message;
          }
        });
        setFormErrors(errors);
        toast.error("אנא מלא את כל השדות הנדרשים בצורה תקינה");
        return;
      } else {
        setFormErrors({});
      }
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("נדרש להיכנס לחשבון כדי לבצע הזמנה");
      return;
    }

    // Validate all fields before placing order
    const validationData = {
      firstName: shippingAddress.firstName || "",
      lastName: shippingAddress.lastName || "",
      street: shippingAddress.street || "",
      city: shippingAddress.city || "",
      postalCode: shippingAddress.postalCode || "",
      phone: shippingAddress.phone || "",
      paymentMethod,
      shippingMethod,
      orderNotes: orderNotes || "",
    };

    const validationResult = checkoutSchema.validate(validationData, {
      abortEarly: false,
    });

    if (validationResult.error) {
      const errors: { [key: string]: string } = {};
      validationResult.error.details.forEach((err) => {
        if (err.path && err.path.length > 0) {
          errors[err.path[0]] = err.message;
        }
      });
      setFormErrors(errors);
      toast.error("אנא מלא את כל השדות הנדרשים בצורה תקינה");
      console.log("Validation errors:", errors); // Debug log
      return;
    } else {
      setFormErrors({});
    }

    try {
      // Create order object (without userId as backend sets it from auth token)
      console.log("Cart items before mapping:", cartItems); // Debug log

      const orderData = {
        items: cartItems.map((item) => {
          console.log("Processing cart item:", item); // Debug log
          console.log("Product object:", item.product); // Debug log
          console.log("Product keys:", Object.keys(item.product || {})); // Debug log
          const productId =
            item.product?.id || item.product?.filename || item.productId;
          console.log("Extracted productId:", productId); // Debug log

          return {
            productId: productId,
            quantity: item.quantity,
            price: item.product?.price || 0,
            selectedVariant: item.selectedVariant,
          };
        }),
        totalAmount: total,
        status: "pending" as const,
        shippingAddress: shippingAddress as Address,
        paymentMethod,
        shippingMethod,
        notes: orderNotes,
        shippingCost,
        tax,
      };
      console.log("Order data being sent:", orderData); // Debug log

      // Send order to backend
      console.log("Sending order to backend..."); // Debug log
      const savedOrder = await orderService.createOrder(orderData);
      console.log("Order created successfully:", savedOrder); // Debug log

      // Update local state with the saved order
      dispatch(userActions.addOrder(savedOrder));
      dispatch(cartActions.clearCart());

      toast.success(`הזמנה מספר ${savedOrder._id} בוצעה בהצלחה!`);
      navigate("/orders", { state: { orderId: savedOrder._id } });
    } catch (error) {
      console.error("Order creation error:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        user: user ? { id: user.id || user._id, email: user.email } : null,
        cartItems: cartItems.length,
        shippingAddress,
        paymentMethod,
        total,
      }); // Enhanced debug log
      const errorMessage =
        error instanceof Error ? error.message : "שגיאה בביצוע ההזמנה";
      toast.error(errorMessage);
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
    <Box
      className="checkout-page"
      sx={{
        maxWidth: 1200,
        mx: "auto",
        p: 3,
      }}
    >
      <Typography
        variant="h4"
        sx={{ mb: 4, textAlign: "center", direction: "rtl" }}
      >
        השלמת הזמנה
      </Typography>

      <Stepper
        activeStep={activeStep}
        sx={{
          mb: 4,
          direction: "rtl",
          "& .MuiStepConnector-root": {
            transform: "scaleX(-1)",
          },
          "& .MuiStepLabel-root": {
            flexDirection: "row-reverse",
          },
          "& .MuiStepLabel-labelContainer": {
            textAlign: "right",
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel
              sx={{
                "& .MuiStepLabel-label": {
                  textAlign: "right",
                  direction: "rtl",
                },
              }}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box
        sx={{
          display: "flex",
          gap: 3,
          flexDirection: { xs: "column", md: "row-reverse" },
          direction: "rtl",
        }}
      >
        <Box sx={{ flex: { md: 2 } }}>
          <Paper sx={{ p: 3, direction: "rtl" }}>
            {activeStep === 0 && (
              <Box>
                <Typography variant="h6" sx={{ mb: 3 }}>
                  פרטי משלוח
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                  }}
                >
                  <Box>
                    <TextField
                      fullWidth
                      label="שם פרטי"
                      value={shippingAddress.firstName}
                      onChange={(e) => {
                        setShippingAddress({
                          ...shippingAddress,
                          firstName: e.target.value,
                        });
                        validateField("firstName", e.target.value);
                      }}
                      required
                      error={!!formErrors.firstName}
                      helperText={formErrors.firstName}
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="שם משפחה"
                      value={shippingAddress.lastName}
                      onChange={(e) => {
                        setShippingAddress({
                          ...shippingAddress,
                          lastName: e.target.value,
                        });
                        validateField("lastName", e.target.value);
                      }}
                      required
                      error={!!formErrors.lastName}
                      helperText={formErrors.lastName}
                    />
                  </Box>
                  <Box sx={{ gridColumn: "1 / -1" }}>
                    <TextField
                      fullWidth
                      label="כתובת"
                      value={shippingAddress.street}
                      onChange={(e) => {
                        setShippingAddress({
                          ...shippingAddress,
                          street: e.target.value,
                        });
                        validateField("street", e.target.value);
                      }}
                      required
                      error={!!formErrors.street}
                      helperText={formErrors.street}
                    />
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gap: 2,
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    mt: 2,
                  }}
                >
                  <Box>
                    <TextField
                      fullWidth
                      label="עיר"
                      value={shippingAddress.city}
                      onChange={(e) => {
                        setShippingAddress({
                          ...shippingAddress,
                          city: e.target.value,
                        });
                        validateField("city", e.target.value);
                      }}
                      required
                      error={!!formErrors.city}
                      helperText={formErrors.city}
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="מיקוד"
                      value={shippingAddress.postalCode}
                      onChange={(e) => {
                        setShippingAddress({
                          ...shippingAddress,
                          postalCode: e.target.value,
                        });
                        validateField("postalCode", e.target.value);
                      }}
                      required
                      error={!!formErrors.postalCode}
                      helperText={formErrors.postalCode}
                    />
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="מספר טלפון"
                    value={shippingAddress.phone}
                    onChange={(e) => {
                      const formattedPhone = formatPhoneNumber(e.target.value);
                      setShippingAddress({
                        ...shippingAddress,
                        phone: formattedPhone,
                      });
                      validateField("phone", formattedPhone);
                    }}
                    required
                    error={!!formErrors.phone}
                    helperText={formErrors.phone || "פורמט: 05XXXXXXXX"}
                    placeholder="05XXXXXXXX"
                  />
                </Box>

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

                <Box sx={{ mt: 3 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="הערות להזמנה (אופציונלי)"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </Box>
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
        </Box>

        <Box sx={{ flex: { md: 1 } }}>
          <Paper
            className="order-summary-card"
            sx={{
              p: 3,
              position: { xs: "static", md: "sticky" },
              top: { md: "2rem" },
              maxHeight: { md: "calc(100vh - 4rem)" },
              overflowY: { md: "auto" },
              alignSelf: { md: "flex-start" },
              zIndex: 10,
              height: "fit-content",
              // Ensure sticky positioning works
              willChange: "transform",
              // Add more specific positioning
              inset: { md: "2rem auto auto auto" },
            }}
          >
            <Typography variant="h6" sx={{ mb: 2, textAlign: "right" }}>
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
        </Box>
      </Box>
    </Box>
  );
};

export default Checkout;
