import { ChakraProvider } from "@chakra-ui/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./page/Home.jsx";
import { MemberSignup } from "./page/member/MemberSignup.jsx";
import { MemberLogin } from "./page/member/MemberLogin.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    // element: <Home />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      { path: "signup", element: <MemberSignup /> },
      { path: "login", element: <MemberLogin /> },
    ],
  },
]);

function App(props) {
  return (
    <ChakraProvider>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
