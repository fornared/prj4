import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  StackDivider,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export function LibraryList() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [id, setId] = useState(null);
  const [book, setBook] = useState(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpenReturn, onOpenReturn, onCloseReturn } = useDisclosure();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/api/book/library`)
      .then((res) => {
        setBookList(res.data);
      })
      .catch(() => {
        toast({
          position: "top",
          status: "warning",
          description: "로그인 후 이용해주세요.",
          duration: "2000",
          isClosable: true,
        });
        navigate("/login");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    bookList
      .filter((item) => item.id === id)
      .map((book) => {
        setBook(book);
        console.log(book);
      });
  }, [id]);

  if (isLoading) {
    return <Spinner />;
  }

  function handleReturn() {
    axios.put(`/api/book/${id}/return`).then().catch().finally();
  }

  return (
    <Box
      mx={{
        base: 4,
        lg: 100,
      }}
      mt={10}
      bg="gray.50"
      p={4}
      borderRadius="lg"
      boxShadow="md"
    >
      <Box mb={5}>
        <Heading textAlign="center" color="teal.600" mb={4} mt={5}>
          내 서재
        </Heading>
      </Box>
      {bookList.length === 0 ? (
        <Center>
          <Button onClick={() => navigate(`/book/list`)}>
            <FontAwesomeIcon icon={faPlus} size="xl" />
          </Button>
        </Center>
      ) : (
        <SimpleGrid
          minChildWidth="280px"
          spacing={5}
          justifyItems="center"
          mt={5}
          mb={10}
        >
          {bookList.map((item) => (
            <Box
              key={item.id}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              width="300px"
              height="240px"
              cursor="pointer"
              onClick={() => {
                setId(item.id);
                onOpen();
              }}
              transition="transform 0.2s"
              _hover={{
                borderColor: "blue.300",
                transform: "scale(1.05)",
              }}
              overflow="hidden"
            >
              <Box
                height="190px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {item.bookImage.name ? (
                  <Image
                    border="1px"
                    borderColor="gray.200"
                    display="flex"
                    alignItems="center"
                    objectFit="contain"
                    width="90%"
                    height="100%"
                    objectPosition="bottom"
                    src={item.bookImage.src}
                  />
                ) : (
                  <Center
                    border="1px"
                    borderColor="gray.200"
                    w="90%"
                    h="100%"
                    alignItems="center"
                  >
                    <Text fontSize="6xl">
                      <FontAwesomeIcon icon={faBook} color="teal" />
                    </Text>
                  </Center>
                )}
              </Box>
              <Box
                borderTop="1px solid"
                borderColor="gray.200"
                height="40px"
                // mt="5px"
                fontWeight="semibold"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={2}
                textAlign="center"
                bg="white"
              >
                {item.title}
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader></ModalHeader>
          <ModalBody>
            {book && (
              <>
                <VStack
                  divider={<StackDivider borderColor="gray.200" />}
                  spacing={4}
                  align="stretch"
                  mb={10}
                >
                  <Box ml={1}>
                    <Heading>{book.title}</Heading>
                    <Text mt={1} fontSize="sm">
                      {book.kdcMain} &gt; {book.kdcSub}
                    </Text>
                  </Box>
                  <Flex>
                    <Image
                      boxSize="150px"
                      objectFit="cover"
                      src={book.bookImage.src}
                    />
                    <Table variant="unstyled">
                      <Tbody>
                        <Tr>
                          <Th>저자</Th>
                          <Td>{book.author}</Td>
                        </Tr>
                        <Tr>
                          <Th>출판사</Th>
                          <Td>{book.publisher}</Td>
                        </Tr>
                        <Tr>
                          <Th>출판년도</Th>
                          <Td>{book.publicationYear}</Td>
                        </Tr>
                        <Tr>
                          <Th>ISBN</Th>
                          <Td>{book.isbn}</Td>
                        </Tr>
                        <Tr>
                          <Td>
                            <Button
                              isDisabled={true}
                              colorScheme="teal"
                              w="100%"
                            >
                              읽기
                            </Button>
                          </Td>
                        </Tr>
                      </Tbody>
                    </Table>
                  </Flex>
                  <Box>
                    <Heading fontSize="sm">소개</Heading>
                    <Text>{book.description}</Text>
                  </Box>
                </VStack>
                <Box textAlign="right">
                  <Button onClick={onOpenReturn} colorScheme="teal">
                    반납
                  </Button>
                </Box>
              </>
            )}
          </ModalBody>
          <ModalFooter justifyContent="center">
            {book && (
              <Flex gap={10}>
                <Text fontWeight="semibold" color="teal.700">
                  대여일: {book.bookLoan.loanDate}
                </Text>
                <Text fontWeight="semibold" color="teal.700">
                  반납예정: {book.bookLoan.dueDate}
                </Text>
              </Flex>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpenReturn} onClose={onCloseReturn}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>반납</ModalHeader>
          <ModalBody>반납할까요?</ModalBody>
          <ModalFooter gap={2}>
            <Button onClick={handleReturn} colorScheme="blue" variant="outline">
              확인
            </Button>
            <Button
              onClick={onCloseReturn}
              colorScheme="teal"
              variant="outline"
            >
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
