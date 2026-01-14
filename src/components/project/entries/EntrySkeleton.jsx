import { Box, Group, Paper, Skeleton, Stack, Divider } from "@mantine/core";

// Single skeleton item matching EntryItem layout
const EntrySkeletonItem = () => (
  <Box w="100%" bg="white" py={16} px={20}>
    {/* Header */}
    <Group justify="space-between" wrap="nowrap" gap="md" mb={10}>
      <Group gap={10} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        {/* Gradient accent skeleton */}
        <Skeleton w={4} h={44} radius={2} style={{ flexShrink: 0 }} />
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Skeleton h={18} w="60%" radius="sm" />
          <Skeleton h={14} w="45%" radius="sm" />
        </Stack>
      </Group>
      {/* Badge skeleton */}
      <Skeleton h={32} w={48} radius="md" />
    </Group>

    {/* Products List skeleton */}
    <Paper
      p={4}
      radius={12}
      style={{
        backgroundColor: "rgba(139, 92, 246, 0.08)",
      }}
      withBorder
    >
      <Stack gap={2}>
        <Box bg="white" py={8} px={10} style={{ borderRadius: 10 }}>
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={4} style={{ flex: 1 }}>
              <Skeleton h={16} w="50%" radius="sm" />
              <Skeleton h={12} w="30%" radius="sm" />
            </Stack>
            <Skeleton h={16} w={24} radius="sm" />
          </Group>
        </Box>
        <Box bg="white" py={8} px={10} style={{ borderRadius: 10 }}>
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={4} style={{ flex: 1 }}>
              <Skeleton h={16} w="55%" radius="sm" />
              <Skeleton h={12} w="25%" radius="sm" />
            </Stack>
            <Skeleton h={16} w={24} radius="sm" />
          </Group>
        </Box>
      </Stack>
    </Paper>
  </Box>
);

// Header skeleton matching SectionHeader
const HeaderSkeleton = () => (
  <Box px={16} py={24}>
    <Box h={72} /> {/* Space for shell header */}
    <Skeleton h={28} w="45%" radius="sm" mb={8} mx="auto" />
    <Skeleton h={16} w="65%" radius="sm" mx="auto" />
  </Box>
);

// Full loading skeleton with header and items
const EntrySkeleton = ({ count = 5 }) => (
  <Stack gap={0}>
    <HeaderSkeleton />
    <Divider />
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index}>
        {index !== 0 && <Divider variant="dashed" size="sm" />}
        <EntrySkeletonItem />
      </Box>
    ))}
  </Stack>
);

export default EntrySkeleton;
