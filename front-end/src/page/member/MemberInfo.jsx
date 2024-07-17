import {
  Box,
  Button,
  Center,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export function MemberInfo() {
  const { id } = useParams();
  const [member, setMember] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        setMember(res.data);
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "존재하지 않는 회원입니다.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          navigate("/member/list");
        }
        if (err.response.status === 401) {
          toast({
            status: "error",
            description: "페이지에 접근할 수 없습니다.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          navigate("/");
        }
      })
      .finally();
  }, []);

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Box py={8} px={4} minH="100vh" bg="gray.50">
      <Center>
        <Box
          w={{ base: "100%", lg: 800 }}
          boxShadow="xl"
          borderRadius="lg"
          p={8}
          border="1px solid black"
        >
          <Heading
            mb={6}
            textAlign="center"
            fontSize="2xl"
            fontWeight="bold"
            // color="teal.500"
          >
            회원정보
          </Heading>
          <Divider mb={6} />
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                이름
              </FormLabel>
              <Input isReadOnly value={member.name} bg="gray.100" />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                이메일
              </FormLabel>
              <Input isReadOnly value={member.email} bg="gray.100" />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                전화번호
              </FormLabel>
              <Input isReadOnly value={member.tel} bg="gray.100" />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                성별
              </FormLabel>
              {/*<Input*/}
              {/*  isReadOnly*/}
              {/*  value={member.gender === 0 ? "남성" : "여성"}*/}
              {/*  bg="gray.100"*/}
              {/*/>*/}
              <RadioGroup value={member.gender.toString()}>
                <Stack direction="row">
                  <Radio readOnly value="0">
                    남성
                  </Radio>
                  <Radio readOnly value="1">
                    여성
                  </Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                생년월일
              </FormLabel>
              <Input
                isReadOnly
                value={new Date(member.birth).toLocaleDateString()}
                bg="gray.100"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                주소
              </FormLabel>
              <Input isReadOnly value={member.address} bg="gray.100" />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                가입일시
              </FormLabel>
              <Input
                isReadOnly
                value={member.inserted}
                type="datetime-local"
                bg="gray.100"
              />
            </FormControl>
            <Center>
              <Button
                mr={4}
                onClick={() => navigate(`/member/edit/${member.id}`)}
                colorScheme="blue"
              >
                수정
              </Button>
              <Button colorScheme="red" onClick={onOpen}>
                탈퇴
              </Button>
            </Center>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
