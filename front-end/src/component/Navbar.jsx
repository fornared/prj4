import { Box, Button, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";

export function Navbar() {
  const navigate = useNavigate();
  const toast = useToast();
  const account = useContext(LoginContext);

  return (
    <Box>
      {account.isLoggedIn() ? (
        <Button
          onClick={() => {
            account.logout();
            toast({
              status: "success",
              description: "로그아웃 되었습니다.",
              position: "top",
              duration: 2000,
              isClosable: true,
            });
          }}
        >
          로그아웃
        </Button>
      ) : (
        <Button onClick={() => navigate("/login")} colorScheme="blue">
          로그인
        </Button>
      )}
    </Box>
  );
}
