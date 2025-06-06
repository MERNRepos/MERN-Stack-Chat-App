import { useEffect } from "react";
import { Container, Box, Text, Tabs } from "@chakra-ui/react";
import { LuFolder, LuUser } from "react-icons/lu";
import Login from "../components/authentication/Login";
import Signup from "../components/authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const user = await JSON.parse(localStorage.getItem("userInfo"));
      if (user) {
        navigate("/chats");
      } else {
        navigate("/");
      }
    }
    fetchData();
  }, []);

  return (
    <Container maxW={"xl"} centerContent>
      <Box
        d={"flex"}
        w="100%"
        p={3}
        bg={"white"}
        justifyContent={"center"}
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth="1px"
      >
        <Text
          fontFamily={"Work sans"}
          color={"black"}
          fontSize={"4xl"}
          textAlign={"center"}
        >
          Talk-A-Tive
        </Text>
      </Box>
      <Box
        borderRadius={"lg"}
        borderWidth={"1px"}
        width={"100%"}
        p="4"
        bg="white"
      >
        <Tabs.Root defaultValue="members">
          <Tabs.List>
            <Tabs.Trigger
              value="members"
              _selected={{
                bg: "teal.100",
                color: "teal.700",
                fontWeight: "bold",
              }}
              _active={{
                bg: "teal.200",
              }}
              _hover={{
                bg: "teal.50",
              }}
            >
              <LuUser />
              Login
            </Tabs.Trigger>

            <Tabs.Trigger
              value="projects"
              _selected={{
                bg: "teal.100",
                color: "teal.700",
                fontWeight: "bold",
              }}
              _active={{
                bg: "teal.200",
              }}
              _hover={{
                bg: "teal.50",
              }}
            >
              <LuFolder />
              Sign Up
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="members">
            <Login />
          </Tabs.Content>

          <Tabs.Content value="projects">
            <Signup />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default HomePage;
