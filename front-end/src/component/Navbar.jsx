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
            navigate("/");
          }}
        >
          로그아웃
        </Button>
      ) : (
        <Button onClick={() => navigate("/login")} colorScheme="blue">
          로그인
        </Button>
      )}
      {account.isLoggedIn() && (
        <Button onClick={() => navigate(`/member/${account.id}`)}>
          내 정보
        </Button>
      )}
      {(account.isAdmin() || account.isManager()) && (
        <Button onClick={() => navigate("/member/list")}>회원 목록</Button>
      )}
    </Box>
  );
}
