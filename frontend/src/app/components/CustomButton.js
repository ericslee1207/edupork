import React from "react";
import { Button, Flex, Stack } from "@chakra-ui/react";

function CustomButton(...props) {
  return (
    <Stack direction="row" spacing={4}>
      <Button
        onClick={props.onClick}
        colorScheme={props.color ? props.color : "teal"}
        variant="solid"
        align={'center'}
        disabled={props.disabled}
      >
        <Flex alignItems="center" justifyContent="center">
          {props.icon && <Flex as={props.icon} marginRight="4px" />}
          {props.title}
        </Flex>
      </Button>
    </Stack>
  );
}

export default CustomButton;
