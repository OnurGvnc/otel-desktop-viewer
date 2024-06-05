import React from "react";
import { Flex, Text } from "@chakra-ui/react";

type HeaderProps = {
  traceID: string;
};

export function Header(props: HeaderProps) {
  return (
    <Flex
      data-testid="header"
      align="center"
      height="30px"
      paddingX="6px"
    >
      <Text
        fontSize="lg"
        noOfLines={1}
      >
        {"Trace ID: "}
        <strong>{props.traceID}</strong>
      </Text>
    </Flex>
  );
}
