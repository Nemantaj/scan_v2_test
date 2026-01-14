import { Box, Container } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";

// Color tint configurations (for glass variant)
const TINTS = {
  none: { bg: "255, 255, 255", border: "255, 255, 255" },
  red: { bg: "239, 68, 68", border: "239, 68, 68" },
  orange: { bg: "249, 115, 22", border: "249, 115, 22" },
  yellow: { bg: "234, 179, 8", border: "234, 179, 8" },
  green: { bg: "5, 34, 22", border: "255, 255, 255" },
  teal: { bg: "20, 184, 166", border: "20, 184, 166" },
  blue: { bg: "59, 130, 246", border: "59, 130, 246" },
  indigo: { bg: "99, 102, 241", border: "99, 102, 241" },
  violet: { bg: "139, 92, 246", border: "139, 92, 246" },
  pink: { bg: "236, 72, 153", border: "236, 72, 153" },
  dark: { bg: "0, 0, 0", border: "255, 255, 255" },
};

// Variant configurations
const VARIANTS = {
  glass: (tint = "none", opacity = 0.9) => ({
    background: `rgba(${TINTS[tint]?.bg || TINTS.none.bg}, ${opacity})`,
    backdropFilter: "blur(10px) saturate(180%)",
    WebkitBackdropFilter: "blur(10px) saturate(180%)",
    border: `1px solid rgba(${TINTS[tint]?.border || TINTS.none.border}, 0.15)`,
  }),
  solid: (tint = "dark") => ({
    background: `rgb(${TINTS[tint]?.bg || TINTS.dark.bg})`,
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
    border: `1px solid rgba(${TINTS[tint]?.border || TINTS.dark.border}, 0.1)`,
  }),
};

// Size configurations
const SIZES = {
  sm: { padding: "12px 8px", gap: "8px", radius: "16px" },
  md: { padding: "16px 12px", gap: "12px", radius: "20px" },
  lg: { padding: "24px 16px", gap: "16px", radius: "24px" },
  xl: { padding: "32px 20px", gap: "20px", radius: "32px" },
};

// Container size configurations
const CONTAINER_SIZES = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
};

// Optimized animation variants
const containerVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -5 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      staggerChildren: 0.03,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

const FloatingDrawer = ({
  isOpen,
  onClose,
  children,
  variant = "solid",
  tint = "green",
  tintOpacity = 0.9,
  size = "lg",
  containerSize = "xs",
  shadow = true,
  className = "",
  style = {},
}) => {
  // Get variant config
  const variantConfig =
    variant === "glass"
      ? VARIANTS.glass(tint, tintOpacity)
      : VARIANTS[variant]?.(tint) || VARIANTS.solid(tint);

  const sizeConfig = SIZES[size] || SIZES.lg;

  const baseBoxShadow = shadow
    ? `
        0 25px 50px -12px rgba(0, 0, 0, 0.25),
        0 10px 20px -5px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.05)
      `
    : "none";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            <Box
              onClick={onClose}
              className="fixed inset-0 z-40 bg-transparent"
            />
            <motion.div
              style={{
                minWidth: "100dvw",
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                zIndex: 50,
              }}
            >
              <Container w="100%" size={CONTAINER_SIZES[containerSize] || "xs"}>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full"
                  // style={{ willChange: "opacity, transform" }}
                >
                  <Box
                    className={`overflow-hidden ${className}`}
                    style={{
                      background: variantConfig.background,
                      backdropFilter: variantConfig.backdropFilter,
                      WebkitBackdropFilter: variantConfig.WebkitBackdropFilter,
                      border: variantConfig.border,
                      borderRadius: sizeConfig.radius,
                      padding: sizeConfig.padding,
                      boxShadow: baseBoxShadow,
                      //   display: "grid",
                      //   gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                      //   gap: gap || sizeConfig.gap,
                      ...style,
                      // willChange: "opacity, transform",
                    }}
                  >
                    {children}
                  </Box>
                </motion.div>
              </Container>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingDrawer;
