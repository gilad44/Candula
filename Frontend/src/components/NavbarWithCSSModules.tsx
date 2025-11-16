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

const NavbarWithCSSModules = () => {
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
      className={`${styles.appBar} ${styles.appBarSmall}`}
    >
      <Toolbar
        className={`${styles.toolbar} ${styles.toolbarPaddingSmall} ${styles.toolbarPaddingMedium}`}
      >
        <Box className={styles.logoBox} component={Link} to="/">
          <Box
            className={`${styles.logoContainer} ${styles.logoContainerXSmall} ${styles.logoContainerSmall} ${styles.logoContainerMedium} ${styles.logoContainerLarge} ${styles.logoContainerXLarge}`}
          >
            <img
              src="/images/WicknWaxLogo.png"
              alt="לוגו פתיל ואש"
              className={styles.logoImage}
            />
          </Box>
          <Box className={styles.logoTextContainer}>
            <Typography
              className={`${styles.titleName} ${styles.titleNameXSmall} ${styles.titleNameSmall} ${styles.titleNameMedium} ${styles.titleNameLarge} ${styles.titleNameXLarge}`}
            >
              פתיל ואש
            </Typography>
            <Typography
              className={`${styles.titleDescription} ${styles.titleDescriptionXSmall} ${styles.titleDescriptionMedium} ${styles.titleDescriptionLarge}`}
            >
              נרות דקורטיביים ריחניים
            </Typography>
          </Box>
        </Box>

        {/* Desktop nav */}
        <Box className={`${styles.desktopNav} ${styles.desktopNavVisible}`}>
          <Box className={styles.searchBox}>
            <Collapse in={searchOpen} orientation="horizontal">
              <InputBase
                placeholder="חיפוש נרות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSearch(searchQuery)
                }
                className={styles.searchInput}
                autoFocus={searchOpen}
                onBlur={() => {
                  setTimeout(() => setSearchOpen(false), 200);
                }}
              />
            </Collapse>
            <IconButton
              onClick={() => setSearchOpen(!searchOpen)}
              className={styles.searchIconButton}
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
                slotProps={{
                  paper: {
                    className: styles.userMenuPaper,
                  },
                }}
              >
                {userMenuItems.map((item) => (
                  <MenuItem
                    key={item.to}
                    onClick={() => handleUserMenuItemClick(item.to)}
                    className={styles.userMenuItem}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                <MenuItem
                  onClick={handleLogout}
                  className={styles.logoutMenuItem}
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
            className={styles.cartButton}
          >
            <LocalMallTwoToneIcon className={styles.cartIcon} />
          </IconButton>
          <Drawer
            anchor="right"
            open={cartOpen}
            onClose={() => setCartOpen(false)}
            slotProps={{
              paper: {
                className: styles.cartDrawerPaper,
              },
            }}
          >
            <Box className={styles.cartDrawerContent}>
              <Cart onClose={() => setCartOpen(false)} />
            </Box>
          </Drawer>
        </Box>

        {/* Mobile nav */}
        <Box className={`${styles.mobileNav} ${styles.mobileNavHidden}`}>
          <IconButton
            color="inherit"
            edge="end"
            onClick={handleDrawerToggle}
            className={styles.menuIconButton}
          >
            <MenuIcon
              className={`${styles.menuIcon} ${styles.menuIconSmall}`}
            />
          </IconButton>
          <IconButton
            onClick={() => setCartOpen(true)}
            className={`${styles.cartButtonMobile} ${styles.cartButtonMobileSmall}`}
          >
            <LocalMallTwoToneIcon
              className={`${styles.cartIconMobile} ${styles.cartIconMobileSmall}`}
            />
          </IconButton>
          <Box
            className={`${styles.mobileSearchBox} ${styles.mobileSearchBoxSmall}`}
          >
            <Collapse in={searchOpen} orientation="horizontal">
              <InputBase
                placeholder="חיפוש נרות"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleSearch(searchQuery)
                }
                className={styles.mobileSearchInput}
                autoFocus={searchOpen}
                onBlur={() => {
                  setTimeout(() => setSearchOpen(false), 200);
                }}
              />
            </Collapse>
            <IconButton
              onClick={() => setSearchOpen(!searchOpen)}
              className={styles.mobileSearchIconButton}
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
        slotProps={{ paper: { className: styles.mobileDrawerPaper } }}
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
                    className={styles.drawerListItemText}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          {user && (
            <>
              <ListItem disablePadding>
                <ListItemText
                  primary="איזור אישי"
                  className={styles.userMenuHeaderText}
                />
              </ListItem>
              {userMenuItems.map((item) => (
                <ListItem
                  key={item.to}
                  disablePadding
                  className={styles.userMenuSubItem}
                >
                  <ListItemButton
                    component={Link}
                    to={item.to}
                    selected={location.pathname === item.to}
                    onClick={handleDrawerToggle}
                  >
                    <ListItemText
                      primary={item.label}
                      className={styles.drawerListItemText}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
              <ListItem disablePadding className={styles.userMenuSubItem}>
                <ListItemButton
                  onClick={() => {
                    dispatch({ type: "user/logout" });
                    dispatch(cartActions.setUserId(null));
                    handleDrawerToggle();
                  }}
                >
                  <ListItemText primary="התנתק" className={styles.logoutText} />
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
                  className={styles.drawerListItemText}
                />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>

      <Box
        onClick={() => showForm && setShowForm(false)}
        className={`${styles.authOverlay} ${
          showForm ? styles.authOverlayVisible : styles.authOverlayHidden
        }`}
      >
        <Slide in={showForm} direction="up" timeout={700}>
          <Box
            onClick={(e) => e.stopPropagation()}
            className={styles.authFormBox}
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

export default NavbarWithCSSModules;
