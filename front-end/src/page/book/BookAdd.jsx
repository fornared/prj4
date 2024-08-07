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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Textarea,
  Tooltip,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BookAdd() {
  const [isLoading, setIsLoading] = useState(false);
  const [isbn, setIsbn] = useState("");
  const [isIsbnChecked, setIsIsbnChecked] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [publicationYear, setPublicationYear] = useState("");
  const [kdcMain, setKdcMain] = useState([]);
  const [selectedMain, setSelectedMain] = useState(0);
  const [kdcSub, setKdcSub] = useState([]);
  const [selectedSub, setSelectedSub] = useState(0);
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState([]);
  const [quantity, setQuantity] = useState(1);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/book/get/kdc")
      .then((res) => {
        setKdcMain(res.data.main);
        setKdcSub(res.data.sub);
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "페이지를 불러오는 중 문제가 발생하였습니다.",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        navigate("/");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function handleLengthCheck(e, max) {
    if (e.target.value.length > max) {
      e.target.value = e.target.value.slice(0, max);
    }
  }

  function handleSubmit() {
    setIsLoading(true);
    axios
      .postForm("/api/book/add", {
        isbn,
        title,
        author,
        publisher,
        publicationYear,
        kdcId: selectedSub,
        description,
        files,
        quantity,
      })
      .then(() => {
        toast({
          title: "도서가 등록되었습니다.",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 401) {
          toast({
            status: "error",
            description: "권한이 없습니다.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          navigate("/");
        } else {
          toast({
            title: "도서 등록 중 오류가 발생하였습니다.",
            status: "error",
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

  function handleCheckIsbn() {
    axios.get(`/api/book/check?isbn=${isbn}`).then((res) => {
      if (res.data === true) {
        toast({
          status: "success",
          description: "등록 가능한 도서입니다.",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        setIsIsbnChecked(true);
      } else {
        toast({
          status: "warning",
          description: "이미 등록된 도서입니다.",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
      }
    });
  }

  let isDisabled = false;
  if (
    !isbn.trim().length > 0 ||
    !title.trim().length > 0 ||
    !author.trim().length > 0 ||
    !publisher.trim().length > 0 ||
    selectedSub < 0
  ) {
    isDisabled = true;
  }
  if (!isIsbnChecked) {
    isDisabled = true;
  }

  function handleCancel() {
    if (window.confirm("작성한 내용을 저장하지 않고 목록으로 돌아갑니다.")) {
      navigate("/book/list");
    }
  }

  if (isLoading) {
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
            도서 등록
          </Heading>
          <Divider mb={6} />
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                ISBN*
              </FormLabel>
              <InputGroup>
                <Input
                  onInput={(e) => handleLengthCheck(e, 13)}
                  onChange={(e) => {
                    setIsIsbnChecked(false);
                    setIsbn(e.target.value);
                  }}
                />
                <InputRightElement w={75}>
                  <Tooltip
                    placement="top-end"
                    hasArrow
                    bg="gray.700"
                    isDisabled={isbn.length === 10 || isbn.length === 13}
                    label="10자리 또는 13자리 ISBN을 입력해주세요."
                  >
                    <Button
                      size="sm"
                      m={1}
                      isDisabled={isbn.length !== 10 && isbn.length !== 13}
                      onClick={handleCheckIsbn}
                      colorScheme="blue"
                    >
                      중복확인
                    </Button>
                  </Tooltip>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                제목*
              </FormLabel>
              <Input onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                저자명*
              </FormLabel>
              <Input onChange={(e) => setAuthor(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                출판사*
              </FormLabel>
              <Input onChange={(e) => setPublisher(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                출판년도
              </FormLabel>
              <Input
                type="number"
                onInput={(e) => handleLengthCheck(e, 4)}
                onChange={(e) => setPublicationYear(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                분류*
              </FormLabel>
              <Flex gap={3}>
                <Select
                  value={selectedMain}
                  onChange={(e) => {
                    setSelectedMain(Number(e.target.value));
                    setSelectedSub(Number(e.target.value) * 10);
                  }}
                >
                  {kdcMain.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </Select>
                <Select
                  value={selectedSub}
                  onChange={(e) => {
                    setSelectedSub(Number(e.target.value));
                  }}
                >
                  {selectedMain >= 0 &&
                    kdcSub.map(
                      (item) =>
                        item.kdcMainId === selectedMain && (
                          <option key={item.id} value={item.id}>
                            {item.name}({item.classCode})
                          </option>
                        ),
                    )}
                </Select>
              </Flex>
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                설명
              </FormLabel>
              <Textarea onChange={(e) => setDescription(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                대표 이미지
              </FormLabel>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setFiles(e.target.files)}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                수량*
              </FormLabel>
              <NumberInput
                onChange={(number) => setQuantity(Number(number))}
                maxW={24}
                defaultValue={1}
                value={quantity}
                min={0}
                allowMouseWheel
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <Center>
              <Button
                onClick={handleSubmit}
                isDisabled={isDisabled}
                isLoading={isLoading}
                mr={4}
                colorScheme="blue"
              >
                등록
              </Button>
              <Button onClick={handleCancel} colorScheme="red">
                취소
              </Button>
            </Center>
          </VStack>
        </Box>
      </Center>
    </Box>
  );
}
