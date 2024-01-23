import { Card, CardHeader, CardBody, CardFooter, Text, Button } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { Heading } from "@chakra-ui/react";
import { Flex, Spacer } from "@chakra-ui/react";
import DownloadIcon from "@mui/icons-material/Download";
import { useParams } from "react-router-dom";
import { fetchNotes } from "../actions/notes.js";

function NotesPage() {
  //get this text from backend
  const [text, setText] = useState("Error Processing Get Request");

  const { lectureId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      console.log(lectureId);

      const response = await fetchNotes(lectureId);

      console.log("REEEESP", response);

      if (response) {
        setText(response[0].content);
      } else {
        console.error("Course could not be created on the backend");
      }
    };

    fetchData();
  }, [lectureId]);
  const handleDownloadClick = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated_notes.txt";
    a.style.display = "none";

    // Append the anchor to the body and trigger the click event
    document.body.appendChild(a);
    a.click();

    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    console.log("yes");
  };

  return (
    <Card>
      <CardBody>
        <Flex justify="center">
          <Heading textAlign="center" color="#00719c">Generated Notes</Heading>
        </Flex>
        <Text mt={"3rem"}>
          {text.split("\n").map((line, index) => (
            <>
              {line}
              {index !== text.split("\n").length - 1 && (
                <>
                  <br />
                  <br />
                </>
              )}
            </>
          ))}
        </Text>
      </CardBody>
      <Flex justify="center" mb={"2rem"}>
        <Button
          onClick={handleDownloadClick}
          colorScheme="green"
          leftIcon={<DownloadIcon />}
        >
          Download Notes
        </Button>
      </Flex>
    </Card>
  );
}

export default NotesPage;
