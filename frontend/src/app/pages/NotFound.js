import React from 'react';
import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  const goHome = () => {
    navigate('/');
  };

  return (
    <Center h="70vh" w="80%" flexDirection="column">
      <Box 
        p={8} 
        boxShadow="md" 
        borderRadius="md" 
        textAlign="center"
      >
        <Heading mb={4}>Error: 404</Heading>
        <Text fontSize="xl" mb={4}>Page Not Found</Text>
        <Button colorScheme="blue" onClick={goHome}>
          Go Home
        </Button>
      </Box>
    </Center>
  );
};

export default NotFound;
