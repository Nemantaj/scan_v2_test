import { memo, useState, useCallback } from "react";
import {
  Box,
  Group,
  Stack,
  Text,
  TextInput,
  ActionIcon,
  Paper,
  Badge,
} from "@mantine/core";
import { TbPlus, TbX, TbBarcode, TbAlertCircle } from "react-icons/tb";

// Helper to remove whitespace from IMEI
const cleanIMEI = (str) => str.replace(/\s+/g, "");

const IMEICodeManager = memo(
  ({ codes = [], onChange, onScannerOpen, error }) => {
    const [inputValue, setInputValue] = useState("");

    const handleAdd = useCallback(() => {
      const cleaned = cleanIMEI(inputValue);
      if (cleaned && !codes.includes(cleaned)) {
        onChange([...codes, cleaned]);
        setInputValue("");
      }
    }, [inputValue, codes, onChange]);

    const handleRemove = useCallback(
      (index) => {
        const newCodes = codes.filter((_, i) => i !== index);
        onChange(newCodes);
      },
      [codes, onChange]
    );

    const handleKeyDown = useCallback(
      (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleAdd();
        }
      },
      [handleAdd]
    );

    return (
      <Stack gap={12}>
        {/* Section Header */}
        <Group justify="space-between" align="center">
          <Group gap={10}>
            <Text size="sm" fw={600} c={error ? "red.6" : "gray.7"}>
              Serial Numbers / IMEI
            </Text>
            {error && (
              <TbAlertCircle size={14} color="var(--mantine-color-red-6)" />
            )}
          </Group>
          {codes.length > 0 && (
            <Badge variant="light" color="violet" size="md" radius="xl">
              {codes.length} {codes.length === 1 ? "code" : "codes"}
            </Badge>
          )}
        </Group>

        {/* Input Row */}
        <Group gap={8} wrap="nowrap">
          <TextInput
            placeholder="Enter IMEI or serial number"
            size="md"
            radius="md"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{ flex: 1 }}
            styles={{
              input: {
                backgroundColor: "white",
                border: error
                  ? "1px solid var(--mantine-color-red-5)"
                  : "1px solid var(--mantine-color-gray-3)",
                height: 48,
                fontFamily: "monospace",
                letterSpacing: "0.5px",
                fontSize: 16,
              },
            }}
          />
          <ActionIcon
            size={48}
            radius="md"
            variant="gradient"
            gradient={{ from: "violet.5", to: "pink.5", deg: 135 }}
            onClick={onScannerOpen}
          >
            <TbBarcode size={22} />
          </ActionIcon>
          <ActionIcon
            size={48}
            radius="md"
            variant="filled"
            color="green"
            onClick={handleAdd}
            disabled={!inputValue.trim()}
          >
            <TbPlus size={22} />
          </ActionIcon>
        </Group>

        {/* Error Message */}
        {error && codes.length === 0 && (
          <Text size="xs" c="red.6" mt={-8}>
            {error}
          </Text>
        )}

        {/* Codes List */}
        {codes.length > 0 && (
          <Paper
            p={8}
            radius={12}
            style={{
              backgroundColor: "var(--mantine-color-gray-0)",
              border: "1px solid var(--mantine-color-gray-2)",
            }}
          >
            <Stack gap={6}>
              {codes.map((code, index) => (
                <Group
                  key={`${code}-${index}`}
                  justify="space-between"
                  wrap="nowrap"
                  py={8}
                  px={12}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 8,
                    border: "1px solid var(--mantine-color-gray-2)",
                  }}
                >
                  <Group
                    gap={10}
                    wrap="nowrap"
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    <Text
                      size="xs"
                      c="violet.5"
                      fw={600}
                      w={20}
                      ta="center"
                      style={{ flexShrink: 0 }}
                    >
                      {index + 1}
                    </Text>
                    <Text
                      size="sm"
                      c="dark.7"
                      fw={500}
                      ff="monospace"
                      truncate="end"
                      style={{ letterSpacing: "0.5px" }}
                    >
                      {code}
                    </Text>
                  </Group>
                  <ActionIcon
                    size="sm"
                    variant="subtle"
                    color="red"
                    onClick={() => handleRemove(index)}
                    radius="xl"
                  >
                    <TbX size={14} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          </Paper>
        )}

        {/* Empty State */}
        {codes.length === 0 && !error && (
          <Box
            py={24}
            px={16}
            style={{
              borderRadius: 12,
              backgroundColor: "var(--mantine-color-gray-0)",
              border: "1px dashed var(--mantine-color-gray-3)",
            }}
          >
            <Text size="sm" c="gray.5" ta="center">
              No codes added yet. Enter manually or scan barcode.
            </Text>
          </Box>
        )}
      </Stack>
    );
  }
);

IMEICodeManager.displayName = "IMEICodeManager";

export default IMEICodeManager;
