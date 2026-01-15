import { memo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import moment from "moment";
import { useClipboard } from "@mantine/hooks";
import { ActionIcon, Box, Group, Tooltip } from "@mantine/core";
import { TbCopy, TbCheck } from "react-icons/tb";
import PrintButton from "../../../common/PrintButton";
import { PrintProductInvoice } from "../details/libs";

const ImeiItem = memo(({ item }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const clipboard = useClipboard({ timeout: 1500 });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      PrintProductInvoice({
        id: item._id,
        imei: item.codes,
        filename: `Invoice_${item.codes}`,
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
    mutate();
  };

  const handleCopy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    clipboard.copy(item.codes);
  };

  return (
    <Box
      style={{
        textDecoration: "none",
        display: "block",
        backgroundColor: "white",
        padding: "14px 20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "nowrap",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
          {/* Gradient accent */}
          <div
            style={{
              width: 4,
              minHeight: 32,
              borderRadius: 3,
              background: "linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)",
              flexShrink: 0,
            }}
          />
          <div
            style={{
              flex: 1,
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Group gap={8}>
              <div
                style={{
                  fontWeight: 600,
                  color: "#1F2937", // dark.8
                  fontFamily: "monospace",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.codes || "N/A"}
              </div>
              <Tooltip
                label={clipboard.copied ? "Copied!" : "Copy IMEI"}
                withArrow
              >
                <ActionIcon
                  variant="transparent"
                  color={clipboard.copied ? "teal" : "gray"}
                  size="xs"
                  onClick={handleCopy}
                  radius={0}
                >
                  {clipboard.copied ? (
                    <TbCheck size={18} />
                  ) : (
                    <TbCopy size={18} />
                  )}
                </ActionIcon>
              </Tooltip>
            </Group>
            <div
              style={{
                fontSize: "14px", // size="sm"
                color: "#2F9E44", // green.9
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.name} - {item.details}
            </div>
            <div style={{ marginTop: 2, fontSize: "14px", color: "#374151" }}>
              {" "}
              {/* gray.7 */}
              {item.orderName} •{" "}
              <span style={{ fontWeight: 500, color: "#C92A2A" }}>
                {" "}
                {/* red.9 */}
                {moment(item.date).format("DD MMM YYYY")}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <PrintButton
            onClick={handlePrint}
            loading={isPending}
            success={showSuccess}
          />
        </div>
      </div>
    </Box>
  );
});

export default ImeiItem;
