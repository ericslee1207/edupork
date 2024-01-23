import React from 'react';
import {
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Button,
  Flex
} from '@chakra-ui/react';

function ButtonsLayout(){
    return(
        <SimpleGrid w={'80%'}>
        <SimpleGrid spacing={2} flexDirection='column' flex={1}>
      <Flex>
        <Card flex={0.6} mr={4} h={250}>
          <CardHeader>
            <Heading size='md'> Notes</Heading>
          </CardHeader>
          <CardBody>
            <Text>View a summary of all your customers over the last month.</Text>
          </CardBody>
        </Card>
        <Card flex={0.4}>
          <CardHeader>
            <Heading size='md'> Practice Problems</Heading>
          </CardHeader>
          <CardBody>
            <Text>View a summary of all your customers over the last month.</Text>
          </CardBody>
        </Card>
      </Flex>
      {/* You can add more pairs of cards as needed */}
    </SimpleGrid>
<SimpleGrid spacing={2} flexDirection='column' flex={1} mt={4}>
<Flex>

  <Card flex={0.4} mr={4} h={250}>
    <CardHeader>
      <Heading size='md'> TBD </Heading>
    </CardHeader>
    <CardBody>
      <Text>View a summary of all your customers over the last month.</Text>
    </CardBody>
  </Card>
  <Card flex={0.6} >
    <CardHeader>
      <Heading size='md'> Flash Cards </Heading>
    </CardHeader>
    <CardBody>
      <Text>View a summary of all your customers over the last month.</Text>
    </CardBody>
  </Card>
  </Flex>
</SimpleGrid>
</SimpleGrid>
    )
}

export default ButtonsLayout;