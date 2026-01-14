import React from "react";
import { Center, Stack, Text, ThemeIcon, Button, rem } from "@mantine/core";
import { TbDatabaseOff } from "react-icons/tb";

const EmptyList = ({
  icon: Icon = TbDatabaseOff,
  message = "No records found",
  description = "It looks like there is nothing here yet.",
  actionLabel,
  onAction,
  height = 300,
}) => {
  return (
    <Center h={height} w="100%">
      <Stack align="center" gap={0}>
        <ThemeIcon variant="default" size={80} radius="50%">
          <Icon style={{ width: rem(40), height: rem(40) }} />
        </ThemeIcon>
        <Text mt="md" size="lg" fw={600} ta="center">
          {message}
        </Text>
        <Text size="sm" c="gray.7" ta="center" maw={300}>
          {description}
        </Text>
        {/* {actionLabel && onAction && (
          <Button
            mt="md"
            variant="light"
            onClick={onAction}
            size="xs"
            radius="md"
          >
            {actionLabel}
          </Button>
        )} */}
      </Stack>
    </Center>
  );
};

export default EmptyList;
