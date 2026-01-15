import { useState } from "react";
import { Box, Group, Stack, Text, Accordion, Portal } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";

import ProductInfoCards from "./ProductInfoCards";
import SerialNumbersList from "./SerialNumbersList";
import ScanBadge from "../../../common/ScanBadge";
import ItemActionMenu from "../../../common/ItemActionMenu";
import ProcessLoader from "../../../common/ProcessLoader";
import { PrintBulkProductInvoice } from "./libs";

const ProductItem = ({ product, orderId, onDeleteClick }) => {
  const itemCount = product.codes?.length || 0;
  const [processStatus, setProcessStatus] = useState("idle");

  // Print mutation
  const { mutate: printMutate } = useMutation({
    mutationFn: async () => {
      setProcessStatus("starting");
      // Small delay to show starting state
      await new Promise((resolve) => setTimeout(resolve, 500));
      setProcessStatus("in-progress");
      return PrintBulkProductInvoice({
        id: product._id,
        filename: `Invoice_${product.name}_${product.details || "product"}`,
      });
    },
    onSuccess: (result) => {
      if (result.success) {
        setProcessStatus("success");
        setTimeout(() => setProcessStatus("idle"), 1500);
      } else {
        setProcessStatus("error");
        setTimeout(() => setProcessStatus("idle"), 2000);
      }
    },
    onError: () => {
      setProcessStatus("error");
      setTimeout(() => setProcessStatus("idle"), 2000);
    },
  });

  const handlePrint = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(product._id);
    printMutate();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteClick?.(product);
  };

  return (
    <>
      <Portal>
        <ProcessLoader
          visible={processStatus !== "idle"}
          status={processStatus}
        />
      </Portal>

      <Accordion.Item value={product._id || product.name}>
        <Accordion.Control py={14}>
          <Group justify="space-between" wrap="nowrap" gap="md" pr={8}>
            <Group gap={12} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
              {/* Gradient accent */}
              <Box
                w={4}
                style={{
                  alignSelf: "stretch",
                  minHeight: 28,
                  borderRadius: 3,
                  background:
                    "linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)",
                  flexShrink: 0,
                }}
              />
              <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                <Text fw={600} c="dark.8" truncate="end" lh={1.3}>
                  {product.name}
                </Text>
                {product.category && (
                  <Text size="xs" c="gray.7" truncate="end">
                    {product.details}
                  </Text>
                )}
              </Stack>
            </Group>
            <Group gap={0} wrap="nowrap">
              <ScanBadge size="lg" count={itemCount} />
              <ItemActionMenu
                onPrint={handlePrint}
                onDelete={handleDelete}
                printLoading={false}
                printSuccess={false}
                showEdit={false}
              />
            </Group>
          </Group>
        </Accordion.Control>

        <Accordion.Panel>
          <Stack mt={-8} gap="md">
            <ProductInfoCards product={product} />
            <SerialNumbersList codes={product.codes} orderId={product?._id} />
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </>
  );
};

export default ProductItem;
