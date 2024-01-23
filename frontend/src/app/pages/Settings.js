import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { logoutUser } from "../slices/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Center h="100vh">
      <Box
        w="400px" // Increased width
        p={4}
        boxShadow={'lg'}
        borderRadius={'md'}
        bg={'white'}
        pb={7}
      >
        <Center>
          <VStack>
            <Heading mt="3">Settings</Heading>

            {/* Text for guidance */}
            <Box textAlign="center" maxW="200px" mb={5}>
              <Text fontSize="md">
                Here you can manage your account settings. Select an option
                below to continue.
              </Text>
            </Box>

            {isAuthenticated ? (
              <Button w="100%" colorScheme="blue" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <Button
                as={ReactLink}
                to="/authenticate"
                w="100%"
                colorScheme="blue"
              >
                Sign In
              </Button>
            )}
          </VStack>
        </Center>
      </Box>
    </Center>
  );
};

export default Settings;
