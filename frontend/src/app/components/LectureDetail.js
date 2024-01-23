'use client'

import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { ReactElement, useEffect, useState } from 'react'
import {
  FcAbout,
  FcAssistant,
  FcCollaboration,
  FcDonate,
  FcManager,
} from 'react-icons/fc'
import QuizIcon from '@mui/icons-material/Quiz';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLecture } from '../actions/lectures';

const Card = ({ heading, description, icon, href, type }) => {
  const navigate = useNavigate()
  const { courseId, lectureId } = useParams()
  return (
    <Box
      maxW={{ base: 'full', md: '275px' }}
      w={'full'}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={5}
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'lg',
        bg: 'white',
      }}
      transition="all 0.3s ease-in-out"
      bg={'#f2f5f6'}
      onClick={()=>navigate(`/courses/${courseId}/lectures/${lectureId}/${type}`)}
    >
      <Stack align={'start'} spacing={2}>
        <Flex
          w={16}
          h={16}
          align={'center'}
          justify={'center'}
          color={useColorModeValue('gray.700', 'gray.100')}
          rounded={'full'}
          bg={useColorModeValue('gray.100', 'gray.700')}
        >
          {icon}
        </Flex>
        <Box mt={2}>
          <Heading size="md">{heading}</Heading>
          <Text mt={1} fontSize={'sm'}>
            {description}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
}

export default function LectureDetail() {

  const {lectureId} = useParams();
  const [lectureName, setLectureName] = useState("");

  useEffect(() => {
    const an = async () => {
      const response = await fetchLecture(lectureId);
      if (response) {
        setLectureName(response.name);
      }
    };
    an();
  }, [lectureId])

  return (
    <Box p={4}>
      <Stack spacing={4} as={Container} maxW={'3xl'} textAlign={'center'}>
        <Heading fontSize={{ base: '2xl', sm: '4xl' }} fontWeight={'bold'}>
          {lectureName}
        </Heading>
        <Text color={'gray.600'} fontSize={{ base: 'sm', sm: 'lg' }}>
          Utilize these AI generated study tools to ace your next exam!
        </Text>
      </Stack>

      <Container maxW={'5xl'} mt={12}>
        <Flex flexWrap="wrap" gridGap={6} justify="center">
          <Card
            type="flashcards"
            heading={'Flash Cards'}
            icon={<Icon as={QuizIcon} w={10} h={10} color="blue.400" />}
            // description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
          />
          <Card
            type="notes"
            heading={'Notes'}
            icon={<Icon as={FcCollaboration} w={10} h={10} />}
            //description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
          />
          <Card
            type="practice-questions"
            heading={'Practice Questions'}
            icon={<Icon as={QuestionAnswerIcon} w={10} h={10} color="yellow.400" />}
            //description={'Lorem ipsum dolor sit amet catetur, adipisicing elit.'}
          />
        </Flex>
      </Container>
    </Box>
  )
}