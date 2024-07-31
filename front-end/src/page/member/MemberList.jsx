import {
  Center,
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
    <Center>
      <Table>
        <Thead>
          <Tr>
            <Th>no</Th>
            <Th>이름</Th>
            <Th>이메일</Th>
            <Th>생년월일</Th>
          </Tr>
        </Thead>
        <Tbody>
          {memberList.map((member) => (
            <Tr key={member.id}>
              <Td>{member.id}</Td>
              <Td
                _hover={{
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "lg",
                }}
                onClick={() => navigate(`/member/${member.id}`)}
              >
                {member.name}
              </Td>
              <Td>{member.email}</Td>
              <Td>{member.birth}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Center>
  );
}
