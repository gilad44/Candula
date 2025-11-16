import CloseIcon from "@mui/icons-material/Close";
import LocalMallTwoToneIcon from "@mui/icons-material/LocalMallTwoTone";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  InputBase,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useUser } from "../hooks/useRedux";
import Cart from "./Cart";
import Login from "./Login";
import Signup from "./Signup";

const Navbar = () => {
  const user = useUser();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const navLinks = [
    { label: "דף הבית", to: "/" },
    { label: "אודות", to: "/about" },
    { label: "הנרות שלנו", to: "/products" },
    ...(user
      ? [
          { label: "מועדפים", to: "/favorites" },
          { label: "ההזמנות שלי", to: "/orders" },
          { label: "הפרופיל שלי", to: "/profile" },
        ]
      : []),
  ];
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const handleDrawerToggle = () => setDrawerOpen((open) => !open);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/products?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={3}
      sx={{
        mb: 0,
        width: "100vw",
        height: { "3xs": "5rem", sm: "5rem" },
        left: 0,
        right: 0,
        borderRadius: 0,
        maxWidth: "100%",
        background: "linear-gradient(to right, black,rgb(247, 239, 169))",
        py: 1,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "5.5rem",
          px: { "3xs": 1, sm: 3 },
          width: "100%",
          maxWidth: "100%",
          mx: 0,
        }}
      >
        <Box
          sx={{ textDecoration: "none" }}
          display="flex"
          component={Link}
          to="/"
        >
          <Box
            sx={{
              width: {
                "3xs": "10vmax",
                sm: "8vmax",
                md: "6vmax",
                lg: "5vmax",
                xl: "4vmax",
              },
              height: {
                "3xs": "10vmax",
                sm: "8vmax",
                md: "6vmax",
                lg: "5vmax",
                xl: "4vmax",
              },
              my: {
                "3xs": "0.6rem",
                sm: "0.7rem",
                md: "0.3rem",
                lg: "0.8rem",
                xl: "0.8rem",
              },
            }}
          >
            <img
              id="logo"
              src="images/logo.jpg"
              alt="logo"
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
          <Box display="flex" flexDirection="column">
            <Typography
              fontSize={{
                "3xs": "6vmax",
                sm: "4vmax",
                md: "3vmax",
                lg: "2.1vmax",
                xl: "2vmax",
              }}
              id="titleName"
            >
              קנדולה
            </Typography>
            <Typography
              fontSize={{ "3xs": "3vmax", md: "1.6vmax", lg: "1.4vmax" }}
              id="titleDescription"
            >
              נרות דקורטיביים ריחניים
            </Typography>
          </Box>
        </Box>
        {/* Desktop nav */}
        <Box
          sx={{
            display: { "3xs": "none", md: "flex" },
            gap: 2,
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Box
            display={"flex"}
            alignItems={"center"}
            sx={{
              position: "relative",
              zIndex: 10,
              mr: 2,
            }}
          >
            <Collapse in={searchOpen} orientation="horizontal">
              <InputBase
                placeholder="חיפוש נרות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSearch(searchQuery)
                }
                sx={{
                  "& .MuiCollapse-wrapperInner": {
                    direction: "rtl",
                  },
                  bgcolor: "rgba(255, 246, 209, 0.9)",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  width: "15vmax",
                  height: "3vmax",
                  mr: 1,
                }}
                autoFocus={searchOpen}
                onBlur={() => {
                  setTimeout(() => setSearchOpen(false), 200);
                }}
              />
            </Collapse>
            <IconButton
              onClick={() => setSearchOpen(!searchOpen)}
              sx={{ color: "black" }}
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
          </Box>
          {navLinks
            .filter((link) => link.to !== "/cart")
            .map((link) => (
              <Box
                key={link.to}
                sx={{
                  height: "2.3rem",
                  display: "flex",
                  justifyContent: "center",
                  boxShadow: 2,
                  borderRadius: 2,
                  bgcolor: "rgba(255, 255, 255, 0.41)",
                  mx: 0.5,
                  backdropFilter: "blur(2px)",
                }}
              >
                <Button
                  component={Link}
                  to={link.to}
                  color={
                    location.pathname === link.to ? "secondary" : "inherit"
                  }
                  sx={{
                    fontWeight: 600,
                    fontSize: { md: "0.8rem" },
                    color: "#222",
                    px: 2,
                    minWidth: 0,
                  }}
                >
                  {link.label}
                </Button>
              </Box>
            ))}

          <Box
            sx={{
              height: "2.3rem",
              display: "flex",
              justifyContent: "center",
              boxShadow: 2,
              borderRadius: 2,
              bgcolor: "rgba(255, 255, 255, 0.41)",
              mx: 0.5,
              p: 0,
              backdropFilter: "blur(2px)",
            }}
          >
            {user ? (
              <Button
                onClick={() => dispatch({ type: "user/logout" })}
                sx={{
                  fontWeight: 600,
                  fontSize: { md: "0.8rem" },
                  color: "#222",
                  px: 2,
                }}
              >
                התנתק
              </Button>
            ) : (
              <Button
                onClick={() => setShowForm((prev) => !prev)}
                sx={{
                  fontWeight: 600,
                  fontSize: { md: "0.8rem" },
                  color: "#222",
                  px: 2,
                  py: 1,
                  minWidth: 0,
                }}
              >
                התחברות/הרשמה
              </Button>
            )}
          </Box>

          <IconButton
            onClick={() => setCartOpen(true)}
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 0,
              padding: 0,
            }}
          >
            <LocalMallTwoToneIcon
              fontSize="large"
              sx={{ color: "black", mb: 1 }}
            />
          </IconButton>
          <Drawer
            anchor="right"
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            slotProps={{
              paper: {
                sx: {
                  background:
                    "linear-gradient(to top, black,rgb(247, 239, 169))",
                  borderRadius: "200px / 40px",
                  boxShadow: `
                    inset 10px 0 40px rgba(255,255,255,0.9),
                    inset -20px 0 40px rgba(0,0,0,0.15),
                    inset 10px 0 40px rgba(255,255,255,0.9)
                  `,
                  width: "20vmax",
                },
              },
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100vh",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              <Cart onClose={() => setCartOpen(false)} />
            </Box>
          </Drawer>
        </Box>
        {/* Mobile nav */}
        <Box
          sx={{
            display: { "3xs": "flex", md: "none" },
            alignItems: "center",
          }}
        >
          <IconButton color="inherit" edge="end" onClick={handleDrawerToggle}>
            <MenuIcon
              sx={{
                marginTop: { "3xs": "2vmax" },
                width: { "3xs": "7vmax", sm: "5vmax" },
                height: { "3xs": "7vmax", sm: "5vmax" },
              }}
            />
          </IconButton>
          <IconButton
            onClick={() => setCartOpen(true)}
            sx={{ ml: 1, mt: { sm: "1vmax" } }}
          >
            <LocalMallTwoToneIcon
              sx={{
                color: "black",
                fontSize: { "3xs": "7vmax", sm: "5vmax" },
              }}
            />
          </IconButton>
          <Box
            display={"flex"}
            alignItems={"center"}
            position={"absolute"}
            sx={{
              right: { "3xs": "32vmax", sm: "25vmax" },
              top: { "3xs": "4.5vmax", sm: "2.5vmax" },
            }}
          >
            <Collapse in={searchOpen} orientation="horizontal">
              <InputBase
                placeholder="חיפוש נרות"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSearch(searchQuery)
                }
                sx={{
                  bgcolor: "rgba(255, 246, 209, 0.9)",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  width: { "3xs": "25vmax" },
                  height: { "3xs": "5.5vmax" },
                  ml: 1,
                }}
                autoFocus={searchOpen}
                onBlur={() => {
                  setTimeout(() => setSearchOpen(false), 200);
                }}
              />
            </Collapse>
            <IconButton
              onClick={() => setSearchOpen(!searchOpen)}
              sx={{ color: "black", mr: { "3xs": "-10vmax" } }}
            >
              {searchOpen ? <CloseIcon /> : <SearchIcon />}
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        slotProps={{ paper: { sx: { width: 240 } } }}
      >
        <List>
          {navLinks
            .filter((link) => link.to !== "/cart")
            .map((link) => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.to}
                  selected={location.pathname === link.to}
                  onClick={handleDrawerToggle}
                >
                  <ListItemText
                    primary={link.label}
                    sx={{ textAlign: "right" }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          <ListItem disablePadding>
            {user ? (
              <ListItemButton
                onClick={() => {
                  dispatch({ type: "user/logout" });
                  handleDrawerToggle();
                }}
              >
                <ListItemText primary="התנתק" sx={{ textAlign: "right" }} />
              </ListItemButton>
            ) : (
              <ListItemButton
                onClick={() => {
                  setShowForm((prev) => !prev);
                  handleDrawerToggle();
                }}
              >
                <ListItemText
                  primary="התחברות/הרשמה"
                  sx={{ textAlign: "right" }}
                />
              </ListItemButton>
            )}
          </ListItem>
        </List>
      </Drawer>

      <Box
        onClick={() => showForm && setShowForm(false)}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "transparent",
          zIndex: showForm ? 1400 : -1,
          pointerEvents: showForm ? "auto" : "none",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-start",
        }}
      >
        <Slide in={showForm} direction="up" timeout={700}>
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              width: 400,
              maxHeight: "90vh",
              overflowY: "auto",
              background: "linear-gradient(to top, black,rgb(247, 239, 169))",
              p: 2,
              borderRadius: "200px / 30px",
              boxShadow: `
        inset 20px 0 40px rgba(255,255,255,0.9),
        inset -20px 0 40px rgba(0,0,0,0.15),
        inset 40px 0 40px rgba(0,0,0,0.15),
        inset 20px 0 40px rgba(255,255,255,0.9)
      `,
              transform: "perspective(1000px)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              "&::-webkit-scrollbar": { display: "none" },
            }}
          >
            <Signup onSuccess={() => setShowForm(false)} />
            <br />
            <br />
            <Login onSuccess={() => setShowForm(false)} />
          </Box>
        </Slide>
      </Box>
    </AppBar>
  );
};

export default Navbar;
