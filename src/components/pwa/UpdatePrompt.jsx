import { useState } from "react";
import {
  Box,
  Text,
  Group,
  CloseButton,
  Button,
  Container,
  Paper,
} from "@mantine/core";
import { TbRefresh } from "react-icons/tb";
import { usePWA } from "../../contexts/PWAContext";

const UpdatePrompt = () => {
  const { needRefresh, updateApp, closePrompts } = usePWA();
  const [isUpdating, setIsUpdating] = useState(false);

  if (!needRefresh) return null;

  const handleUpdate = async () => {
    setIsUpdating(true);
    updateApp();
  };

  return (
    <Container size="xs" px={0}>
      <Paper
        style={{
          position: "fixed",
          bottom: 80,
          left: 16,
          right: 16,
          zIndex: 9998,
          background: `rgba(249, 115, 22, 0.9)`,
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
            <Box
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: "rgba(255,255,255,0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TbRefresh size={20} />
            </Box>
            <div>
              <Text size="sm" fw={600}>
                Update Available
              </Text>
              <Text size="xs" opacity={0.8}>
                A new version is ready
              </Text>
            </div>
          </Group>
          <Group gap={8} wrap="nowrap">
            <Button
              size="xs"
              variant="white"
              color="violet"
              loading={isUpdating}
              onClick={handleUpdate}
              styles={{
                root: {
                  fontWeight: 600,
                },
              }}
            >
              Update
            </Button>
            <CloseButton
              size="sm"
              variant="transparent"
              c="white"
              onClick={closePrompts}
            />
          </Group>
        </Group>
      </Paper>
    </Container>
  );
};

export default UpdatePrompt;
