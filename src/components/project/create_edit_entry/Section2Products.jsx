import { memo, useCallback, useState } from "react";
import { Stack, Group, Text, Box, Divider } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { TbPlus } from "react-icons/tb";
import ProductCard from "./ProductCard";
import StyledButton from "../../common/StyledButton";
import { GetProducts } from "./libs";

const Section2Products = memo(({ form, onScannerOpen }) => {
  const products = form.values.products || [];

  // Track which product card is expanded (null = none, index = that one)
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Fetch available products from API
  const { data: productData = {} } = useQuery({
    queryKey: ["products"],
    queryFn: GetProducts,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Toggle expand for a specific index
  const handleToggle = useCallback((index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  }, []);

  // Add new product
  const handleAddProduct = useCallback(() => {
    form.insertListItem("products", {
      name: "",
      details: "",
      price: 0,
      warranty: "",
      category: "",
      codes: [],
    });
    // Auto-expand newly added product
    setExpandedIndex(products.length);
  }, [form, products.length]);

  // Update product at index
  const handleUpdateProduct = useCallback(
    (index, updatedProduct) => {
      form.setFieldValue(`products.${index}`, updatedProduct);
    },
    [form]
  );

  // Remove product at index
  const handleRemoveProduct = useCallback(
    (index) => {
      form.removeListItem("products", index);
      // Reset expanded if the removed item was expanded
      setExpandedIndex((prev) => {
        if (prev === index) return null;
        if (prev !== null && prev > index) return prev - 1;
        return prev;
      });
    },
    [form]
  );

  return (
    <Stack bg="#fff" gap={0}>
      {/* Section Header */}
      <Group justify="space-between" align="center" p="lg">
        <Group gap={10}>
          <Box
            w={4}
            h={24}
            style={{
              borderRadius: 2,
              background: "linear-gradient(180deg, #8B5CF6 0%, #EC4899 100%)",
            }}
          />
          <Text fw={600} c="dark.8">
            Products List
          </Text>
        </Group>
        <Text size="sm" c="gray.6">
          {products.length} {products.length === 1 ? "product" : "products"}
        </Text>
      </Group>
      <Divider variant="dashed" />
      {/* Product Cards */}
      <Stack gap={0}>
        {products.map((product, index) => {
          // Get errors for this product
          const productErrors = form.errors || {};
          const errors = {};
          Object.keys(productErrors).forEach((key) => {
            if (key.startsWith(`products.${index}.`)) {
              const field = key.replace(`products.${index}.`, "");
              errors[field] = productErrors[key];
            }
          });

          return (
            <>
              <ProductCard
                key={index}
                product={product}
                index={index}
                products={productData}
                errors={errors}
                expanded={expandedIndex === index}
                onToggle={() => handleToggle(index)}
                onChange={(updated) => handleUpdateProduct(index, updated)}
                onRemove={() => handleRemoveProduct(index)}
                onScannerOpen={() => onScannerOpen?.(index)}
              />
              <Divider key={`${index}-divider`} variant="dashed" />
            </>
          );
        })}
      </Stack>

      {/* Add Product Button */}
      <Box p="lg">
        <StyledButton
          variant="glass"
          tint="blue"
          tintOpacity={0.75}
          size="lg"
          fullWidth
          leftSection={<TbPlus size={20} />}
          onClick={handleAddProduct}
        >
          Add Product
        </StyledButton>
      </Box>
    </Stack>
  );
});

Section2Products.displayName = "Section2Products";

export default Section2Products;
