import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../ui/toaster";
import { Button, Field, Fieldset, Input, Stack } from "@chakra-ui/react";

const LoginForm = () => {
  const [email, setEmail] = useState("tejass@gmail.com");
  const [password, setPassword] = useState("Test@123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log({ email, password });
    setLoading(false);

    if (!email || !password) {
      toaster.error({
        title: "Error",
        description: "Please fill all details",
        action: {
          label: "Undo",
          onClick: () => console.log("Undo"),
        },
      });
      return;
    } else {
      try {
        const Config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          "http://localhost:5001/api/user/login",
          { email, password },
          Config
        );
        localStorage.setItem("userInfo", JSON.stringify(data));

        toaster.success({
          title: "Success",
          description: "Login successful",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
        setLoading(false);
        navigate("/chats");
      } catch (error) {
        console.log("Handle Login Submit", error);
        setLoading(false);
        toaster.error({
          title: "Error",
          description: "Login Error",
          action: {
            label: "Undo",
            onClick: () => console.log("Undo"),
          },
        });
      }
    }
  };

  const fillGuestCredentials = () => {
    setEmail("guest@example.com");
    setPassword("123456");
  };

  return (
    <form onSubmit={handleLogin}>
      <Fieldset.Root size="lg" maxW="md">
        <Stack spacing="4">
          {/* Email Field */}
          <Field.Root>
            <Field.Label color="red.500">
              Email <span style={{ color: "red" }}>*</span>
            </Field.Label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              bg="blue.50"
              color="green.600"
              _placeholder={{ color: "gray.400" }}
              borderColor="teal.300"
            />
          </Field.Root>

          {/* Password Field */}
          <Field.Root>
            <Field.Label color="red.500">
              Password <span style={{ color: "red" }}>*</span>
            </Field.Label>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              bg="blue.50"
              color="green.600"
              _placeholder={{ color: "gray.400" }}
              borderColor="teal.300"
            />
            <Button
              variant="ghost"
              size="sm"
              mt="1"
              w="fit-content"
              onClick={() => setShowPassword(!showPassword)}
              colorScheme="gray"
            >
              {showPassword ? "Hide" : "Show"}
            </Button>
          </Field.Root>

          {/* Login Button */}
          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            loading={loading}
          >
            Login
          </Button>

          {/* Guest Credentials Button */}
          <Button onClick={fillGuestCredentials} colorScheme="red" width="100%">
            Get Guest User Credentials
          </Button>
        </Stack>
      </Fieldset.Root>
    </form>
  );
};

export default LoginForm;
