import { useState } from "react";
import {
  Text,
  Group,
  CloseButton,
  Button,
  Container,
  Paper,
} from "@mantine/core";
import { TbDownload } from "react-icons/tb";
import { usePWA } from "../../contexts/PWAContext";

const InstallPrompt = () => {
  const { canInstall, installApp } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Check localStorage for dismissal
  if (dismissed || !canInstall) return null;

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await installApp();
    if (!success) {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    // Remember dismissal for this session
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  // Check if already dismissed this session
  if (sessionStorage.getItem("pwa-install-dismissed")) return null;

  return (
    <Container size="xs" px={0}>
      <Paper
        shadow="sm"
        style={{
          position: "fixed",
          bottom: 80,
          left: 16,
          right: 16,
          zIndex: 9997,
          background: `rgba(37, 222, 174, 0.9)`,
          backdropFilter: "blur(0px) saturate(500%)",
          borderRadius: 12,
          padding: "14px 16px",
          boxShadow: ` 0 4px 6px -1px rgba(0, 0, 0, 0.1),
        0 2px 4px -2px rgba(0, 0, 0, 0.1),
        inset 0 2px 4px rgba(0, 0, 0, 0.06),
        inset 0 -1px 2px rgba(255, 255, 255, 0.5)`,
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap={10} wrap="nowrap" style={{ flex: 1 }}>
            <div>
              <Text size="sm" fw={600}>
                Install App
              </Text>
              <Text size="xs" opacity={0.8}>
                Add to home screen for quick access
              </Text>
            </div>
          </Group>
          <Group gap={8} wrap="nowrap">
            <Button
              size="xs"
              variant="white"
              color="cyan"
              loading={isInstalling}
              onClick={handleInstall}
              leftSection={<TbDownload size={14} />}
              styles={{
                root: {
                  fontWeight: 600,
                },
              }}
            >
              Install
            </Button>
            <CloseButton
              size="sm"
              variant="transparent"
              c="white"
              onClick={handleDismiss}
            />
          </Group>
        </Group>
      </Paper>
    </Container>
  );
};

export default InstallPrompt;
