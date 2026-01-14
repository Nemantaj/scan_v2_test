import { Box, Group, Stack, Text, ActionIcon } from "@mantine/core";
import { TbTrash, TbMapPin } from "react-icons/tb";

const CustomerItem = ({ item, onDeleteClick }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteClick?.(item);
  };

  return (
    <Box bg="white" py={14} px={20}>
      <Group justify="space-between" wrap="nowrap" gap="md">
        <Group gap={12} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
          {/* Gradient accent */}
          <Box
            w={4}
            style={{
              alignSelf: "stretch",
              minHeight: 36,
              borderRadius: 3,
              background: "linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)",
              flexShrink: 0,
            }}
          />
          <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
            <Text fw={600} c="dark.8" truncate="end">
              {item.fullName}
            </Text>
            <Group gap={4} wrap="nowrap">
              <TbMapPin size={14} color="var(--mantine-color-red-7)" />
              <Text size="sm" c="gray.7" truncate="end">
                {item.city}
              </Text>
            </Group>
          </Stack>
        </Group>

        <ActionIcon
          variant="subtle"
          color="red"
          size="lg"
          radius="xl"
          onClick={handleDelete}
        >
          <TbTrash size={20} />
        </ActionIcon>
      </Group>
    </Box>
  );
};

export default CustomerItem;
