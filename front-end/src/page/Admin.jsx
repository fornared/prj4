import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export function Admin() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/api/member/authority")
      .then(() => {})
      .catch((err) => {
        if (err.response.status === 401) {
          toast({
            position: "top",
            status: "error",
            description: "페이지 접근 권한이 없습니다.",
            duration: 2000,
            isClosable: true,
          });
          navigate("/");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

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
            관리자 메뉴
          </Heading>
          <Button onClick={() => navigate("/member/list")}>회원 관리</Button>
          <Button onClick={() => navigate("/book/add")}>추가</Button>
        </Box>
      </Center>
    </Box>
  );
}
