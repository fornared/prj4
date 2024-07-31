import {
  Box,
  Button,
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
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BookInfo() {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/book/${id}`)
      .then((res) => {
        setBook(res.data);
      })
      .catch()
      .finally();
  }, []);

  if (book === null) {
    return <Spinner />;
  }

  function handleOnOpen() {
    if (account.isLoggedIn()) {
      onOpen();
    } else {
      toast({
        status: "warning",
        description: "로그인 후 이용해주세요.",
        position: "top",
        duration: 2000,
        isClosable: true,
      });
      navigate("/login");
    }
  }

  function handleBorrow() {}

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
          <Image boxSize="150px" objectFit="cover" src={book.bookImage.src} />
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
            </Tbody>
          </Table>
        </Flex>
        <Box>
          <Heading fontSize="sm">소개</Heading>
          <Text>{book.description}</Text>
        </Box>
      </VStack>
      <Box textAlign="right">
        <Text fontSize="sm" color="gray.500">
          현재수량: {book.quantity}
        </Text>
        <Button
          isDisabled={book.quantity < 1}
          onClick={handleOnOpen}
          colorScheme="blue"
          variant="outline"
        >
          대여
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>대여</ModalHeader>
          <ModalBody>대여할까요</ModalBody>
          <ModalFooter gap={2}>
            <Button onClick={handleBorrow} colorScheme="blue" variant="outline">
              확인
            </Button>
            <Button onClick={onClose} colorScheme="teal" variant="outline">
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
