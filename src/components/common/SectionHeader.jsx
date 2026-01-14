import { Box, Container, Space, Text, Title } from "@mantine/core";

const SectionHeader = ({ title = "", subtitle = "", pt = 0 }) => {
  return (
    <Box
      style={{
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Mesh gradient background - Summer palette */}
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
        <Space h={pt} />
        <Title ta="center" ff="Google Sans Flex" order={2}>
          {title}
        </Title>
        <Text ta="center" size="sm" c="gray.7">
          {subtitle}
        </Text>
      </Container>
    </Box>
  );
};

export default SectionHeader;
