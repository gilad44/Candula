import { Link } from "@mui/material";

type MyLinkProps = {
  text: string;
  fontSize: string;
  color: string;
  fontWeight: number;
  fontFamily: string;
  textDecoration: string;
  sx: object;
  width: string;
  // height: string;
};
const MyLink = (props: MyLinkProps) => {
  return (
    <Link
      display="flex"
      justifyContent="center"
      alignItems="center"
      width={props.width}
      height="auto"
      paddingX="0.5rem"
      // paddingY="0.5rem"
      borderRadius="0.5rem"
      border="1px solid black"
      boxShadow="-1px 1px"
      sx={{ textDecoration: "none", cursor: "pointer" }}
    >
      {props.text}
    </Link>
  );
};

export default MyLink;
