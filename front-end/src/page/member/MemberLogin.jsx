import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const account = useContext(LoginContext);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (account.isLoggedIn()) {
      navigate("/");
    }
  }, []);

  function handleLogin() {
    axios
      .post("/api/member/login", { email, password })
      .then((res) => {
        account.login(res.data.token);
        toast({
          status: "success",
          description: `로그인 되었습니다.`,
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        navigate(-1);
      })
      .catch(() => {
        account.logout();
        toast({
          status: "warning",
          description: "이메일 또는 패스워드를 확인해주세요.",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
      })
      .finally();
  }

  return (
    <Center
      border="1px"
      borderColor="gray.300"
      borderRadius="3px"
      mx="20%"
      p={3}
    >
      <Box mt={10} mb={10} w="80%">
        <Heading textAlign="center" color="teal.600" mb={4}>
          로그인
        </Heading>
        <FormControl mb={3}>
          <FormLabel>이메일</FormLabel>
          <Input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </FormControl>
        <FormControl mb={6}>
          <FormLabel>비밀번호</FormLabel>
          <Input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </FormControl>
        <Center mb={3}>
          <Button w="100%" colorScheme="teal" onClick={handleLogin}>
            로그인
          </Button>
        </Center>
        <Center>
          <Button
            w="100%"
            colorScheme="teal"
            variant="outline"
            onClick={() => navigate("/signup")}
          >
            회원가입
          </Button>
        </Center>
      </Box>
    </Center>
  );
}
