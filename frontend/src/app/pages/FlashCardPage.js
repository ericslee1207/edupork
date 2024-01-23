import {
  Box,
  Button,
  Center,
  Divider,
  Heading,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaCheckCircle } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import Carousel from "../components/Carousel";
import ReactFlipCard from "reactjs-flip-card";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchFlashcards } from "../actions/flashcards.js";

const FlashCardPage = () => {
  const { lectureId } = useParams();
  const [flashCardData, setFlashCardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(lectureId);

      const response = await fetchFlashcards(lectureId);

      console.log("REEEESP", response);

      if (response) {
        setFlashCardData(response);
      } else {
        console.error("Course could not be created on the backend");
      }
    };

    fetchData();
  }, [lectureId]);

  return (
    <Box py={6} px={5} width="full">
      <Stack spacing={4} width={"100%"} direction={"column"}>
        <Stack
          p={5}
          alignItems={"center"}
          justifyContent={{
            base: "flex-start",
            md: "space-around",
          }}
          direction={{
            base: "column",
            md: "row",
          }}
        >
          <Stack
            width={{
              base: "100%",
              md: "40%",
            }}
            textAlign={"center"}
          >
            <Heading size={"lg"}>
              <Text color="#00719c">Flashcards</Text>
            </Heading>
          </Stack>
        </Stack>
        <Divider />
        <div
          style={{ flex: 1, backgroundColor: "transparent", paddingBottom: 5 }}
        >
          <Carousel>
  {flashCardData.map((flashCard, index) => (
    <SwiperSlide style={{ height: 400 }}>
      <Center h="100%" w="100%">
        <ReactFlipCard
          flipTrigger="onClick"
          direction="vertical"
          containerStyle={{ height: "100%", width: "80%" }} // Adjust width as needed
          frontComponent={
            <Box
              boxShadow="lg"
              borderRadius="md"
              bg="white"
              p={4}
              h={"100%"}
              w={"100%"} // Make sure the Box occupies the full width of the ReactFlipCard
              display="flex" // Ensure the text inside is centered
              justifyContent={"center"}
              alignItems={"center"}
            >
              {flashCard.question}
            </Box>
          }
          backComponent={
            <Box
              boxShadow="lg"
              borderRadius="md"
              bg="white"
              p={4}
              h={"100%"}
              w={"100%"}  // Make sure the Box occupies the full width of the ReactFlipCard
              display="flex" // Ensure the text inside is centered
              justifyContent={"center"}
              alignItems={"center"}
            >
              {flashCard.answer}
            </Box>
          }
        />
      </Center>
    </SwiperSlide>
  ))}
</Carousel>


        </div>
      </Stack>
    </Box>
  );
};

export default FlashCardPage;
