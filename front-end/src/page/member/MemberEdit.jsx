import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faMinus } from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberEdit() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [tel1, setTel1] = useState("");
  const [tel2, setTel2] = useState("");
  const [tel3, setTel3] = useState("");
  const [isPasswordChecked, setIsPasswordChecked] = useState(false);
  const [oldPassword, setOldPassword] = useState("");

  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        setMember(res.data);
        const tel = res.data.tel.split("-");
        setTel1(tel[0]);
        setTel2(tel[1]);
        setTel3(tel[2]);
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

  function handleSubmit() {
    const newMember = member;
    newMember.tel = tel1 + "-" + tel2 + "-" + tel3;
    if (isPasswordChecked || account.isAdmin() || account.isManager()) {
      axios
        .put(`/api/member/edit`, newMember)
        .then((res) => {
          toast({
            status: "success",
            description: "회원 정보가 수정되었습니다.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          account.login(res.data.token);
          navigate(`/member/${id}`);
        })
        .catch(() => {
          toast({
            status: "error",
            description: "회원 정보가 수정되지 않았습니다.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        })
        .finally();
    }
    if (!isPasswordChecked && !account.isAdmin() && !account.isManager()) {
      toast({
        status: "error",
        description: "비정상적인 접근입니다.",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      navigate(`/member/${id}`);
    }
  }

  function handleCheckPassword() {
    axios
      .post(`/api/member/passwordCheck`, { password: oldPassword })
      .then(() => setIsPasswordChecked(true))
      .catch(() => {
        toast({
          status: "warning",
          description: "비밀번호가 올바르지 않습니다.",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
      })
      .finally(() => {
        setOldPassword("");
      });
  }

  if (!isPasswordChecked) {
    return (
      <Box py={8} px={4} minH="100vh" bg="gray.50">
        <Center>
          <Box
            w={{ base: "100%", lg: 800 }}
            boxShadow="xl"
            borderRadius="lg"
            p={8}
            border="1px"
            borderColor="gray.300"
          >
            <Heading
              mb={6}
              textAlign="center"
              fontSize="2xl"
              fontWeight="bold"
              color="teal.600"
            >
              회원정보 수정
            </Heading>
            <Divider mb={6} />
            <FormControl>
              <FormLabel textAlign="center" fontWeight="bold" color="gray.600">
                {account.isAdmin() || account.isManager()
                  ? "관리자 비밀번호를 입력하세요."
                  : "기존 비밀번호를 입력하세요"}
              </FormLabel>
              <Input
                mt={3}
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </FormControl>
            <Center>
              <Button colorScheme="teal" mt={5} onClick={handleCheckPassword}>
                확인
              </Button>
            </Center>
          </Box>
        </Center>
      </Box>
    );
  }

  if (isPasswordChecked) {
    return (
      <Box py={8} px={4} minH="100vh" bg="gray.50">
        <Center>
          <Box
            w={{ base: "100%", lg: 800 }}
            boxShadow="xl"
            borderRadius="lg"
            p={8}
            border="1px"
            borderColor="gray.300"
          >
            <Heading
              mb={6}
              textAlign="center"
              fontSize="2xl"
              fontWeight="bold"
              color="teal.600"
            >
              회원정보 수정
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
                  새 비밀번호
                </FormLabel>
                <InputGroup>
                  <Input
                    type={passwordVisible ? "text" : "password"}
                    onChange={(e) =>
                      setMember({ ...member, password: e.target.value })
                    }
                    placeholder={"입력하지 않으면 기존 비밀번호가 유지됩니다."}
                  />
                  <InputRightElement>
                    <Text onClick={() => setPasswordVisible(!passwordVisible)}>
                      {passwordVisible ? (
                        <FontAwesomeIcon icon={faEyeSlash} />
                      ) : (
                        <FontAwesomeIcon icon={faEye} />
                      )}
                    </Text>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold" color="gray.600">
                  전화번호
                </FormLabel>
                <Flex gap={1} alignItems="center">
                  <Input
                    type="number"
                    value={tel1}
                    onChange={(e) => setTel1(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faMinus} size="sm" />
                  <Input
                    type="number"
                    value={tel2}
                    onChange={(e) => setTel2(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faMinus} size="sm" />
                  <Input
                    type="number"
                    value={tel3}
                    onChange={(e) => setTel3(e.target.value)}
                  />
                </Flex>
              </FormControl>
              <FormControl>
                <FormLabel fontWeight="bold" color="gray.600">
                  성별
                </FormLabel>
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
                <Input
                  value={member.address}
                  onChange={(e) =>
                    setMember({ ...member, address: e.target.value })
                  }
                />
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
              <Center gap={4}>
                <Button onClick={handleSubmit} colorScheme="teal">
                  저장
                </Button>
                <Button
                  onClick={() => navigate(`/member/${id}`)}
                  colorScheme="teal"
                  variant="outline"
                >
                  취소
                </Button>
              </Center>
            </VStack>
          </Box>
        </Center>
      </Box>
    );
  }
}
