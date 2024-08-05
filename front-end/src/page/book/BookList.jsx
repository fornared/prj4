import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Image,
  Input,
  Select,
  Spinner,
  StackDivider,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-regular-svg-icons";

export function BookList() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [kdcMain, setKdcMain] = useState([]);
  const [selectedMain, setSelectedMain] = useState(undefined);
  const [kdcSub, setKdcSub] = useState([]);
  const [selectedSub, setSelectedSub] = useState(undefined);
  const [searchType, setSearchType] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [searchParams] = useSearchParams();

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
        navigate(-1);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    axios.get(`/api/book/list?${searchParams}`).then((res) => {
      setBookList(res.data.bookList);
      setPageInfo(res.data.pageInfo);

      setSelectedMain(undefined);
      setSelectedSub(undefined);
      setSearchType("all");
      setKeyword("");

      const kdcParam = searchParams.get("kdc");
      const typeParam = searchParams.get("type");
      const keywordParam = searchParams.get("keyword");

      if (kdcParam) {
        setSelectedMain(Math.floor(kdcParam / 10));
        setSelectedSub(kdcParam);
      }
      if (typeParam) {
        setSearchType(typeParam);
      }
      if (keywordParam) {
        setKeyword(keywordParam);
      }
    });
  }, [searchParams]);

  if (isLoading) {
    return <Spinner />;
  }

  function handleSearch() {
    const params = new URLSearchParams();

    if (selectedSub >= 0) {
      params.append("kdc", selectedSub);
    }
    if (keyword) {
      if (searchType !== "all") {
        params.append("type", searchType);
      }
      params.append("keyword", keyword);
    }

    navigate(`/book/list?${params.toString()}`);
  }

  const pageNums = [];
  for (let i = pageInfo.beginPageNum; i <= pageInfo.endPageNum; i++) {
    pageNums.push(i);
  }

  function handleClickPage(pageNum) {
    searchParams.set("page", pageNum);
    navigate(`/book/list?${searchParams}`);
  }

  function handleSelectMain(value) {
    if (value === "all") {
      setSelectedMain(undefined);
      setSelectedSub(undefined);
    } else {
      setSelectedMain(Number(value));
      setSelectedSub(Number(value) * 10);
    }
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
        <Heading textAlign="center" mb={4} mt={5}>
          자료 검색
        </Heading>
      </Box>
      <Box mb={3}>
        <Flex gap={3} mb={3}>
          <Select
            value={selectedMain}
            onChange={(e) => {
              handleSelectMain(e.target.value);
            }}
          >
            <option value={"all"}>전체</option>
            {kdcMain.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </Select>
          {selectedMain >= 0 && (
            <Select
              value={selectedSub}
              onChange={(e) => {
                setSelectedSub(Number(e.target.value));
              }}
            >
              {kdcSub.map(
                (item) =>
                  item.kdcMainId === selectedMain && (
                    <option key={item.id} value={item.id}>
                      {item.name}({item.classCode})
                    </option>
                  ),
              )}
            </Select>
          )}
        </Flex>
        <Flex gap={2} mb={3}>
          <Box>
            <Select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="all">전체</option>
              <option value="title">제목</option>
              <option value="author">저자</option>
              <option value="publisher">출판사</option>
              <option value="isbn">ISBN</option>
            </Select>
          </Box>
          <Box>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Box>
        </Flex>
        <Box textAlign="right">
          <Button onClick={handleSearch}>검색</Button>
        </Box>
      </Box>
      <Divider mb={10} />
      <Box mb={10}>
        {bookList.length > 0 ? (
          <VStack
            divider={<StackDivider borderColor="gray.200" />}
            spacing={4}
            align="stretch"
          >
            {bookList.map((book) => (
              <Flex key={book.id}>
                <Box
                  border="1px solid black"
                  w={"25%"}
                  p={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {book.bookImage.name ? (
                    <Image
                      src={book.bookImage.src}
                      w={"100%"}
                      h={"100%"}
                      cursor="pointer"
                      onClick={() => navigate(`/book/${book.id}`)}
                    />
                  ) : (
                    <FontAwesomeIcon icon={faImage} />
                  )}
                </Box>
                <Box p={2} w={"75%"} border="1px solid red">
                  <Heading
                    onClick={() => navigate(`/book/${book.id}`)}
                    size="md"
                    cursor="pointer"
                    mt={1}
                  >
                    {book.title}
                  </Heading>
                  <Text color="gray.500">
                    {book.author} | {book.publisher} | {book.publicationYear}
                  </Text>
                  <Text mt={3} fontSize="small" color="gray.600">
                    ISBN: {book.isbn}
                  </Text>
                </Box>
              </Flex>
            ))}
          </VStack>
        ) : (
          <Center>검색 결과가 없습니다.</Center>
        )}
      </Box>

      <Center mb={10}>
        <Flex gap={2}>
          {pageInfo.prevPageNum > 0 && (
            <>
              <Button
                onClick={() => handleClickPage(1)}
                _hover={{ bg: "blue.600" }}
              >
                처음
              </Button>
              <Button
                onClick={() => handleClickPage(pageInfo.prevPageNum)}
                _hover={{ bg: "blue.600" }}
              >
                이전
              </Button>
            </>
          )}
          {pageNums.map((pageNum) => (
            <Button
              key={pageNum}
              onClick={() => handleClickPage(pageNum)}
              colorScheme={pageNum === pageInfo.currPageNum ? "blue" : "gray"}
              _hover={{ bg: "blue.600" }}
            >
              {pageNum}
            </Button>
          ))}
          {pageInfo.nextPageNum < pageInfo.lastPageNum && (
            <>
              <Button
                onClick={() => handleClickPage(pageInfo.nextPageNum)}
                _hover={{ bg: "blue.600" }}
              >
                다음
              </Button>
              <Button
                onClick={() => handleClickPage(pageInfo.lastPageNum)}
                _hover={{ bg: "blue.600" }}
              >
                끝
              </Button>
            </>
          )}
        </Flex>
      </Center>
    </Box>
  );
}
