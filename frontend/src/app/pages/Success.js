import React from 'react';
import { Button, Box, Text, Flex, useColorModeValue, Heading, Stack} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';

function Success() {
  const history = useNavigate();

  const goToHomeAndReload = () => {
    history('/');
    window.location.reload();
  };
  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}
    >
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={8}
      >
        <Stack spacing={4}>
          <Flex align={'center'} justify={'center'}>
            <Heading fontSize={'4xl'}>
              Success!
            </Heading>
          </Flex>
          <Text fontSize={'lg'} color={'gray.600'}>
            Congratulations, you've successfully completed the action! 🎉
          </Text>
          <Flex align={'center'} justify={'center'}>
              <Button
                bg={'blue.400'}
                color={'white'}
                _hover={{
                  bg: 'blue.500',
                }}
                onClick={goToHomeAndReload}
              >
                Go to Home
              </Button>
          </Flex>
        </Stack>
      </Box>
    </Flex>
  );
}

export default Success;
