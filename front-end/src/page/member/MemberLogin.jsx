import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export function MemberLogin() {
  const navigate = useNavigate();

  return (
    <Center>
      <Box>
        <Heading>로그인</Heading>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input type="password" />
        </FormControl>
        <Button>로그인</Button>
        <Button onClick={() => navigate("/signup")}>회원가입</Button>
      </Box>
    </Center>
  );
}
