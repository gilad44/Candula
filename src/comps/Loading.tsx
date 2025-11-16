import { Box, CircularProgress, Typography } from "@mui/material";

type LoadingProps = {
  message?: string;
  size?: number;
  fullScreen?: boolean;
};

const Loading = ({
  message = "טוען...",
  size = 60,
  fullScreen = false,
}: LoadingProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: fullScreen ? "100vh" : "200px",
        gap: 2,
        direction: "rtl",
        ...(fullScreen && {
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          zIndex: 9999,
        }),
      }}
    >
      <CircularProgress
        size={size}
        sx={{
          color: "#7f6000",
          "& .MuiCircularProgress-circle": {
            strokeLinecap: "round",
          },
        }}
      />
      <Typography
        variant="body1"
        sx={{
          color: "#7f6000",
          textAlign: "center",
          fontWeight: 500,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default Loading;
