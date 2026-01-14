import { Group, Stack, Text, Paper } from "@mantine/core";

const ProductInfoCards = ({ product }) => {
  const hasDetails = product?.details || product?.price || product?.warranty;

  if (!hasDetails) return null;

  return (
    <Stack gap={12}>
      {/* Warranty - Full Width */}
      {product.warranty && (
        <Paper
          p="md"
          radius={16}
          style={{
            background:
              "linear-gradient(135deg, var(--mantine-color-teal-0) 0%, var(--mantine-color-teal-1) 100%)",
            border: "1px solid var(--mantine-color-teal-2)",
          }}
        >
          <Text size="sm" fw={600} c="dark.8">
            Warranty Period
          </Text>
          <Text size="xs" c="gray.6" lh={1.5}>
            Covered under manufacturer warranty
          </Text>
          <Text
            mt={8}
            size="sm"
            fw={500}
            // mb={4}
            // style={{ letterSpacing: "-0.02em" }}
          >
            {product.warranty}
          </Text>
        </Paper>
      )}

      {/* Details & Price - 50/50 */}
      {(product.details || product.price) && (
        <Group gap={12} grow align="stretch">
          {product.details && (
            <Paper
              p="md"
              radius={16}
              style={{
                background:
                  "linear-gradient(135deg, var(--mantine-color-pink-0) 0%, var(--mantine-color-pink-1) 100%)",
                border: "1px solid var(--mantine-color-pink-2)",
              }}
            >
              <Text size="sm" fw={600} c="dark.8">
                Product Details
              </Text>
              <Text
                size="lg"
                fw={500}
                c="pink.7"
                style={{ letterSpacing: "-0.02em" }}
              >
                {product.details}
              </Text>
            </Paper>
          )}
          {product.price && (
            <Paper
              p="md"
              radius={16}
              style={{
                background:
                  "linear-gradient(135deg, var(--mantine-color-green-0) 0%, var(--mantine-color-green-1) 100%)",
                border: "1px solid var(--mantine-color-green-2)",
              }}
            >
              <Text size="sm" fw={600} c="dark.8">
                Unit Price
              </Text>
              <Text
                size="lg"
                fw={500}
                c="green.7"
                style={{ letterSpacing: "-0.02em" }}
              >
                ₹ {product.price?.toLocaleString("en-in")}
              </Text>
            </Paper>
          )}
        </Group>
      )}
    </Stack>
  );
};

export default ProductInfoCards;
