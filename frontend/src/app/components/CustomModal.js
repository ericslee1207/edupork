import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  ModalHeader,
  Box,
  Spinner,
  Flex,
  Button,
} from "@chakra-ui/react";
import React from "react";
import CustomButton from "./CustomButton";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

function CustomModal({
  isOpen,
  setIsOpen,
  title,
  children,
  onSubmit,
  onClose,
  disabled,
}) {
  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);
  const [loading, setLoading] = React.useState(false);

  const submit = async () => {
    setLoading(true);
    await onSubmit();
    setLoading(false);
  };

  return (
    <>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
      >
        <ModalOverlay />
        <ModalContent pointerEvents={loading ? "none" : ""}>
          {loading && (
            <Box
              position="absolute"
              top={0}
              right={0}
              bottom={0}
              left={0}
              backgroundColor="rgba(128, 128, 128, 0.5)"
              zIndex={998}
            >
              <Flex
                justifyContent="center"
                alignItems="center"
                height="100%"
                zIndex={999}
              >
                <Spinner
                  thickness="6px"
                  speed="0.65s"
                  emptyColor="gray.300"
                  color="red.500"
                  size="2xl"
                />
              </Flex>
            </Box>
          )}

          <ModalHeader>{title}</ModalHeader>
          <ModalBody pb={6}>
            <FormControl isDisabled={loading}>{children}</FormControl>
          </ModalBody>

          <ModalFooter>
            {!disabled && (
              <Button
                onClick={submit}
                colorScheme="green"
                leftIcon={<AddIcon />}
                mr='3'
              >
                Save
              </Button>
            )}
            <Button
              onClick={() => {
                setIsOpen(false);
                onClose();
              }}
              colorScheme="red"
              leftIcon={<CloseIcon />}
              disabled={loading}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default CustomModal;
