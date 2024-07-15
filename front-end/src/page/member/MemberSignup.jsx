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

export function MemberSignup() {
  return (
    <Center>
      <Box w={400}>
        <Center>
          <Heading>회원가입</Heading>
        </Center>
        <FormControl>
          <FormLabel>이메일</FormLabel>
          <Input type="email" />
        </FormControl>
        <FormControl>
          <FormLabel>비밀번호</FormLabel>
          <Input type="password" />
        </FormControl>
        <FormControl>
          <FormLabel>이름</FormLabel>
          <Input type="text" />
        </FormControl>
        <FormControl>
          <FormLabel>성별</FormLabel>
          <RadioGroup>
            <Stack direction="row">
              <Radio value="1">남성</Radio>
              <Radio value="2">여성</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>전화번호</FormLabel>
          <Flex>
            <Input type="number" />-
            <Input type="number" />-
            <Input type="number" />
          </Flex>
        </FormControl>
        <FormControl>
          <FormLabel>주소</FormLabel>
          <Input type="text" />
        </FormControl>
        <FormControl>
          <FormLabel>생년월일</FormLabel>
          <Input type="date" />
        </FormControl>
        <Center>
          <Button colorScheme="blue">가입</Button>
          <Button colorScheme="red">취소</Button>
        </Center>
      </Box>
    </Center>
  );
}
