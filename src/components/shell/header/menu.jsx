import { Link } from "react-router-dom";
import { ActionIcon, Paper } from "@mantine/core";
import { TbMenu } from "react-icons/tb";

// Color tint configurations (for glass variant)
const TINTS = {
  none: { bg: "255, 255, 255", iconColor: "dark" },
  red: { bg: "239, 68, 68", iconColor: "red.7" },
  orange: { bg: "249, 115, 22", iconColor: "orange.7" },
  yellow: { bg: "234, 179, 8", iconColor: "yellow.7" },
  green: { bg: "37, 222, 174", iconColor: "green.7" },
  teal: { bg: "20, 184, 166", iconColor: "teal.7" },
  blue: { bg: "59, 130, 246", iconColor: "blue.7" },
  indigo: { bg: "99, 102, 241", iconColor: "indigo.7" },
  violet: { bg: "139, 92, 246", iconColor: "violet.7" },
  pink: { bg: "236, 72, 153", iconColor: "pink.7" },
  dark: { bg: "0, 0, 0", iconColor: "white" },
};

// Variant configurations
const VARIANTS = {
  glass: (tint = "none", opacity = 0.5) => ({
    background: `rgba(${TINTS[tint]?.bg || TINTS.none.bg}, ${opacity})`,
    backdropFilter: "blur(0px) saturate(500%)",
    color: TINTS[tint]?.iconColor || "dark",
  }),
  solid: {
    background: "#ffffff",
    backdropFilter: "none",
    color: "dark",
  },
};

// Size configurations
const SIZES = {
  sm: { button: "md", icon: "1rem" },
  md: { button: "lg", icon: "1.25rem" },
  lg: { button: "xl", icon: "1.25rem" },
  xl: { button: 48, icon: "1.75rem" },
};

const NavButton = ({
  link,
  onClick,
  icon: Icon = TbMenu,
  variant = "glass",
  tint = "none",
  tintOpacity = 0.95,
  size = "lg",
  disabled = false,
  className = "",
  shadow = true,
  iconColor,
}) => {
  // Get variant config
  const variantConfig =
    variant === "glass"
      ? VARIANTS.glass(tint, tintOpacity)
      : VARIANTS[variant] || VARIANTS.glass("none");

  const sizeConfig = SIZES[size] || SIZES.lg;

  const baseBoxShadow = shadow
    ? `
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -2px rgba(0, 0, 0, 0.1),
        inset 0 2px 4px rgba(0, 0, 0, 0.06),
        inset 0 -1px 2px rgba(255, 255, 255, 0.5)
      `
    : "none";

  // Determine button props based on whether it's a link or button
  const buttonProps = link ? { component: Link, to: link } : { onClick };

  // Allow override of icon color
  const finalIconColor = iconColor || variantConfig.color;

  return (
    <Paper
      shadow={shadow ? "md" : "none"}
      style={{
        background: variantConfig.background,
        backdropFilter: variantConfig.backdropFilter,
        boxShadow: baseBoxShadow,
        opacity: disabled ? 0.5 : 1,
        pointerEvents: disabled ? "none" : "auto",
        transition: "all 0.2s ease",
      }}
      radius="xl"
      className={className}
    >
      <ActionIcon
        size={sizeConfig.button}
        variant="transparent"
        color={finalIconColor}
        radius="xl"
        disabled={disabled}
        {...buttonProps}
      >
        <Icon size={sizeConfig.icon} />
      </ActionIcon>
    </Paper>
  );
};

export default NavButton;
