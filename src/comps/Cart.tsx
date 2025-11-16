import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Button, IconButton, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { productsData } from "../data/productsData";
import { cartActions } from "../slices/cartSlice";
import type { RootState } from "../store/store";

type CartProps = {
  onClose?: () => void;
};

const Cart = ({ onClose }: CartProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state: RootState) => state.cartSlice.items);

  const cartProducts = cartItems
    .map((item) => {
      const product = productsData.find((p) => p.id === item.productId);
      return { ...item, product };
    })
    .filter((item) => item.product); // Filter out items where product is not found

  const totalPrice = cartProducts.reduce(
    (total, item) => total + (item.product?.price || 0) * item.quantity,
    0
  );

  const handleRemoveFromCart = (productId: string) => {
    dispatch(cartActions.removeFromCart({ productId, quantity: 999 })); // Remove all
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    dispatch(cartActions.updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleClearCart = () => {
    dispatch(cartActions.clearCart());
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        p: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        width="90%"
        ml="0.5rem"
        variant="h6"
        color="#7f6000"
        fontSize="1.2rem"
        mt={1}
        bgcolor="transparent"
        borderBottom="0.1rem solid #7f6000"
        pb={1}
        mb={2}
      >
        סל קניות ({cartItems.length})
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {cartProducts.length === 0 ? (
          <Typography
            textAlign="center"
            color="gray"
            sx={{ mt: 4, fontSize: "0.9rem" }}
          >
            הסל ריק
          </Typography>
        ) : (
          cartProducts.map((item) => (
            <Box
              key={item.productId}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                p: 2,
                border: "1px solid #ddd",
                borderRadius: 2,
                mb: 2,
                bgcolor: "rgba(255, 255, 255, 0.7)",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: 1,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={`/images/${item.product?.filename}`}
                    alt={item.product?.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ fontSize: "0.8rem", fontWeight: "bold" }}
                  >
                    {item.product?.title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="gray"
                    sx={{ fontSize: "0.7rem" }}
                  >
                    ₪{item.product?.price}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => handleRemoveFromCart(item.productId)}
                  sx={{ color: "red" }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleUpdateQuantity(
                        item.productId,
                        Math.max(1, item.quantity - 1)
                      )
                    }
                    sx={{ width: 24, height: 24, color: "#7f6000" }}
                  >
                    -
                  </IconButton>
                  <Typography
                    sx={{
                      minWidth: 20,
                      textAlign: "center",
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.quantity}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() =>
                      handleUpdateQuantity(item.productId, item.quantity + 1)
                    }
                    sx={{ width: 24, height: 24, color: "#7f6000" }}
                  >
                    +
                  </IconButton>
                </Box>
                <Typography variant="body2" fontWeight="bold">
                  ₪{(item.product?.price || 0) * item.quantity}
                </Typography>
              </Box>
            </Box>
          ))
        )}
      </Box>

      {cartProducts.length > 0 && (
        <Box sx={{ borderTop: "1px solid #ddd", pt: 2, mt: 2 }}>
          <Typography
            variant="h6"
            textAlign="center"
            sx={{ mb: 2, color: "#7f6000", fontWeight: "bold" }}
          >
            סה"כ: ₪{totalPrice}
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={() => {
              onClose?.();
              navigate("/checkout");
            }}
            sx={{
              mb: 1,
              background: "linear-gradient(to right, #7f6000, #cd853f)",
              "&:hover": {
                background: "linear-gradient(to right, #654d00, #b8762f)",
              },
            }}
          >
            המשך לתשלום
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleClearCart}
            sx={{
              color: "#7f6000",
              borderColor: "#7f6000",
              "&:hover": {
                borderColor: "#654d00",
                color: "#654d00",
              },
            }}
          >
            רוקן סל
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Cart;
