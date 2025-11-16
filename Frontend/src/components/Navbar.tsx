import CloseIcon from "@mui/icons-material/Close";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import LocalMallTwoToneIcon from "@mui/icons-material/LocalMallTwoTone";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import {
  AppBar,
  Box,
  Button,
  Collapse,
  InputBase,
  Menu,
  MenuItem,
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
// import RootState from your Redux store definition
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/useRedux";
import { cartActions } from "../slices/cartSlice";
import type { RootState } from "../store/store";
import Cart from "./Cart";
import Login from "./Login";
import styles from "../Styles/components/Navbar.module.css";
import Signup from "./Signup";

const Navbar = () => {
  const user = useSelector((state: RootState) => state.userSlice.user);
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const navLinks = [
    { label: "דף הבית", to: "/" },
    { label: "אודות", to: "/about" },
    { label: "הנרות שלנו", to: "/products" },
  ];

  const userMenuItems = [
    { label: "מועדפים", to: "/favorites" },
    { label: "ההזמנות שלי", to: "/orders" },
    { label: "הפרופיל שלי", to: "/profile" },
    ...(isAdmin ? [{ label: "ניהול מערכת", to: "/admin" }] : []),
  ];

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(
    null
  );
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

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleUserMenuItemClick = (to: string) => {
    navigate(to);
    handleUserMenuClose();
  };

  const handleLogout = () => {
    dispatch({ type: "user/logout" });
    dispatch(cartActions.setUserId(null));
    handleUserMenuClose();
  };

  return (
    <AppBar
      position="sticky"
      elevation={3}
      className={styles.appBar}
      sx={{
        mb: 0,
        width: "100vw",
        left: 0,
        right: 0,
        top: 0,
        borderRadius: 0,
        maxWidth: "100%",
        minWidth: "100%",
        background: "linear-gradient(to right, black, #f7efa9ff)",
        py: 1,
        zIndex: 1200,
        overflow: "hidden",
      }}
    >
      <Toolbar
        className={styles.toolbar}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          px: { "3xs": 1, sm: 3 },
          width: "100%",
          maxWidth: "100%",
          mx: 0,
        }}
      >
        <Box
          className={styles.logoBox}
          sx={{ textDecoration: "none" }}
          display="flex"
          component={Link}
          to="/"
          style={{
            flexShrink: 0,
            alignItems: "center",
          }}
        >
          <Box
            className={styles.logoContainer}
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
                md: "0.7rem",
                lg: "0.8rem",
                xl: "0.8rem",
              },
              flexShrink: 0,
              flexGrow: 0,
              position: "relative",
              overflow: "hidden",
              borderRadius: "50%",
              boxShadow: "0 0 5px 3px #ffffe4ff",
            }}
          >
            <img
              src="/images/WicknWaxLogo.png"
              alt="לוגו פתיל ואש"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transform: "scale(2)",
              }}
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            className={styles.logoTextContainer}
          >
            <Typography
              className={styles.titleName}
              fontSize={{
                "3xs": "6vmax",
                sm: "4vmax",
                md: "3vmax",
                lg: "2.1vmax",
                xl: "2vmax",
              }}
              id="titleName"
            >
              פתיל ואש
            </Typography>
            <Typography
              className={styles.titleDescription}
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
            flexDirection: "row",
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
              <Button
                key={link.to}
                component={Link}
                to={link.to}
                variant={
                  location.pathname === link.to ? "contained" : "outlined"
                }
                className={`${styles.navButton} ${
                  location.pathname === link.to ? styles.navButtonActive : ""
                }`}
              >
                {link.label}
              </Button>
            ))}

          {user ? (
            <Box className={styles.userMenuBox}>
              <Button
                onClick={handleUserMenuOpen}
                endIcon={<KeyboardArrowDownIcon />}
                className={styles.userMenuButton}
              >
                איזור אישי
              </Button>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
                sx={{
                  "& .MuiPaper-root": {
                    background:
                      "linear-gradient(to bottom, rgba(209, 197, 91, 1), black)",
                    borderRadius: 2,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  },
                }}
              >
                {userMenuItems.map((item) => (
                  <MenuItem
                    key={item.to}
                    onClick={() => handleUserMenuItemClick(item.to)}
                    sx={{
                      color: "white",
                      fontWeight: 500,
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: "white",
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.1)",
                    },
                  }}
                >
                  התנתק
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box className={styles.authBox}>
              <Button
                onClick={() => setShowForm((prev) => !prev)}
                className={styles.authButton}
              >
                התחברות/הרשמה
              </Button>
            </Box>
          )}

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
          {user && (
            <>
              <ListItem disablePadding>
                <ListItemText
                  primary="איזור אישי"
                  sx={{
                    textAlign: "left",
                    px: 2,
                    py: 1,
                    "& .MuiListItemText-primary": {
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#333",
                    },
                  }}
                />
              </ListItem>
              {userMenuItems.map((item) => (
                <ListItem key={item.to} disablePadding sx={{ pl: 2 }}>
                  <ListItemButton
                    component={Link}
                    to={item.to}
                    selected={location.pathname === item.to}
                    onClick={handleDrawerToggle}
                  >
                    <ListItemText
                      primary={item.label}
                      sx={{ textAlign: "right" }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding sx={{ pl: 2 }}>
                <ListItemButton
                  onClick={() => {
                    dispatch({ type: "user/logout" });
                    dispatch(cartActions.setUserId(null));
                    handleDrawerToggle();
                  }}
                >
                  <ListItemText
                    primary="התנתק"
                    sx={{
                      textAlign: "right",
                      "& .MuiListItemText-primary": {
                        color: "#d32f2f",
                      },
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </>
          )}
          {!user && (
            <ListItem disablePadding>
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
            </ListItem>
          )}
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
