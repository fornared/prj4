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
import { useContext, useState } from "react";
import axios from "axios";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const account = useContext(LoginContext);

  const navigate = useNavigate();
  const toast = useToast();

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
        navigate("/");
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
    <Center>
      <Box>
        <Heading>로그인</Heading>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input
            type="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </FormControl>
        <Button onClick={handleLogin}>로그인</Button>
        <Button onClick={() => navigate("/signup")}>회원가입</Button>
      </Box>
    </Center>
  );
}
