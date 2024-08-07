import { useEffect, useState } from "react";
import { Spinner, useToast } from "@chakra-ui/react";
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

  return null;
}
