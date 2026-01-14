import { useState } from "react";
import {
  Group,
  Stack,
  Text,
  Paper,
  Badge,
  CopyButton,
  ActionIcon,
  Loader,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { TbCopy, TbCheck, TbPrinter, TbX } from "react-icons/tb";
import { PrintProductInvoice } from "./libs";
import PrintButtonCommon from "../../../common/PrintButton";

// Reusable Print Button Component with useMutation
const PrintButton = ({ orderId, imei, filename }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  const { mutate, isPending, isError } = useMutation({
    mutationFn: () =>
      PrintProductInvoice({
        id: orderId,
        imei: imei,
        filename: filename || `Invoice_${imei}`,
      }),
    onSuccess: (result) => {
      if (result.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    },
  });

  const handlePrint = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!orderId || !imei) return;
    mutate();
  };

  return (
    <>
      <PrintButtonCommon
        size="sm"
        onClick={handlePrint}
        loading={isPending}
        success={showSuccess}
      />
    </>
  );
};

const SerialNumbersList = ({ codes = [], orderId }) => {
  if (!codes || codes.length === 0) return null;

  return (
    <Paper
      mt={-4}
      p="md"
      radius={16}
      style={{
        background:
          "linear-gradient(135deg, var(--mantine-color-violet-0) 0%, var(--mantine-color-violet-1) 100%)",
        border: "1px solid var(--mantine-color-violet-2)",
      }}
    >
      {/* Header */}
      <Group justify="space-between" mb={12}>
        <Text size="sm" fw={600}>
          Serial Numbers
        </Text>
        <Badge variant="light" color="violet" size="md" radius="xl">
          {codes.length} codes
        </Badge>
      </Group>

      {/* Codes List */}
      <Stack gap={6}>
        {codes.map((code, index) => (
          <Group
            key={index}
            justify="space-between"
            py={8}
            px={8}
            style={{
              backgroundColor: "white",
              borderRadius: 10,
              border: "1px solid var(--mantine-color-gray-1)",
            }}
          >
            <Group gap={12}>
              <Text
                size="xs"
                fw={700}
                c="white"
                w={24}
                h={24}
                ta="center"
                style={{
                  backgroundColor: "var(--mantine-color-violet-5)",
                  borderRadius: 6,
                  lineHeight: "24px",
                }}
              >
                {index + 1}
              </Text>
              <Text size="sm" ff="monospace" c="dark.8" fw={500}>
                {code}
              </Text>
            </Group>
            <Group gap={6}>
              {/* Print Button */}
              {orderId && (
                <PrintButton
                  orderId={orderId}
                  imei={code}
                  filename={`Invoice_${code}`}
                />
              )}
              {/* Copy Button */}
              <CopyButton value={code}>
                {({ copied, copy }) => (
                  <ActionIcon
                    size="sm"
                    variant={copied ? "filled" : "light"}
                    color={copied ? "teal" : "violet"}
                    onClick={copy}
                    radius="xl"
                  >
                    {copied ? <TbCheck size={14} /> : <TbCopy size={14} />}
                  </ActionIcon>
                )}
              </CopyButton>
            </Group>
          </Group>
        ))}
      </Stack>
    </Paper>
  );
};

export { PrintButton };
export default SerialNumbersList;
