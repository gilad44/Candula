import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, IconButton, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import AdminRoute from "./components/AdminRoute";
import ContactForm from "./components/ContactForm";
import ErrorBoundary from "./components/ErrorBoundary";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import SessionWarning from "./components/SessionWarning";
import { useAutoLogout } from "./hooks/useAutoLogout";
import { useAppDispatch } from "./hooks/useRedux";
import About from "./pages/About";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminUsers from "./pages/admin/AdminUsers";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import UploadNewProduct from "./pages/UploadNewProduct";
import { cartActions } from "./slices/cartSlice";
import type { RootState } from "./store/store";
import "./Styles/index.css";

const App = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const handleContactSuccess = () => setContactModalOpen(false);

  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.userSlice.user);

  // Auto logout after 4 hours of inactivity
  const { showWarningModal, extendSession, logout, timeLeft } =
    useAutoLogout(user);

  // Initialize cart with user ID when app loads
  useEffect(() => {
    if (user?.id || user?._id) {
      dispatch(cartActions.setUserId(user.id || user._id));
    }
  }, [user, dispatch]);

  // Ensure RTL is always set globally
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.body.style.direction = "rtl";
  }, []);

  return (
    <ErrorBoundary>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route
          path="/upload-product"
          element={<UploadNewProduct />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <AdminRoute>
              <AdminContacts />
            </AdminRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
      {/* Floating Contact Button & WhatsApp */}
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: 24, md: 32 },
          left: { xs: 24, md: 30 },
          zIndex: 1300,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
        }}
      >
        <IconButton
          component="a"
          href="https://wa.me/972501234567"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            background: "linear-gradient(135deg, #25D366 60%, #128C7E 100%)",
            color: "white",
            boxShadow: 3,
            mb: 1,
            width: 56,
            height: 56,
            "&:hover": {
              background: "linear-gradient(135deg, #128C7E 60%, #25D366 100%)",
            },
          }}
          aria-label="WhatsApp"
        >
          <WhatsAppIcon sx={{ fontSize: 32 }} />
        </IconButton>
        <Button
          variant="contained"
          onClick={() => setContactModalOpen(true)}
          sx={{
            background: "linear-gradient(to right, #7f6000, #cd853f)",
            color: "white",
            px: 3,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: "bold",
            boxShadow: 3,
            borderRadius: 99,
            border: "3px ridge orange",

            minWidth: 0,
            "&:hover": {
              background: "linear-gradient(to right, #654d00, #b8762f)",
            },
          }}
        >
          צור קשר
        </Button>
      </Box>
      {/* Contact Modal */}
      <Modal
        open={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            background:
              "linear-gradient(135deg, rgba(255,253,231,0.95), rgba(247,239,169,0.95))",
            borderRadius: 3,
            p: 4,
            maxWidth: "500px",
            width: "100%",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 215, 0, 0.3)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <ContactForm onSuccess={handleContactSuccess} />
        </Box>
      </Modal>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        rtl={true}
        style={{ direction: "rtl" }}
      />
      {/* Session Warning Modal */}
      {showWarningModal && (
        <SessionWarning
          isOpen={showWarningModal}
          timeLeft={timeLeft}
          onExtendSession={extendSession}
          onLogout={logout}
        />
      )}
    </ErrorBoundary>
  );
};

export default App;
