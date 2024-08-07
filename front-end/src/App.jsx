import { Box, ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { Home } from "./page/Home.jsx";
import { MemberSignup } from "./page/member/MemberSignup.jsx";
import { MemberLogin } from "./page/member/MemberLogin.jsx";
import { LoginProvider } from "./component/LoginProvider.jsx";
import axios from "axios";
import { MemberList } from "./page/member/MemberList.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { MemberInfo } from "./page/member/MemberInfo.jsx";
import { MemberEdit } from "./page/member/MemberEdit.jsx";
import { BookAdd } from "./page/book/BookAdd.jsx";
import { BookList } from "./page/book/BookList.jsx";
import { BookInfo } from "./page/book/BookInfo.jsx";
import { BookEdit } from "./page/book/BookEdit.jsx";
import { Admin } from "./page/Admin.jsx";
import { LibraryList } from "./page/library/LibraryList.jsx";
import { Footer } from "./component/Footer.jsx"; // axios interceptor 설정

// axios interceptor 설정
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Box mb={200}>
          <Navbar />
          <Box
            mx={{
              base: 0,
              lg: 200,
            }}
            mt={10}
          >
            <Outlet />
          </Box>
        </Box>
        <Footer />
      </>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: "signup", element: <MemberSignup /> },
      { path: "login", element: <MemberLogin /> },
      { path: "member/list", element: <MemberList /> },
      { path: "member/:id", element: <MemberInfo /> },
      { path: "member/:id/edit", element: <MemberEdit /> },
      { path: "book/add", element: <BookAdd /> },
      { path: "book/list", element: <BookList /> },
      { path: "book/:id", element: <BookInfo /> },
      { path: "book/:id/edit", element: <BookEdit /> },
      { path: "library", element: <LibraryList /> },
      { path: "admin", element: <Admin /> },
    ],
  },
]);

function App(props) {
  return (
    <LoginProvider>
      <ChakraProvider>
        <RouterProvider router={router} />
      </ChakraProvider>
    </LoginProvider>
  );
}

export default App;
