import { Link } from "react-router-dom";
import { Button, Loader } from "@mantine/core";

// Color tint configurations
const TINTS = {
  none: { bg: "255, 255, 255", textColor: "#1a1a1a" },
  red: { bg: "239, 68, 68", textColor: "#fff" },
  orange: { bg: "249, 115, 22", textColor: "#fff" },
  yellow: { bg: "234, 179, 8", textColor: "#1a1a1a" },
  green: { bg: "37, 222, 174", textColor: "#1a1a1a" },
  teal: { bg: "20, 184, 166", textColor: "#fff" },
  blue: { bg: "59, 130, 246", textColor: "#fff" },
  indigo: { bg: "99, 102, 241", textColor: "#fff" },
  violet: { bg: "139, 92, 246", textColor: "#fff" },
  pink: { bg: "236, 72, 153", textColor: "#fff" },
  dark: { bg: "30, 30, 30", textColor: "#fff" },
};

// Variant configurations
const VARIANTS = {
  glass: (tint = "none", opacity = 0.5) => ({
    background: `rgba(${TINTS[tint]?.bg || TINTS.none.bg}, ${opacity})`,
    backdropFilter: "blur(0px) saturate(180%)",
    WebkitBackdropFilter: "blur(10px) saturate(180%)",
    color: TINTS[tint]?.textColor || "#1a1a1a",
  }),
  solid: (tint = "none") => ({
    background: `rgba(${TINTS[tint]?.bg || TINTS.none.bg}, 1)`,
    backdropFilter: "none",
    color: TINTS[tint]?.textColor || "#1a1a1a",
  }),
  gradient: (tint = "violet") => ({
    background:
      tint === "violet"
        ? "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)"
        : tint === "blue"
        ? "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)"
        : tint === "green"
        ? "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)"
        : tint === "orange"
        ? "linear-gradient(135deg, #f97316 0%, #ef4444 100%)"
        : "linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)",
    backdropFilter: "none",
    color: "#fff",
  }),
};

// Size configurations
const SIZES = {
  xs: { height: 28, fontSize: "xs", px: 12 },
  sm: { height: 32, fontSize: "sm", px: 14 },
  md: { height: 40, fontSize: "sm", px: 18 },
  lg: { height: 48, fontSize: "md", px: 24 },
  xl: { height: 56, fontSize: "lg", px: 32 },
};

const StyledButton = ({
  children,
  link,
  onClick,
  leftSection,
  rightSection,
  variant = "glass",
  tint = "none",
  tintOpacity = 0.9,
  size = "md",
  disabled = false,
  loading = false,
  fullWidth = false,
  className = "",
  shadow = true,
  radius = "xl",
  type = "button",
}) => {
  // Get variant config
  const variantConfig =
    variant === "glass"
      ? VARIANTS.glass(tint, tintOpacity)
      : variant === "gradient"
      ? VARIANTS.gradient(tint)
      : VARIANTS.solid(tint);

  const sizeConfig = SIZES[size] || SIZES.md;

  const boxShadow = shadow
    ? `
        0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -2px rgba(0, 0, 0, 0.1),
        inset 0 1px 2px rgba(255, 255, 255, 0.25)
      `
    : "none";

  // Determine button props based on whether it's a link or button
  const buttonProps = link ? { component: Link, to: link } : { onClick, type };

  return (
    <Button
      bd="1px solid #dee2e6"
      h={sizeConfig.height}
      px={sizeConfig.px}
      fz={sizeConfig.fontSize}
      fw={600}
      variant="unstyled"
      radius={radius}
      disabled={disabled || loading}
      fullWidth={fullWidth}
      leftSection={
        loading ? <Loader size={14} color={variantConfig.color} /> : leftSection
      }
      rightSection={rightSection}
      className={`hover:scale-[1.02] active:scale-[0.98] transition-transform ${className}`}
      style={{
        background: variantConfig.background,
        backdropFilter: variantConfig.backdropFilter,
        WebkitBackdropFilter: variantConfig.WebkitBackdropFilter,
        color: variantConfig.color,
        boxShadow,
        border: "none",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
      }}
      {...buttonProps}
    >
      {children}
    </Button>
  );
};

export default StyledButton;
