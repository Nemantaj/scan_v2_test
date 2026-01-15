import { Text, Group, Container, Paper } from "@mantine/core";
import { TbWifiOff, TbCloudUpload } from "react-icons/tb";
import { usePWA } from "../../contexts/PWAContext";

const OnlineStatus = () => {
  const { isOffline, pendingSyncCount } = usePWA();

  if (!isOffline) return null;

  return (
    <Container size="xs" px={0}>
      <Paper
        style={{
          position: "fixed",
          top: 72,
          left: 16,
          right: 16,
          zIndex: 9999,
          background: `rgba(239, 68, 68, 0.9)`,
          backdropFilter: "blur(0px) saturate(500%)",
          borderRadius: 12,
          padding: "12px 16px",
          boxShadow: ` 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -2px rgba(0, 0, 0, 0.1),
        inset 0 2px 4px rgba(0, 0, 0, 0.06),
        inset 0 -1px 2px rgba(255, 255, 255, 0.5)`,
        }}
      >
        <Group justify="center" gap={8}>
          <TbWifiOff size={18} />
          <Text size="sm" fw={500}>
            You're offline
          </Text>
          {pendingSyncCount > 0 && (
            <>
              <Text size="sm" opacity={0.7}>
                •
              </Text>
              <Group gap={4}>
                <TbCloudUpload size={16} opacity={0.9} />
                <Text size="sm" opacity={0.9}>
                  {pendingSyncCount} pending
                </Text>
              </Group>
            </>
          )}
        </Group>
      </Paper>
    </Container>
  );
};

export default OnlineStatus;
