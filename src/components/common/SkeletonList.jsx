import React from "react";
import { Stack, Box } from "@mantine/core";

const SkeletonList = ({ count = 5, component: Component, gap = "md" }) => {
  return (
    <Stack gap={gap}>
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} w="100%">
          {Component ? <Component /> : <Box h={100} bg="gray.1" />}
        </Box>
      ))}
    </Stack>
  );
};

export default SkeletonList;
