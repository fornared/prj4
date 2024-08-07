import {
  Box,
  Center,
  Divider,
  Heading,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberList() {
  const [memberList, setMemberList] = useState([]);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    axios
      .get("/api/member/list")
      .then((res) => {
        setMemberList(res.data);
      })
      .catch((err) => {
        if (err.response.status === 401 || err.response.status === 403) {
          toast({
            status: "error",
            description: "페이지에 접근할 수 없습니다.",
            position: "top",
            duration: 2000,
            isClosable: true,
          });
          navigate("/");
        }
      });
  }, []);

  if (memberList.length === 0) {
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
      border="1px"
      borderColor="gray.300"
    >
      <Center mt={10}>
        <Heading color="teal.600" mb={5}>
          회원 관리
        </Heading>
      </Center>
      <Divider mb={10} />
      <Table colorScheme="teal" mb={5}>
        <Thead bgColor="gray.100">
          <Tr>
            <Th textAlign="center">no</Th>
            <Th textAlign="center">이름</Th>
            <Th textAlign="center">이메일</Th>
            <Th textAlign="center">생년월일</Th>
          </Tr>
        </Thead>
        <Tbody>
          {memberList.map((member) => (
            <Tr key={member.id}>
              <Td textAlign="center">{member.id}</Td>
              <Td
                _hover={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "lg",
                }}
                onClick={() => navigate(`/member/${member.id}`)}
                textAlign="center"
              >
                {member.name}
              </Td>
              <Td textAlign="center">{member.email}</Td>
              <Td textAlign="center">{member.birth}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}
