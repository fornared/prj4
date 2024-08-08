import axios from "axios";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Center,
  Flex,
  Heading,
  Image,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook } from "@fortawesome/free-solid-svg-icons";

export function HistoryList() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/api/book/history`)
      .then((res) => {
        setBookList(res.data);
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function bookCard(item) {
    return (
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
      >
        <Flex
          border="1px solid black"
          justifyContent="center"
          alignItems="center"
          w={{ base: "100%", sm: "30%" }}
          px={2}
          py={1}
        >
          {item.bookImage.name ? (
            <Image
              border="1px"
              borderColor="gray.200"
              display="flex"
              alignItems="center"
              objectFit="contain"
              maxW={{ base: "100%", sm: "200px" }}
              w="100%"
              height="95%"
              objectPosition="bottom"
              src={item.bookImage.src}
            />
          ) : (
            <Center
              border="1px"
              borderColor="gray.200"
              maxW={{ base: "100%", sm: "200px" }}
              w="100%"
              h="95%"
              alignItems="center"
            >
              <Text fontSize="6xl">
                <FontAwesomeIcon icon={faBook} color="teal" />
              </Text>
            </Center>
          )}
        </Flex>
        <Stack>
          <CardBody>
            <Heading size="md">{item.title}</Heading>

            <Text py="2">대여일: {item.bookLoan.loanDate}</Text>
            <Text py="2">반납일: {item.bookLoan.returnDate}</Text>
          </CardBody>

          <CardFooter>
            <Button variant="solid" colorScheme="blue">
              Buy Latte
            </Button>
          </CardFooter>
        </Stack>
      </Card>
    );
  }

  if (isLoading) {
    return <Spinner />;
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
          대여 내역
        </Heading>
      </Box>
      {bookList.length === 0 ? (
        <Center></Center>
      ) : (
        bookList.map((item) => (
          <Box key={item.id} w="100%" h="5% ">
            {bookCard(item)}
          </Box>
        ))
      )}
    </Box>
  );
}
