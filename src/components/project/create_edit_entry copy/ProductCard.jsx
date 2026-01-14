import { memo, useMemo, useCallback, useState, useEffect } from "react";
import {
  Paper,
  Stack,
  Group,
  Text,
  TextInput,
  NumberInput,
  Box,
  Collapse,
  UnstyledButton,
  Divider,
  Badge,
} from "@mantine/core";
import {
  TbChevronDown,
  TbTrash,
  TbCurrencyRupee,
  TbShieldCheck,
  TbAlertCircle,
} from "react-icons/tb";
import CategorySelector from "./CategorySelector";
import ProductSelector from "./ProductSelector";
import VariantSelector from "./VariantSelector";
import IMEICodeManager from "./IMEICodeManager";
import ScanBadge from "../../common/ScanBadge";

// ============ Memoized Sub-Components ============

// Header component - shows error count when collapsed
const ProductCardHeader = memo(
  ({ product, index, expanded, codesCount, errorCount, onToggle }) => {
    const hasContent = product.name || product.category;
    const hasErrors = errorCount > 0;

    return (
      <UnstyledButton
        w="100%"
        py={14}
        px={20}
        onClick={onToggle}
        style={{
          backgroundColor:
            hasErrors && !expanded
              ? "var(--mantine-color-red-0)"
              : expanded
              ? "var(--mantine-color-gray-0)"
              : "white",
        }}
      >
        <Group justify="space-between" wrap="nowrap">
          <Group gap={14} wrap="nowrap" style={{ flex: 1, minWidth: 0 }}>
            {/* Index Badge */}
            <Box
              w={28}
              h={28}
              style={{
                borderRadius: 40,
                background: hasErrors
                  ? "var(--mantine-color-red-6)"
                  : hasContent
                  ? "linear-gradient(135deg, #8B5CF6, #A78BFA)"
                  : "var(--mantine-color-gray-1)",
                border:
                  hasContent || hasErrors
                    ? "none"
                    : "1px solid var(--mantine-color-gray-2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {hasErrors ? (
                <TbAlertCircle size={16} color="white" />
              ) : (
                <Text size="xs" fw={600} c={hasContent ? "white" : "gray.5"}>
                  {index + 1}
                </Text>
              )}
            </Box>

            {/* Info */}
            <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
              <Text
                size="sm"
                fw={600}
                c={hasErrors ? "red.7" : "dark.8"}
                truncate="end"
              >
                {product.name || "Untitled Product"}
              </Text>
              <Group gap={6} wrap="nowrap">
                {hasErrors && !expanded ? (
                  <Text size="xs" c="red.6" fw={500}>
                    {errorCount} missing field{errorCount > 1 ? "s" : ""}
                  </Text>
                ) : (
                  <>
                    {product.details && (
                      <Text size="xs" c="gray.7" truncate>
                        {product.details}
                      </Text>
                    )}
                    {product.price > 0 && (
                      <>
                        {product.details && (
                          <Text size="xs" c="gray.6">
                            •
                          </Text>
                        )}
                        <Text size="xs" c="green.7" fw={500}>
                          ₹{product.price?.toLocaleString("en-IN")}
                        </Text>
                      </>
                    )}
                  </>
                )}
              </Group>
            </Stack>
          </Group>

          <Group gap={10} wrap="nowrap">
            {codesCount > 0 && <ScanBadge size="md" count={codesCount} />}
            <Box
              w={22}
              h={22}
              style={{
                borderRadius: 8,
                backgroundColor: "var(--mantine-color-gray-1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              <TbChevronDown size={16} color="var(--mantine-color-gray-6)" />
            </Box>
          </Group>
        </Group>
      </UnstyledButton>
    );
  }
);

ProductCardHeader.displayName = "ProductCardHeader";

// Price/Warranty section - uses local state for instant feedback
const PriceWarrantySection = memo(
  ({
    price,
    warranty,
    priceError,
    warrantyError,
    onPriceChange,
    onWarrantyChange,
  }) => {
    const [localPrice, setLocalPrice] = useState(price || "");
    const [localWarranty, setLocalWarranty] = useState(warranty || "");

    useEffect(() => {
      setLocalPrice(price || "");
    }, [price]);

    useEffect(() => {
      setLocalWarranty(warranty || "");
    }, [warranty]);

    return (
      <Stack gap={16} px={20}>
        <NumberInput
          hideControls
          label="Price"
          placeholder="0"
          size="md"
          radius="md"
          min={0}
          thousandSeparator=","
          error={priceError}
          leftSection={
            <TbCurrencyRupee
              size={18}
              color={
                priceError
                  ? "var(--mantine-color-red-6)"
                  : "var(--mantine-color-gray-5)"
              }
            />
          }
          value={localPrice}
          onChange={setLocalPrice}
          onBlur={() => onPriceChange(localPrice)}
          styles={{
            input: {
              backgroundColor: "white",
              border: priceError
                ? "1px solid var(--mantine-color-red-5)"
                : "1px solid var(--mantine-color-gray-3)",
              height: 48,
              fontSize: 16,
            },
            label: {
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
              color: "var(--mantine-color-gray-7)",
            },
          }}
        />
        <TextInput
          label="Warranty"
          placeholder="e.g., 1 Year"
          size="md"
          radius="md"
          error={warrantyError}
          leftSection={
            <TbShieldCheck
              size={18}
              color={
                warrantyError
                  ? "var(--mantine-color-red-6)"
                  : "var(--mantine-color-gray-5)"
              }
            />
          }
          value={localWarranty}
          onChange={(e) => setLocalWarranty(e.target.value)}
          onBlur={() => onWarrantyChange(localWarranty)}
          styles={{
            input: {
              backgroundColor: "white",
              border: warrantyError
                ? "1px solid var(--mantine-color-red-5)"
                : "1px solid var(--mantine-color-gray-3)",
              height: 48,
              fontSize: 16,
            },
            label: {
              fontSize: 14,
              fontWeight: 500,
              marginBottom: 6,
              color: "var(--mantine-color-gray-7)",
            },
          }}
        />
      </Stack>
    );
  }
);

PriceWarrantySection.displayName = "PriceWarrantySection";

// Delete button
const DeleteButton = memo(({ onRemove }) => (
  <UnstyledButton
    onClick={onRemove}
    mx={20}
    py={12}
    style={{
      borderRadius: 12,
      backgroundColor: "var(--mantine-color-red-0)",
      border: "1px dashed var(--mantine-color-red-3)",
      textAlign: "center",
    }}
  >
    <Group gap={8} justify="center">
      <TbTrash size={16} color="var(--mantine-color-red-6)" />
      <Text size="sm" fw={500} c="red.6">
        Remove Product
      </Text>
    </Group>
  </UnstyledButton>
));

DeleteButton.displayName = "DeleteButton";

// ============ Main Component ============

const ProductCard = memo(
  ({
    product,
    index,
    products = {},
    errors = {},
    onChange,
    onRemove,
    onScannerOpen,
    expanded,
    onToggle,
  }) => {
    // Count errors
    const errorCount = Object.keys(errors).length;

    // Memoized product list based on category
    const productList = useMemo(() => {
      if (!product.category || !products) return [];
      const { iphones = [], ipods = [], iwatches = [] } = products;

      switch (product.category) {
        case "iPhone":
          return iphones.filter((p) => /iPhone/i.test(p.name));
        case "iPad":
          return iphones.filter((p) => /iPad/i.test(p.name));
        case "Android":
          return iphones.filter((p) => !/iPhone|iPad/i.test(p.name));
        case "Airpods":
          return ipods;
        case "iWatch":
          return iwatches;
        default:
          return [];
      }
    }, [product.category, products]);

    // Memoized variants based on selected product
    const variants = useMemo(() => {
      if (!product.name || !productList.length) return [];
      const selectedProd = productList.find((p) => p.name === product.name);
      if (!selectedProd?.variants) return [];

      if (["iPhone", "iPad", "Android"].includes(product.category)) {
        return selectedProd.variants.map((v) => v.storage);
      } else if (product.category === "iWatch") {
        return selectedProd.variants.map((v) => `${v.size} - ${v.type}`);
      }
      return [];
    }, [product.name, product.category, productList]);

    // Stable callbacks
    const handleCategoryChange = useCallback(
      (category) =>
        onChange({
          ...product,
          category,
          name: "",
          details: "",
          codes: product.codes || [],
        }),
      [onChange, product]
    );

    const handleProductChange = useCallback(
      (name) => onChange({ ...product, name, details: "" }),
      [onChange, product]
    );

    const handleDetailChange = useCallback(
      (details) => onChange({ ...product, details }),
      [onChange, product]
    );

    const handlePriceChange = useCallback(
      (price) => onChange({ ...product, price }),
      [onChange, product]
    );

    const handleWarrantyChange = useCallback(
      (warranty) => onChange({ ...product, warranty }),
      [onChange, product]
    );

    const handleCodesChange = useCallback(
      (codes) => onChange({ ...product, codes }),
      [onChange, product]
    );

    const codesCount = product.codes?.length || 0;

    return (
      <Paper radius={0} shadow="none" bg="white">
        <ProductCardHeader
          product={product}
          index={index}
          expanded={expanded}
          codesCount={codesCount}
          errorCount={errorCount}
          onToggle={onToggle}
        />

        <Collapse in={expanded}>
          <Stack gap={0} pb={20}>
            <Divider />

            {/* Error Summary */}
            {errorCount > 0 && (
              <Box px={20} py={12} bg="red.0">
                <Group gap={8}>
                  <TbAlertCircle size={16} color="var(--mantine-color-red-6)" />
                  <Text size="xs" c="red.7" fw={500}>
                    Missing: {Object.keys(errors).join(", ")}
                  </Text>
                </Group>
              </Box>
            )}

            <CategorySelector
              value={product.category}
              onChange={handleCategoryChange}
              error={errors.category}
            />

            <Divider my={16} />

            <Stack gap={16} px={20}>
              <ProductSelector
                products={productList}
                value={product.name}
                onChange={handleProductChange}
                category={product.category}
                disabled={!product.category}
                error={errors.name}
              />
              <VariantSelector
                variants={variants}
                value={product.details}
                onChange={handleDetailChange}
                category={product.category}
                disabled={!product.name}
                error={errors.details}
              />
            </Stack>

            <Divider my={16} />

            <PriceWarrantySection
              price={product.price}
              warranty={product.warranty}
              priceError={errors.price}
              warrantyError={errors.warranty}
              onPriceChange={handlePriceChange}
              onWarrantyChange={handleWarrantyChange}
            />

            <Divider my={16} />

            <Box px={20}>
              <IMEICodeManager
                codes={product.codes || []}
                onChange={handleCodesChange}
                onScannerOpen={onScannerOpen}
                error={errors.codes}
              />
            </Box>

            <Divider my={16} />

            <DeleteButton onRemove={onRemove} />
          </Stack>
        </Collapse>
      </Paper>
    );
  }
);

ProductCard.displayName = "ProductCard";

export default ProductCard;
