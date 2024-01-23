import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { authenticateUser, signupUser } from "../slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function Authenticate() {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [emailLogin, setLoginEmail] = useState("");
  const [passwordLogin, setLoginPassword] = useState("");

  const navigate = useNavigate();

  const validateInput = () => {
    const passwordValidation = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    if (isSignup && (!email || !password)) {
      setErrorMessage("Email and Password are required.");
      return false;
    }

    if (!isSignup && (!emailLogin || !passwordLogin)) {
      setErrorMessage("Email and Password are required.");
      return false;
    }

    if (isSignup && password !== password2) {
      setErrorMessage("Passwords must match.");
      return false;
    }

    if (isSignup && !passwordValidation.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and contain at least one number."
      );
      return false;
    }

    if (!isSignup && !passwordValidation.test(passwordLogin)) {
      setErrorMessage(
        "Password must be at least 8 characters long and contain at least one number."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInput()) {
      return;
    }

    const userSignUpData = {
      email,
      password,
    };

    const userLoginData = {
      email: emailLogin,
      password: passwordLogin,
    };

    if (isSignup) {
      const signupResponse = await dispatch(signupUser(userSignUpData));
      console.log("SIGNUP", signupResponse);

      if (!signupResponse.error) {
        setIsSignup(false);
      } else {
        setErrorMessage("Signup failed. Please try again.");
      }
    } else {
      const loginResponse = await dispatch(authenticateUser(userLoginData));
      console.log("LOGIN", loginResponse);
      if (!loginResponse.error) {
        navigate("/success");
      } else {
        setErrorMessage("Login failed. Incorrect email or password.");
      }
    }

    setEmail("");
    setPassword("");
    setPassword2("");
    setLoginEmail("");
    setLoginPassword("");
    setIsSignup(false);
  };
  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Sign in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool <Text color={"blue.400"}>features</Text> ✌️
          </Text>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {errorMessage && <Text color="red.500">{errorMessage}</Text>}
              {isSignup ? (
                <>
                  <FormControl id="email">
                    <FormLabel>Email address</FormLabel>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="password2">
                    <FormLabel>Confirm Password</FormLabel>
                    <Input
                      type="password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                    />
                  </FormControl>
                </>
              ) : (
                <>
                  <FormControl id="emailLogin">
                    <FormLabel>Email address</FormLabel>
                    <Input
                      type="email"
                      value={emailLogin}
                      onChange={(e) => setLoginEmail(e.target.value)}
                    />
                  </FormControl>
                  <FormControl id="passwordLogin">
                    <FormLabel>Password</FormLabel>
                    <Input
                      type="password"
                      value={passwordLogin}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </FormControl>
                </>
              )}

              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                ></Stack>{" "}
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  {isSignup ? "Sign Up" : "Log In"}
                </Button>
                <Button
                  onClick={() => setIsSignup((prevIsSignup) => !prevIsSignup)}
                >
                  {isSignup
                    ? "Already have an account? Sign in"
                    : "Don't have an account? Sign up"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
}
