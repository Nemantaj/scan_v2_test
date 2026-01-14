import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Popover,
  Stack,
  UnstyledButton,
  Group,
  Text,
  ThemeIcon,
  Box,
  Paper,
} from "@mantine/core";
import {
  TbMenu2,
  TbX,
  TbLayoutDashboard,
  TbUsers,
  TbUserPlus,
  TbPlus,
  TbSearch,
  TbChevronRight,
  TbBox,
} from "react-icons/tb";
import NavButton from "./menu";
import FloatingDrawer from "../../common/drawers/floating";

// Default menu items
const DEFAULT_MENU_ITEMS = [
  {
    type: "divider",
    label: "Manage Data",
  },
  {
    label: "Entry Dashboard",
    description: "View all entries",
    icon: TbLayoutDashboard,
    link: "/models",
    color: "violet",
  },
  {
    label: "Customers",
    description: "Manage customers",
    icon: TbUsers,
    link: "/customers",
    color: "blue",
  },
  {
    type: "divider",
    label: "Quick Actions",
  },
  {
    label: "Add Customer",
    icon: TbUserPlus,
    link: "/customers/new",
    color: "green",
  },
  {
    label: "New Entry",
    icon: TbPlus,
    link: "/create",
    color: "orange",
  },
  {
    type: "divider",
    label: "Tools",
  },
  {
    label: "Show by IMEI",
    description: "Find by serial number",
    icon: TbSearch,
    link: "/imei",
    color: "pink",
  },
];

const MenuDivider = ({ label }) => (
  <Box pt={12} pb={4} px={12}>
    <Text size="xs" fw={600} c="gray.4" tt="uppercase" lh={1}>
      {label || ""}
    </Text>
  </Box>
);

const MenuItem = ({ item, onClose, isFirst, isLast }) => {
  if (item.type === "divider") {
    return <MenuDivider label={item.label} />;
  }

  const Icon = item.icon;

  return (
    <UnstyledButton
      component={item.link ? Link : "button"}
      to={item.link}
      onClick={() => {
        item.onClick?.();
        onClose();
      }}
      py={8}
      px={12}
      style={{
        borderRadius: 12,
        transition: "all 0.15s ease",
      }}
      className="hover:bg-gray-100 active:scale-[0.98]"
    >
      <Group gap={12} wrap="nowrap">
        <ThemeIcon
          size={40}
          variant="default"
          color={item.color || "gray"}
          radius="xl"
        >
          <Icon size={20} />
        </ThemeIcon>
        <Stack gap={1} style={{ flex: 1 }}>
          <Text
            size="sm"
            fw={500}
            c="#fff"
            style={{ letterSpacing: "-0.01em" }}
          >
            {item.label}
          </Text>
          {item.description && (
            <Text size="xs" c="gray.3" lh={1.3}>
              {item.description}
            </Text>
          )}
        </Stack>
        <Box
          style={{
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 40,
            backgroundColor: "var(--mantine-color-gray-7)",
          }}
        >
          <TbChevronRight size={14} className="text-gray-100" />
        </Box>
      </Group>
    </UnstyledButton>
  );
};

const NavMenu = ({
  items = DEFAULT_MENU_ITEMS,
  title,
  buttonIcon: ButtonIcon = TbMenu2,
  buttonVariant = "glass",
  buttonTint = "none",
  buttonSize = "lg",
  position = "bottom",
  width = 280,
}) => {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <NavButton
        icon={opened ? TbX : ButtonIcon}
        variant={opened ? "solid" : buttonVariant}
        tint={opened ? "dark" : buttonTint}
        size={buttonSize}
        onClick={() => setOpened((o) => !o)}
        className="transition-all duration-300 transform active:scale-95"
      />
      <FloatingDrawer
        variant="solid"
        tint="green"
        tintOpacity={0.9}
        isOpen={opened}
        onClose={() => setOpened(false)}
      >
        <Stack w="100%" gap={2}>
          {items.map((item, index) => (
            <MenuItem
              key={item.label || `divider-${index}`}
              item={item}
              onClose={() => setOpened(false)}
              isFirst={index === 0}
              isLast={index === items.length - 1}
            />
          ))}
        </Stack>
      </FloatingDrawer>
    </>
  );
};

export default NavMenu;
