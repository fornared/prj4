import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";

export function Navbar() {
  const navigate = useNavigate();
  const toast = useToast();
  const account = useContext(LoginContext);

  return (
    <Box mb={10} border="1px solid red" borderBottom="2px solid teal">
      <Flex
        justifyContent="right"
        mb={3}
        gap={3}
        mr={3}
        border="1px solid black"
      >
        {(account.isAdmin() || account.isManager()) && (
          <Button onClick={() => navigate("/member/list")}>회원 관리</Button>
        )}
        {account.isLoggedIn() && (
          <Button onClick={() => navigate(`/member/${account.id}`)}>
            내 정보
          </Button>
        )}
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
      </Flex>
      <Flex justifyContent="space-around" mb={5}>
        <Button onClick={() => navigate("/")}>홈</Button>
        <Box></Box>
        <Button onClick={() => navigate("/book/list")}>검색</Button>
        <Button onClick={() => navigate("/")}>내도서</Button>
        {account.isManager() && (
          <Button onClick={() => navigate("/admin")}>관리자메뉴</Button>
        )}
      </Flex>
    </Box>
  );
}
