import { ActionIcon, Loader, Tooltip } from "@mantine/core";
import { memo } from "react";
import { TbPrinter, TbCheck } from "react-icons/tb";

const PrintButton = memo(
  ({
    onClick,
    loading = false,
    success = false,
    size = "lg",
    tooltip = "Print Label",
  }) => {
    const iconSize =
      size === "xs" ? 12 : size === "sm" ? 14 : size === "md" ? 16 : 18;

    const handleAction = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!loading && !success) {
        onClick?.(e);
      }
    };

    return (
      <Tooltip
        label={success ? "Printed!" : tooltip}
        position="top"
        withArrow
        gutter={10}
      >
        <ActionIcon
          size={size}
          radius="xl"
          variant="gradient"
          gradient={
            success
              ? { from: "#059669", to: "#10b981", deg: 135 }
              : { from: "pink.5", to: "pink.6", deg: 135 }
          }
          onClick={handleAction}
          disabled={loading}
          style={{
            transition: "all 0.2s ease",
            border: "none",
          }}
          className="hover:scale-105 active:scale-95"
        >
          {loading ? (
            <Loader size={iconSize - 2} color="white" />
          ) : success ? (
            <TbCheck size={iconSize} />
          ) : (
            <TbPrinter size={iconSize} />
          )}
        </ActionIcon>
      </Tooltip>
    );
  }
);

PrintButton.displayName = "PrintButton";

export default PrintButton;
