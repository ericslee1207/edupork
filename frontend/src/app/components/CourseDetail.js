import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiUpload } from "react-icons/fi";
import CustomModal from "./CustomModal";
import {
  Box,
  Container,
  Flex,
  FormLabel,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Stack,
  Text,
  useBreakpointValue,
  Button,
  HStack,
  Textarea,
  CircularProgress,
  useColorModeValue,
  SkeletonCircle,
  SkeletonText,
  Skeleton,
  Center,
  useToast,
} from "@chakra-ui/react";
import ProgressBar from "../utils/Progress";
import { AttachmentIcon, PhoneIcon, UnlockIcon } from "@chakra-ui/icons";
import QuizIcon from "@mui/icons-material/Quiz";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import { createLecture, fetchLectures } from "../actions/lectures";

const AddLectureCard = ({ onClick }) => {
  return (
    <Box
      h="400px"
      bg="gray.200"
      maxW={{ base: "full", md: "275px" }}
      bgColor="gray.100"
      w={"full"}
      boxShadow={"lg"}
      borderRadius="lg"
      overflow="hidden"
      p={5}
      color="black"
      _hover={{
        transform: "scale(1.02)",
        shadow: "md",
        borderColor: "green.400",
        borderWidth: "2px",
      }}
      transition="all 0.3s ease-in-out"
      onClick={onClick}
      position="relative"
    >
      <Stack align={"center"} spacing={2}>
        <Heading size="lg" mt="150px">
          Add Lecture
        </Heading>

        <Icon as={FiUpload} w={60} h={30} color="green.400" />
      </Stack>
    </Box>
  );
};

const Card = ({ heading, description, onClick, progress, lectureNumber }) => {
  return (
    <Box
      boxShadow="lg"
      maxW={{ base: "full", md: "275px" }}
      w={"full"}
      borderRadius="lg"
      bgColor="white"
      overflow="hidden"
      p={5}
      color="black"
      _hover={{
        transform: "scale(1.05)",
        shadow: "2xl",
      }}
      transition="all 0.3s ease-in-out"
      onClick={onClick}
      position="relative"
      bg={"#f2f5f6"}
    >
      <Stack align={"center"} spacing={2}>
        <Text fontSize="4xl" fontWeight="bold">
          {description}
        </Text>
        <Heading size="md"></Heading>

        <Box
          padding="6"
          rounded={"2xl"}
          bg={"#f2f5f6"}
          w="100%"
          boxShadow={"lg"}
        >
          {/* Replacing SkeletonCircle with a static Box */}
          <Box w="10" h="10" borderRadius="50%" bg="gray.300" ></Box>

          {/* Replacing SkeletonText with static Box elements */}
          <Box w="100%">
            <Box mt="4" h="4" bg="blue.500" mb="4" rounded={'2xl'}></Box>
            <Box h="4" bg="gray.300" mb="4" rounded={'2xl'}></Box>
            <Box h="4" bg="gray.300" mb="4" rounded={'2xl'}></Box>
            <Box h="4" bg="gray.300" mb="4" rounded={'2xl'}></Box>
          </Box>
        </Box>

        <Box mt={2} textAlign="center">
          <Text mt={1} fontSize={"sm"}>
            {/* Your text content here */}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

function CourseDetail() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const flexDir = useBreakpointValue({ base: "column", md: "row" });
  const [lectures, setLectures] = useState([]);
  const toast = useToast();

  const [lectureName, setLectureName] = useState("");

  const { courseId } = useParams();
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedLectures = await fetchLectures(courseId);
      if (fetchedLectures) {
        setLectures(fetchedLectures);
      }
    };
    fetchData();
  }, [courseId]);

  const [transcriptionFile, setTranscriptionFile] = useState(null);
  const [audioFile, setAudioFile] = useState(null);
  const onClose = () => {
    setLectureName("");
    setTranscriptionFile(null);
    setAudioFile(null);
  };
  console.log(disabled);

  const handleFileChange = (e, type) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      console.log(selectedFile);
      if (type === "transcript") {
        console.log("WE IN HEREE");
        setTranscriptionFile(selectedFile);
      } else if (type === "audio") {
        setAudioFile(selectedFile);
      }
    }
  };

  const handleCreateLecture = async () => {
    const newLecture = await createLecture(
      courseId,
      audioFile,
      transcriptionFile,
      lectureName
    );
    if (newLecture) {
      // Refresh the lectures
      const refreshedLectures = await fetchLectures(courseId);
      if (refreshedLectures) {
        setLectures(refreshedLectures);
      }
      setIsOpen(false); // Close the modal
      toast({
        title: `${lectureName} created!`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={4}>
      <CustomModal
        title="Add New Lecture"
        isOpen={isOpen}
        onSubmit={handleCreateLecture}
        setIsOpen={setIsOpen}
        onClose={onClose}
        disabled={disabled || (transcriptionFile == null && audioFile == null)}
      >
        <FormLabel>Lecture Name</FormLabel>
        <Input
          placeholder="Lecture Name"
          value={lectureName}
          onChange={(e) => {
            if (e.target.value == "") {
              setDisabled(true);
            } else {
              setDisabled(false);
            }
            setLectureName(e.target.value);
          }}
        />
        <HStack mt={10} justify={"center"} direction={flexDir}>
          <Flex direction="column" align="center">
            <FormLabel mb={2}>Upload Transcript</FormLabel>
            <label>
              {transcriptionFile == null ? (
                <>
                  <Input
                    type="file"
                    id="file"
                    accept=".txt"
                    onChange={(e) => handleFileChange(e, "transcript")}
                    style={{ display: "none" }}
                  />
                  <Button
                    leftIcon={<AttachmentIcon />}
                    colorScheme="teal"
                    variant="solid"
                    as="span"
                  >
                    Choose File
                  </Button>{" "}
                </>
              ) : (
                <Text>{transcriptionFile.name}</Text>
              )}
            </label>
          </Flex>
          <Flex direction="column" align="center">
            <FormLabel mb={2}>Upload Audio</FormLabel>
            <label>
              {audioFile == null ? (
                <>
                  <Input
                    type="file"
                    id="audioFile"
                    accept=".mp3, .mp4, .m4a"
                    onChange={(e) => handleFileChange(e, "audio")}
                    style={{ display: "none" }}
                  />
                  <Button
                    leftIcon={<AudioFileIcon />}
                    colorScheme="purple"
                    variant="solid"
                    as="span"
                  >
                    Choose File
                  </Button>
                </>
              ) : (
                <Text>{audioFile.name}</Text>
              )}
            </label>
          </Flex>
        </HStack>
        <Center></Center>
      </CustomModal>

      <Container maxW={"5xl"} mt={12}>
        <Flex flexWrap="wrap" gridGap={6} justify="center">
          <AddLectureCard onClick={() => setIsOpen(true)} />
          {lectures.map((lecture, index) => (
            <Card
              key={index}
              heading={`Lecture ${lecture.id}`}
              icon={<Icon as={QuizIcon} w={10} h={10} color="blue.400" />}
              description={lecture.name}
              lectureNumber={index + 1}
              onClick={() =>
                navigate(`/courses/${courseId}/lectures/${lecture.id}`)
              }
            />
          ))}
        </Flex>
      </Container>
    </Box>
  );
}

export default CourseDetail;
