import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Spinner, useToast } from "@chakra-ui/react";
import axios from "axios";

export function BookList() {
  const [isLoading, setIsLoading] = useState(false);
  const [bookList, setBookList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [kdcMain, setKdcMain] = useState([]);
  const [selectedMain, setSelectedMain] = useState(null);
  const [kdcSub, setKdcSub] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [searchType, setSearchType] = useState("");
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

      // setSelectedMain(0);
      setSelectedSub(null);
      setSearchType("");
      setKeyword("");

      const kdcParam = searchParams.get("kdc");
      const typeParam = searchParams.get("type");
      const keywordParam = searchParams.get("keyword");

      if (kdcParam) {
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

  return null;
}
