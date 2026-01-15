import { Box, Group, Text } from "@mantine/core";
import { TbScan } from "react-icons/tb";

// Dynamic color thresholds
const getColorConfig = (count) => {
  if (count === 0) {
    return {
      bg: "#f3f4f6",
      text: "#6b7280",
      icon: "#9ca3af",
    };
  }
  if (count <= 5) {
    return {
      bg: "#dbeafe",
      text: "#1d4ed8",
      icon: "#3b82f6",
    };
  }
  if (count <= 15) {
    return {
      bg: "#dcfce7",
      text: "#15803d",
      icon: "#22c55e",
    };
  }
  if (count <= 30) {
    return {
      bg: "#fef3c7",
      text: "#b45309",
      icon: "#f59e0b",
    };
  }
  // High volume (> 30)
  return {
    bg: "#fce7f3",
    text: "#be185d",
    icon: "#ec4899",
  };
};

const ScanBadge = ({ count = 0, showIcon = true, size = "md" }) => {
  const colors = getColorConfig(count);

  const sizeConfig = {
    sm: { px: 8, py: 2, fontSize: "xs", iconSize: 12, gap: 4 },
    md: { px: 10, py: 4, fontSize: "sm", iconSize: 14, gap: 5 },
    lg: { px: 12, py: 6, fontSize: "md", iconSize: 16, gap: 6 },
  };

  const config = sizeConfig[size] || sizeConfig.md;

  return (
    <Box
      bd={`1px solid #dee2e6`}
      px={config.px}
      py={config.py}
      style={{
        borderRadius: 20,
        backgroundColor: colors.bg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.2s ease",
      }}
    >
      <Group gap={config.gap} wrap="nowrap">
        {showIcon && (
          <TbScan
            size={config.iconSize}
            style={{ color: colors.icon, flexShrink: 0 }}
          />
        )}
        <Text
          // size={config.fontSize}
          fw={600}
          lh={1}
          style={{
            color: colors.text,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {count}
        </Text>
      </Group>
    </Box>
  );
};

export default ScanBadge;
