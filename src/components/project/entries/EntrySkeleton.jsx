import { Box, Group, Skeleton, Stack, Divider, Container } from "@mantine/core";

// Product row skeleton matching ProductCard layout
const ProductCardSkeleton = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      flexWrap: "nowrap",
      gap: 8,
    }}
  >
    <Skeleton h={14} w="35%" radius="sm" />
    <Skeleton h={14} w="20%" radius="sm" />
    <Skeleton h={14} w={24} radius="sm" style={{ flexShrink: 0 }} />
  </div>
);

// Single skeleton item matching EntryItem layout
const EntrySkeletonItem = () => (
  <Box
    bg="white"
    style={{
      padding: "16px 20px",
      width: "100%",
    }}
  >
    <Group wrap="nowrap" gap={12}>
      {/* Gradient accent skeleton */}
      <Skeleton
        w={4}
        style={{
          alignSelf: "stretch",
          minHeight: 60,
          borderRadius: 2,
          flexShrink: 0,
        }}
      />
      <Box w="100%">
        {/* Header row */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: 16,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Name */}
              <Skeleton h={18} w="55%" radius="sm" mb={4} />
              {/* Date • products */}
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Skeleton h={12} w={70} radius="sm" />
                <Skeleton h={12} w={60} radius="sm" />
              </div>
            </div>
          </div>
          {/* ScanBadge skeleton */}
          <Skeleton h={28} w={56} radius="xl" />
        </div>

        {/* Products List */}
        <Stack gap={4}>
          <ProductCardSkeleton />
          <ProductCardSkeleton />
        </Stack>
      </Box>
    </Group>
  </Box>
);

// Header skeleton matching SectionHeader with mesh gradient
const HeaderSkeleton = () => (
  <Box style={{ position: "relative", overflow: "hidden" }}>
    {/* Mesh gradient background */}
    <Box
      style={{
        position: "absolute",
        inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 15% 30%, rgba(251, 146, 60, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 70% 50% at 85% 25%, rgba(250, 204, 21, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse 60% 70% at 70% 85%, rgba(6, 182, 212, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse 50% 40% at 25% 80%, rgba(244, 114, 182, 0.10) 0%, transparent 50%),
          radial-gradient(ellipse 40% 35% at 50% 10%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)
        `,
        pointerEvents: "none",
      }}
    />
    <Container px={16} py={24} size="xs" style={{ position: "relative" }}>
      <Box h={72} /> {/* Space for shell header */}
      <Stack align="center" gap="xs">
        <Skeleton h={28} w="50%" radius="md" />
        <Skeleton h={16} w="65%" radius="sm" />
      </Stack>
    </Container>
  </Box>
);

// Full loading skeleton with header and items
const EntrySkeleton = ({ count = 5 }) => (
  <Stack gap={0}>
    <HeaderSkeleton />
    <Divider />
    {Array.from({ length: count }).map((_, index) => (
      <Box key={index}>
        {index !== 0 && <Divider />}
        <EntrySkeletonItem />
      </Box>
    ))}
  </Stack>
);

export default EntrySkeleton;
