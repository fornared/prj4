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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";

export function BookInfo() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [isBorrow, setIsBorrow] = useState(false);

  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const {
    isOpen: isOpenBorrow,
    onOpen: onOpenBorrow,
    onClose: onCloseBorrow,
  } = useDisclosure();
  const {
    isOpen: isOpenReturn,
    onOpen: onOpenReturn,
    onClose: onCloseReturn,
  } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    axios
      .get(`/api/book/${id}`)
      .then((res) => {
        setBook(res.data);
      })
      .catch()
      .finally();
    axios
      .get(`/api/book/${id}/borrow`)
      .then((res) => {
        setIsBorrow(res.data);
      })
      .catch()
      .finally();
  }, []);

  if (book === null) {
    return <Spinner />;
  }

  function handleOnOpen() {
    if (account.isLoggedIn()) {
      onOpenBorrow();
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

  function handleRemove() {
    if (window.confirm("등록된 도서를 삭제하시겠습니까?")) {
      axios
        .delete(`/api/book/${id}`)
        .then(() => {
          toast({
            title: "도서 정보를 삭제하였습니다.",
            status: "success",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          navigate("/book/list");
        })
        .catch(() => {
          toast({
            status: "error",
            description: "도서 삭제 중 오류가 발생하였습니다.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
        })
        .finally(() => {});
    }
  }

  function handleBorrow() {
    axios
      .post(`/api/book/${id}/borrow`)
      .then(() => {
        toast({
          title: "도서를 대여하였습니다.",
          status: "success",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
        navigate("/book/list");
      })
      .catch(() => {
        toast({
          status: "error",
          description: "도서 수량을 확인해 주세요.",
          position: "top",
          duration: 2000,
          isClosable: true,
        });
      })
      .finally();
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
      p={5}
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor="gray.300"
    >
      <VStack
        divider={<StackDivider borderColor="gray.200" />}
        spacing={4}
        align="stretch"
        mb={10}
      >
        <Box ml={1}>
          <Flex justifyContent="space-between">
            <Heading>{book.title}</Heading>
            {account.isManager() && (
              <Box>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  cursor="pointer"
                  onClick={() => navigate(`/book/${id}/edit`)}
                />
                &nbsp;&nbsp;
                <FontAwesomeIcon
                  icon={faTrashCan}
                  cursor="pointer"
                  onClick={handleRemove}
                />
              </Box>
            )}
          </Flex>
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
        {isBorrow ? (
          <Button onClick={onOpenReturn} colorScheme="teal">
            반납
          </Button>
        ) : (
          <Button
            isDisabled={book.quantity < 1}
            onClick={handleOnOpen}
            colorScheme="blue"
          >
            {book.quantity < 1 ? "대여불가" : "대여"}
          </Button>
        )}
      </Box>
      <Modal isOpen={isOpenBorrow} onClose={onCloseBorrow}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>대여</ModalHeader>
          <ModalBody>대여할까요</ModalBody>
          <ModalFooter gap={2}>
            <Button onClick={handleBorrow} colorScheme="blue" variant="outline">
              확인
            </Button>
            <Button
              onClick={onCloseBorrow}
              colorScheme="teal"
              variant="outline"
            >
              취소
            </Button>
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
