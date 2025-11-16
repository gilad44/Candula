import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Route, Routes } from "react-router-dom";
import ErrorBoundary from "./comps/ErrorBoundary";
import Footer from "./comps/Footer";
import Navbar from "./comps/Navbar";
import "./index.css";
import About from "./pages/About";
import Checkout from "./pages/Checkout";
import Favorites from "./pages/Favorites";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import Products from "./pages/Products";
import Profile from "./pages/Profile";
import "./styles/animations.css";
import "./styles/Navbar.css";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { Box, Button, IconButton, Modal } from "@mui/material";
import { useState } from "react";
import ContactForm from "./comps/ContactForm";

const App = () => {
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const handleContactSuccess = () => setContactModalOpen(false);

  return (
    <ErrorBoundary>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
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
    </ErrorBoundary>
  );
};

export default App;
