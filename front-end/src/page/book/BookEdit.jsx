import { useEffect, useState } from "react";
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Spinner,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export function BookEdit() {
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [kdcMain, setKdcMain] = useState([]);
  const [selectedMain, setSelectedMain] = useState(0);
  const [kdcSub, setKdcSub] = useState([]);
  const [selectedSub, setSelectedSub] = useState(0);
  const [files, setFiles] = useState([]);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/book/get/kdc")
      .then((res) => {
        setKdcMain(res.data.main);
        setKdcSub(res.data.sub);
        axios
          .get(`/api/book/${id}`)
          .then((res) => {
            setBook(res.data);
            setSelectedMain(Math.floor(res.data.kdcId / 10));
            setSelectedSub(res.data.kdcId);
          })
          .catch((err) => {
            if (err.response.status === 404) {
              toast({
                status: "warning",
                description: "해당 도서가 존재하지 않습니다.",
                position: "top",
                duration: 2000,
                isClosable: true,
              });
              navigate("/book/list");
            }
          })
          .finally();
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "페이지를 불러오는 중 문제가 발생하였습니다.",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        navigate(-1);
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
      .putForm("/api/book/edit", {
        id: id,
        isbn: book.isbn,
        kdcId: selectedSub,
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        publicationYear: book.publicationYear,
        description: book.description,
        quantity: book.quantity,
        files,
      })
      .then(() => {
        toast({
          title: "도서 정보가 수정되었습니다.",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        navigate(`/book/${id}`);
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
            title: "도서 정보 수정 중 오류가 발생하였습니다.",
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

  function handleCancel() {
    if (window.confirm("작성한 내용은 저장되지 않습니다.")) {
      navigate(-1);
    }
  }

  let isDisabled = false;

  if (
    Object.keys(book).length !== 0 &&
    (!book.title.trim().length > 0 ||
      !book.author.trim().length > 0 ||
      !book.publisher.trim().length > 0)
  ) {
    isDisabled = true;
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
            편집
          </Heading>
          <Divider mb={6} />
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                ISBN*
              </FormLabel>
              <Input
                isReadOnly={true}
                defaultValue={book.isbn}
                bgColor="gray.100"
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                제목*
              </FormLabel>
              <Input
                onChange={(e) => setBook({ ...book, title: e.target.value })}
                defaultValue={book.title}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                저자명*
              </FormLabel>
              <Input
                onChange={(e) => setBook({ ...book, author: e.target.value })}
                defaultValue={book.author}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                출판사*
              </FormLabel>
              <Input
                onChange={(e) =>
                  setBook({ ...book, publisher: e.target.value })
                }
                defaultValue={book.publisher}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontWeight="bold" color="gray.600">
                출판년도
              </FormLabel>
              <Input
                type="number"
                onInput={(e) => handleLengthCheck(e, 4)}
                onChange={(e) =>
                  setBook({ ...book, publicationYear: e.target.value })
                }
                defaultValue={book.publicationYear}
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
              <Textarea
                onChange={(e) =>
                  setBook({ ...book, description: e.target.value })
                }
                defaultValue={book.description}
              />
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
                onChange={(number) =>
                  setBook({ ...book, quantity: Number(number) })
                }
                maxW={24}
                value={book.quantity}
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
                저장
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
