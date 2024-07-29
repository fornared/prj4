import { Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <Box m={10}>
      {/*<Outlet />*/}
      <Button onClick={() => navigate("/book/add")}>추가</Button>
    </Box>
  );
}
