import { Box, Group, Skeleton, Stack, Divider } from "@mantine/core";

// Single skeleton item matching CustomerItem layout
const CustomerSkeletonItem = () => (
  <Box w="100%" bg="white" py={14} px={20}>
    <Group justify="space-between" wrap="nowrap" gap="md">
      <Group gap={12} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        {/* Gradient accent skeleton */}
        <Skeleton w={4} h={36} radius={3} style={{ flexShrink: 0 }} />
        <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
          <Skeleton h={18} w="55%" radius="sm" />
          <Skeleton h={14} w="35%" radius="sm" />
        </Stack>
      </Group>
      {/* Delete button skeleton */}
      <Skeleton h={36} w={36} radius="xl" />
    </Group>
  </Box>
);

// Header skeleton matching SectionHeader
const HeaderSkeleton = () => (
  <Box px={16} py={24}>
    <Box h={72} />
    <Skeleton h={28} w="40%" radius="sm" mb={8} mx="auto" />
    <Skeleton h={16} w="55%" radius="sm" mx="auto" />
  </Box>
);

// Full loading skeleton with header and items
const CustomerSkeleton = ({ count = 8 }) => (
  <Stack gap={0}>
    <HeaderSkeleton />
    <Divider />
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index}>
        {index !== 0 && <Divider variant="dashed" size="sm" />}
        <CustomerSkeletonItem />
      </Box>
    ))}
  </Stack>
);

export default CustomerSkeleton;
