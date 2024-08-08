import {
  Box,
  Button,
  Flex,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  faBookOpen,
  faMagnifyingGlass,
  faRightFromBracket,
  faUser,
  faUserTie,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Navbar() {
  const navigate = useNavigate();
  const toast = useToast();
  const account = useContext(LoginContext);

  return (
    <Box mb={10} borderBottom="3px solid teal">
      <Flex justifyContent="space-around" mt={5} mb={5}>
        <Button onClick={() => navigate("/")} variant="unstyled" fontSize="lg">
          홈
        </Button>
        <Box></Box>
        <Button
          onClick={() => navigate("/book/list")}
          variant="unstyled"
          fontSize="lg"
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} /> 검색
        </Button>
        <Button
          onClick={() => navigate("/library")}
          variant="unstyled"
          fontSize="lg"
        >
          <FontAwesomeIcon icon={faBookOpen} /> 내서재
        </Button>
        <Button
          onClick={() => navigate("/history")}
          variant="unstyled"
          fontSize="lg"
        >
          대여내역
        </Button>
        {account.isManager() && (
          <Button
            onClick={() => navigate("/admin")}
            variant="unstyled"
            fontSize="lg"
          >
            <FontAwesomeIcon icon={faUserTie} />
            관리자메뉴
          </Button>
        )}
        {account.isLoggedIn() ? (
          <Menu>
            <MenuButton
              as={Button}
              colorScheme="teal"
              rightIcon={<ChevronDownIcon />}
              fontSize="sm"
            >
              <FontAwesomeIcon icon={faUser} size="sm" /> {account.name}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => navigate(`/member/${account.id}`)}>
                <FontAwesomeIcon icon={faUser} color="teal" />
                <Text ml={2}>내 정보</Text>
              </MenuItem>
              <MenuDivider />
              <MenuItem
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
                <FontAwesomeIcon icon={faRightFromBracket} color="teal" />
                <Text ml={2}>로그아웃</Text>
              </MenuItem>
            </MenuList>
          </Menu>
        ) : (
          <Button onClick={() => navigate("/login")} colorScheme="teal">
            로그인
          </Button>
        )}
      </Flex>
    </Box>
    // <Box mb={10} border="1px solid red" borderBottom="2px solid teal">
    //   <Flex
    //     justifyContent="right"
    //     mb={3}
    //     gap={3}
    //     mr={3}
    //     border="1px solid black"
    //   >
    //     {(account.isAdmin() || account.isManager()) && (
    //       <Button onClick={() => navigate("/member/list")}>회원 관리</Button>
    //     )}
    //     {account.isLoggedIn() && (
    //       <Button onClick={() => navigate(`/member/${account.id}`)}>
    //         내 정보
    //       </Button>
    //     )}
    //     {account.isLoggedIn() ? (
    //       <Button
    //         onClick={() => {
    //           account.logout();
    //           toast({
    //             status: "success",
    //             description: "로그아웃 되었습니다.",
    //             position: "top",
    //             duration: 2000,
    //             isClosable: true,
    //           });
    //           navigate("/");
    //         }}
    //       >
    //         로그아웃
    //       </Button>
    //     ) : (
    //       <Button onClick={() => navigate("/login")} colorScheme="blue">
    //         로그인
    //       </Button>
    //     )}
    //   </Flex>
    //   <Flex justifyContent="space-around" mb={5}>
    //     <Button onClick={() => navigate("/")}>홈</Button>
    //     <Box></Box>
    //     <Button onClick={() => navigate("/book/list")}>검색</Button>
    //     <Button onClick={() => navigate("/")}>내도서</Button>
    //     {account.isManager() && (
    //       <Button onClick={() => navigate("/admin")}>관리자메뉴</Button>
    //     )}
    //   </Flex>
    // </Box>
  );
}
