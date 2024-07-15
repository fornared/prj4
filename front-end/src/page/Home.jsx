import { Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const navigate = useNavigate();

  return (
    <Box>
      <Button onClick={() => navigate("/login")} colorScheme="blue">
        로그인
      </Button>
    </Box>
  );
}
