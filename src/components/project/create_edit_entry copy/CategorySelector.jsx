import { memo } from "react";
import {
  Box,
  Group,
  Stack,
  Text,
  UnstyledButton,
  ScrollArea,
} from "@mantine/core";
import {
  TbDeviceMobile,
  TbDeviceTablet,
  TbDeviceWatch,
  TbHeadphones,
  TbDeviceMobileCode,
  TbPackage,
} from "react-icons/tb";

// Category configuration with gradient colors
const CATEGORIES = [
  {
    value: "iPhone",
    label: "iPhone",
    icon: TbDeviceMobile,
    from: "#8B5CF6",
    to: "#A78BFA",
  },
  {
    value: "iPad",
    label: "iPad",
    icon: TbDeviceTablet,
    from: "#3B82F6",
    to: "#60A5FA",
  },
  {
    value: "iWatch",
    label: "iWatch",
    icon: TbDeviceWatch,
    from: "#EC4899",
    to: "#F472B6",
  },
  {
    value: "Airpods",
    label: "AirPods",
    icon: TbHeadphones,
    from: "#14B8A6",
    to: "#2DD4BF",
  },
  {
    value: "Android",
    label: "Android",
    icon: TbDeviceMobileCode,
    from: "#22C55E",
    to: "#4ADE80",
  },
  {
    value: "Other",
    label: "Other",
    icon: TbPackage,
    from: "#6B7280",
    to: "#9CA3AF",
  },
];

const CategoryCard = memo(({ category, isSelected, onSelect }) => {
  const Icon = category.icon;

  return (
    <UnstyledButton
      onClick={() => onSelect(category.value)}
      py={10}
      px={14}
      style={{
        borderRadius: 14,
        background: isSelected
          ? `linear-gradient(135deg, ${category.from}, ${category.to})`
          : "white",
        border: isSelected ? "none" : "1.5px solid var(--mantine-color-gray-2)",
        // boxShadow: isSelected
        //   ? `0 4px 12px ${category.from}40`
        //   : "0 1px 3px rgba(0,0,0,0.04)",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        minWidth: 76,
        flexShrink: 0,
      }}
      className="active:scale-95"
    >
      <Stack gap={8} align="center">
        <Box
          w={36}
          h={36}
          style={{
            borderRadius: 10,
            backgroundColor: isSelected
              ? "rgba(255,255,255,0.25)"
              : "var(--mantine-color-gray-0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.25s ease",
          }}
        >
          <Icon
            size={20}
            style={{
              color: isSelected ? "white" : category.from,
              transition: "color 0.2s ease",
            }}
          />
        </Box>
        <Text
          size="xs"
          fw={600}
          c={isSelected ? "white" : "gray.7"}
          ta="center"
          lh={1.2}
        >
          {category.label}
        </Text>
      </Stack>
    </UnstyledButton>
  );
});

CategoryCard.displayName = "CategoryCard";

const CategorySelector = memo(({ value, onChange, error }) => {
  return (
    <Box pt={16} pb={8}>
      <Text px={20} size="sm" mb={10} fw={500} c={error ? "red.6" : "gray.7"}>
        Choose a Category {error && "*"}
      </Text>

      <ScrollArea scrollbarSize={0} type="scroll" offsetScrollbars={false}>
        <Group gap={8} wrap="nowrap" px={20} pb={4}>
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.value}
              category={cat}
              isSelected={value === cat.value}
              onSelect={onChange}
            />
          ))}
        </Group>
      </ScrollArea>
    </Box>
  );
});

CategorySelector.displayName = "CategorySelector";

export default CategorySelector;
