import { Box, Stack, Text, Transition, Loader, ThemeIcon } from "@mantine/core";
import { TbCheck, TbExclamationMark, TbX } from "react-icons/tb";

/**
 * ProcessLoader Component
 *
 * Visualizes the state of an async process.
 *
 * @param {string} status - Current status: 'idle', 'starting', 'in-progress', 'complete', 'success', 'error'
 * @param {boolean} visible - Whether the loader is visible
 * @param {string} message - Optional custom message to display (overrides default)
 */
const ProcessLoader = ({ status = "idle", visible = false, message }) => {
  const getStatusConfig = (currentStatus) => {
    switch (currentStatus) {
      case "starting":
        return {
          icon: <Loader size={32} color="blue" type="dots" />,
          color: "blue",
          text: "Starting...",
        };
      case "in-progress":
        return {
          icon: <Loader size={48} color="blue" variant="bars" />,
          color: "blue",
          text: "Processing...",
        };
      case "complete":
        return {
          icon: <Loader size={32} color="green" type="oval" />,
          color: "green",
          text: "Finishing up...",
        };
      case "success":
        return {
          icon: (
            <ThemeIcon size={60} radius="xl" color="green" variant="light">
              <TbCheck size={32} />
            </ThemeIcon>
          ),
          color: "green",
          text: "Success!",
        };
      case "error":
        return {
          icon: (
            <ThemeIcon size={60} radius="xl" color="red" variant="light">
              <TbX size={32} />
            </ThemeIcon>
          ),
          color: "red",
          text: "Error encountered",
        };
      default:
        return {
          icon: <Loader size={32} />,
          color: "gray",
          text: "Loading...",
        };
    }
  };

  const config = getStatusConfig(status);
  const displayMessage = message || config.text;

  return (
    <Transition
      mounted={visible}
      transition="fade"
      duration={200}
      timingFunction="ease"
    >
      {(styles) => (
        <Box
          style={{
            ...styles,
            height: "100dvh",
            position: "absolute",
            inset: 0,
            zIndex: 100,
            backgroundColor: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack align="center" gap="md">
            <Box style={{ position: "relative" }}>{config.icon}</Box>
            <Text fw={600} size="lg" c={config.color}>
              {displayMessage}
            </Text>
          </Stack>
        </Box>
      )}
    </Transition>
  );
};

export default ProcessLoader;
