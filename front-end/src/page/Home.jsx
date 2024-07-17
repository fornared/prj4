import { Box } from "@chakra-ui/react";

export function Home() {
  return (
    <Box mb={300}>
      <Box
        border="1px solid black"
        mx={{
          base: 0,
          lg: 200,
        }}
        mt={10}
      >
        {/*<Outlet />*/}
      </Box>
    </Box>
  );
}
