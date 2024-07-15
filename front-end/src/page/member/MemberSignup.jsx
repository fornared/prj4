import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("0");
  const [tel1, setTel1] = useState("");
  const [tel2, setTel2] = useState("");
  const [tel3, setTel3] = useState("");
  const [address, setAddress] = useState("");
  const [birth, setBirth] = useState("");

  function handleSubmit() {
    axios.post("/api/member/signup", {
      email,
      password,
      name,
      gender,
      tel: tel1 + "-" + tel2 + "-" + tel3,
      address,
      birth,
    });
  }

  return (
    <Center>
      <Box w={400}>
        <Center>
          <Heading>회원가입</Heading>
        </Center>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input type="email" onChange={(e) => setEmail(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>이름</FormLabel>
          <Input type="text" onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>성별</FormLabel>
          <RadioGroup onChange={setGender} value={gender}>
            <Stack direction="row">
              <Radio value="0">남성</Radio>
              <Radio value="1">여성</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>전화번호</FormLabel>
          <Flex>
            <Input type="number" onChange={(e) => setTel1(e.target.value)} />-
            <Input type="number" onChange={(e) => setTel2(e.target.value)} />-
            <Input type="number" onChange={(e) => setTel3(e.target.value)} />
          </Flex>
        </FormControl>
        <FormControl>
          <FormLabel>주소</FormLabel>
          <Input type="text" onChange={(e) => setAddress(e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>생년월일</FormLabel>
          <Input type="date" onChange={(e) => setBirth(e.target.value)} />
        </FormControl>
        <Center>
          <Button colorScheme="blue" onClick={handleSubmit}>
            가입
          </Button>
          <Button colorScheme="red">취소</Button>
        </Center>
      </Box>
    </Center>
  );
}
