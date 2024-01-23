import {
  Box,
  Button,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
  Flex,
  Heading,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { fetchPracticeQuestions } from "../actions/practicequestions.js";
import { useParams } from "react-router-dom";

const PracticeQuestionsPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState("");
  const { lectureId } = useParams();
  const toast = useToast();
  const [questions, setQuestions] = useState([]);

  function transformQuestion(data) {
    let correctAnswerKey = data.answer.charAt(0).toUpperCase();

    if (!["A", "B", "C", "D"].includes(correctAnswerKey)) {
      correctAnswerKey = "B";
    }

    return {
      text: data.question,
      options: [
        { key: "A", text: data.choice1 },
        { key: "B", text: data.choice2 },
        { key: "C", text: data.choice3 },
        { key: "D", text: data.choice4 },
      ],
      correctAnswer: correctAnswerKey,
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetchPracticeQuestions(lectureId);

      if (response) {
        let transformedQuestions = [];
        response.forEach((q) => {
          transformedQuestions.push(transformQuestion(q));
        });
        setQuestions(transformedQuestions);
      } else {
        console.error("Course could not be created on the backend");
      }
    };

    fetchData();
  }, [lectureId]);

  const handleSubmit = () => {
    if (selectedValue === questions[currentQuestionIndex].correctAnswer) {
      toast({
        title: "Correct!",
        description: "On to the next one.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setSelectedValue("");
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      toast({
        title: "Incorrect!",
        description: "Try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (currentQuestionIndex >= questions.length) {
    return (
      <Text fontSize="xl" mt={4}>
        Thank you for completing the quiz!
      </Text>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const Card = ({ children }) => (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      padding="6"
      boxShadow="xl"
      bg="white"
      marginBottom="4"
    >
      {children}
    </Box>
  );

  return (
    <>
      <Flex justify="center">
        <Heading textAlign="center" color="#00719c">
          Practice Questions
        </Heading>
      </Flex>
      <Box p={4}>
        <Card>
          <Text fontSize="xl" marginBottom="4">
            {currentQuestion.text}
          </Text>
          <RadioGroup
            onChange={setSelectedValue}
            value={selectedValue}
            colorScheme="blue"
          >
            <Stack spacing={4}>
              {currentQuestion.options.map((option) => (
                <Radio key={option.key} value={option.key}>
                  {option.text}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
          <Button mt={4} colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </Card>
      </Box>
    </>
  );
};

export default PracticeQuestionsPage;
