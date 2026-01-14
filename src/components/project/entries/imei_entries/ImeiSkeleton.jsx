import { Box, Group, Skeleton, Stack, Divider } from "@mantine/core";

// Single skeleton item matching ImeiItem layout
const ImeiSkeletonItem = () => (
  <Box w="100%" bg="white" py={14} px={20}>
    <Group justify="space-between" wrap="nowrap" gap="md">
      <Group gap={12} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        {/* Gradient accent skeleton */}
        <Skeleton w={4} h={56} radius={3} style={{ flexShrink: 0 }} />
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Skeleton h={18} w="55%" radius="sm" />
          <Skeleton h={14} w="45%" radius="sm" />
          <Skeleton h={14} w="50%" radius="sm" mt={2} />
        </Stack>
      </Group>
      {/* Print button skeleton */}
      <Skeleton h={36} w={36} radius="md" />
    </Group>
  </Box>
);

// Header skeleton matching SectionHeader
const HeaderSkeleton = () => (
  <Box px={16} py={24}>
    <Box h={72} />
    <Skeleton h={28} w="40%" radius="sm" mb={8} mx="auto" />
    <Skeleton h={16} w="60%" radius="sm" mx="auto" />
  </Box>
);

// Full loading skeleton with header and items
const ImeiSkeleton = ({ count = 8 }) => (
  <Stack gap={0}>
    <HeaderSkeleton />
    <Divider />
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index}>
        {index !== 0 && <Divider variant="dashed" size="sm" />}
        <ImeiSkeletonItem />
      </Box>
    ))}
  </Stack>
);

export default ImeiSkeleton;
