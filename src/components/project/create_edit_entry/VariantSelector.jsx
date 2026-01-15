import { memo, useMemo } from "react";
import { Box, Chip, Text, TextInput, ScrollArea } from "@mantine/core";
import { TbInfoCircle } from "react-icons/tb";

const VariantSelector = memo(
  ({ variants = [], value, onChange, category, disabled = false, error }) => {
    // Determine variants to show
    const displayVariants = useMemo(() => {
      if (category === "Airpods") return ["Default"];
      return variants;
    }, [category, variants]);

    // For "Other", show simple text input
    if (category === "Other") {
      return (
        <Box>
          <Text size="sm" fw={500} c={error ? "red.6" : "gray.7"} mb={8}>
            Details / Variant {error && "*"}
          </Text>
          <TextInput
            placeholder="Enter details"
            size="lg"
            radius={12}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            error={!!error}
            leftSection={
              <TbInfoCircle
                size={18}
                color={error ? "var(--mantine-color-red-6)" : "#8B5CF6"}
              />
            }
            styles={{
              input: {
                backgroundColor: "white",
                border: "1.5px solid var(--mantine-color-gray-2)",
                height: 48,
                fontSize: 15,
              },
            }}
          />
        </Box>
      );
    }

    const variantsGrid = category === "iWatch" ? 2 : 3;

    // For products with variants (including Airpods), show chips
    return (
      <Box>
        <Text size="sm" fw={500} c={error ? "red.6" : "gray.7"} mb={8}>
          Select Variant {error && "*"}
        </Text>

        {displayVariants.length > 0 ? (
          <Chip.Group value={value} onChange={onChange}>
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${variantsGrid}, 1fr)`,
                gap: 8,
              }}
            >
              {displayVariants.map((variant) => (
                <Chip
                  key={variant}
                  value={variant}
                  size="md"
                  radius={10}
                  variant="outline"
                  color="#fff"
                  styles={{
                    root: {
                      width: "100%",
                      height: "100%",
                    },
                    label: {
                      width: "100%",
                      height: "100%",
                      minHeight: 40,
                      paddingTop: 8,
                      paddingBottom: 8,
                      paddingLeft: 16,
                      paddingRight: 16,
                      fontSize: 14,
                      fontWeight: 500,
                      textAlign: "center",
                      whiteSpace: "normal",
                      wordBreak: "break-word",
                      border:
                        value === variant
                          ? "none"
                          : "1.5px solid var(--mantine-color-gray-3)",
                      background:
                        value === variant
                          ? "linear-gradient(135deg, #8B5CF6, #A78BFA)"
                          : "var(--mantine-color-gray-0)",
                      color:
                        value === variant
                          ? "white"
                          : "var(--mantine-color-gray-7)",
                      lineHeight: 1.4,
                    },
                    iconWrapper: {
                      display: "none",
                    },
                  }}
                >
                  {variant}
                </Chip>
              ))}
            </Box>
          </Chip.Group>
        ) : (
          <Box
            py={16}
            px={12}
            style={{
              borderRadius: 8,
              backgroundColor: "var(--mantine-color-gray-0)",
              border: "1.5px dashed var(--mantine-color-gray-3)",
            }}
          >
            <Text size="sm" c="gray.7" ta="center">
              Select a product to see variants
            </Text>
          </Box>
        )}
      </Box>
    );
  }
);

VariantSelector.displayName = "VariantSelector";

export default VariantSelector;
