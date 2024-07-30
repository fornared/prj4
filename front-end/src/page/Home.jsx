import { Box, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { LoginContext } from "../component/LoginProvider.jsx";

export function Home() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Box m={10}>
      {account.isManager() && (
        <Button onClick={() => navigate("/book/add")}>추가</Button>
      )}
    </Box>
  );
}
