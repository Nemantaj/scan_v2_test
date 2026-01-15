import {
  Box,
  Group,
  Skeleton,
  Stack,
  Divider,
  Paper,
  Container,
} from "@mantine/core";
import { TbChevronDown } from "react-icons/tb";

const ProductItemSkeleton = () => (
  <Box
    py={20}
    px={16}
    style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
  >
    <Group justify="space-between" wrap="nowrap" gap="md" pr={8}>
      <Group gap={12} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
        {/* Gradient accent mimic */}
        <Skeleton w={4} h={40} radius={3} style={{ flexShrink: 0 }} />
        <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
          <Skeleton h={20} w="40%" radius="sm" />
          <Skeleton h={14} w="25%" radius="sm" />
        </Stack>
      </Group>
      <Group gap={8} wrap="nowrap">
        <Skeleton h={26} w={60} radius="xl" />
        <Skeleton h={32} w={32} radius="md" />
        <Box
          w={24}
          h={24}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Skeleton h={16} w={16} radius="sm" />
        </Box>
      </Group>
    </Group>
  </Box>
);

const HeaderSkeleton = () => (
  <Box style={{ position: "relative", overflow: "hidden" }}>
    {/* Mesh gradient background - Same as SectionHeader */}
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
      <Box h={72} /> {/* Space for pt={72} */}
      <Stack align="center" gap="xs">
        <Skeleton h={32} w="60%" radius="md" />
        <Skeleton h={20} w="40%" radius="sm" />
      </Stack>
    </Container>
    <Divider />
  </Box>
);

const EntryDetailsSkeleton = () => {
  return (
    <Box>
      <HeaderSkeleton />
      <Box>
        {/* Mimic Accordion Wrapper */}
        <Box bg="white">
          {Array.from({ length: 5 }).map((_, i) => (
            <ProductItemSkeleton key={i} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default EntryDetailsSkeleton;
