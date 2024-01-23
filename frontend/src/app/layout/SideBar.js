import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { createCourse, fetchCourses } from "../actions/courses";
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  Icon,
  useColorModeValue,
  Text,
  Drawer,
  DrawerContent,
  useDisclosure,
  Link,
  FormLabel,
  Input,
  useToast,
  Collapse,
  Button,
} from "@chakra-ui/react";

import { FiHome, FiTrendingUp, FiCompass, FiMenu } from "react-icons/fi";

import { Link as ReactLink } from "react-router-dom";

import CustomModal from "../components/CustomModal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";
import SettingsIcon from "@mui/icons-material/Settings";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SchoolIcon from "@mui/icons-material/School";
import { useSelector } from "react-redux";

function SimpleSidebar({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.100", "gray.900")}>
      <SidebarContent
        onClose={() => onClose()}
        display={{ base: "none", md: "block" }}
      />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      <MobileNav display={{ base: "flex", md: "none" }} onOpen={onOpen} />
      <Box overflowX="hidden" h="100vh" ml={{ base: 0, md: 60 }} p="4">
        {children}
      </Box>
    </Box>
  );
}

function SidebarContent({ onClose, ...rest }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [courses, setCourses] = useState([]);
  const [text, setText] = useState("");
  const toast = useToast();
  const handleCourseAdd = async () => {
    try {
      console.log(state);
      const response = await createCourse(state.auth.user.user_id, text);
      if (response) {
        console.log(response);

        const updatedCourses = [...courses, response];
        setCourses(updatedCourses);

        // Close the modal
        setIsOpen(false);

        // Display a success toast
        toast({
          title: "Course Created.",
          description: `Successfully created ${text}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        console.error("Course could not be created on the backend");
      }
    } catch (error) {
      console.error("An error occurred while creating the course:", error);

      // Optionally, you could add an error toast here
      toast({
        title: "An error occurred.",
        description: "Unable to create the course.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const [localStorageValue, setLocalStorageValue] = useState(localStorage.getItem('access_token'));
  const state = useSelector((state) => state);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    const updateLocalStorage = () => {
      setLocalStorageValue(localStorage.getItem('access_token'));
    };

    // Listen to local storage changes
    window.addEventListener('storage', updateLocalStorage);

    // Cleanup
    return () => {
      window.removeEventListener('storage', updateLocalStorage);
    };
  }, []);

  useEffect(() => {
    const getCoursesData = async (id) => {
      try {
        const fetchedCourses = await fetchCourses(id);
        if (fetchedCourses) {
          setCourses(fetchedCourses);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    if (isAuthenticated) {
      getCoursesData(state.auth.user.user_id);
    } else {
      setCourses([]);
    }

  }, [isAuthenticated, localStorageValue, text]);

  return (
    <>
      <CustomModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={"Add Course"}
        onSubmit={handleCourseAdd}
        onClose={() => {}}
      >
        <FormLabel>Add Course</FormLabel>
        <Input
          placeholder="Course Name"
          onChange={(e) => setText(e.target.value)}
        />
      </CustomModal>
      <Box
        bg={useColorModeValue("white", "gray.900")}
        borderRight="1px"
        borderRightColor={useColorModeValue("gray.200", "gray.700")}
        w={{ base: "full", md: 60 }}
        pos="fixed"
        h="full"
        {...rest}
      >
        <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
          <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
            Edufy
          </Text>
          <CloseButton
            display={{ base: "flex", md: "none" }}
            onClick={onClose}
          />
        </Flex>
        <NavItem icon={FiHome} href="/">
          Home
        </NavItem>
        <NavItem icon={InfoIcon} href="/about">
          About
        </NavItem>
        <NavItem icon={SettingsIcon} href="/settings">
          Settings
        </NavItem>

        <NavItem
          icon={showCourses ? ChevronRightIcon : ExpandMoreIcon}
          href="#"
          onClick={() => setShowCourses(!showCourses)}
        >
          Courses
        </NavItem>

        <Box
          pos="relative"
          h="250px"
          overflowY="auto"
          css={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.5)",
              borderRadius: "4px",
            },
          }}
        >
          <Collapse in={showCourses}>
            {isAuthenticated ? (
              <Box position="relative">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <NavItem
                      key={course.name}
                      icon={SchoolIcon}
                      href={`courses/${course.id}`}
                      ml={8}
                    >
                      {course.name}
                    </NavItem>
                  ))
                ) : (
                  <Box
                    ml={8}
                    p={4}
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      color: "#FF5733",
                    }}
                  >
                    No courses...
                  </Box>
                )}
                <Flex
                  align="center"
                  p="4"
                  ml={8}
                  borderRadius="lg"
                  role="group"
                  cursor="pointer"
                >
                  <Button
                    title={"Add"}
                    onClick={() => {
                      setIsOpen(true);
                    }}
                    style={{
                      backgroundColor: "#3498db",
                      color: "white",
                      border: "2px solid #3498db",
                      width: "80%",
                      padding: "10px",
                      textAlign: "center",
                      textDecoration: "none",
                      display: "inline-block",
                      margin: "4px 2px",
                      cursor: "pointer",
                      borderRadius: "12px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = "white";
                      e.currentTarget.style.color = "#3498db";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = "#3498db";
                      e.currentTarget.style.color = "white";
                    }}
                  >
                    Add
                  </Button>
                </Flex>
              </Box>
            ) : (
              <Flex
                align="center"
                p="4"
                ml={8}
                borderRadius="lg"
                role="group"
                cursor="pointer"
              >
                <Button
                  as={ReactLink}
                  to="/authenticate"
                  title={"Login"}
                  style={{
                    backgroundColor: "#3498db",
                    color: "white",
                    border: "2px solid #3498db",
                    width: "80%",
                    padding: "10px",
                    textAlign: "center",
                    textDecoration: "none",
                    display: "inline-block",
                    margin: "4px 2px",
                    cursor: "pointer",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.color = "#3498db";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#3498db";
                    e.currentTarget.style.color = "white";
                  }}
                >
                  Login
                </Button>
              </Flex>
            )}
          </Collapse>
        </Box>
      </Box>
    </>
  );
}

SidebarContent.propTypes = {
  onClose: PropTypes.func.isRequired,
};

function NavItem({ icon, children, href, ...rest }) {
  return (
    <Link
      as={ReactLink}
      to={href}
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: "cyan.400",
          color: "white",
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: "white",
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
}

NavItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
};

function MobileNav({ onOpen, ...rest }) {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 24 }}
      height="20"
      alignItems="center"
      bg={useColorModeValue("white", "gray.900")}
      borderBottomWidth="1px"
      borderBottomColor={useColorModeValue("gray.200", "gray.700")}
      justifyContent="flex-start"
      {...rest}
    >
      <IconButton
        variant="outline"
        onClick={onOpen}
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text fontSize="2xl" ml="8" fontFamily="monospace" fontWeight="bold">
        Logo
      </Text>
    </Flex>
  );
}

MobileNav.propTypes = {
  onOpen: PropTypes.func.isRequired,
};

export default SimpleSidebar;
