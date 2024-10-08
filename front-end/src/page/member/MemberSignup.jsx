import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faMinus } from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberSignup() {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [name, setName] = useState("");
  const [gender, setGender] = useState(null);
  const [tel1, setTel1] = useState("");
  const [tel2, setTel2] = useState("");
  const [tel3, setTel3] = useState("");
  const [address, setAddress] = useState("");
  const [birth, setBirth] = useState(null);

  const navigate = useNavigate();
  const toast = useToast();
  const account = useContext(LoginContext);

  useEffect(() => {
    if (account.isLoggedIn()) {
      navigate("/");
    }
  }, []);

  function handleSubmit() {
    setIsLoading(true);
    axios
      .post("/api/member/signup", {
        email,
        password,
        name,
        gender,
        tel: tel1 + "-" + tel2 + "-" + tel3,
        address,
        birth,
      })
      .then(() => {
        toast({
          status: "success",
          description: "회원 가입이 완료되었습니다.",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        navigate("/login");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: "입력값을 확인해주세요.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        } else {
          toast({
            status: "error",
            description: "회원가입 도중 문제가 발생하였습니다.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  function handleCheckEmail() {
    axios
      .get(`/api/member/check?email=${email}`)
      .then((res) => {
        if (res.data === true) {
          toast({
            status: "success",
            description: "사용 가능한 이메일입니다.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          setIsEmailChecked(true);
        } else {
          toast({
            status: "warning",
            description: "이미 사용중인 이메일입니다.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "warning",
            description: "입력값을 확인해주세요.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        }
      })
      .finally();
  }

  let isDisabled = false;

  if (
    !email.trim().length > 0 ||
    !password.trim().length > 0 ||
    !name.trim().length > 0 ||
    gender === null ||
    !tel1.trim().length > 0 ||
    !tel2.trim().length > 0 ||
    !tel3.trim().length > 0 ||
    !address.trim().length > 0 ||
    birth === null
  ) {
    isDisabled = true;
  }
  if (!isEmailChecked) {
    isDisabled = true;
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
        <Center>
          <Heading color="teal.600" mb={5}>
            회원가입
          </Heading>
        </Center>
        <FormControl mb={3}>
          <FormLabel>이메일</FormLabel>
          <InputGroup>
            <Input
              type="email"
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailChecked(false);
                setIsInvalidEmail(e.target.validity.typeMismatch);
              }}
            />
            <InputRightElement w={75}>
              <Tooltip
                placement="top-end"
                hasArrow
                bg="gray.700"
                isDisabled={!isInvalidEmail}
                label="올바른 이메일 형식으로 작성해 주세요"
              >
                <Button
                  size="sm"
                  m={1}
                  isDisabled={email.trim().length === 0 || isInvalidEmail}
                  onClick={handleCheckEmail}
                  colorScheme="teal"
                >
                  중복확인
                </Button>
              </Tooltip>
            </InputRightElement>
          </InputGroup>
          {isEmailChecked || (
            <FormHelperText>이메일 중복확인을 해주세요.</FormHelperText>
          )}
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>비밀번호</FormLabel>
          <InputGroup>
            <Input
              type={passwordVisible ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
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
        <FormControl mb={3}>
          <FormLabel>이름</FormLabel>
          <Input type="text" onChange={(e) => setName(e.target.value)} />
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>성별</FormLabel>
          <RadioGroup onChange={setGender} value={gender}>
            <Stack direction="row">
              <Radio value="0">남성</Radio>
              <Radio value="1">여성</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>전화번호</FormLabel>
          <Flex gap={1} alignItems="center">
            <Input type="number" onChange={(e) => setTel1(e.target.value)} />
            <FontAwesomeIcon icon={faMinus} size="sm" />
            <Input type="number" onChange={(e) => setTel2(e.target.value)} />
            <FontAwesomeIcon icon={faMinus} size="sm" />
            <Input type="number" onChange={(e) => setTel3(e.target.value)} />
          </Flex>
        </FormControl>
        <FormControl mb={3}>
          <FormLabel>주소</FormLabel>
          <Input type="text" onChange={(e) => setAddress(e.target.value)} />
        </FormControl>
        <FormControl mb={5}>
          <FormLabel>생년월일</FormLabel>
          <Input type="date" onChange={(e) => setBirth(e.target.value)} />
        </FormControl>
        <Center gap={3}>
          <Button
            onClick={handleSubmit}
            isDisabled={isDisabled}
            isLoading={isLoading}
            colorScheme="teal"
          >
            가입
          </Button>
          <Button
            onClick={() => navigate(`/login`)}
            colorScheme="teal"
            variant="outline"
          >
            취소
          </Button>
        </Center>
      </Box>
    </Center>
  );
}
