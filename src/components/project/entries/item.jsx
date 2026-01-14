import { memo, useMemo } from "react";
import { Box, Group, Paper, Stack, Text } from "@mantine/core";
import moment from "moment";
import { Link } from "react-router-dom";
import ScanBadge from "../../common/ScanBadge";

// Gradient accent style (static, no recalculation needed)
const gradientAccentStyle = {
  width: 4,
  alignSelf: "stretch",
  minHeight: 24,
  borderRadius: 2,
  background: "linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)",
  flexShrink: 0,
};

// Simple product card for the products list
const ProductCard = memo(({ product }) => {
  const variant = product.details || product.category;
  const itemCount = product.codes?.length || 1;

  return (
    <div
      style={{
        display: "flex",
        // justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "nowrap",
        gap: 8,
        // backgroundColor: "white",
        // padding: "8px 10px",
        // borderRadius: 10,
      }}
    >
      <Text size="sm" c="dark.6" fw={400} truncate="end">
        {product.name}{" "}
        {variant && (
          <Text pl={4} size="sm" c="green.9" span fw={400} truncate="end">
            {variant}
          </Text>
        )}
      </Text>
      <Text
        size="sm"
        c="violet.9"
        fw={600}
        style={{ fontVariantNumeric: "tabular-nums", flexShrink: 0 }}
      >
        ×{itemCount}
      </Text>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

const EntryItem = memo(({ item }) => {
  const name = item.name || "Unknown";
  const date = item.date ? moment(item.date).format("DD MMM YYYY") : "Unknown";
  const total = item?.products?.length || 0;

  // Calculate total items across all products
  const totalItems = useMemo(() => {
    return (
      item?.products?.reduce((sum, p) => sum + (p.codes?.length || 0), 0) || 0
    );
  }, [item?.products]);

  return (
    <Link
      to={`/entries/${item._id}`}
      style={{
        display: "block",
        textDecoration: "none",
        backgroundColor: "white",
        padding: "16px 20px",
        width: "100%",
      }}
    >
      <Group wrap="nowrap" gap={12}>
        <div style={gradientAccentStyle} />
        <Box w="100%">
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "nowrap",
              gap: 16,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flex: 1,
                minWidth: 0,
              }}
            >
              {/* Gradient accent */}

              <div style={{ flex: 1, minWidth: 0 }}>
                <Text
                  size="md"
                  fw={600}
                  c="dark.9"
                  lh={1.25}
                  mb={2}
                  maw={240}
                  truncate="end"
                >
                  {name}
                </Text>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <Text size="xs" c="red.9" fw={500}>
                    {date}
                  </Text>
                  <Text size="xs" c="gray.6" lh={1}>
                    •
                  </Text>
                  <Text size="xs" c="gray.7" fw={400}>
                    {total} {total === 1 ? "product" : "products"}
                  </Text>
                </div>
              </div>
            </div>
            <ScanBadge count={totalItems} size="lg" />
          </div>
          <Stack gap={2}>
            {item?.products?.map((product, idx) => (
              <ProductCard key={product._id || idx} product={product} />
            ))}
          </Stack>
        </Box>
      </Group>
      {/* Header */}

      {/* Products List */}
      {/* <Paper
        p={4}
        radius={12}
        style={{ backgroundColor: "rgba(139, 92, 246, 0.08)" }}
        withBorder
      >
        <Stack gap={2}>
          {item?.products?.map((product, idx) => (
            <ProductCard key={product._id || idx} product={product} />
          ))}
        </Stack>
      </Paper> */}
    </Link>
  );
});

EntryItem.displayName = "EntryItem";

export default EntryItem;
